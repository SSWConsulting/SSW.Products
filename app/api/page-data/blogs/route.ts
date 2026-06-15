import { cookies } from "next/headers";
import BadRequestError from "@/errors/bad-request";
import NotFoundError from "@/errors/not-found";

import getBlogPageData from "@utils/pages/getBlogPageData";
import { PageDataRequest } from "@/types/api/page-data";

export async function POST(request: Request) {
    try{
        const body = await request.json() as PageDataRequest;
        const cookieStore = await cookies();
        const branch = cookieStore.get("x-branch")?.value;

        if(!branch){
            throw new BadRequestError("Missing branch cookie");   
        }

        const product = body.product;
        const relativePath = body.relativePath;

        if(!product)
        {
            throw new BadRequestError("Missing product parameter");
        }
        if(!relativePath)
        {
            throw new BadRequestError("Missing relativePath parameter");
        }
        
        const data = await getBlogPageData(product, relativePath, branch);
        return new Response(JSON.stringify(data), {status: 200});
    }
    catch(error) {
        if(error instanceof BadRequestError){
            return new Response(JSON.stringify({error: error.message}), {status: 400});
        }
        if(error instanceof NotFoundError){
            return new Response(JSON.stringify({error: error.message}), {status: 404});
        }
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500});
    }

}