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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <header className="border-b border-gray-800 bg-gray-950">
        {isMenuOpen && (
          <div className="border-t border-gray-800 md:hidden">
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-2">
                {[
                  "Products",
                  "Solutions",
                  "Developers",
                  "Pricing",
                  "Updates",
                ].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="py-2 text-gray-300 hover:text-white"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="mb-10">
          <div className="text-sm uppercase tracking-wide text-gray-400">
            Customer stories
          </div>
          <h1 className="mt-2 mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            How Ramp scaled a successful
            <br />
            bill pay product with Increase
          </h1>

          {/* Article metadata */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <AuthorInfo
              author={data.blogs.author}
              sswPeopleLink={articleData.author.avatarUrl}
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content - Takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <p className="mb-8 text-gray-300">
              Ramp is the ultimate platform for modern finance teams. From spend
              management and expense management software, to bill payments and
              vendor management, Ramps all-in-one solution is designed to
              automate finance operations and build healthier businesses. Over
              15,000 businesses have switched to Ramp to cut their expenses by
              an average of 5% and close their books 8x faster.
            </p>

            <div className="mb-12" id="the-problem">
              <h2 className="mb-4 text-2xl font-bold text-white">
                The problem
              </h2>
              <p className="mb-4 text-gray-300">
                In October 2021, Ramp introduced its innovative Bill Pay
                solution, aimed at helping free users from the time-consuming
                process of managing their monthly accounts payable. Yet, as the
                platform expanded its reach, it encountered challenges in
                tracking the lifecycle of individual bill payments, and faced
                operational inefficiencies when onboarding new accounts.
              </p>
              <p className="mb-4 text-gray-300">
                Our former banking partner just didnt have the flexibility or
                control we wanted said Nik Koblov, Director of Engineering. We
                had to call a support person to get access to 250 virtual
                accounts at a time. It was also really difficult tracking the
                settlement for our payments. With payment friction as their Bill
                Pay product grew, it became a priority for the team to pivot to
                a new system.
              </p>
            </div>

            <div className="mb-12" id="the-solution">
              <h2 className="mb-4 text-2xl font-bold text-white">
                The solution
              </h2>
              <p className="mb-4 text-gray-300">
                Ramp partnered with Increase to build a robust platform for
                their Bill Pay product. Ramp spins up unique accounts per user,
                which allows them to programmatically track payments instead of
                needing to parse through a single, massive ledger. They also use
                Increases ACH product to make bill payments via the Federal
                Reserves FedACH network, which provides them with great webhooks
                for each step in the transfer life cycle. This not only speeds
                up the payments process, but also allows Ramp to access much
                more in-depth settlement tracking.
              </p>

              {/* Video Placeholder */}
              <div className="my-8 rounded-lg bg-gray-800">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#cc4141]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polygon
                        points="10 8 16 12 10 16 10 8"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-300">
                      Ramp + Increase Integration Demo
                    </p>
                  </div>
                </div>
              </div>

              <p className="mb-6 text-gray-300">
                In this demonstration, you can see how Ramps engineering team
                integrated with Increases API to create a seamless bill payment
                experience. The video showcases the account creation process,
                payment initiation flow, and the real-time webhooks that provide
                visibility into payment status. This integration allowed Ramp to
                reduce payment processing time by 60% while providing customers
                with more transparency into their payment lifecycle.
              </p>

              <div className="my-8 flex justify-center">
                <Image
                  src="/basic-payment-flow.png"
                  alt="Payment flow diagram"
                  width={600}
                  height={300}
                  className="rounded-lg"
                />
              </div>

              <div className="mb-8 rounded-lg bg-gray-800 p-6">
                <blockquote className="border-l-4 border-[#cc4141] pl-4 italic text-gray-300">
                  Increase has provided us with low level access to the
                  underlying payment rails which has substantially improved the
                  stability of our product. The transparency is second to none,
                  mentioned Nik Koblov. We know exactly when payments are
                  submitted and when funds are received. This has been a game
                  changer for our operations team, who now have complete control
                  of our funds flows.
                </blockquote>
              </div>

              <p className="mb-4 text-gray-300">
                Using Increas APIs, Ramp was able to build a custom solution
                that fit perfectly with their infrastructure. The Increase API
                is the best Ive used. Its a breath of fresh air said Kirill
                Orishchuk, an engineer on Ramps payments team. In addition to
                building our product flows, we need to build internal APIs for
                teams with vastly different needs. Because Increase provides
                such well-reasoned abstractions, were able to surface just the
                right amount of data to each team.
              </p>
            </div>

            <div className="mb-12" id="the-result">
              <h2 className="mb-4 text-2xl font-bold text-white">The result</h2>
              <p className="mb-4 text-gray-300">
                With the help of this new model, Ramp saw a surge of growth in
                their Bill Pay product. Our Bill Pay product has been a game
                changer, and Increase has been an invaluable partner in that
                process, said Nik. Were processing millions of payments with
                Increase and are excited and confident about how well grow
                together in the future.
              </p>
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
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Summary Card Layout */}
              <div className="rounded-lg bg-gray-800 p-6">
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
          <div className="grid gap-8 md:grid-cols-2">
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

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/" className="text-xl font-bold uppercase text-white">
              INCREASE
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                title: "Products",
                links: [
                  "ACH",
                  "Bank Accounts",
                  "Cards",
                  "Checks",
                  "Real Time Payments",
                  "Wires",
                ],
              },
              {
                title: "Developers",
                links: ["Docs", "API Reference", "Changelog", "Status"],
              },
              {
                title: "Solutions",
                links: [
                  "Bill Pay",
                  "Payroll",
                  "Wallets",
                  "Embedded banking",
                  "Fund administration",
                  "Sponsor banking",
                ],
              },
              {
                title: "Company",
                links: [
                  "Pricing",
                  "Updates",
                  "Contact us",
                  "Privacy",
                  "Security",
                  "Terms",
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="mb-4 font-semibold text-white">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={`/${section.title.toLowerCase()}/${link
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-xs text-gray-500">
            <p className="mb-4">
              Increase is not a bank. Banking products and services are offered
              by Sutton Bank, N.A., Member FDIC and First Internet Bank of
              Indiana, Member FDIC. Cards issued by Sutton Bank of Indiana,
              pursuant to a license from Visa®. Deposits are insured by the FDIC
              up to the maximum allowed by law through Sutton Bank, N.A., Member
              FDIC and First Internet Bank of Indiana, Member FDIC. FDIC deposit
              insurance only covers the funds of the FDIC-insured bank.
            </p>
            <p>© 2023 Increase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
