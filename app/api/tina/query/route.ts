

import { TinaQuery } from "@/types/tina";
import client from "@tina/__generated__/client"
import { cookies } from "next/headers";

const POST = async (request: Request) => {

    const cookieStore = await cookies();

    const branch =cookieStore.get("x-branch")?.value;

    if(!branch){
        return new Response(JSON.stringify({error: 'Missing branch cookie'}), {status: 400});
    }

    const body = await request.json() as PageQueryData;

    const relativePath = body.relativePath;
    const queryName = body.queryName;
 
    if(!relativePath){
        return new Response(JSON.stringify({error: 'Missing parameters'}), {status: 400});
    }

    if(typeof queryName !== 'string'){
        return new Response(JSON.stringify({error: 'Missing parameters'}), {status: 400});
    }

    const query = Object.keys(client.queries).find(q => q === queryName) as (TinaQuery | undefined);

    if(!query){
        return new Response(JSON.stringify({error: 'Invalid query name'}), {status: 400});
    }

    const tinaQuery = getQuery(query);
    
    if(!tinaQuery){
        return new Response(JSON.stringify({error: 'Invalid query name'}), {status: 400});
    }
    try{   
        const response = await tinaQuery({relativePath}, {fetchOptions: 
            {
                headers: {
                    "x-branch": branch
                }
            }
        });

        return new Response(JSON.stringify(response), {status: 200});
    }
    catch {
        return new Response(JSON.stringify({error: 'Document not found'}), {status: 400});
    }
}

const getQuery = (queryName: keyof typeof client.queries) => {
    switch(queryName){
        case "docs":
        case "pages":
        case "blogs":
            return client.queries[queryName];
    }
}

type PageQueryData = {
    relativePath?: string;
    queryName?: string;
}

export {POST};