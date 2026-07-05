"use client";
import type { JSX } from "react";

type TProps = {
  blockValue: { properties?: { title?: string[][] }; type?: string };
};

const TAG_MAP: Record<string, keyof JSX.IntrinsicElements> = {
  header: "h1",
  sub_header: "h2",
  sub_sub_header: "h3",
};

const CLASS_MAP: Record<string, string> = {
  header: "notion-h1",
  sub_header: "notion-h2",
  sub_sub_header: "notion-h3",
};

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NotionHeading({ blockValue }: TProps) {
  const type = blockValue?.type ?? "header";
  const text = blockValue?.properties?.title?.map((t) => t[0]).join("") ?? "";
  const id = slugifyHeading(text);
  const Tag = TAG_MAP[type] ?? "h1";
  const className = CLASS_MAP[type] ?? "notion-h1";

  return <Tag id={id} className={className}>{text}</Tag>;
}
