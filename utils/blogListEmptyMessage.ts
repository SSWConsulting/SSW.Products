type BlogPage = { blogs?: unknown[] | null } | null | undefined;

// What the Latest list says when it has no posts to show, or null when it
// shouldn't say anything (#1845). The blogs API answers an empty match with an
// empty page rather than no page, so count the posts, not the pages.
export const getBlogListEmptyMessage = ({
  pages,
  isFetchingNextPage,
  isFiltering,
  hasFeaturedPost,
}: {
  // undefined until a page has loaded: while loading, offline, or after the
  // first load failed. None of those says whether the blog has posts.
  pages: BlogPage[] | undefined;
  isFetchingNextPage: boolean;
  isFiltering: boolean;
  hasFeaturedPost: boolean;
}): string | null => {
  if (!pages || isFetchingNextPage) return null;
  const postCount = pages.reduce(
    (count, page) => count + (page?.blogs?.length ?? 0),
    0
  );
  if (postCount > 0) return null;
  if (isFiltering) return "No results found";
  // The featured post is left out of this list, so a blog whose only post is
  // featured has an empty list but isn't empty
  if (hasFeaturedPost) return null;
  return "No blog posts yet";
};
