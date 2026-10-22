import { getAllConnectionEdges } from "../utils/tina";

// A minimal stand-in for a Tina connection page under the field "items".
const page = (
  edges: (string | null)[],
  endCursor: string,
  hasNextPage: boolean
) => ({ data: { items: { edges, pageInfo: { endCursor, hasNextPage } } } });

describe("getAllConnectionEdges", () => {
  it("follows the cursor to the end and returns every non-null edge", async () => {
    const pages = [
      page(["a", null, "b"], "c1", true),
      page(["c"], "c2", true),
      page(["d"], "", false),
    ];
    let call = 0;
    const runQuery = jest.fn(async () => pages[call++]);

    const edges = await getAllConnectionEdges(runQuery, "items");

    expect(edges).toEqual(["a", "b", "c", "d"]);
    expect(runQuery).toHaveBeenCalledTimes(3);
    // each page's endCursor is passed as `after` to the next call
    expect(runQuery).toHaveBeenNthCalledWith(1, { first: 100, after: undefined });
    expect(runQuery).toHaveBeenNthCalledWith(2, { first: 100, after: "c1" });
    expect(runQuery).toHaveBeenNthCalledWith(3, { first: 100, after: "c2" });
  });

  it("stops after one page when hasNextPage is false", async () => {
    const runQuery = jest.fn(async () => page(["only"], "", false));
    expect(await getAllConnectionEdges(runQuery, "items")).toEqual(["only"]);
    expect(runQuery).toHaveBeenCalledTimes(1);
  });

  it("throws instead of truncating when the page cap is exceeded", async () => {
    const runQuery = jest.fn(async () => page(["x"], "next", true));
    await expect(getAllConnectionEdges(runQuery, "items")).rejects.toThrow(
      /more than 50 pages/
    );
    expect(runQuery).toHaveBeenCalledTimes(50);
  });
});
