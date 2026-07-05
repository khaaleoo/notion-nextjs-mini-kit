"use client";

import type { BlockEntry, MapImageUrl } from "./types";

type TProps = {
  block: BlockEntry;
  mapImageUrl: MapImageUrl;
};

export default function NotionAsset({ block, mapImageUrl }: TProps) {
  const value = block.value;
  const type = value.type;

  if (type === "embed" || type === "video") {
    const format = value.format as {
      display_source?: string;
      block_aspect_ratio?: number;
      block_height?: number;
      block_width?: number;
    } | undefined;
    const aspectRatio =
      format?.block_aspect_ratio ??
      (format?.block_height && format?.block_width
        ? format.block_height / format.block_width
        : 9 / 16);
    const src =
      type === "embed"
        ? (value.properties?.source?.[0]?.[0] as string | undefined)
        : format?.display_source;

    if (!src) return null;

    return (
      <div
        style={{
          paddingBottom: `${aspectRatio * 100}%`,
          position: "relative",
        }}
      >
        <iframe className="notion-image-inset" src={src} title="" />
      </div>
    );
  }

  if (type === "image") {
    const rawSrc = value.properties?.source?.[0]?.[0] as string | undefined;
    if (!rawSrc) return null;

    const src = mapImageUrl(rawSrc, block);
    const caption = value.properties?.title?.[0]?.[0] as string | undefined;
    const format = value.format as { block_aspect_ratio?: number } | undefined;
    const aspectRatio = format?.block_aspect_ratio;

    if (aspectRatio) {
      return (
        <div
          style={{
            paddingBottom: `${aspectRatio * 100}%`,
            position: "relative",
          }}
        >
          <img
            className="notion-image-inset"
            alt={caption || "notion image"}
            crossOrigin="anonymous"
            src={src}
          />
        </div>
      );
    }

    return <img alt={caption || "notion image"} crossOrigin="anonymous" src={src} />;
  }

  return null;
}
