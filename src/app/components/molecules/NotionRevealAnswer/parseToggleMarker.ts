/**
 * Reserved Notion toggle summary markers.
 *
 * Authoring convention (toggle title in Notion):
 * - `[answer]` → reveal CTA “Click to view answer”
 * - `[answer] Explanation` → reveal with label “Explanation”
 * - any other title → normal toggle (no marker)
 *
 * Future markers can extend the same `[kind]` namespace, e.g. `[hint]`, `[spoiler]`.
 */

export type ToggleMarker =
  | { kind: "answer"; label: string | null }
  | { kind: "none" };

const ANSWER_MARKER_RE = /^\[answer\](?:\s+(.*))?$/i;

export function parseToggleMarker(summary: string): ToggleMarker {
  const trimmed = summary.trim();
  const match = trimmed.match(ANSWER_MARKER_RE);

  if (match) {
    const label = match[1]?.trim() || null;
    return { kind: "answer", label };
  }

  return { kind: "none" };
}

export function isAnswerToggle(summary: string): boolean {
  return parseToggleMarker(summary).kind === "answer";
}
