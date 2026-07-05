"use client";

import NotionBlock from "./NotionBlock";
import type { BlockMap, CustomBlockComponents, MapImageUrl } from "./types";
import { defaultMapImageUrl } from "./utils";

export type { BlockMap, CustomBlockComponents };

type TProps = {
  blockMap: BlockMap;
  currentId?: string;
  level?: number;
  mapImageUrl?: MapImageUrl;
  customBlockComponents?: CustomBlockComponents;
};

function NotionRendererInner({
  blockMap,
  currentId,
  level = 0,
  mapImageUrl = defaultMapImageUrl,
  customBlockComponents,
}: TProps) {
  const id = currentId ?? Object.keys(blockMap)[0];
  const currentBlock = blockMap[id];

  if (!currentBlock) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Missing Notion block:", currentId);
    }
    return null;
  }

  const childIds = currentBlock.value.content ?? [];

  return (
    <NotionBlock
      block={currentBlock}
      blockMap={blockMap}
      level={level}
      mapImageUrl={mapImageUrl}
      customBlockComponents={customBlockComponents}
    >
      {childIds.map((contentId) => (
        <NotionRendererInner
          key={contentId}
          blockMap={blockMap}
          currentId={contentId}
          level={level + 1}
          mapImageUrl={mapImageUrl}
          customBlockComponents={customBlockComponents}
        />
      ))}
    </NotionBlock>
  );
}

export default function NotionRenderer(props: TProps) {
  return <NotionRendererInner {...props} />;
}
