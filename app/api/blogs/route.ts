import { NextRequest, NextResponse } from "next/server";
import { getBlogsForProduct } from "../../../utils/fetchBlogs";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const product = params.get("product");

    if (!product) {
      return NextResponse.json(
        { error: "Missing required query parameter: product" },
        { status: 400 }
      );
    }

    const startCursor = params.get("startCursor") || undefined;
    const keyword = params.get("keyword") || undefined;
    const category = params.get("category") || undefined;
    const locale = params.get("locale") || undefined;

    const result = await getBlogsForProduct({
      product,
      startCursor,
      keyword,
      category,
      locale,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
