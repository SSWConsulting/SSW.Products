export type RemoveTinaMetadata<T> = Omit<
  T,
  "__typename" | "_values" | "_sys"
> & {
  __typename: string;
};
