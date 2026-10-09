import { cookies } from "next/headers";
import BadRequestError from "@/errors/bad-request";
import NotFoundError from "@/errors/not-found";

import { getBlogsForProduct } from "@utils/fetchBlogs";
import { BlogsRequest } from "@/types/api/blogs";

export async function POST(request: Request) {
    try{
        const body = await request.json() as BlogsRequest;
        const cookieStore = await cookies();
        const branch = cookieStore.get("x-branch")?.value;

        const product = body.product;

        if(!product)
        {
            throw new BadRequestError("Missing product parameter");
        }

        const data = await getBlogsForProduct({
            product,
            startCursor: body.startCursor,
            keyword: body.keyword,
            category: body.category,
            locale: body.locale,
            loadAll: body.loadAll,
            branch,
        });
        return new Response(JSON.stringify(data), {status: 200});
    }
    catch(error) {
        if(error instanceof BadRequestError){
            return new Response(JSON.stringify({error: error.message}), {status: 400});
        }
        // A search or category filter that matches nothing isn't an error for the
        // index - return an empty page so the client stops paginating
        if(error instanceof NotFoundError){
            return new Response(JSON.stringify({blogs: [], remainingPages: 0}), {status: 200});
        }
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500});
    }

}
