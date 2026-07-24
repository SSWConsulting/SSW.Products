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
const ANCHORED_FIELDS: Record<string, string[]> = {
  Banner: ["headline"],
  BentoBox: ["title", "topLeftBox.title", "topRightBox.title", "bottomRightBox.title"],
  CardAndImage: ["ParentContainerTitle", "CardAndImageItem[].Header"],
  Timeline: ["title", "items[].title"],
  calculator: ["title", "tiers[].tier"],
  callToAction: ["title"],
  comparisonTable: ["headline"],
  downloadCards: ["title", "cards[].title"],
  faq: ["headline", "questions[].question"],
  imageGrid: ["title"],
  imageShowcase: ["title", "showcaseTitle"],
  pricing: ["title", "plans[].planTier", "plans[].listTitle", "addOns.title"],
  tryItNow: ["tryItNowTitle", "tryItNowCards[].title"],
  videoDisplay: ["title"],
};

// Templates that deliberately anchor nothing: hero and mediaHero render the
// page title, richText anchors through the markdown renderer, and
// featureCarousel's headings follow the selected tab.
const UNANCHORED = new Set(["hero", "mediaHero", "richText", "featureCarousel"]);

// Resolves "plans[].planTier" / "addOns.title" against a block
const valuesAt = (node: unknown, path: string): string[] => {
  if (node == null) return [];
  if (!path) return typeof node === "string" ? [node] : [];

  const [head, ...rest] = path.split(".");
  const tail = rest.join(".");
  if (head.endsWith("[]")) {
    const list = (node as Record<string, unknown>)[head.slice(0, -2)];
    return Array.isArray(list) ? list.flatMap((item) => valuesAt(item, tail)) : [];
  }
  return valuesAt((node as Record<string, unknown>)[head], tail);
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

  const paths = ANCHORED_FIELDS[block._template ?? ""] ?? [];
  return paths
    .flatMap((path) => valuesAt(block, path))
    .map(slugifyHeading)
    .filter(Boolean);
};

const pages = fg.sync("content/pages/**/*.json", {
  cwd: path.join(__dirname, ".."),
  absolute: true,
});

describe("page anchor slugs", () => {
  it("finds page content to check", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  // The lint rule stops a new block shipping a raw <h2>/<h3>; this stops one
  // shipping a heading this test doesn't know how to check for collisions.
  it("knows every block template in use", () => {
    const templates = new Set<string>();
    for (const file of pages) {
      const page = JSON.parse(readFileSync(file, "utf8"));
      for (const block of page.pageBlocks ?? []) {
        if (block?._template) templates.add(block._template);
      }
    }

    const unknown = [...templates].filter(
      (t) => !(t in ANCHORED_FIELDS) && !UNANCHORED.has(t) && t !== "features",
    );
    expect(unknown).toEqual([]);
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
