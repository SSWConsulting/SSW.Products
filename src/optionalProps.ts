export type OptionalProps<T> = {
  [K in keyof T]?: T[K] | null;
};
