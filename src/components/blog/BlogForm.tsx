'use client'
import GenreDropdown, { RequiredSchema } from "@/components/blog/GenreDropdown";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import ProductDescriptionInput from "@/components/product/ProductDescriptionInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import { FloatingCardList, FloatingCart_ListDisplay_Type } from "@/components/blog/display_container/FloatingCartList";
import { StringUtils } from "@/lib/utils";
import { GenreDomain } from "@/stores/blog/genre.store";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import {getDateTimeLocal} from "@/lib/date_helper";

export const BlogFormSchema = RequiredSchema.extend({
    title: z.string().min(1).max(40),
    subtitle: z.string().min(1).max(50),
    content: z.string().min(1).max(1000),
    author: z.object({
        id: z.number(),
        fullName: z.string()
    }),
    selectedGenre2Ids: z.set(z.number()),
    image: typeof window !== "undefined"
        ? z.instanceof(File).nullish()
        : z.any(),
    imageUrl: z.string().nullish(),
    publishedAt: z.string(),
});
export type BlogFormType = z.infer<typeof BlogFormSchema>
export const blogFormDefaultValues: BlogFormType = {
    title: "",
    subtitle: "",
    content: "",
    selectedGenre2Ids: new Set<number>(),
    publishedAt: getDateTimeLocal(),
    author: {
        id: 1,
        fullName: 'anonymous'
    },
}
export type Modes = 'update' | 'create'


function ImagePreview({ form }: { form: UseFormReturn<BlogFormType, any, BlogFormType> }) {
    const watchedImage = useWatch({
        control: form.control,
        name: "image",
    });
    // console.log(form.getValues())
    const watchedImageUrl = useWatch({
        control: form.control,
        name: "imageUrl",
    });

    const imagePreview = useMemo(() => {
        const fallback = StringUtils.hasLength(watchedImageUrl)
            ? watchedImageUrl!
            : "/empty_img.png";

        const src = watchedImage ? URL.createObjectURL(watchedImage) : fallback;

        return (
            <div className="relative w-full h-64">
                <Image
                    alt="Image"
                    fill
                    src={src}
                    className="object-contain"
                />
            </div>
        );
    }, [watchedImage, watchedImageUrl]);
    return imagePreview;
}


export default function BlogForm({ initialValues, mode, onFormSubmit, uiTitles }: {
    initialValues: BlogFormType,
    mode: Modes,
    onFormSubmit: (f: BlogFormType) => void,
    uiTitles: {
        formTitle: string, buttonTitle: string
    }
}) {

    const t = useTranslations();
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm<BlogFormType>({
        defaultValues: initialValues,
        resolver: zodResolver(BlogFormSchema),
        mode: "onSubmit",
    });
    const handleSubmit = () => {
        form.handleSubmit(async (data) => {
            onFormSubmit(data);
        })();
    };
    useEffect(() => {
        form.reset(initialValues);
    }, [initialValues, form]);

    // const imagePreview = ImagePreview(form);


    // const [currentDisplayGenre1Id,setCurrentDisplayGenre1Id] = useState()
    const [selectedGenresDisplay, setSelectedGenreDisplay] = useState<FloatingCart_ListDisplay_Type>([]);
    // console.log(form.getValues('selectedGenre2Ids'))

    function onG2Selected(genre2Ids: Set<number>): void {
        const map = new Map<number, {
            id: number,
            name: string,
            childItems: { name: string }[]
        }>();

        const { genre1s, genre2s } = GenreDomain.useStore.getState();

        for (const genre2Id of genre2Ids) {
            const genre2 = genre2s.find(g2 => g2.id === genre2Id);
            if (!genre2) continue;

            const genre1 = genre2.genre1;

            if (!map.has(genre1.id)) {
                map.set(genre1.id, {
                    id: genre1.id,
                    name: genre1.name,
                    childItems: []
                });
            }

            map.get(genre1.id)!.childItems.push({ name: genre2.name });
        }

        const newValue = Array.from(map.values());
        setSelectedGenreDisplay(newValue);
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2 className="capitalize">{uiTitles.formTitle}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className=" grid grid-cols-3 space-x-4 gap-6"
                    >
                        {/* Image Upload */}

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormLabel>{t('Image')}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                ref={fileRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        field.onChange(file);
                                                    }
                                                }}
                                            />

                                            <div className="relative w-full h-64">
                                                <ImagePreview form={form} />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <CommonInputOutline required title={t('Title')} className="col-span-3">
                                    <Input {...field} />
                                </CommonInputOutline>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <CommonInputOutline title={t("Subtitle")} className="col-span-3" required>
                                    <Textarea {...field} className="resize-none" rows={3} />
                                </CommonInputOutline>
                            )}
                        />

                        {/*Require DateTimeLocal*/}
                        <FormField
                            control={form.control}
                            name="publishedAt"
                            render={({ field }) => (
                                <CommonInputOutline title={t("publish_date")} required>
                                    <Input type="datetime-local" {...field} />
                                </CommonInputOutline>
                            )}
                        />

                        {/* Categories Multi-select */}
                        <FormField
                            control={form.control}
                            name="selectedGenre2Ids"
                            render={({ field }) => (
                                <CommonInputOutline title={t('Genres')} required>
                                    <GenreDropdown selectedGenre2Ids={initialValues.selectedGenre2Ids} field={field} onGenre2Selected={onG2Selected} />
                                </CommonInputOutline>
                            )}
                        />
                        <CommonInputOutline title={t("selected_genres")}>
                            <FloatingCardList items={selectedGenresDisplay} />
                        </CommonInputOutline>

                        <div className="col-span-3">
                            <ProductDescriptionInput hint={t('blog_content')} name="content" />
                        </div>

                        <Button
                            className="col-start-3 bg-green-400 hover:bg-green-500"
                            type="submit"
                        >
                            {t(uiTitles.buttonTitle)}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

