import {zodResolver} from "@hookform/resolvers/zod";
import {Filter} from "lucide-react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "../ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../ui/form";
import {Input} from "../ui/input";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "../ui/sheet";
import {BlogMany} from "@/stores/blog/blog.store";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import GenreDropdown from "@/components/blog/GenreDropdown";
import {StringUtils} from "@/lib/utils";
import {SwitchToggleField} from "@/components/ui/CommonYesNo";

export const BlogFilterFormSchema = z.object({
    search: z.string().optional(),
    selectedGenre2Ids: z.union([z.array(z.number()), z.set(z.number())])
        .transform((val) => (val instanceof Set ? val : new Set(val))),
    publishedFrom: z.string().optional(),
    deleted: z.boolean(),
    publishedTo: z.string().optional(),
});

export type BlogFilterFormType = z.infer<typeof BlogFilterFormSchema>;

export default function BlogFilterSheet() {
    const t = useTranslations();
    const getBlogs = BlogMany.useStore((s) => s.getBlogs);

    const form = useForm<BlogFilterFormType>({
        resolver: zodResolver(BlogFilterFormSchema),
        defaultValues: {
            search: "",
            selectedGenre2Ids: new Set<number>(),
            deleted: false,
            publishedFrom: "",
            publishedTo: "",
        },
    });


    function handleSubmit(data: BlogFilterFormType) {
        const hasPf = StringUtils.hasLength(data.publishedFrom)
        const hasPt = StringUtils.hasLength(data.publishedTo)
        const hasSearch = StringUtils.hasLength(data.search)

        getBlogs({
            pageRequest: {
                page: 0,
                size: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
            },
            search: hasSearch ? data.search : undefined,
            publishedFrom: hasPf ? data.publishedFrom : undefined,
            deleted: data.deleted,
            publishedTo: hasPt ? data.publishedTo : undefined,
            genreIds: [...data.selectedGenre2Ids],
        });
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-fit">
                    <Filter/> {t("search_and_filter", {x: t("blog")})}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t("search_and_filter", {x: t("blog")})}</SheetTitle>
                    <SheetDescription>
                        {t("search_and_filter_description", {x: t("blog")})}
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-auto ">
                    <Form {...form}>
                        <form className=" w-full px-3 flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="search"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>{t("Search")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="selectedGenre2Ids"
                                render={({field}) => (
                                    <CommonInputOutline title={t("Genres")} required>
                                        <GenreDropdown field={field}/>
                                    </CommonInputOutline>
                                )}
                            />

                            <CommonInputOutline title={t("include_deleted_item")}>
                                <SwitchToggleField name="deleted"/>
                            </CommonInputOutline>


                            <FormField
                                control={form.control}
                                name="publishedFrom"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>{t("from_date")}</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="publishedTo"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>{t("to_date")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                min={form.watch("publishedFrom")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className="absolute right-0 left-0 bottom-2 flex gap-2 mx-3 bg-white pt-2">
                        <Button className="flex-1" onClick={form.handleSubmit(handleSubmit)}>
                            {t("apply_filters")}
                        </Button>

                        <Button
                            className="flex-1"
                            variant={"destructive"}
                            onClick={() => {
                                form.reset();
                            }}
                        >
                            {t("reset_filters")}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}