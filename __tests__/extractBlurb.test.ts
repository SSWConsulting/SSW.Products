import { extractBlurbAsTinaMarkdownContent } from "../utils/extractBlurbAsTinaMarkdownContent";

// Flattens the blurb back to the strings it would render.
const sentencesOf = (blurb: any): string[] =>
  (blurb.children ?? []).flatMap((p: any) =>
    (p.children ?? []).map((n: any) => n.text),
  );
const textOf = (blurb: any): string => sentencesOf(blurb).join("");

describe("extractBlurbAsTinaMarkdownContent", () => {
  it("keeps a sentence whole when it runs across inline formatting", () => {
    // "...takes **30 minutes on average**\*. This includes..." — the escaped
    // footnote asterisk used to orphan a leading "*." because the bold phrase
    // split the sentence across three inline nodes (regression: yakshaver.ai/blog)
    const body = {
      type: "root",
      children: [
        {
          type: "p",
          children: [
            { type: "text", text: "Creating a work item takes " },
            { type: "text", text: "30 minutes on average", bold: true, italic: true },
            {
              type: "text",
              text: "*. This includes writing clear descriptions and acceptance criteria. Complex items may take ",
            },
            { type: "text", text: "6+ hours", bold: true },
            { type: "text", text: ", especially with dependencies." },
          ],
        },
      ],
    } as any;

    const blurb = extractBlurbAsTinaMarkdownContent(body);
    const first = sentencesOf(blurb)[0];

    expect(first.startsWith("Creating a work item takes")).toBe(true);
    // the footnote marker stays attached to "average", never orphaned up front
    expect(textOf(blurb)).not.toMatch(/^\s*\*\./);
    expect(sentencesOf(blurb).some((s) => /^\s*\*\.\s*$/.test(s))).toBe(false);
    // the bold phrase, previously dropped, is now part of the blurb
    expect(textOf(blurb)).toContain("30 minutes on average");
  });

  it("drops fragments that are only symbols/punctuation", () => {
    const body = {
      type: "root",
      children: [
        {
          type: "p",
          children: [{ type: "text", text: "*. Real content follows here." }],
        },
      ],
    } as any;

    const blurb = extractBlurbAsTinaMarkdownContent(body);
    expect(textOf(blurb)).toBe("Real content follows here.");
  });

  it("includes link label text in a sentence", () => {
    const body = {
      type: "root",
      children: [
        {
          type: "p",
          children: [
            { type: "text", text: "See the " },
            { type: "a", url: "https://x", children: [{ type: "text", text: "ROI Calculator" }] },
            { type: "text", text: " for details." },
          ],
        },
      ],
    } as any;

    expect(textOf(extractBlurbAsTinaMarkdownContent(body))).toBe(
      "See the ROI Calculator for details.",
    );
  });

  it("stops at the sentence limit, across paragraphs", () => {
    const para = (t: string) => ({ type: "p", children: [{ type: "text", text: t }] });
    const body = {
      type: "root",
      children: [
        para("One. Two. Three. Four."),
        para("Five. Six."),
      ],
    } as any;

    const blurb = extractBlurbAsTinaMarkdownContent(body, 3);
    expect(textOf(blurb)).toBe("One. Two. Three.");
    expect(textOf(blurb)).not.toContain("Four");
    expect(textOf(blurb)).not.toContain("Five");
  });

  it("returns an empty blurb for a missing or malformed body", () => {
    const empty = { type: "root", children: [] };
    // a post with an empty body renders as featuredBlog?.body === undefined
    expect(extractBlurbAsTinaMarkdownContent(undefined as any)).toEqual(empty);
    expect(extractBlurbAsTinaMarkdownContent({} as any)).toEqual(empty);
    expect(
      extractBlurbAsTinaMarkdownContent({ type: "root" } as any),
    ).toEqual(empty);
  });

  it("skips non-paragraph blocks like headings and lists", () => {
    const body = {
      type: "root",
      children: [
        { type: "h2", children: [{ type: "text", text: "A Heading" }] },
        { type: "p", children: [{ type: "text", text: "The first paragraph." }] },
      ],
    } as any;

    expect(textOf(extractBlurbAsTinaMarkdownContent(body))).toBe(
      "The first paragraph.",
    );
  });
});
