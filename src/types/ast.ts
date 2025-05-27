export type AstNode = {
  children: AstNode[];
  value: string;
  type: string;
  text: string;
};
