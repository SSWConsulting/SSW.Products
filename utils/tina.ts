import { Edge, Edges } from "@/types/tina";

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

const mapConnection = <T extends Edges, R>(
  edges: T,
  mapFn: (acc: R[], curr: Edge) => R[]
): R[] => {
  if (!edges) return [];
  return edges.reduce<R[]>((acc: R[], curr: Edge) => {
    return mapFn(acc, curr);
  }, []);
};

export { filterEdgesByTenant, getSlugsFromCollections };
