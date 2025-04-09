"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
const FIVE_MINS = 1000 * 60 * 5;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: FIVE_MINS } },
  });
}

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useMemo(() => makeQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
