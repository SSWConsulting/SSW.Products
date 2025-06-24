import { AstNode } from "@/types/ast";

const searchAstTree = (node: AstNode, targetNodes: string[]) => {
  const results: AstNode[] = [];
  recurseAstTree(node, targetNodes, results);
  return results;
};

const recurseAstTree = (
  node: AstNode,
  targetNodes: string[],
  accumulatedNodes: AstNode[]
) => {
  if (targetNodes.includes(node.type)) {
    accumulatedNodes.push(node);
  }
  if (!node.children) {
    return;
  }
  for (const child of node.children) {
    recurseAstTree(child, targetNodes, accumulatedNodes);
  }
};

const nodesToText = (node: AstNode[]) => {
  return node.map((child) => {
    const text = child.children
      .map((child) => (child.children ? child.children[0].text : child.text))
      .join(" ");
    return {
      text,
      type: child.type,
    };
  });
};

export { nodesToText, searchAstTree };
