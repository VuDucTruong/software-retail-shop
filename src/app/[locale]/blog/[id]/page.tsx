'use client'
import BlogGenreSection from "@/components/blog/BlogGenreSection";
import HorizontalPostListItem from "@/components/blog/HorizontalPostListItem";
import NavPostLink from "@/components/blog/NavPostLink";
import VerticalPostListItem from "@/components/blog/VerticalPostListItem";
import {RichTextViewer} from "@/components/rich_text/RichTextViewer";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {BlogGroups, BlogMany, BlogSingle} from "@/stores/blog/blog.store";
import {GenreDomain} from "@/stores/blog/genre.store";
import {useParams} from "next/navigation";
import {useShallow} from "zustand/shallow";
import {Skeleton} from "@/components/ui/skeleton";
import React, {useEffect, useMemo, useRef} from "react";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";
import {v4} from 'uuid';
import Image from "next/image";
import {useTranslations} from "next-intl";

export default function DetailBlogPage() {
    const params = useParams();
    const {id} = params;
    const idNum = Number(id);


    const [latestBlogs, latestBlogStatus,] = BlogMany.useStore(useShallow(s => [
        s.blogs, s.status, s.error,
    ]))

    const [genre2s, genre1s,] = GenreDomain.useStore(useShallow(s =>
        [s.genre2s, s.genre1s]))

    const [proxyLoading, status, error, blog, getById] = BlogSingle.useStore(useShallow(s => [
        s.proxyLoading, s.status, s.error, s.blog, s.getById
    ]))
    const t = useTranslations()


    const blogGenre2s = genre2s.filter(g2 => blog.genre2Ids.some(g2Id => g2Id === g2.id))
    const blogGenre1s = genre1s.filter(g1 =>
        g1.genre2s.some(g2 => blog.genre2Ids.some(bg2Id => g2.id === bg2Id)));
    const g1Ids = useMemo(() => blogGenre1s.map(bg1 => bg1.id), [blogGenre1s]);

    useEffect(() => {
        if (id && !isNaN(idNum)) {
            proxyLoading(() => getById(idNum), 'get')
        }
    }, []);


    return (
        <div className="flex flex-row-reverse gap-6 main-container py-10">
            <div className="w-1/4">
                <StatusDependentRenderer status={latestBlogStatus} error={'wrong'}>
                    <BlogGenreSection genre={t("latest")}>
                        {latestBlogs.map(b => (
                            <HorizontalPostListItem
                              id={b.id}
                              key={b.id}
                              title={b.title}
                              image={b.imageUrl}
                              date={b.publishedAt}
                              author={b.author.fullName}
                              categories={genre2s.filter(g2 => b.genre2Ids.some(g2Id => g2Id === g2.id))}
                            />
                        ))}
                    </BlogGenreSection>
                </StatusDependentRenderer>
            </div>
            <div className="flex flex-col flex-1 gap-6">
                <StatusDependentRenderer status={status} error={error}
                                         altLoading={<Skeleton className={'w-full h-[500px]'}>
                                             <Card>
                                                 <CardHeader className="flex flex-col gap-6">
                                                     <div className="flex gap-2">
                                                         {Array.from({length: 4}, (_, index) => (
                                                             <TagItem key={index} tag="Loading"/>
                                                         ))}
                                                     </div>
                                                     <h3>Loading</h3>
                                                 </CardHeader>
                                             </Card>
                                         </Skeleton>}>
                    <Card>
                        <CardHeader className="flex flex-col gap-6">
                            <h1>{blog.title}</h1>
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={blog.author.imageUrl}/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="text-sm font-medium">{blog.author.fullName}</div>
                                <div className="text-sm text-gray-500">{blog.publishedAt}</div>
                            </div>
                        </CardHeader>

                        <CardContent className="min-h-[400px]">
                            <div className="relative w-full h-[400px] rounded overflow-hidden bg-muted shrink-0">
                                <Image
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <RichTextViewer content={blog.content}/>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 items-start">
                            <div className="flex gap-2 border-y border-border w-full py-4">
                                {
                                    blogGenre1s.map(bg1 =>
                                        <TagItem
                                            key={bg1.id}
                                            tag={bg1.name}
                                            className="hover:bg-black bg-black cursor-auto"
                                        />)
                                }
                                {blogGenre2s.map(g2 => (
                                    <TagItem key={g2.id} tag={g2.name}/>
                                ))}
                            </div>
                            {id && !isNaN(idNum) &&
                                <BlogPrevAndNext currentBlogId={idNum}/>
                            }
                        </CardFooter>
                    </Card>
                </StatusDependentRenderer>
                <BlogRelatedByG1Ids g1Ids={g1Ids}/>
            </div>


        </div>
    );
}

function BlogRelatedByG1Ids({g1Ids}: { g1Ids: number[] }) {
    const [g1IdToBlogs, groupStatus, groupError, getBlogsPartitioned, blogGroupProxyLoading] = BlogGroups.useStore(useShallow(s =>
        [s.g1IdToBlogs, s.status, s.error, s.getBlogsPartitionByG1Id, s.proxyLoading]))
    const t = useTranslations()

    const [genre1s] = GenreDomain.useStore(useShallow(s => [s.genre1s]))
    const didCall = useRef(false);
    useEffect(() => {
        if (!didCall.current && g1Ids.length) {
            didCall.current = true;
            blogGroupProxyLoading(() => getBlogsPartitioned(g1Ids), 'get');
        }
    }, [g1Ids]);


    return (
        <BlogGenreSection genre={t("related")}>
            <StatusDependentRenderer status={groupStatus} error={groupError} altLoading={(<Skeleton/>)}>
                <div className="flex gap-2 items-center">
                    {Object.entries(g1IdToBlogs).flatMap(([g1Id, blogs]) => {
                        return blogs.map((blog) => (
                            <VerticalPostListItem
                                key={v4()}
                                title={blog.title}
                                image={blog.imageUrl}
                                category={genre1s.filter(g1 => g1.id + '' === g1Id).map(g1 => g1.name).join(",  ")}
                                author={blog.author.fullName}
                                date={blog.publishedAt}
                            />));
                    })}
                </div>
            </StatusDependentRenderer>
        </BlogGenreSection>
    )
}

type BlogPrevAndNextPropType = {
    currentBlogId: number
}

function BlogPrevAndNext({currentBlogId}: BlogPrevAndNextPropType) {
    const [g1IdToBlogs] = BlogGroups.useStore(useShallow((s) => [s.g1IdToBlogs]));
    const [genre1s] = GenreDomain.useStore(useShallow(s => [s.genre1s]))
    const t = useTranslations();

    const flattenedBlogs = Object.entries(g1IdToBlogs)
        .flatMap(([g1Id, blogs]) =>
            blogs.map((blog) => ({
                ...blog,
                g1Name: genre1s.find((g1) => g1.id + "" === g1Id)?.name ?? "",
            }))
        )
        .sort((a, b) => a.id - b.id);

    const prev = [...flattenedBlogs]
        .filter((b) => b.id < currentBlogId)
        .sort((a, b) => b.id - a.id)[0];

    const next = [...flattenedBlogs]
        .filter((b) => b.id > currentBlogId)
        .sort((a, b) => a.id - b.id)[0];

    return (
        <div className="grid grid-cols-2 w-full gap-10">
            <NavPostLink
                id={prev?.id ?? -1}
                direction="prev"
                title={prev?.title ?? t('no_previous_blog')}
                disabled={!prev}
            />
            <NavPostLink
                id={next?.id ?? -1}
                direction="next"
                title={next?.title ?? t('no_next_blog')}
                disabled={!next}
            />
        </div>
    );
}

function TagItem({tag, className = ""}: { tag: string; className?: string }) {
    return (
        <div
            className={cn(
                "flex items-center justify-center px-2 py-1 border border-border bg-gray-400 text-sm font-medium hover:bg-primary cursor-pointer text-white rounded-sm",
                className
            )}
        >
            {tag}
        </div>
    );
}
