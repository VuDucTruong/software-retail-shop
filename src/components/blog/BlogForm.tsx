'use client'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import CommonInputOutline from "@/components/common/CommonInputOutline";
import { Textarea } from "@/components/ui/textarea";
import GenreDropdown, { GenreDropDownUI } from "@/components/blog/GenreDropdown";
import ProductDescriptionInput from "@/components/product/ProductDescriptionInput";
import { Button } from "@/components/ui/button";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FloatingCardList, FloatingCart_ListDisplay_Type } from "@/components/blog/display_container/FloatingCartList";

namespace UI {
    const displayProfile = z.object({
        id: z.number(),
        fullName: z.string()
    })
    export type Modes = 'update' | 'create'

    export const BlogFormSchema = GenreDropDownUI.RequiredSchema.extend({
        title: z.string().min(1).max(40),
        subtitle: z.string().min(1).max(50),
        content: z.string().min(1).max(1000),
        author: displayProfile,
        image: typeof window !== "undefined"
            ? z.instanceof(File).nullish()
            : z.any(),
        imageUrl: z.string().optional(),
        publishedAt: z.string(),
    });
    
}
export type BlogFormType = z.infer<typeof UI.BlogFormSchema>
export const BlogFormDefaultValues: BlogFormType = {
    title: "",
    subtitle: "",
    content: "",
    publishedAt: new Date().toDateString(),
    author: {
        id: 1,
        fullName: 'anonymous'
    },
    selectedGenres: [],
}

export default function BlogForm({ initialValues, mode, onFormSubmit, uiTitles  }: {
    initialValues: BlogFormType,
    mode: UI.Modes ,
    onFormSubmit: (f: BlogFormType) => void,
    uiTitles: {
        formTitle: string, buttonTitle: string
    }
}) {

    const t = useTranslations();
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm<BlogFormType>({
        defaultValues: initialValues,
        resolver: zodResolver(UI.BlogFormSchema),
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

    // const [currentDisplayGenre1Id,setCurrentDisplayGenre1Id] = useState()
    const [selectedGenresDisplay, setSelectedGenreDisplay] = useState<FloatingCart_ListDisplay_Type>([]);

    function onG2Selected(checked: boolean, genre2s: GenreDropDownUI.Genre2Child[]): void {
        setSelectedGenreDisplay(current => {
            if (genre2s.length === 0)
                return current;

            const genre1Parent = genre2s[0].parentGenre
            const existGenre1 = current
                .find(g1 => g1.id === genre1Parent.id)

            if (checked) {
                if (existGenre1)
                    return current.map(g1 => {
                        if (g1.id === genre1Parent.id)
                            return {
                                ...g1,
                                childItems: genre2s.map(g2 => ({ name: g2.name }))
                            }
                        return g1;
                    });
                return [...current, { ...genre1Parent, childItems: genre2s.map(g2 => ({ name: g2.name })) }]
            } else {
                if (!existGenre1) return current;
                const filteredChildItems = existGenre1.childItems.filter(
                    ci => !genre2s.some(g2 => g2.name === ci.name)
                );

                if (filteredChildItems.length === 0) {
                    // Remove the whole parent
                    return current.filter(g1 => g1.id !== genre1Parent.id);
                } else {
                    // Update parent's childItems
                    return current.map(g1 => {
                        if (g1.id === genre1Parent.id) {
                            return { ...g1, childItems: filteredChildItems };
                        }
                        return g1;
                    });
                }
            }
        })
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2>{uiTitles.formTitle}</h2>
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
                                    <FormLabel>Hình ảnh</FormLabel>
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
                                                <Image
                                                    alt="Image"
                                                    fill
                                                    src={field.value ? URL.createObjectURL(field.value) : "/empty_img.png"}
                                                    className="object-contain"
                                                />
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
                                <CommonInputOutline required title={"Tiêu đề"} className="col-span-3">
                                    <Input {...field} />
                                </CommonInputOutline>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <CommonInputOutline title="Phụ đề" className="col-span-3" required>
                                    <Textarea {...field} className="resize-none" rows={3} />
                                </CommonInputOutline>
                            )}
                        />

                        {/*Require DateTimeLocal*/}
                        <FormField
                            control={form.control}
                            name="publishedAt"
                            render={({ field }) => (
                                <CommonInputOutline title={"Ngày xuất bản"} required>
                                    <Input type="datetime-local" {...field} />
                                </CommonInputOutline>
                            )}
                        />

                        {/* Categories Multi-select */}
                        <FormField
                            control={form.control}
                            name="selectedGenres"
                            render={({ field }) => (
                                <CommonInputOutline title={"Thể loại"} required>
                                    <GenreDropdown field={field} onGenre2Selected={onG2Selected} />
                                </CommonInputOutline>
                            )}
                        />
                        <CommonInputOutline title="Selected Genres">
                            <FloatingCardList items={selectedGenresDisplay} />
                        </CommonInputOutline>

                        <div className="col-span-3">
                            <ProductDescriptionInput hint="Nội dung bài viết" name="content" />
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

