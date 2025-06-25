import { cn } from "@/lib/utils";
import Container from "@comps/Container";

import { RichText as RichTextProps } from "@/types/components/rich-text";
import { DocAndBlogMarkdownStyle } from "@tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const textAlignOptions = {
  Left: "text-left",
  Center: "text-center",
};

const RichText = (props: RichTextProps) => {
  const textAlignment =
    textAlignOptions[props.textAlign as keyof typeof textAlignOptions];
  return (
    <Container
      className={cn("text-white", textAlignment)}
      data-tina-field={tinaField(props, "body")}
    >
      <TinaMarkdown components={DocAndBlogMarkdownStyle} content={props.body} />
    </Container>
  );
};

export default RichText;
