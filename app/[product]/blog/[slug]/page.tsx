import { notFound } from "next/navigation";

import InteractiveBackground from "../../../../components/shared/Background/InteractiveBackground";
import BlogPostClient from "../../../../components/shared/BlogPostClient";
import FooterServer from "../../../../components/shared/FooterServer";
import NavBarServer from "../../../../components/shared/NavBarServer";
import client from "../../../../tina/__generated__/client";
import { Blogs } from "../../../../tina/__generated__/types";
import { setPageMetadata } from "../../../../utils/setPageMetaData";

interface BlogPostProps {
  params: {
    slug: string;
    product: string;
  };
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug, product } = params;

  try {
    const res = await client.queries.blogs({
      relativePath: `${product}/${slug}.mdx`,
    });

    if (!res?.data?.blogs) {
      return null;
    }

    const metadata = setPageMetadata(res?.data?.blogs?.seo, product);
    return metadata;
  } catch (e) {
    console.error(e);
    notFound();
  }
}


export async function generateStaticParams() {
  const sitePosts = await client.queries.blogsConnection({});
  return sitePosts.data.blogsConnection?.edges?.map((post) => ({
    slug: post?.node?._sys.filename,
    product: post?.node?._sys.breadcrumbs[0]
  })) || []
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            documentData?.blogs.seo?.googleStructuredData ?? {}
          ),
        }}
      />
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
