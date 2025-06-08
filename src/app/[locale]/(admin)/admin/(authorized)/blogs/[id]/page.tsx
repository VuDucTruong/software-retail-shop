'use client'
import {usePathname} from '@/i18n/navigation'
import React, {useEffect} from 'react'
import BlogForm, {blogFormDefaultValues, BlogFormType} from "@/components/blog/BlogForm";
import {useShallow} from 'zustand/shallow';
import {BlogUpdateRequest} from '@/api';
import {BlogSingle} from "@/stores/blog/blog.store";
import {getDateTimeLocal} from '@/lib/date_helper';
import {useActionToast} from "@/hooks/use-action-toast";
import {Toaster} from 'sonner';
import { useTranslations } from 'next-intl';

export default function DetailBlogPage() {
    const t = useTranslations();
    const pathname = usePathname();
    const id = pathname.split("/").at(-1);

    const idnum = Number(id);
    const [proxyLoading, lastAction, status, error, blog, getById, updateBlog] = BlogSingle.useStore(useShallow(s => [
        s.proxyLoading, s.lastAction, s.status, s.error, s.blog, s.getById, s.updateBlog
    ]))

    useEffect(() => {
        proxyLoading(async () => {
            await getById(idnum);
        })
    }, [getById, idnum, proxyLoading])


    const blogValue: BlogFormType = (blog === null) ? blogFormDefaultValues : {
        title: blog.title,
        subtitle: blog.subtitle,
        content: blog.content,
        selectedGenre2Ids: new Set(blog.genre2Ids),
        author: {
            id: blog.author.id,
            fullName: blog.author.fullName
        },
        publishedAt: getDateTimeLocal(),
        image: null,
        imageUrl: blog.imageUrl,
    };

    const onSubmitUpdate = (f: BlogFormType): void => {
        const requestUpdate: BlogUpdateRequest = {
            id: idnum,
            title: f.title,
            content: f.content,
            subtitle: f.subtitle,
            publishedAt: new Date(f.publishedAt).toISOString() ?? new Date().toISOString(),
            image: f.image,
            genreIds: [...f.selectedGenre2Ids]
        }
        proxyLoading(() => updateBlog(requestUpdate),'update')
    }


    useActionToast({
        lastAction,
        status,
        errorMessage: error || undefined,
    });
    return (
        <div>
            {/* <Toaster richColors theme='dark' /> */}
            <BlogForm initialValues={blogValue} onFormSubmit={onSubmitUpdate} mode={'update'}
                      uiTitles={{
                          formTitle: t('update_blog'),
                          buttonTitle: t('Update')
                      }}
            />
        </div>
    )
}
