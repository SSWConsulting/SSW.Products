import NotFoundError from "@/errors/not-found";
import { getBlogsForProduct } from "@utils/fetchBlogs";
import { NextRequest } from "next/server";

const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { product, startCursor, keyword, category, locale } = body;

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Missing product parameter" }),
        { status: 400 }
      );
    }

    const result = await getBlogsForProduct({
      product,
      startCursor,
      keyword,
      category,
      locale,
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

export { POST };
