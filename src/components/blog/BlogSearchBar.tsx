import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import debounce from "lodash/debounce";
import {PackageSearch, Search} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Form, FormField} from "../ui/form";
import {BlogMany} from "@/stores/blog/blog.store";
import {useShallow} from "zustand/shallow";
import {StringUtils} from "@/lib/utils";
import {StatusDependentRenderer} from "@/components/special/LoadingPage";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

type SearchParam = {
    search: string;
    g2s: number[],
}

export default function BlogSearchBar() {
    const form = useForm<SearchParam>({
        defaultValues: {
            search: "",
            g2s: []
        },
    });

    const router = useRouter();
    const t = useTranslations();

    const [blogs, status, error, searchBlogs, proxyLoading] = BlogMany.useStoreLight(useShallow(s =>
        [s.blogs, s.status, s.error, s.getBlogs, s.proxyLoading]))

    const debouncedSearch = React.useMemo(
        () =>
            debounce((data: SearchParam) => {
                proxyLoading(() => searchBlogs({
                    pageRequest: {
                        page: 0,
                        size: 6,
                        sortBy: "createdAt",
                        sortDirection: "desc",
                    },
                    search: data.search,
                    genreIds: data.g2s
                }), 'get')
            }, 500),
        []
    );

    const params = useSearchParams();

    useEffect(() => {
        const search = params.get("search")
        const g2s = params.getAll("g2s")
        const page = params.get("page")
        console.log("query", {search, g2s, page})
        const qSearch = search ?? undefined

        const qG2s = g2s
            .map(Number)
            .filter((v) => Number.isInteger(v) && v > 0)

        const qPage = StringUtils.isNum(page) ? Number(page) : 0

        proxyLoading(() =>
            searchBlogs({
                search: qSearch,
                genreIds: qG2s,
                pageRequest: {
                    page: qPage,
                    size: 10,
                    sortBy: "createdAt",
                    sortDirection: "desc",
                },
            }), 'get');
    }, []);

    useEffect(() => {

        const subscription = form.watch((data) => {
            const cleaned: SearchParam = {
                search: data.search ?? "",
                g2s: []
            }
            debouncedSearch(cleaned);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [form, debouncedSearch]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.handleSubmit((data) => {
            /// TODO: ASK THIS?
            // const cleanData = Object.fromEntries(
            //     Object.entries(data).filter(
            //         ([, value]) => value !== "" && value !== "all"
            //     )
            // );
            const searchParams = new URLSearchParams();
            const cleanData = data;
            if (cleanData.search !== '') {
                searchParams.set("search", cleanData.search);
            }
            if (cleanData.g2s && Array.isArray(cleanData.g2s)) {
                searchParams.set("g2s", cleanData.g2s.join(","))
            }
            searchParams.set("page", "0");

            router.push(`/blog/search?${searchParams.toString()}`);
        })();
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Form {...form}>
                    <form
                        className="flex items-center w-full max-w-md border-b rounded-md border-border shadow-sm"
                        onSubmit={handleSubmit}>
                        <FormField
                            name="search"
                            control={form.control}
                            render={({field}) => {
                                return (
                                    <Input
                                        placeholder={t("search_hint")}
                                        className="flex-1 border-none focus-visible:ring-0 shadow-none"
                                        {...field}
                                    />
                                );
                            }}
                        />
                        <Button
                            variant="ghost"
                            className="p-2 hover:bg-accent/80  text-gray-500 cursor-pointer"
                            type="submit">
                            <Search className="w-5 h-5 "/>
                        </Button>
                    </form>
                </Form>
            </PopoverTrigger>
            <PopoverContent
                className="p-4 w-lg"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}>
                <StatusDependentRenderer
                    status={status}
                    error={error}
                    altLoading={Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} className="flex flex-col gap-2 p-2 rounded-md">
                            <div className="flex gap-3">
                                <div className="w-20 h-20 bg-muted rounded" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted-foreground/30 rounded w-3/4" />
                                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                                </div>
                            </div>
                        </Skeleton>
                    ))}
                >
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                        {blogs.slice(0,6).map((item) => (
                            <div
                                key={item.id}
                                onClick={() => router.push(`/blog/${item.id}`)}
                                className="flex gap-3 p-2 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                            >
                                <div className="relative w-16 h-16 rounded overflow-hidden bg-muted shrink-0">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-between overflow-hidden">
          <span className="text-sm font-medium line-clamp-2 leading-snug text-rose-950 group-hover:text-rose-600">
            {item.title}
          </span>
                                    <span className="text-xs text-muted-foreground"> {item.publishedAt}</span>
                                </div>
                            </div>
                        ))}

                        {blogs.length === 0 && (
                            <div className="col-span-2 flex items-center justify-center p-2 text-sm italic text-muted-foreground">
                                {t("no_matching_x", { x: t("blogs") })}
                            </div>
                        )}
                    </div>

                    {/* View more CTA */}
                    <div className="flex w-full justify-end mt-2">
                        <Link
                            href="/blog/search"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-600 transition-colors"
                        >{t("see_more") ?? "See more"}
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </StatusDependentRenderer>

            </PopoverContent>
        </Popover>
    );
}
