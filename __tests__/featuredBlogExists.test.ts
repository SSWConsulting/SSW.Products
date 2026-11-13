import fg from "fast-glob";
import { existsSync, readFileSync } from "fs";
import path from "path";

// A featured post that points at a missing file 404s the whole blog index, and
// `tinacms build` doesn't catch it (#1845)
const featuredBlogPaths = (node: unknown): string[] => {
  if (Array.isArray(node)) return node.flatMap(featuredBlogPaths);
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([key, value]) =>
    key === "featuredBlog" && typeof value === "string"
      ? [value]
      : featuredBlogPaths(value)
  );
};

const root = path.join(__dirname, "..");
const indexPages = fg.sync("content/indexPages/**/*.json", { cwd: root });

describe("featured blog posts", () => {
  it("finds the blog indexes", () => {
    expect(indexPages.length).toBeGreaterThan(0);
  });

  it.each(indexPages)("%s features only posts that exist", (file) => {
    const featured = featuredBlogPaths(
      JSON.parse(readFileSync(path.join(root, file), "utf8"))
    );
    const missing = featured.filter((post) => !existsSync(path.join(root, post)));
    expect(missing).toEqual([]);
  });
});
