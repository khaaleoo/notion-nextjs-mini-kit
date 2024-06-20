import { notionDatabaseId, notionToken } from "@helpers/config";
import { DEFAULT_PAGE_SIZE } from "@helpers/constant";
import { ERROR_CODE } from "@helpers/error";
import { Client } from "@notionhq/client";
import type {} from "@notionhq/client";

const notion = new Client({ auth: notionToken });

export const getBlogPosts = async (config: { filter: Record<string, any>; pageSize?: number; nextCursor?: string }) => {
  const databaseId = notionDatabaseId || "";
  const { filter, nextCursor } = config;
  let { pageSize } = config;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter as any,
    page_size: pageSize || DEFAULT_PAGE_SIZE,
    start_cursor: nextCursor,
  });

  return response;
};

export const getPage = async (pageId: string) => {
  const data = await fetch(`https://notion-api.splitbee.io/v1/page/${pageId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  return data;
};

export const getPageBySlug = async (
  slug: string
): Promise<{
  generalInfo: any;
  detailInfo: any;
}> => {
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

  return {
    generalInfo: posts.results[0],
    detailInfo: await getPage(posts.results[0].id),
  };
};
