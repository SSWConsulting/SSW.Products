// Slug for a heading anchor, per https://www.ssw.com.au/rules/heading-to-anchor-targets
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC") // fold width/compatibility forms (e.g. full-width CJK)
    .replace(/[^\p{L}\p{N}\s_-]/gu, "") // drop punctuation; keep letters/numbers of any script
    .trim()
    .replace(/[\s_]+/g, "-") // spaces and underscores become dashes
    .replace(/-+/g, "-") // collapse repeated dashes
    .replace(/^-|-$/g, ""); // trim leading/trailing dash
}

// Plain text of a heading's children (string, React element, or Tina AST node).
export function extractText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (!node || typeof node !== "object") return "";

  const n = node as {
    props?: { children?: unknown; content?: unknown };
    text?: unknown;
    children?: unknown;
  };
  if (n.props) return extractText(n.props.children ?? n.props.content); // React element (Tina heading text lives in props.content)
  if (n.text !== undefined) return extractText(n.text); // Tina AST leaf
  if (n.children !== undefined) return extractText(n.children); // Tina AST branch
  return "";
}
