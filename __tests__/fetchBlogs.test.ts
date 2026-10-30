// React 18 only ships `cache` in server builds, so pass the function through
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: (fn: unknown) => fn,
}));

const blogsConnection = jest.fn();
jest.mock("../tina/__generated__/client", () => ({
  __esModule: true,
  default: { queries: { blogsConnection: (...args: unknown[]) => blogsConnection(...args) } },
}));

import { getBlogsForProduct } from "../utils/fetchBlogs";

const post = (title: string) => ({
  cursor: title,
  node: { title, _sys: { path: `content/blogs/YakShaver/${title}.mdx` } },
});

beforeEach(() => {
  blogsConnection.mockReset();
  blogsConnection.mockImplementation(async (vars: { filter?: unknown }) =>
    vars?.filter
      ? // the paginated page query
        { data: { blogsConnection: { edges: [post("Newest")] } } }
      : // the full title list (getTitlesInTenant)
        {
          data: {
            blogsConnection: {
              edges: [post("Newest"), post("Featured")],
              pageInfo: { hasNextPage: false, endCursor: "" },
            },
          },
        }
  );
});

// The page query's `title: { in: [...] }` filter - what the list can include
const queriedTitles = () => {
  const pageCall = blogsConnection.mock.calls.find(([vars]) => vars?.filter);
  return pageCall?.[0].filter.title.in;
};

describe("getBlogsForProduct", () => {
  it("leaves excluded titles out of the query, before pagination (#550)", async () => {
    await getBlogsForProduct({ product: "YakShaver", filteredBlogs: ["Featured"] });
    expect(queriedTitles()).toEqual(["Newest"]);
  });

  it("includes every title when nothing is excluded", async () => {
    await getBlogsForProduct({ product: "YakShaver" });
    expect(queriedTitles()).toEqual(["Newest", "Featured"]);
  });
});
