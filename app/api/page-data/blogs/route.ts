import { cookies } from "next/headers";
import BadRequestError from "../../../../errors/bad-request";
import NotFoundError from "../../../../errors/bad-request";

import getBlogPageData from "@utils/pages/getBlogPageData";


type PageDataRequest = {
    product?: string;
    relativePath?: string;
}

export async function POST(request: Request) {


    try{
        const body = await request.json() as PageDataRequest;
        const cookieStore = await cookies();
        const branch = cookieStore.get("x-branch")?.value;

        if(!branch){
            console.error("branch cookie is missing");
            throw new BadRequestError("Missing branch cookie");
            
        }
        else{
            console.log("branch is here :) ", branch);
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

        return new Response(JSON.stringify({data}), {status: 200});
    }
    catch(error) {
        if(error instanceof BadRequestError){
            return new Response(JSON.stringify({error: error.message}), {status: 400});
        }
        if(error instanceof NotFoundError){
            return new Response(JSON.stringify({error: error.message}), {status: 404});
        }
        console.log("Unexpected error: ", error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500});
    }

}