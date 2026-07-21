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

export type { Edge, Edges, RemoveTinaMetadata };
