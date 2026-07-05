import type { ShikiTransformer } from "shiki";

type TLineNumbersOptions = {
  className?: string;
  skipSingleLine?: boolean;
};

function gutterWidth(totalLines: number): string {
  const digits = String(totalLines).length;
  if (digits === 1) return "1.125rem";
  if (digits === 2) return "1.625rem";
  return "2.125rem";
}

export function transformerLineNumbers(
  options: TLineNumbersOptions = {}
): ShikiTransformer {
  const className = options.className ?? "line-number";
  const skipSingleLine = options.skipSingleLine ?? true;
  let totalLines = 0;

  return {
    name: "@notion-nextjs-mini-kit/line-numbers",
    preprocess(code) {
      totalLines = code.split("\n").length;
    },
    line(node, line) {
      if (skipSingleLine && totalLines <= 1) return;

      const codeTokens = [...node.children];
      node.children = [
        {
          type: "element",
          tagName: "span",
          properties: { class: className, "aria-hidden": "true" },
          children: [{ type: "text", value: String(line) }],
        },
        {
          type: "element",
          tagName: "span",
          properties: { class: "line-content" },
          children: codeTokens,
        },
      ];
    },
    pre(node) {
      if (skipSingleLine && totalLines <= 1) return;
      this.addClassToHast(node, "has-line-numbers");
      const gutter = gutterWidth(totalLines);
      node.properties.style = [node.properties.style, `--code-gutter:${gutter}`]
        .filter(Boolean)
        .join(";");
    },
  };
}
