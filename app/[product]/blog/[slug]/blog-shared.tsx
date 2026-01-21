"use client"

import BlogPostClient from "@comps/shared/BlogPostClient"
import getBlogPageData from "@utils/pages/getBlogPageData"

type BlogPageSharedProps = Awaited<ReturnType<typeof getBlogPageData>>


import GoogleStructuredDataScript from "@comps/GoogleStructuredDataScript";

const BlogPageShared = (data: BlogPageSharedProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow">
        <BlogPostClient
          nextBlog={data.nextBlog}
          previousBlog={data.previousBlog}
          recentBlogs={data.recentBlogs}
          initialFormattedDate={data.initialFormattedDate}
          query={data.query}
          variables={data.variables}
          pageData={{ blogs: data.blogs }}
        />
      </div>
      <GoogleStructuredDataScript jsonString={data.seo?.googleStructuredData} />
    </div>
  );
}

export { BlogPageShared, type BlogPageSharedProps };