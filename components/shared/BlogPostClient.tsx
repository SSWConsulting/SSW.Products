"use client";

import { FormattedDate } from "@/formattedDate";
import { OptionalProps } from "@/optionalProps";
import { AuthorInfo } from "@comps/AuthorInfo";
import { Tags } from "@comps/Tags";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Blogs } from "../../tina/__generated__/types";
interface BlogPostClientProps extends OptionalProps<FormattedDate> {
  query: string;
  variables: object;
  pageData: { blogs: Blogs };
}

const articleData = {
  title: "How Ramp scaled a successful bill pay product with Increase",
  url: "https://increase.com/blog/how-ramp-scaled-bill-pay-with-increase",
  author: {
    name: "Sarah Johnson",
    role: "Content Marketing Manager",
    avatarUrl: "/mystical-forest-spirit.png",
    date: "October 15, 2023",
  },
  tags: ["Fintech", "Case Study", "Bill Pay", "API Integration"],
  tableOfContents: [
    { id: "the-problem", title: "The problem", level: 2 },
    { id: "the-solution", title: "The solution", level: 2 },
    { id: "the-result", title: "The result", level: 2 },
  ],
  relatedArticles: [
    {
      id: "1",
      title: "How Mercury built their banking platform with Increase",
      excerpt:
        "Learn how Mercury leveraged Increase's API to build their banking platform for startups.",
      imageUrl: "/interconnected-fintech.png",
      slug: "how-mercury-built-banking-platform",
    },
    {
      id: "2",
      title: "Building modern payment systems with Increase",
      excerpt:
        "A technical deep dive into building payment systems using Increase's infrastructure.",
      imageUrl: "/digital-payments-interface.png",
      slug: "building-modern-payment-systems",
    },
  ],
};
export default function BlogPostClient({
  query,
  variables,
  pageData,
  initialFormattedDate,
}: BlogPostClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useTina<{ blogs: Blogs }>({
    query,
    variables,
    data: pageData,
  });
  // const formattedDate =
  //   parsedDate && !isNaN(parsedDate.getTime())
  //     ? `${parsedDate.getDate()} ${parsedDate.toLocaleString("default", {
  //         month: "long",
  //       })} ${parsedDate.getFullYear()}`
  //     : "Unknown Date";

  return (
    <div className="min-h-screen text-white">
      {/* Navigation */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="mb-10">
          <div className="text-sm uppercase tracking-wide text-gray-400">
            {data.blogs.category}
          </div>
          <h1 className="mt-2 mb-6 text-3xl max-w-4xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {data.blogs.title}
          </h1>

          {/* Article metadata */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <AuthorInfo
              authorImage={data.blogs.authorImage}
              author={data.blogs.author}
              sswPeopleLink={data.blogs.sswPeopleLink}
              initialFormattedDate={initialFormattedDate}
              dynamicDate={data.blogs.date}
              readingTime={data.blogs.readLength}
            />
          </div>

          {/* Tags and social sharing icons */}
          <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Tags tags={articleData.tags} />

            {/* Social sharing icons */}
            <div className="flex space-x-2"></div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-12 overflow-hidden rounded-lg bg-gray-800 p-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-white">ramp</div>
                <Image
                  src="/abstract-ramp-design.png"
                  alt="Ramp logo"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:w-2/3">
              <Image
                src="/ramp-dashboard-overview.png"
                alt="Ramp dashboard interface"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="flex">
          {/* Main Content - Takes up 2/3 of the space on large screens */}
          <div className="flex flex-col basis-2/3">
            <div className="grow">
              <TinaMarkdown content={data.blogs.body} />
            </div>

            {/* Article navigation */}
            <div className="mb-12 flex justify-between border-t border-gray-800 pt-8">
              <Link
                href="#"
                className="flex items-center text-gray-400 hover:text-[#cc4141]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Article
              </Link>
              <Link
                href="#"
                className="flex items-center text-gray-400 hover:text-[#cc4141]"
              >
                Next Article
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar - Takes up 1/3 of the space on large screens */}
          <div className="basis-1/3">
            <div className="sticky top-8 space-y-6">
              {/* Summary Card Layout */}
              <div className="rounded-lg bg-gray-darkest p-6">
                {/* Company information */}
                <div className="space-y-4">
                  {[
                    { title: "Company name", value: "Ramp" },
                    { title: "Industry", value: "Fintech" },
                    { title: "Company size", value: "Enterprise" },
                    {
                      title: "Pain point",
                      value: "Tracking payment lifecycle and onboarding",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.value}</p>
                    </div>
                  ))}

                  <div>
                    <h3 className="font-medium text-white">
                      Increase products used
                    </h3>
                    <ul className="mt-1 space-y-1 text-gray-300">
                      {["ACH Payments", "Bank accounts", "Wires", "Checks"].map(
                        (product, index) => (
                          <li key={index}>
                            <Link
                              href="#"
                              className="text-[#cc4141] hover:underline"
                            >
                              {product}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-white">
                      About the company
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                      Ramp is the ultimate platform for modern finance teams.
                      From spend management and expense management software, to
                      bill payments and vendor management, Ramps all-in-one
                      solution is designed to automate finance operations and
                      build healthier businesses. Over 15,000 businesses have
                      switched to Ramp to cut their expenses by an average of 5%
                      and close their books 8x faster. Founded in 2019, Ramp has
                      raised over $1 billion in funding and is valued at over $8
                      billion. The company is headquartered in New York City
                      with offices in Miami, Salt Lake City, and Dublin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Table of Contents Card */}
              <div className="rounded-lg border border-gray-800 p-6">
                <h3 className="mb-3 font-medium text-white">
                  Table of Contents
                </h3>
                <nav>
                  <ul className="space-y-2 text-sm">
                    {articleData.tableOfContents.map((item) => (
                      <li
                        key={item.id}
                        style={{
                          paddingLeft: `${(item.level - 2) * 0.75}rem`,
                        }}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-gray-400 transition-colors hover:text-[#cc4141]"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles - Full width */}
        <div className="mt-16 border-t border-gray-800 pt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Related Articles</h2>
          </div>
          <div className="grid md:grid-cols-2">
            {articleData.relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-colors hover:border-gray-700"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    width={600}
                    height={338}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-medium text-white group-hover:text-[#cc4141]">
                    {article.title}
                  </h3>
                  <p className="text-gray-400">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
