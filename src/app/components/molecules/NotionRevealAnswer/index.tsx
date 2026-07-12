"use client";

import type { ReactNode } from "react";
import type {
  BlockValue,
  Decoration,
} from "@components/molecules/NotionRenderer/types";
import { parseToggleMarker } from "./parseToggleMarker";

type TProps = {
  blockValue: BlockValue;
  renderDefault: () => ReactNode;
  children?: ReactNode;
};

const DEFAULT_CLOSED_LABEL = "Click to view answer";
const DEFAULT_OPEN_LABEL = "Hide answer";

function summaryFromTitle(title: Decoration[] | undefined): string {
  if (!title) return "";
  return title
    .map((segment) => (Array.isArray(segment) ? segment[0] : segment))
    .join("");
}

export default function NotionRevealAnswer({
  blockValue,
  renderDefault,
  children,
}: TProps) {
  const marker = parseToggleMarker(
    summaryFromTitle(blockValue.properties?.title)
  );

  switch (marker.kind) {
    case "none":
      return <>{renderDefault()}</>;
    case "answer": {
      const customLabel = marker.label;
      const closedLabel = customLabel ?? DEFAULT_CLOSED_LABEL;
      const openLabel = customLabel ?? DEFAULT_OPEN_LABEL;

      return (
        <details className="notion-reveal-answer">
          <summary className="notion-reveal-answer__summary">
            <span className="notion-reveal-answer__chevron" aria-hidden="true" />
            <span className="notion-reveal-answer__label notion-reveal-answer__label--closed">
              {closedLabel}
            </span>
            <span className="notion-reveal-answer__label notion-reveal-answer__label--open">
              {openLabel}
            </span>
          </summary>
          <div className="notion-reveal-answer__content">{children}</div>
        </details>
      );
    }
    default: {
      const _exhaustive: never = marker;
      return _exhaustive;
    }
  }
}
