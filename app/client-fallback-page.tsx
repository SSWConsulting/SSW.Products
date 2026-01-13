"use client";

import React, { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import ApiClient from "./tina-api.client";
import NotFoundError from "../errors/not-found";

export type QueryKey = keyof typeof ApiClient.queries;



type ClientFallbackPageProps<T> = {
    query: QueryKey;
    relativePath: string;
    Component: React.FC<T>;
};


function ClientFallbackPage<T>({ query, relativePath, Component }: ClientFallbackPageProps<T>) {

    const { data, error, isLoading} = useQuery({
        queryKey:[query, relativePath], 
        retry: false,
        queryFn: ()=> ApiClient.queries[query](query,relativePath) as Promise<T>
    });    

    useEffect(()=> {
        if(error instanceof NotFoundError){
            notFound();
        }
    }, [error]);

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