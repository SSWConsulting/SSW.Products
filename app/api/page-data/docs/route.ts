import { PageDataRequest } from "@/types/api/page-data";
import BadRequestError from "../../../../src/errors/bad-request";
import getDocPageData from "@utils/pages/getDocPageData";
import { cookies } from "next/headers";
import NotFoundError from "@/errors/not-found";

const POST = async (request: Request) => { 
    const {product, relativePath} = await request.json() as PageDataRequest;
    try {
        const cookieStore = await cookies();
        const branch = cookieStore.get("x-branch")?.value;

        if(!branch){
            console.error("branch cookie is missing");
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

        const data = await getDocPageData({product, slug: relativePath, branch});

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