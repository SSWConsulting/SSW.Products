import type { ReactNode } from "react";

// Anchor format per https://www.ssw.com.au/rules/heading-to-anchor-targets:
// lowercase, dash-separated, punctuation stripped. Unicode letters are kept so
// zh headings still get a usable anchor.
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Plain text of a rendered rich-text heading (bold/links/spans inside).
// Handles both React children and Tina rich-text AST: TinaMarkdown renders a
// heading's text as a nested <TinaMarkdown content={ast}> element, so the text
// lives in props.content ({type, text, children} nodes), not props.children.
export function extractText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object") {
    if ("props" in node) {
      const props = node.props as { children?: ReactNode; content?: unknown };
      return extractText(props.children ?? props.content);
    }
    if ("text" in node) return String((node as { text: unknown }).text ?? "");
    if ("children" in node) {
      return extractText((node as { children: unknown }).children);
    }
  }
  return "";
}
