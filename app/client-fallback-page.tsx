"use client";

import React, { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import ApiClient from "./tina-api.client";
import NotFoundError from "../src/errors/not-found";

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

    const { data, error, isLoading} = useQuery({
        queryKey:[product, relativePath], 
        retry: false,
        queryFn: ()=> ApiClient.queries[query](product,relativePath) as Promise<T>
    });    

    useEffect(()=> {
        if(error instanceof NotFoundError){
            notFound();
        }
    }, [error]);
    
    console.log({data, error, isLoading});
    if(isLoading){    
        return <LoadingFallback />;
    }

    if(data){
        return <Component {...data} />;
    }
}

export default ClientFallbackPage;


const LoadingFallback = ()=> {
    return <div><LoaderCircle /></div>
};