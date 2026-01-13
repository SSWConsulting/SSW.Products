"use client"

import BlogPostClient from "@comps/shared/BlogPostClient"
import getBlogPageData from "@utils/pages/getBlogPageData"

type BlogPageSharedProps = Awaited<ReturnType<typeof getBlogPageData>>

const BlogPageShared = (data: BlogPageSharedProps) => {


        console.log("blog page shared stuff", data);
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.seo?.googleStructuredData ?? {}),
          }}
        />
      </div>
    )
}

export { BlogPageShared, type BlogPageSharedProps };