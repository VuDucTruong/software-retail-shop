import {usePathname} from "next/navigation";
import React from "react";
import BlogSearchBarOnSearchPage from "@/components/blog/search/BlogSearchBarOnSearchPage";
import BlogSearchBarOther from "@/components/blog/search/BlogSearchBarOther";


export default function BlogSearchBar() {
  const isSearchPage = usePathname().includes("/blog/search");
  if (isSearchPage)
    return <BlogSearchBarOnSearchPage/>
  return <BlogSearchBarOther/>
}
