import { Fragment, type ReactNode } from "react";
import type { Decoration } from "./types";

export function renderRichText(properties: Decoration[] | undefined): ReactNode {
  if (!properties?.length) return null;

  return properties.map(([text, decorations], i) => {
    if (!decorations || !Array.isArray(decorations)) {
      return <Fragment key={i}>{text}</Fragment>;
    }

    return decorations.reduceRight<ReactNode>((element, decorator) => {
      switch (decorator[0]) {
        case "h":
          return (
            <span key={i} className={`notion-${decorator[1]}`}>
              {element}
            </span>
          );
        case "c":
          return (
            <code key={i} className="notion-inline-code">
              {element}
            </code>
          );
        case "b":
          return <b key={i}>{element}</b>;
        case "i":
          return <em key={i}>{element}</em>;
        case "s":
          return <s key={i}>{element}</s>;
        case "a":
          return (
            <a className="notion-link" href={decorator[1]} key={i}>
              {element}
            </a>
          );
        default:
          return <Fragment key={i}>{element}</Fragment>;
      }
    }, <>{text}</>);
  });
}
