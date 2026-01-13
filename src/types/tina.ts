import client from "@tina/__generated__/client";
import { SystemInfo } from "@tina/__generated__/types";

type RemoveTinaMetadata<T> = Omit<T, "__typename" | "_values" | "_sys"> & {
  __typename: string;
};

type Edges = Edge[] | null | undefined;

type Edge =
  | {
      node?: {
        _sys: Partial<SystemInfo>;
      } | null;
    }
  | null
  | undefined;

type TinaQuery = (keyof typeof client.queries);

export type { Edge, Edges, RemoveTinaMetadata, TinaQuery };
