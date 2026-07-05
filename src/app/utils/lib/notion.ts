import { cache } from "react";
import { notionDatabaseId, notionToken } from "@helpers/config";
import { DEFAULT_PAGE_SIZE } from "@helpers/constant";
import { ERROR_CODE } from "@helpers/error";
import { Client } from "@notionhq/client";
import { fetchPageBlockMap } from "./notion-blocks";

const NOTION_API_VERSION = "2025-09-03";

const notion = new Client({ auth: notionToken, notionVersion: NOTION_API_VERSION });

type DataSourceQueryParams = Parameters<Client["dataSources"]["query"]>[0];
type DataSourceQueryResponse = Awaited<ReturnType<Client["dataSources"]["query"]>>;

const dataSourceIdCache = new Map<string, string>();

async function resolveDataSourceId(client: Client, databaseId: string): Promise<string> {
  const cached = dataSourceIdCache.get(databaseId);
  if (cached) return cached;

  const database = await client.databases.retrieve({ database_id: databaseId });
  if (!("data_sources" in database) || !database.data_sources?.[0]?.id) {
    throw new Error(`No data source found for Notion database ${databaseId}`);
  }
  const dataSourceId = database.data_sources[0].id;

  dataSourceIdCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

type QueryDatabaseConfig = {
  filter?: DataSourceQueryParams["filter"];
  pageSize?: number;
  nextCursor?: string;
  sorts?: DataSourceQueryParams["sorts"];
};

async function queryDatabase(
  client: Client,
  databaseId: string,
  config: QueryDatabaseConfig
): Promise<DataSourceQueryResponse> {
  const dataSourceId = await resolveDataSourceId(client, databaseId);

  return client.dataSources.query({
    data_source_id: dataSourceId,
    ...(config.filter ? { filter: config.filter } : {}),
    sorts: config.sorts ?? [{ timestamp: "created_time", direction: "descending" }],
    page_size: config.pageSize || DEFAULT_PAGE_SIZE,
    start_cursor: config.nextCursor,
  });
}

export const getBlogPosts = async (config: {
  filter: Record<string, any>;
  pageSize?: number;
  nextCursor?: string;
}) => {
  const databaseId = notionDatabaseId || "";
  const { filter, nextCursor, pageSize } = config;

  return queryDatabase(notion, databaseId, {
    filter: filter as DataSourceQueryParams["filter"],
    nextCursor,
    pageSize,
  });
};

export const getAllPublishedPosts = cache(async () => {
  const posts: DataSourceQueryResponse["results"] = [];
  let nextCursor: string | undefined;

  do {
    const response = await getBlogPosts({
      filter: {
        and: [
          {
            property: "Status",
            status: { equals: "Published" },
          },
        ],
      },
      pageSize: 100,
      nextCursor,
    });

    posts.push(...response.results);
    nextCursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (nextCursor);

  return posts as any[];
});

export const getPage = async (pageId: string) => {
  return fetchPageBlockMap(notion, pageId);
};

export const getPostGeneralInfoBySlug = async (slug: string): Promise<any> => {
  const posts = await getBlogPosts({
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
    pageSize: 1,
  });
  if (posts.results.length === 0) {
    throw new Error(ERROR_CODE.not_found_the_resource);
  }

  return posts.results[0];
};

export const getPageBySlug = async (
  slug: string
): Promise<{
  generalInfo: any;
  detailInfo: any;
}> => {
  const generalInfo = await getPostGeneralInfoBySlug(slug);

  return {
    generalInfo,
    detailInfo: await getPage(generalInfo.id),
  };
};
