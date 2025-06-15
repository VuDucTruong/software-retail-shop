"use client";
import VerticalPostListItem from "@/components/blog/VerticalPostListItem";
import SearchNotFound from "@/components/common/SearchNotFound";
import SearchPagination from "@/components/search/SearchPagination";


export default function BlogSearchPage() {
  //const t = useTranslations();

  return (
    <div className="main-container flex flex-col gap-4 !pt-10">
      <h2>{"Search result for xxxx"}</h2>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 10 }, (_, i) => (
          <VerticalPostListItem
            key={i}
            category="GAME"
            image="/empty_img.png"
            title="HEHE"
            author="Sang ri"
            date="22/5/2025"
          />
        ))}

        <SearchNotFound className="col-span-4" />
      </div>

      <SearchPagination currentPage={0} totalPages={1} />
    </div>
  );
}
