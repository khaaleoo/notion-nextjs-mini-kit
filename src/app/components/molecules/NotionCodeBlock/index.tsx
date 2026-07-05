"use client";
import CopyButton from "./CopyButton";
import NotionMermaidBlock from "@components/molecules/NotionMermaidBlock";

type TProps = {
  blockValue: {
    properties?: { title?: string[][]; language?: string[][] };
    _highlightedHtml?: string;
    _rawLang?: string;
  };
};

const MERMAID_LANGS = new Set(["mermaid", "flowchart"]);

export default function NotionCodeBlock({ blockValue }: TProps) {
  const code = blockValue?.properties?.title?.[0]?.[0] ?? "";
  const rawLang =
    blockValue?._rawLang ??
    blockValue?.properties?.language?.[0]?.[0] ??
    "";
  const highlighted = blockValue?._highlightedHtml ?? "";

  if (MERMAID_LANGS.has(rawLang.toLowerCase())) {
    return <NotionMermaidBlock code={code} />;
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        {rawLang && !["plain text", "plaintext", "text", ""].includes(rawLang) && (
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {rawLang}
          </span>
        )}
      </div>

      <div
        className="code-block-body shiki-code-host [&>pre]:!rounded-none [&>pre]:!rounded-b-lg [&>pre]:!m-0"
        dangerouslySetInnerHTML={{
          __html:
            highlighted ||
            `<pre class="shiki-code-block" style="color:#24292e;background-color:#f6f8fa;margin:0;border-radius:0 0 0.5rem 0.5rem;padding:1rem 1rem;overflow-x:auto;font-size:0.8125rem;line-height:1.45"><code>${code}</code></pre>`,
        }}
      />

      <CopyButton code={code} />
    </div>
  );
}
