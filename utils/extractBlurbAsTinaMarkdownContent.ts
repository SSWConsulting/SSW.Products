import { TinaMarkdownContent } from "tinacms/dist/rich-text";

interface RootNode {
  type: "root";
  children: any[];
}

// A sentence ends at . ! ? or their full-width CJK forms.
const SENTENCE = /[^.!?。！？]+[.!?。！？]+/g;

// Plain text of an inline node and its descendants. Bold/italic are text nodes
// with marks and a link (`a`) wraps its label in children, so a sentence that
// runs across `plain **bold** plain` or a link is only whole once these join.
const inlineText = (node: any): string => {
  if (typeof node?.text === "string") return node.text;
  if (Array.isArray(node?.children))
    return node.children.map(inlineText).join("");
  return "";
};

// Keep only fragments containing a letter or number, so a stray "*." left by an
// escaped footnote marker (`**30 minutes**\*.`) never opens the blurb.
const hasWord = (text: string): boolean => /[\p{L}\p{N}]/u.test(text);

export const extractBlurbAsTinaMarkdownContent = (
  body: TinaMarkdownContent,
  sentenceLimit = 3
): TinaMarkdownContent => {
  const blurb: TinaMarkdownContent = { type: "root", children: [] };

  // A post may have an empty body, so `body` (or its children) can be missing;
  // treat anything non-iterable as no content and return an empty blurb.
  const nodes = (body as RootNode | undefined)?.children;
  if (!Array.isArray(nodes)) return blurb;

  let remaining = sentenceLimit;
  for (const node of nodes) {
    if (remaining === 0) break;
    if (node?.type !== "p" || !Array.isArray(node.children)) continue;

    // Join the paragraph before splitting: splitting each inline node on its own
    // drops runs with no terminal punctuation (a lead-in, a bold phrase) and can
    // orphan a trailing fragment, opening the blurb mid-sentence on a stray "*.".
    const text = node.children.map(inlineText).join("");
    const kept = (text.match(SENTENCE) ?? []).filter(hasWord).slice(0, remaining);
    if (kept.length === 0) continue;

    remaining -= kept.length;
    const paragraph: RootNode["children"][number] = {
      type: "p",
      children: [{ type: "text", text: kept.join("").trimStart() }],
    };
    blurb.children.push(paragraph);
  }

  return blurb;
};
