"use client";

import React from "react";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import ApiClient from "./tina-api.client";
import NotFoundError from "../src/errors/not-found";
import { useIsAdminPage } from "@comps/hooks/useIsAdmin";

export type QueryKey = keyof typeof ApiClient.queries;

type ClientFallbackPageProps<T> = {
    product: string;
    relativePath: string;
    query:QueryKey;
    Component: React.FC<T>;
};


function ClientFallbackPage<T>(
    { product, relativePath, query, Component }: ClientFallbackPageProps<T>
) {
        const { isAdmin, isLoading: isAdminLoading } =  useIsAdminPage();
    const { data, error, isLoading} = useQuery({
        queryKey:[product, relativePath], 
        retry: false,
        queryFn: ()=> ApiClient.queries[query](product,relativePath) as Promise<T>
    });    

    return <>
        {(!isAdminLoading && !isAdmin) && notFound()}
        {(error && error instanceof NotFoundError) && notFound()}
        {isLoading && <LoadingFallback />}
        {data && <Component {...data} />}   
    </>;
}

export default ClientFallbackPage;


const LoadingFallback = ()=> {
    return <div className="w-full h-full ">
            <div className="top-1/2 -translate-x-1/2 left-1/2 absolute -translate-y-1/2 flex flex-col gap-3 items-center">
            <LoaderCircle className="stroke-white animate-spin animation-duration-500 size-10" />
            <span className="text-white text-lg">Loading</span>
            </div>
        </div>
        
};