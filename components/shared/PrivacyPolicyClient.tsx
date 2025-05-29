"use client";

import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import client from "../../tina/__generated__/client";
import { DocAndBlogMarkdownStyle } from "../../tina/tinamarkdownStyles/DocAndBlogMarkdownStyle";

type PrivacyPolicyClientProps = Awaited<
  ReturnType<typeof client.queries.privacy>
>;

export default function BlogPostClient({
  query,
  variables,
  data,
}: PrivacyPolicyClientProps) {
  const pageData = useTina({
    query,
    variables,
    data,
  });

  const privacy = pageData.data.privacy;

  return (
    <div className="p-4 lg:pt-32 md:pt-20 mt-20 font-semibold max-w-3xl mx-auto text-white">
      <h2
        data-tina-field={tinaField(privacy, "title")}
        className="text-3xl mb-2 tracking-wide"
      >
        {privacy.title}
      </h2>
      <div
        data-tina-field={tinaField(privacy, "body")}
        className="text-base font-light lg:prose-xl"
      >
        <TinaMarkdown
          content={privacy.body}
          components={DocAndBlogMarkdownStyle}
        />
      </div>
    </div>
  );
}
