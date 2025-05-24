'use client'
import {usePathname} from '@/i18n/navigation'
import React, {useEffect} from 'react'
import BlogForm, {BlogFormDefaultValues, BlogFormType} from "@/components/blog/BlogForm";
import {useShallow} from 'zustand/shallow';
import {BlogUpdateRequest} from '@/api';
import {BlogSingle} from "@/stores/blog/blog.store";
import { getDateTimeLocal } from '@/lib/date_helper';

export default function DetailBlogPage() {

    const pathname = usePathname();
    const id = pathname.split("/").at(-1);

    const idnum = Number(id);
    const [proxyLoading, status, error, blog, getById, updateBlog] = BlogSingle.useStore(useShallow(s => [
        s.proxyLoading, s.status, s.error, s.blog, s.getById, s.updateBlog
    ]))

    useEffect(() => {
        proxyLoading(async () => {
            await getById(idnum);
        })
    }, [getById, idnum, proxyLoading])

    const blogValue: BlogFormType = (blog === null) ? BlogFormDefaultValues : {
        title: blog.title,
        subtitle: blog.subtitle,
        content: blog.content,
        author: {
            id: blog.author.id,
            fullName: blog.author.fullName
        },
        publishedAt: getDateTimeLocal(),
        image: null,
        imageUrl: blog.imageUrl,
        selectedGenres: [],
    };
    const onSubmitUpdate = (f: BlogFormType): void => {
        const requestUpdate: BlogUpdateRequest = {
            id: idnum,
            title: f.title,
            content: f.content,
            subtitle: f.subtitle,
            publishedAt: new Date(f.publishedAt).toISOString() ?? new Date().toISOString(),
            image: f.image,
            genreIds: f.selectedGenres.map(g2 => g2.id)
        }
        console.log(requestUpdate)
        proxyLoading(() => updateBlog(requestUpdate))
    }


    // if (!StringUtils.hasLength(id)) {
    //     return (
    //         <div>This page jasdlkfjaklsdjlf</div>
    //     )
    // }
    return (
        <BlogForm initialValues={blogValue} onFormSubmit={onSubmitUpdate} mode={'update'}/>
    )
}
