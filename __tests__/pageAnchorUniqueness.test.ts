import fg from "fast-glob";
import { readFileSync } from "fs";
import path from "path";
import { slugifyHeading } from "../utils/anchorSlug";

// Anchor names must be unique within a document:
// https://www.ssw.com.au/rules/efficient-anchor-names
//
// Nothing dedups slugs at render time, so two blocks sharing a title would ship
// a duplicate id and the link would resolve to whichever came first. This maps
// each block template to the field its component anchors - keep it in step with
// components/shared/Blocks when a template gains or renames a heading.
const ANCHORED_FIELD: Record<string, string> = {
  Banner: "headline",
  BentoBox: "title",
  CardAndImage: "ParentContainerTitle",
  Timeline: "title",
  calculator: "title",
  callToAction: "title",
  comparisonTable: "headline",
  downloadCards: "title",
  faq: "headline",
  imageGrid: "title",
  imageShowcase: "title",
  pricing: "title",
  tryItNow: "tryItNowTitle",
  videoDisplay: "title",
};

// hero and mediaHero render the page title, not a section target, so they are
// deliberately absent above. features anchors each item, not the block.
type Block = Record<string, unknown> & {
  _template?: string;
  featureItem?: { headline?: string; headlineAfter?: string }[];
};

const slugsIn = (block: Block): string[] => {
  if (block._template === "features") {
    return (block.featureItem ?? [])
      .map((item) =>
        slugifyHeading(
          [item.headline, item.headlineAfter].filter(Boolean).join(" "),
        ),
      )
      .filter(Boolean);
  }

  const field = ANCHORED_FIELD[block._template ?? ""];
  const title = field ? block[field] : undefined;
  if (typeof title !== "string") return [];
  const slug = slugifyHeading(title);
  return slug ? [slug] : [];
};

const pages = fg.sync("content/pages/**/*.json", {
  cwd: path.join(__dirname, ".."),
  absolute: true,
});

describe("page anchor slugs", () => {
  it("finds page content to check", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it.each(pages.map((p) => [path.relative(process.cwd(), p), p]))(
    "%s has no duplicate heading anchors",
    (_name, file) => {
      const page = JSON.parse(readFileSync(file, "utf8"));
      const slugs = (page.pageBlocks ?? []).flatMap(slugsIn);
      const duplicates = slugs.filter(
        (slug: string, i: number) => slugs.indexOf(slug) !== i,
      );
      expect(duplicates).toEqual([]);
    },
  );
});
