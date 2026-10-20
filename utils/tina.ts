import { Edge, Edges } from "@/types/tina";

const filterEdgesByTenant = <E extends Edge>(
  edges: E[] | null | undefined,
  product: string
): E[] =>
  (edges ?? []).filter(
    (edge) => edge?.node?._sys.breadcrumbs?.at(0) === product
  );

const getSlugsFromCollections = <T extends Edges>(edges: T): string[] => {
  if (!edges) return [];
  return edges.reduce<string[]>((acc, curr) => {
    const slug = curr?.node?._sys.breadcrumbs?.at(-1);
    if (!slug) return acc;
    return [...acc, slug];
  }, []);
};

// Tina connection queries return one page at a time, so a single call silently
// truncates large collections. Follow the cursor to the end and return every
// edge, typed from the query. Used by the sitemap and by the routes'
// generateStaticParams so they enumerate every entry, not just the first page.
// (This only completes the param list; it doesn't make the routes static —
// locale/host resolution reads headers(), so rendering stays dynamic. See #737.)
type Connection<E> = {
  edges?: (E | null)[] | null;
  pageInfo: { hasNextPage: boolean; endCursor: string };
};

const MAX_PAGES = 50;

const getAllConnectionEdges = async <K extends string, E>(
  runQuery: (vars: { first: number; after?: string }) => Promise<{
    data: { [P in K]: Connection<E> };
  }>,
  field: K
): Promise<NonNullable<E>[]> => {
  const edges: NonNullable<E>[] = [];
  let after: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data } = await runQuery({ first: 100, after });
    const connection = data[field];
    for (const edge of connection.edges ?? []) {
      if (edge) edges.push(edge);
    }
    if (!connection.pageInfo.hasNextPage) return edges;
    after = connection.pageInfo.endCursor;
  }
  // Fail loudly instead of silently truncating, which is the bug this replaces
  throw new Error(
    `getAllConnectionEdges: "${field}" has more than ${MAX_PAGES} pages`
  );
};

export { filterEdgesByTenant, getSlugsFromCollections, getAllConnectionEdges };
