import type { ReactNode } from "react";

// Anchor format per https://www.ssw.com.au/rules/heading-to-anchor-targets:
// lowercase, dash-separated, punctuation stripped. Unicode letters are kept so
// zh headings still get a usable anchor.
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Plain text of a rendered rich-text heading (bold/links/spans inside).
export function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}
