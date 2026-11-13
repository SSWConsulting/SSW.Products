import { getBlogListEmptyMessage } from "../utils/blogListEmptyMessage";

describe("getBlogListEmptyMessage", () => {
  const emptyPage = { blogs: [], remainingPages: 0 };
  const loaded = { isFetchingNextPage: false };

  it("says the blog has no posts yet when a product has none", () => {
    expect(
      getBlogListEmptyMessage({
        ...loaded,
        pages: [emptyPage],
        isFiltering: false,
        hasFeaturedPost: false,
      })
    ).toBe("No blog posts yet");
  });

  it("says nothing matched when a search or category finds no posts", () => {
    expect(
      getBlogListEmptyMessage({
        ...loaded,
        pages: [emptyPage],
        isFiltering: true,
        hasFeaturedPost: false,
      })
    ).toBe("No results found");
  });

  it("says nothing matched even when there is a featured post", () => {
    expect(
      getBlogListEmptyMessage({
        ...loaded,
        pages: [emptyPage],
        isFiltering: true,
        hasFeaturedPost: true,
      })
    ).toBe("No results found");
  });

  it("stays quiet when the only post is the featured one", () => {
    expect(
      getBlogListEmptyMessage({
        ...loaded,
        pages: [emptyPage],
        isFiltering: false,
        hasFeaturedPost: true,
      })
    ).toBeNull();
  });

  it("stays quiet when there are posts to list", () => {
    expect(
      getBlogListEmptyMessage({
        ...loaded,
        pages: [emptyPage, { blogs: [{}] }],
        isFiltering: true,
        hasFeaturedPost: false,
      })
    ).toBeNull();
  });

  it("stays quiet before any page has loaded", () => {
    // Loading, offline, or the first load failed
    expect(
      getBlogListEmptyMessage({
        ...loaded,
        pages: undefined,
        isFiltering: false,
        hasFeaturedPost: false,
      })
    ).toBeNull();
  });

  it("stays quiet while the next page is loading", () => {
    expect(
      getBlogListEmptyMessage({
        pages: [emptyPage],
        isFetchingNextPage: true,
        isFiltering: false,
        hasFeaturedPost: false,
      })
    ).toBeNull();
  });
});
