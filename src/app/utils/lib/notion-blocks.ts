import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

type NotionBlock = BlockObjectResponse | PartialBlockObjectResponse;

type LegacyBlockMap = Record<
  string,
  {
    role: string;
    value: Record<string, unknown>;
  }
>;

type Decoration = string | [string] | [string, Array<string | [string, string]>];

const BLOCK_TYPE_MAP: Record<string, string> = {
  paragraph: "text",
  heading_1: "header",
  heading_2: "sub_header",
  heading_3: "sub_sub_header",
  bulleted_list_item: "bulleted_list",
  numbered_list_item: "numbered_list",
  to_do: "to_do",
  toggle: "toggle",
  code: "code",
  quote: "quote",
  callout: "callout",
  divider: "divider",
  image: "image",
  video: "video",
  embed: "embed",
  bookmark: "bookmark",
  equation: "equation",
  page: "page",
};

function isFullBlock(block: NotionBlock): block is BlockObjectResponse {
  return "type" in block && block.type !== "unsupported";
}

function richTextToTitle(richText: RichTextItemResponse[]): Decoration[] {
  if (!richText.length) return [[""]];

  return richText.map((item) => {
    const marks: Array<string | [string, string]> = [];
    if (item.annotations.bold) marks.push("b");
    if (item.annotations.italic) marks.push("i");
    if (item.annotations.strikethrough) marks.push("s");
    if (item.annotations.code) marks.push("c");
    if (item.href) marks.push(["a", item.href]);
    if (item.annotations.color && item.annotations.color !== "default") {
      marks.push(["h", item.annotations.color]);
    }
    if (!marks.length) return [item.plain_text];
    return [item.plain_text, marks];
  });
}

function getRichText(block: BlockObjectResponse): RichTextItemResponse[] {
  const data = block[block.type as keyof BlockObjectResponse];
  if (!data || typeof data !== "object" || !("rich_text" in data)) return [];
  return (data as { rich_text: RichTextItemResponse[] }).rich_text ?? [];
}

function mapProperties(block: BlockObjectResponse): Record<string, unknown> {
  const type = block.type;

  if (type === "code") {
    const code = block.code;
    const lang = code.language || "Plain Text";
    return {
      title: [[code.rich_text.map((t) => t.plain_text).join("")]],
      language: [[lang]],
    };
  }

  if (type === "image") {
    const src =
      block.image.type === "external"
        ? block.image.external.url
        : block.image.file.url;
    return {
      source: [[src]],
      title: richTextToTitle(block.image.caption),
    };
  }

  if (type === "video") {
    const src =
      block.video.type === "external"
        ? block.video.external.url
        : block.video.file.url;
    return {
      source: [[src]],
      title: richTextToTitle(block.video.caption),
    };
  }

  if (type === "embed") {
    return {
      source: [[block.embed.url]],
      title: richTextToTitle(block.embed.caption),
    };
  }

  if (type === "bookmark") {
    return {
      link: [[block.bookmark.url]],
      title: richTextToTitle(block.bookmark.caption),
    };
  }

  if (type === "to_do") {
    return {
      title: richTextToTitle(block.to_do.rich_text),
      checked: block.to_do.checked ? [["Yes"]] : [["No"]],
    };
  }

  if (type === "divider") {
    return {};
  }

  if (type === "callout") {
    return {
      title: richTextToTitle(block.callout.rich_text),
    };
  }

  return {
    title: richTextToTitle(getRichText(block)),
  };
}

function getParentMeta(block: BlockObjectResponse) {
  const parent = block.parent;
  if (parent.type === "page_id") {
    return { parent_id: parent.page_id, parent_table: "block" };
  }
  if (parent.type === "block_id") {
    return { parent_id: parent.block_id, parent_table: "block" };
  }
  return { parent_id: block.id, parent_table: "block" };
}

function toLegacyEntry(block: BlockObjectResponse, childIds: string[], isRootPage = false) {
  const legacyType = isRootPage ? "page" : (BLOCK_TYPE_MAP[block.type] ?? "text");

  return {
    role: "reader",
    value: {
      id: block.id,
      type: legacyType,
      properties: mapProperties(block),
      content: childIds,
      format: {},
      version: 0,
      created_time: new Date(block.created_time).getTime(),
      last_edited_time: new Date(block.last_edited_time).getTime(),
      alive: true,
      created_by_table: "notion_user",
      created_by_id: block.created_by.id,
      last_edited_by_table: "notion_user",
      last_edited_by_id: block.last_edited_by.id,
      ...getParentMeta(block),
    },
  };
}

async function listAllChildren(client: Client, blockId: string): Promise<NotionBlock[]> {
  const results: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return results;
}

const SKIP_CHILD_FETCH = new Set(["child_page", "child_database", "column", "column_list"]);

export async function fetchPageBlockMap(
  client: Client,
  pageId: string
): Promise<LegacyBlockMap> {
  const childIdsByBlock = new Map<string, string[]>();
  const blocks = new Map<string, BlockObjectResponse>();

  async function walk(blockId: string) {
    const children = await listAllChildren(client, blockId);
    const childIds: string[] = [];

    for (const child of children) {
      if (!isFullBlock(child)) continue;
      if (child.type === "child_page" || child.type === "child_database") continue;

      childIds.push(child.id);
      blocks.set(child.id, child);

      if (child.has_children && !SKIP_CHILD_FETCH.has(child.type)) {
        await walk(child.id);
      }
    }

    childIdsByBlock.set(blockId, childIds);
  }

  const pageBlock = await client.blocks.retrieve({ block_id: pageId });
  if (!isFullBlock(pageBlock)) {
    throw new Error(`Unable to load Notion page block ${pageId}`);
  }

  blocks.set(pageId, pageBlock);
  await walk(pageId);

  const blockMap: LegacyBlockMap = {};
  for (const [id, block] of blocks) {
    blockMap[id] = toLegacyEntry(block, childIdsByBlock.get(id) ?? [], id === pageId);
  }

  return blockMap;
}
