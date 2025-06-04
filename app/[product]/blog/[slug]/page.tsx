import { notFound } from "next/navigation";

import { Blog } from "@/types/blog";
import BlogPostClient from "@comps/shared/BlogPostClient";
import client from "@tina/__generated__/client";
import { Blogs } from "@tina/__generated__/types";
import { getBlogsForProduct } from "@utils/fetchBlogs";
import { formatDate } from "@utils/formatDate";
import { setPageMetadata } from "@utils/setPageMetaData";

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
  return (
    sitePosts.data.blogsConnection?.edges?.map((post) => ({
      slug: post?.node?._sys.filename,
      product: post?.node?._sys.breadcrumbs[0],
    })) || []
  );
}

let nextBlog: Blog | undefined = undefined;
let previousBlog: Blog | undefined = undefined;

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug, product } = params;

  const documentData = await getBlogPost(product, slug);

  const allBlogs = await getBlogsForProduct({
    product,
  });

  const flattenedBlogs =
    allBlogs.blogs?.reduce<Blog[]>((acc, blog) => {
      if (!blog?.node) return acc;
      const {
        author,
        date,
        title,
        _sys,
        category,
        body,
        bannerImage,
        readLength,
      } = blog.node;
      return [
        ...acc,
        {
          readLength,
          author,
          date,
          title,
          slug: _sys.filename,
          category,
          body,
          bannerImage,
        },
      ];
    }, []) || [];

  const currentBlogIndex = flattenedBlogs.findIndex(
    (blog) => blog.title === documentData?.blogs?.title
  );

  previousBlog = flattenedBlogs[currentBlogIndex + 1] || undefined;
  nextBlog = flattenedBlogs[currentBlogIndex - 1] || undefined;

  if (!documentData) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow">
        <BlogPostClient
          nextBlog={nextBlog}
          previousBlog={previousBlog}
          recentBlogs={flattenedBlogs
            .filter((blog) => blog.title !== documentData.blogs.title)
            .slice(-2)
            .reverse()}
          initialFormattedDate={
            documentData.blogs.date && formatDate(documentData.blogs.date)
          }
          query={documentData.query}
          variables={documentData.variables}
          pageData={{ blogs: documentData.blogs }}
        />
      </div>
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
