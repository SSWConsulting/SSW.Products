export type RemoveTinaMetadata<T> = Omit<T, "__typename" | "_values"> & {
  __typename: string;
};
