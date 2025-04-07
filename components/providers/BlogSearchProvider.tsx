"use client";

import { createContext, useContext, useState } from "react";

type BlogSearchContextType = {
  updateSearchTerm?: (arg0: string) => void;
  searchTerm: string;
};

const BlogSearchContext = createContext<BlogSearchContextType>({
  searchTerm: "",
  updateSearchTerm: undefined,
});

type BlogSearchProviderProps = {
  children: React.ReactNode;
};

const BlogSearchProvider = ({ children }: BlogSearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BlogSearchContext.Provider
      value={{
        updateSearchTerm: setSearchTerm,
        searchTerm,
      }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
};

const useBlogSearch = () => useContext(BlogSearchContext);

export { BlogSearchProvider, useBlogSearch };
