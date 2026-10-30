type BlogIndexBlock =
  | {
      __typename?: string | null;
      featuredBlog?: { title?: string | null } | null;
    }
  | null
  | undefined;

// Titles of the blog index's featured post(s). The Latest list leaves these out
// so a featured post isn't listed twice (#550). Titles, not filenames, because
// the blog query can only filter by title.
export const getFeaturedBlogTitles = (
  blocks: BlogIndexBlock[] | null | undefined
): string[] =>
  (blocks ?? []).flatMap((block) =>
    block?.__typename === "BlogsIndexBlocksFeaturedBlog" &&
    block.featuredBlog?.title
      ? [block.featuredBlog.title]
      : []
  );
