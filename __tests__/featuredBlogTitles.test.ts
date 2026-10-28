import { getFeaturedBlogTitles } from "../utils/featuredBlogTitles";

describe("getFeaturedBlogTitles", () => {
  it("returns the featured post's title and ignores other blocks", () => {
    const blocks = [
      { __typename: "BlogsIndexBlocksHeroSearch" },
      {
        __typename: "BlogsIndexBlocksFeaturedBlog",
        featuredBlog: { title: "How Much Time Does YakShaver Save?" },
      },
      { __typename: "BlogsIndexBlocksArticleList" },
    ];
    expect(getFeaturedBlogTitles(blocks)).toEqual([
      "How Much Time Does YakShaver Save?",
    ]);
  });

  it("returns nothing when there is no featured post", () => {
    expect(getFeaturedBlogTitles(null)).toEqual([]);
    expect(
      getFeaturedBlogTitles([
        { __typename: "BlogsIndexBlocksFeaturedBlog", featuredBlog: null },
        null,
      ])
    ).toEqual([]);
  });
});
