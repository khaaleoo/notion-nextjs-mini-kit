import type { BlockMap, Decoration, MapImageUrl } from "./types";

export const classNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export const getTextContent = (text: Decoration[]) =>
  text.reduce((prev, current) => prev + current[0], "");

const groupBlockContent = (blockMap: BlockMap): string[][] => {
  const output: string[][] = [];
  let lastType: string | undefined;
  let index = -1;

  Object.keys(blockMap).forEach((id) => {
    blockMap[id].value.content?.forEach((blockId) => {
      const blockType = blockMap[blockId]?.value?.type;
      if (blockType && blockType !== lastType) {
        index++;
        lastType = blockType;
        output[index] = [];
      }
      output[index]?.push(blockId);
    });
    lastType = undefined;
  });

  return output;
};

export const getListNumber = (blockId: string, blockMap: BlockMap) => {
  const group = groupBlockContent(blockMap).find((g) => g.includes(blockId));
  return group ? group.indexOf(blockId) + 1 : undefined;
};

export const defaultMapImageUrl: MapImageUrl = (image = "", block) => {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const url = new URL(
    `https://www.notion.so${
      image.startsWith("/image") ? image : `/image/${encodeURIComponent(image)}`
    }`
  );

  if (block && !image.includes("/images/page-cover/")) {
    const table =
      block.value.parent_table === "space" ? "block" : block.value.parent_table;
    url.searchParams.set("table", table ?? "block");
    url.searchParams.set("id", block.value.id);
    url.searchParams.set("cache", "v2");
  }

  return url.toString();
};
