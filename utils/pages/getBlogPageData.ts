import { Blog } from "@/types/blog";
import { Blogs } from "@tina/__generated__/types";
import { getBlogsForProduct } from "@utils/fetchBlogs";
import { formatDate } from "@utils/formatDate";
import { getBlogWithFallback, getLocale } from "@utils/i18n";
import NotFoundError from "../../src/errors/not-found";

async function getBlogPageData(product: string, slug: string, branch?: string) {
  const locale = await getLocale();
  console.log("locale", locale);
  const res = await getBlogWithFallback({product, slug, locale, branch});
  if (!res?.data?.blogs)
  {
    throw new NotFoundError("Blog post not found");
  }

  const allBlogs = await getBlogsForProduct({ product, locale, branch });
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
    (blog) => blog.title === res.data.blogs.title
  );

  const previousBlog = flattenedBlogs[currentBlogIndex + 1] || undefined;
  const nextBlog = flattenedBlogs[currentBlogIndex - 1] || undefined;
  const recentBlogs = flattenedBlogs
    .filter((blog) => blog.title !== res.data.blogs.title)
    .slice(-2)
    .reverse();
  const initialFormattedDate = res.data.blogs.date && formatDate(res.data.blogs.date);

  return {
    query: res.query,
    variables: res.variables,
    blogs: res.data.blogs as Blogs,
    previousBlog,
    nextBlog,
    recentBlogs,
    initialFormattedDate,
    seo: res.data.blogs.seo,
  };
}

export default getBlogPageData;