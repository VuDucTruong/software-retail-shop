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

const G1_GAME_Id = 1;
const G1_COOL_Id = 2
const NOW_YMD = getDateLocal();
const HOT_G1_IDS = [G1_GAME_Id, G1_COOL_Id]

export default function BlogPage() {
    const [latestBlogs, latestBlogStatus, latestBlogsError, getBlogsPaginated, latestBlogProxyLoading] = BlogMany.useStore(useShallow(s => [
        s.blogs, s.status, s.error, s.getBlogs, s.proxyLoading
    ]))

    const [g1IdToBlogs, groupStatus, groupError, getBlogsPartitioned, blogGroupProxyLoading] = BlogGroups.useStore(useShallow(s =>
        [s.g1IdToBlogs, s.status, s.error, s.getBlogsPartitionByG1Id, s.proxyLoading]))

    const [genre2s] = GenreDomain.useStore(useShallow(s =>
        [s.genre2s]))

    useEffect(() => {
        blogGroupProxyLoading(() => getBlogsPartitioned(HOT_G1_IDS), 'get')
    }, []);


    return (
        <div className="main-container flex flex-col py-10">
            <div className="grid grid-cols-3 gap-2 h-[400px] w-full">
                <StatusDependentRenderer status={latestBlogStatus} error={latestBlogsError}>
                    <div className="grid row-span-2">
                        {latestBlogs?.length > 0 && <BlogCarouselItem blog={latestBlogs[0]}/>}
                    </div>
                    <div className="grid row-span-2">
                        {latestBlogs?.length > 1 && <BlogCarouselItem blog={latestBlogs[1]}/>}
                    </div>
                    {latestBlogs?.length > 2 && <BlogCarouselItem blog={latestBlogs[2]}/>}
                    <div className="grid grid-cols-2 gap-2">
                        {latestBlogs?.length > 3 && <BlogCarouselItem blog={latestBlogs[3]}/>}
                        {latestBlogs?.length > 4 && <BlogCarouselItem blog={latestBlogs[4]}/>}
                    </div>
                </StatusDependentRenderer>
            </div>

            <div className="flex flex-row-reverse gap-4">
                <div className="w-1/4">
                    <BlogGenreSection genre="Moi nhat">
                        <StatusDependentRenderer status={latestBlogStatus} error={latestBlogsError}>
                            {
                                g1IdToBlogs[G1_COOL_Id]?.length &&
                                g1IdToBlogs[G1_COOL_Id].map((b) => (
                                    <HorizontalPostListItem
                                        key={b.id}
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
                    <BlogGenreSection genre="Meo hay">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                            <div className="md:col-span-1">
                                {
                                    (() => {
                                        const coolBlogs = g1IdToBlogs[G1_COOL_Id]
                                        if (typeof coolBlogs === 'undefined' || coolBlogs?.length === 0)
                                            return null;
                                        const b = coolBlogs[0]
                                        return <FeaturedPostCard
                                            title={b.title}
                                            image={b.imageUrl || "/empty_img.png"}
                                            category={genre2s.filter(g2 =>
                                                b.genre2Ids.some(bG2Id => g2.id === bG2Id))
                                                .map(g2 => g2.name).join(", ")}
                                            author={b.author?.fullName}
                                            date={b.publishedAt}
                                            description={b.subtitle}
                                        />
                                    })()
                                }
                            </div>
                            <div className="flex flex-col justify-between">
                                {
                                    (() => {
                                        const coolBlogs = g1IdToBlogs[G1_COOL_Id]
                                        if (typeof coolBlogs === 'undefined' || coolBlogs?.length < 2)
                                            return null;
                                        return coolBlogs.slice(1).map(b => (
                                            <FeaturedPostCard
                                                key={b.id}
                                                title={b.title}
                                                image={b.imageUrl || "/empty_img.png"}
                                                category={genre2s.filter(g2 =>
                                                    b.genre2Ids.some(bG2Id => g2.id === bG2Id))
                                                    .map(g2 => g2.name).join(", ")}
                                                author={b.author?.fullName}
                                                date={b.publishedAt}
                                                description={b.subtitle}
                                            />
                                        ))
                                    })()
                                }
                            </div>
                        </div>
                    </BlogGenreSection>
                </div>
            </div>
        </div>
    );
}
