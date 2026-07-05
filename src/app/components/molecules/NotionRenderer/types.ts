import type { ReactNode, FC } from "react";

export type Decoration = string | [string] | [string, Array<string | [string, string]>];

export type BlockValue = {
  id: string;
  type: string;
  properties?: Record<string, Decoration[]>;
  content?: string[];
  format?: Record<string, unknown>;
  parent_id?: string;
  parent_table?: string;
  _highlightedHtml?: string;
  _rawLang?: string;
};

export type BlockEntry = {
  role: string;
  value: BlockValue;
};

export type BlockMap = Record<string, BlockEntry>;

export type MapImageUrl = (url: string, block: BlockEntry) => string;

export type CustomBlockComponent = FC<{
  blockValue: BlockValue;
  blockMap: BlockMap;
  level: number;
  renderComponent: () => ReactNode;
  children?: ReactNode;
}>;

export type CustomBlockComponents = Partial<
  Record<string, CustomBlockComponent>
>;
