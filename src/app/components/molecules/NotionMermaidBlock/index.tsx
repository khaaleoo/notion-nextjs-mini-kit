"use client";

import { useEffect, useId, useRef, useState } from "react";

type TProps = {
  code: string;
};

export default function NotionMermaidBlock({ code }: TProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !code.trim()) return;

    let cancelled = false;

    async function renderDiagram() {
      setError(null);
      setLoading(true);

      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "strict",
          fontFamily: "inherit",
        });

        const renderId = `mermaid-${baseId}-${Date.now()}`;
        const { svg } = await mermaid.render(renderId, code.trim());

        if (cancelled) return;

        const el = containerRef.current;
        if (!el) return;

        el.innerHTML = svg;
        const svgEl = el.querySelector("svg");
        if (svgEl) {
          svgEl.removeAttribute("height");
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
        }
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setLoading(false);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
        containerRef.current?.replaceChildren();
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, baseId]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700 mb-2">Could not render diagram: {error}</p>
        <pre className="text-xs overflow-x-auto text-gray-700 font-mono whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div
      className="notion-mermaid my-6 flex justify-center overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 min-h-[120px]"
      aria-label="Diagram"
      aria-busy={loading}
    >
      {loading && !error && (
        <span className="self-center text-sm text-gray-400">Loading diagram…</span>
      )}
      <div
        ref={containerRef}
        className={`w-full max-w-3xl [&_svg]:mx-auto ${loading ? "hidden" : ""}`}
      />
    </div>
  );
}
