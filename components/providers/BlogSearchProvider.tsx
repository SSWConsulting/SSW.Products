"use client";

import { createContext, useContext, useState } from "react";

export const ALL_CATEGORY = "All";
export const DEFAULT_CATEGORY = "Uncategorized";

type BlogSearchContextType = {
  updateSearchTerm?: (arg0: string) => void;
  searchTerm: string;
  setSelectedCategory?: (arg0: string) => void;
  selectedCategory: string;
  categories: string[];
};

const BlogSearchContext = createContext<BlogSearchContextType>({
  searchTerm: "",
  updateSearchTerm: undefined,
  selectedCategory: "",
  categories: [],
});

type BlogSearchProviderProps = {
  children: React.ReactNode;
  categories: string[];
};

const BlogSearchProvider = ({
  children,
  categories,
}: BlogSearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <BlogSearchContext.Provider
      value={{
        updateSearchTerm: setSearchTerm,
        setSelectedCategory,
        selectedCategory,
        searchTerm,
        categories: ["", ...categories].sort((a, b) => a.localeCompare(b)),
      }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
};

const useBlogSearch = () => useContext(BlogSearchContext);

export { BlogSearchProvider, useBlogSearch };
