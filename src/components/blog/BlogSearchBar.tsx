import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import debounce from "lodash/debounce";
import {Search} from "lucide-react";
import {useTranslations} from "next-intl";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Form, FormField} from "../ui/form";
import {BlogMany} from "@/stores/blog/blog.store";
import {useShallow} from "zustand/shallow";
import {StringUtils} from "@/lib/utils";

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

    const [searchBlogs, proxyLoading] = BlogMany.useStore(useShallow(s => [s.getBlogs, s.proxyLoading]))

    const debouncedSearch = React.useMemo(
        () =>
            debounce((data: SearchParam) => {
                proxyLoading(() => searchBlogs({
                    pageRequest: {
                        page: 0,
                        size: 10,
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
        <Popover open={form.watch("search") !== ""}>
            <PopoverTrigger asChild>
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
                <div className="flex flex-col  gap-3">
                    {/* {search?.data.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                router.push("/blog/" + item.slug);
              }}
              className="flex items-center cursor-pointer hover:text-primary hover:opacity-80 gap-2 hover:underline"
            >
              <PackageSearch />
              <span>{item.name}</span>
            </div>
          ))}

          {search?.data.length === 0 && (
            <div className="flex items-center justify-center cursor-pointer hover:text-primary hover:opacity-80 gap-2">
              <span className="text-muted-foreground italic">
                {t("no_matching_x", { x: t("blogs") })}
              </span>
            </div>
          )} */}
                </div>
            </PopoverContent>
        </Popover>
    );
}
