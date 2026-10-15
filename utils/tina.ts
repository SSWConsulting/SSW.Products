import { Edge, Edges } from "@/types/tina";

const mapConnection = <T extends Edges, R>(
  edges: T,
  mapFn: (acc: R[], curr: Edge) => R[]
): R[] => {
  if (!edges) return [];
  return edges.reduce<R[]>((acc: R[], curr: Edge) => {
    return mapFn(acc, curr);
  }, []);
};

const filterEdgesByTenant = <T extends Edges>(
  connection: T,
  product: string
) => {
  return mapConnection(connection, (acc: Edge[], curr) => {
    const breadcrumb = curr?.node?._sys.breadcrumbs?.at(0);
    if (!breadcrumb || breadcrumb !== product) return acc;
    return [...acc, curr];
  });
};

const getSlugsFromCollections = <T extends Edges>(edges: T): string[] => {
  if (!edges) return [];
  return edges.reduce<string[]>((acc, curr) => {
    const slug = curr?.node?._sys.breadcrumbs?.at(-1);
    if (!slug) return acc;
    return [...acc, slug];
  }, []);
};

// Tina connection queries return one page at a time (default ~10 edges), so a
// single call silently truncates large collections. Follow the cursor to the
// end and return every edge. Used by the sitemap and by the routes'
// generateStaticParams, which otherwise only pre-render the first page.
const getAllConnectionEdges = async (
  runQuery: (vars: {
    first: number;
    after?: string;
  }) => Promise<{ data: Record<string, any> }>,
  field: string
): Promise<any[]> => {
  const edges: any[] = [];
  let after: string | undefined;
  // hard cap guards against a malformed pageInfo turning this into a loop
  for (let page = 0; page < 50; page++) {
    const res = await runQuery({ first: 100, after });
    const connection = res.data[field];
    for (const edge of connection?.edges ?? []) {
      if (edge) edges.push(edge);
    }
    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) {
      break;
    }
    after = connection.pageInfo.endCursor;
  }
  return edges;
};

export { filterEdgesByTenant, getSlugsFromCollections, getAllConnectionEdges };
