"use client";
import VerticalPostListItem from "@/components/blog/VerticalPostListItem";
import SearchNotFound from "@/components/common/SearchNotFound";

import {BlogMany} from "@/stores/blog/blog.store";
import {useShallow} from "zustand/shallow";
import {GenreDomain} from "@/stores/blog/genre.store";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";
import {useTranslations} from "next-intl";
import {Skeleton} from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import SearchPagination from "@/components/search/SearchPagination";


export default function BlogSearchPage() {
  const t = useTranslations();
  const search = useSearchParams().get('search') ?? '';

  const [blogs, status, error, currentPage, totalPages] = BlogMany.useStoreLight(useShallow(s =>
    [s.blogs, s.status, s.error, s.currentPage, s.totalPages]))

  const [genre2s] = GenreDomain.useStore(useShallow(s =>
    [s.genre2s]))


      const searchTitle =
    search.length > 0 ? t('search_results_for_x' , {x: search}) : t('search_results');


  return (
    <div className="main-container flex flex-col gap-4 !pt-10">
      <h2>{searchTitle}</h2>
      <div className="grid grid-cols-4 gap-3">

        <StatusDependentRenderer status={status} error={error}
                                 altLoading={
                                   Array.from({length: 8}).map((_, index) => (
                                     <Skeleton key={index} className="text-center h-50  w-full group rounded-md border border-border shadow-md" />
                                   ))
                                 }
                                 altError={<SearchNotFound objectName={t("blog")} className="col-span-4"/>}
        >
          {blogs.map(b => {
            const blogGenre2s = genre2s.filter(g2 =>
              b.genre2Ids.some(g2Id => g2Id === g2.id)).map(g2 => g2.name)
            return (
              <VerticalPostListItem
                key={b.id}
                category={blogGenre2s.join(', ')}
                image={b.imageUrl}
                title={b.title}
                author={b.author.fullName}
                date={b.publishedAt}
              />
            )
          })}
        </StatusDependentRenderer>

      </div>
      <SearchPagination currentPage={currentPage} totalPages={totalPages}/>
    </div>
  )
    ;
}
