import { notFound } from 'next/navigation';
import client from '../../../tina/__generated__/client';
import InteractiveBackground from '../../../components/shared/Background/InteractiveBackground';
import NavBarServer from '../../../components/shared/NavBarServer';
import FooterServer from '../../../components/shared/FooterServer';
import BlogPageClient from '../../../components/shared/BlogPageClient';

interface BlogPageProps { 
  params: { product: string; }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { product } = params;

  const blogs = await getBlogsForProduct(product);

  if (!blogs) {
    return notFound();
  }

  return (
    <div>
      <InteractiveBackground />
      <NavBarServer product={product} />
      <BlogPageClient query={blogs.query} data={blogs.data} product={product} />
      <FooterServer product={product} />
    </div>
  );
}

async function getBlogsForProduct(product: string) {
  try {
    const res = await client.queries.getAllBlogs();

    // Null checks for res.data and res.data.blogsConnection
    if (!res.data || !res.data.blogsConnection || !res.data.blogsConnection.edges || !res.data.blogsConnection.edges.length) {
      throw new Error('No documents found');
    }

    // Filter the blogs for the specific product
    const filteredBlogs = res.data.blogsConnection.edges?.filter((edge: any) => 
      edge.node?._sys?.path?.includes(`/blogs/${product}/`)
    );

    if (!filteredBlogs || !filteredBlogs.length) {
      throw new Error('No documents found');
    }

    return {
      query: res.query,
      data: filteredBlogs.map((edge: any) => edge.node),
    };
  } catch (error) {
    console.error('Error fetching TinaCMS blog data:', error);
    notFound();
  }
}