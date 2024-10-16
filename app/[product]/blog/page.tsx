import { notFound } from "next/navigation";
import { getBlogsForProduct } from "../../../utils/fetchBlogs"; // Updated import
import InteractiveBackground from "../../../components/shared/Background/InteractiveBackground";
import NavBarServer from "../../../components/shared/NavBarServer";
import FooterServer from "../../../components/shared/FooterServer";
import BlogIndexClient from "../../../components/shared/BlogIndexClient";

interface BlogIndex {
  params: { product: string };
}

export default async function BlogIndex({ params }: BlogIndex) {
  const { product } = params;

  try {
    const blogs = await getBlogsForProduct(product);

    if (!blogs) {
      return notFound();
    }

    return (
      <div className="flex flex-col min-h-screen">
        <InteractiveBackground />
        <NavBarServer product={product} />

        <div className="flex-grow">
          <BlogIndexClient
            query={blogs.query}
            data={blogs.data}
            product={product}
          />
        </div>

        <FooterServer product={product} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching TinaCMS blog data:", error);
    return notFound();
  }
}
