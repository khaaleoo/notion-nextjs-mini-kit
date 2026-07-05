import { codeToHtml } from "shiki";
import { transformerLineNumbers } from "@helpers/shiki-line-numbers";

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  bash: "bash",
  shell: "bash",
  sh: "bash",
  go: "go",
  golang: "go",
  sql: "sql",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  docker: "dockerfile",
  dockerfile: "dockerfile",
  python: "python",
  rust: "rust",
  css: "css",
  html: "html",
  markdown: "markdown",
  md: "markdown",
  "plain text": "text",
  plaintext: "text",
  text: "text",
};

const PRE_STYLE =
  "margin:0;border-radius:0 0 0.5rem 0.5rem;padding:0.875rem 1rem;overflow-x:auto;font-size:0.8125rem;line-height:1.45;";

function appendClass(existing: string | string[] | undefined, ...classes: string[]): string {
  const list = Array.isArray(existing)
    ? [...existing]
    : existing
      ? existing.split(/\s+/).filter(Boolean)
      : [];
  return [...list, ...classes].join(" ");
}

async function highlightCode(code: string, rawLang: string): Promise<string> {
  const lang = LANGUAGE_MAP[rawLang.toLowerCase()] ?? "text";
  const options = {
    lang,
    theme: "github-light",
    transformers: [
      transformerLineNumbers(),
      {
        pre(node: { properties: { style?: string; class?: string | string[] } }) {
          node.properties.style = [node.properties.style, PRE_STYLE].filter(Boolean).join(";");
          node.properties.class = appendClass(node.properties.class, "shiki-code-block");
        },
      },
    ],
  };

  try {
    return await codeToHtml(code, options);
  } catch {
    return await codeToHtml(code, { ...options, lang: "text" });
  }
}

export async function highlightCodeBlocks(
  blockMap: Record<string, any>
): Promise<Record<string, any>> {
  const result = { ...blockMap };

  await Promise.all(
    Object.entries(result).map(async ([key, block]) => {
      const blockValue = block?.value;
      if (blockValue?.type !== "code") return;

      const code = blockValue?.properties?.title?.[0]?.[0] ?? "";
      const rawLang = (blockValue?.properties?.language?.[0]?.[0] ?? "").toLowerCase();

      if (!code || code.length > 50_000) return;
      if (rawLang === "mermaid" || rawLang === "flowchart") {
        result[key] = {
          ...block,
          value: { ...blockValue, _rawLang: rawLang },
        };
        return;
      }

      const html = await highlightCode(code, rawLang);
      result[key] = {
        ...block,
        value: {
          ...blockValue,
          _highlightedHtml: html,
          _rawLang: rawLang,
        },
      };
    })
  );

  return result;
}
