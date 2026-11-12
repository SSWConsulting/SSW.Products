import { getBlogListEmptyMessage } from "../utils/blogListEmptyMessage";

describe("getBlogListEmptyMessage", () => {
  const emptyPage = { blogs: [], remainingPages: 0 };

  it("says the blog has no posts yet when a product has none", () => {
    expect(
      getBlogListEmptyMessage({
        pages: [emptyPage],
        isFiltering: false,
        hasFeaturedPost: false,
      })
    ).toBe("No blog posts yet");
  });

  it("says nothing matched when a search or category finds no posts", () => {
    expect(
      getBlogListEmptyMessage({
        pages: [emptyPage],
        isFiltering: true,
        hasFeaturedPost: true,
      })
    ).toBe("No results found");
  });

  it("stays quiet when the only post is the featured one", () => {
    expect(
      getBlogListEmptyMessage({
        pages: [emptyPage],
        isFiltering: false,
        hasFeaturedPost: true,
      })
    ).toBeNull();
  });

  it("stays quiet when there are posts to list", () => {
    expect(
      getBlogListEmptyMessage({
        pages: [emptyPage, { blogs: [{}] }],
        isFiltering: true,
        hasFeaturedPost: false,
      })
    ).toBeNull();
  });
});
