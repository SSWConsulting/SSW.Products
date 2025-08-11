import { TinaMarkdownContent } from "tinacms/dist/rich-text";

interface TextNode {
    type: 'text';
    text: string;
  }
  
  interface ParagraphNode {
    type: 'p';
    children: (TextNode | any)[];
  }
  
  interface RootNode {
    type: 'root';
    children: (ParagraphNode | any)[];
  }
  
  export const extractBlurbAsTinaMarkdownContent = (body: TinaMarkdownContent, sentenceLimit = 3): TinaMarkdownContent => {
    let sentenceCount = 0;
    const blurb: TinaMarkdownContent = {
      type: 'root',
      children: [],
    };
  
    //traverse the body to collect the sentences
    for (const node of (body as RootNode).children) {
      if (node.type === 'p' && node.children) {
        const paragraphNode = { ...node, children: [] }; //clone the node structure for the blurb
        for (const child of node.children) {
          if (child.type === 'text' && typeof child.text === 'string') {
            //split the text into sentences based on common punctuation (.!? and Chinese 。！？)
            const sentences = child.text.match(/[^\.!\?。！？]+[\.!\?。！？]+/g) || [];
            for (const sentence of sentences) {
              if (sentenceCount < sentenceLimit) {
                paragraphNode.children.push({ type: 'text', text: sentence });
                sentenceCount++;
              } else {
                break;
              }
            }
          }
        }
        if (paragraphNode.children.length > 0) {
          blurb.children.push(paragraphNode);
        }
        if (sentenceCount >= sentenceLimit) {
          break;
        }
      }
    }
  
    return blurb;
  };