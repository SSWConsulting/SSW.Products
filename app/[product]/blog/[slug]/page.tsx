import { notFound } from "next/navigation";
import InteractiveBackground from "../../../../components/shared/Background/InteractiveBackground";
import NavBarServer from "../../../../components/shared/NavBarServer";
import FooterServer from "../../../../components/shared/FooterServer";
import client from "../../../../tina/__generated__/client";
import BlogPostClient from "../../../../components/shared/BlogPostClient";
import { Blogs } from "../../../../tina/__generated__/types";

interface BlogPostProps {
  params: {
    slug: string;
    product: string;
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug, product } = params;

  const documentData = await getBlogPost(product, slug);
  if (!documentData) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <InteractiveBackground />
      <NavBarServer product={product} />

      <div className="flex-grow">
        <BlogPostClient
          query={documentData.query}
          variables={documentData.variables}
          pageData={{ blogs: documentData.blogs }}
        />
      </div>

      <FooterServer product={product} />
    </div>
  );
}

async function getBlogPost(product: string, slug: string) {
  try {
    const res = await client.queries.blogs({
      relativePath: `${product}/${slug}.mdx`,
    });

    if (!res?.data?.blogs) {
      return null;
    }

    return {
      query: res.query,
      variables: res.variables,
      blogs: res.data.blogs as Blogs,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
