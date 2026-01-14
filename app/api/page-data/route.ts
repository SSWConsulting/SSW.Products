import BadRequestError from "@/errors/bad-request";
import NotFoundError from "@/errors/not-found";
import { PageDataRequest } from "@/types/api/page-data";
import getPageData from "@utils/pages/getPageData";
import { cookies } from "next/dist/server/request/cookies";

const POST = async (request: Request) => {
    const body = await request.json() as PageDataRequest;

    try {
        const cookieStore = await cookies();
        const branch = cookieStore.get("x-branch")?.value;
        const product = body.product;
        const relativePath = body.relativePath;
        
        if(!branch){
            throw new BadRequestError("Missing branch cookie");
        }
        
        if(!product)
        {
            throw new BadRequestError("Missing product parameter");
        }

        if(!relativePath)
        {
            throw new BadRequestError("Missing relativePath parameter");
        }

        const data = await getPageData(product, relativePath, branch);

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


export { POST };