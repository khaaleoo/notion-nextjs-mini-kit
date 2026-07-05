"use client";

import type { ReactNode } from "react";
import NotionAsset from "./NotionAsset";
import { renderRichText } from "./NotionRichText";
import type { BlockEntry, BlockMap, CustomBlockComponents, MapImageUrl } from "./types";
import { classNames, getListNumber, getTextContent } from "./utils";

type TProps = {
  block: BlockEntry;
  blockMap: BlockMap;
  level: number;
  mapImageUrl: MapImageUrl;
  customBlockComponents?: CustomBlockComponents;
  children?: ReactNode;
};

export default function NotionBlock({
  block,
  blockMap,
  level,
  mapImageUrl,
  customBlockComponents,
  children,
}: TProps) {
  const blockValue = block.value;

  const renderDefault = (): ReactNode => {
    const title = blockValue.properties?.title;

    switch (blockValue.type) {
      case "page":
        if (level === 0) {
          return <main className="notion">{children}</main>;
        }
        if (!title) return null;
        return (
          <a className="notion-page-link" href={`/${blockValue.id.replace(/-/g, "")}`}>
            <div className="notion-page-text">{renderRichText(title)}</div>
          </a>
        );

      case "header":
        if (!title) return null;
        return <h1 className="notion-h1">{renderRichText(title)}</h1>;

      case "sub_header":
        if (!title) return null;
        return <h2 className="notion-h2">{renderRichText(title)}</h2>;

      case "sub_sub_header":
        if (!title) return null;
        return <h3 className="notion-h3">{renderRichText(title)}</h3>;

      case "divider":
        return <hr className="notion-hr" />;

      case "text": {
        if (!title) {
          return <div className="notion-blank">&nbsp;</div>;
        }
        const blockColor = blockValue.format?.block_color as string | undefined;
        return (
          <p className={classNames("notion-text", blockColor && `notion-${blockColor}`)}>
            {renderRichText(title)}
          </p>
        );
      }

      case "bulleted_list":
      case "numbered_list": {
        const wrapList = (content: ReactNode, start?: number) =>
          blockValue.type === "bulleted_list" ? (
            <ul className="notion-list notion-list-disc">{content}</ul>
          ) : (
            <ol start={start} className="notion-list notion-list-numbered">
              {content}
            </ol>
          );

        let output: ReactNode = null;

        if (blockValue.content?.length) {
          output = (
            <>
              {title && <li>{renderRichText(title)}</li>}
              {wrapList(children)}
            </>
          );
        } else {
          output = title ? <li>{renderRichText(title)}</li> : null;
        }

        const parent = blockValue.parent_id
          ? blockMap[blockValue.parent_id]?.value
          : undefined;
        const isTopLevel = !parent || parent.type !== blockValue.type;
        const start = getListNumber(blockValue.id, blockMap);

        return isTopLevel ? wrapList(output, start) : output;
      }

      case "image":
      case "embed":
      case "video":
        return (
          <figure className="notion-asset-wrapper">
            <NotionAsset block={block} mapImageUrl={mapImageUrl} />
            {blockValue.properties?.title && (
              <figcaption className="notion-image-caption">
                {renderRichText(blockValue.properties.title)}
              </figcaption>
            )}
          </figure>
        );

      case "quote":
        if (!title) return null;
        return <blockquote className="notion-quote">{renderRichText(title)}</blockquote>;

      case "callout": {
        const blockColor = blockValue.format?.block_color as string | undefined;
        return (
          <div
            className={classNames(
              "notion-callout",
              blockColor && `notion-${blockColor}`,
              blockColor && `notion-${blockColor}_co`
            )}
          >
            <div className="notion-callout-text">{renderRichText(title)}</div>
          </div>
        );
      }

      case "bookmark": {
        const link = blockValue.properties?.link;
        if (!link) return null;
        const bookmarkTitle = blockValue.properties?.title ?? link;
        return (
          <div className="notion-row">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="notion-bookmark"
              href={link[0][0]}
            >
              <div>
                <div className="notion-bookmark-title">
                  {renderRichText(bookmarkTitle)}
                </div>
                <div className="notion-bookmark-link">
                  {getTextContent(link)}
                </div>
              </div>
            </a>
          </div>
        );
      }

      case "toggle":
        return (
          <details className="notion-toggle">
            <summary>{renderRichText(title)}</summary>
            <div>{children}</div>
          </details>
        );

      case "to_do": {
        const checked = blockValue.properties?.checked?.[0]?.[0] === "Yes";
        return (
          <div className="notion-to-do">
            <input type="checkbox" checked={checked} readOnly />
            <span>{renderRichText(title)}</span>
          </div>
        );
      }

      case "equation":
        if (!title) return null;
        return (
          <div className="notion-equation">
            {getTextContent(title)}
          </div>
        );

      default:
        if (process.env.NODE_ENV !== "production") {
          console.warn("Unsupported Notion block type:", blockValue.type);
        }
        return null;
    }
  };

  if (
    customBlockComponents?.[blockValue.type] &&
    level !== 0
  ) {
    const CustomComponent = customBlockComponents[blockValue.type]!;
    return (
      <CustomComponent
        blockMap={blockMap}
        blockValue={blockValue}
        level={level}
        renderComponent={renderDefault}
      >
        {children}
      </CustomComponent>
    );
  }

  return renderDefault();
}
