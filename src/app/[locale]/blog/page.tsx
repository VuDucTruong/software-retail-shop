"use client";

import BlogCarouselItem from "@/components/blog/BlogCarouselItem";
import BlogGenreSection from "@/components/blog/BlogGenreSection";
import FeaturedPostCard from "@/components/blog/FeaturedPostCard";
import HorizontalPostListItem from "@/components/blog/HorizontalPostListItem";
import {BlogGroups, BlogMany} from "@/stores/blog/blog.store";
import {useShallow} from "zustand/shallow";
import {useEffect} from "react";
import {getDateLocal} from "@/lib/date_helper";
import {GenreDomain} from "@/stores/blog/genre.store";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";
import {Skeleton} from "@/components/ui/skeleton";
import {useTranslations} from "next-intl";
import {BlogDomainType} from "@/api";

const G1_GAME_ID = 1;
const G1_TIPS_ID = 2
const G1_MOVIE_ID = 3;
const NOW_YMD = getDateLocal();
const HOT_G1_IDS = [G1_GAME_ID, G1_TIPS_ID, G1_MOVIE_ID]

export default function BlogPage() {
  const t = useTranslations();
  const [latestBlogs, latestBlogStatus, latestBlogsError] = BlogMany.useStore(useShallow(s => [
    s.blogs, s.status, s.error,
  ]))

  const [groupStatus, groupError, getBlogsPartitioned, blogGroupProxyLoading] = BlogGroups.useStore(useShallow(s =>
    [ s.status, s.error, s.getBlogsPartitionByG1Id, s.proxyLoading]))
  const [genre2s] = GenreDomain.useStore(useShallow(s =>
    [s.genre2s]))


  useEffect(() => {
    blogGroupProxyLoading(() => getBlogsPartitioned(HOT_G1_IDS), 'get')
  }, []);


  return (
    <div className="main-container flex flex-col py-10">
      <div className="grid grid-cols-3 gap-2 h-[400px] w-full">
        <StatusDependentRenderer status={latestBlogStatus} error={latestBlogsError} altLoading={<>
          <div key={0} className="grid row-span-2"><Skeleton/></div>
          <div key={1} className="grid row-span-2"><Skeleton/></div>
          <Skeleton key={2}/>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton key={3}/>
            <Skeleton key={4}/>
          </div>
        </>}>
          <div className="grid row-span-2">
            {latestBlogs?.length > 0 && <BlogCarouselItem blog={latestBlogs[0]}/>}
          </div>
          <div className="grid row-span-2">
            {latestBlogs?.length > 1 && <BlogCarouselItem blog={latestBlogs[1]}/>}
          </div>
          {latestBlogs?.length > 2 && <BlogCarouselItem blog={latestBlogs[2]}/>}
          <div className="grid grid-cols-2 gap-2">
            {latestBlogs?.length > 3 && <BlogCarouselItem maxG2Display={2} blog={latestBlogs[3]}/>}
            {latestBlogs?.length > 4 && <BlogCarouselItem maxG2Display={2} blog={latestBlogs[4]}/>}
          </div>
        </StatusDependentRenderer>
      </div>

      <div className="flex flex-row-reverse gap-4">
        <div className="w-1/4">
          <BlogGenreSection genre={t("latest_blogs")}>
            <StatusDependentRenderer status={latestBlogStatus} error={latestBlogsError} altLoading={(<Skeleton/>)}>
              {
                latestBlogs?.length > 5 &&
                latestBlogs?.slice(5, 13).map((b) => (
                  <HorizontalPostListItem
                    id={b.id}
                    key={b.id}
                    categories={genre2s.filter(g2 => b.genre2Ids.some(g2Id => g2Id === g2.id))}
                    title={b.title}
                    image={b.imageUrl && "/empty_img.png"}
                    date={b.publishedAt && NOW_YMD}
                    author={b.author.fullName}
                  />
                ))
              }
            </StatusDependentRenderer>
          </BlogGenreSection>
        </div>
        <div className="flex flex-col flex-1">
          <StatusDependentRenderer
            status={groupStatus} error={groupError}
            altLoading={
              Array.from({length: 4}).map((_, index) => <Skeleton key={index}/>)
            }
            altError={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                {
                  Array.from({length: 4}).map((_, index) =>
                    <Skeleton key={index}
                              className={'flex items-center justify-center text-center w-full group cursor-pointer h-50'}>
                      NOT FOUND
                    </Skeleton>
                  )
                }
              </div>
            }>
            <BlogGenreSection genre={t("tips")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                <BlogGenreSectionItemsList genre1Id={G1_TIPS_ID} maxCount={4}/>
              </div>
            </BlogGenreSection>
          </StatusDependentRenderer>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <BlogGenreSection genre={t("movie")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <BlogGenreSectionItemsList genre1Id={G1_MOVIE_ID} maxCount={4}/>
          </div>
        </BlogGenreSection>
      </div>
      <div className="flex flex-col flex-1">
        <BlogGenreSection genre={t("game")}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
            <BlogGenreSectionItemsList genre1Id={G1_GAME_ID} maxCount={4}/>
          </div>
        </BlogGenreSection>
      </div>
    </div>
  );
}

function BlogGenreSectionItemsList({genre1Id, maxCount}: { genre1Id: number, maxCount?: number }) {
  const [g1IdToBlogs,] = BlogGroups.useStore(useShallow(s =>
    [s.g1IdToBlogs]))
  const movieBlogs = g1IdToBlogs[genre1Id];
  if (!movieBlogs || movieBlogs.length < 1) return null;
  return movieBlogs.slice(0, maxCount ?? 4).map(b => (
    <BlogGenreSectionItem key={b.id} blog={b}/>
  ));
}

function BlogGenreSectionItem({blog}: { blog: BlogDomainType }) {
  const [genre2s] = GenreDomain.useStore(useShallow(s =>
    [s.genre2s]))
  const blogGenre2s = genre2s.filter(g2 => blog.genre2Ids.some(g2Id => g2Id === g2.id))

  return <FeaturedPostCard
    id={blog.id}
    title={blog.title}
    image={blog.imageUrl || "/empty_img.png"}
    categories={blogGenre2s}
    author={blog.author?.fullName}
    date={blog.publishedAt}
    description={blog.subtitle}
  />
}