'use client'
import {BlogUpdateRequest} from '@/api';
import BlogForm, {blogFormDefaultValues, BlogFormType} from "@/components/blog/BlogForm";
import {useActionToast} from "@/hooks/use-action-toast";
import {usePathname} from '@/i18n/navigation';
import {getDateTimeLocal} from '@/lib/date_helper';
import {BlogSingle} from "@/stores/blog/blog.store";
import {useTranslations} from 'next-intl';
import {useEffect} from 'react';
import {useShallow} from 'zustand/shallow';

export default function DetailBlogPage() {
    const t = useTranslations();
    const pathname = usePathname();
    const id = pathname.split("/").at(-1);

    const idnum = Number(id);
    const [proxyLoading, lastAction, status, error, blog, getById, updateBlog, approveBlog] = BlogSingle.useStore(useShallow(s => [
        s.proxyLoading, s.lastAction, s.status, s.error, s.blog, s.getById, s.updateBlog, s.approveBlog
    ]))

    useEffect(() => {
        proxyLoading(async () => {
            await getById(idnum);
        })
    }, [])


    const blogValue: BlogFormType = (blog === null) ? blogFormDefaultValues : {
        title: blog.title,
        subtitle: blog.subtitle,
        content: blog.content,
        approvedAt: blog.approvedAt,
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
        proxyLoading(() => updateBlog(requestUpdate), 'update')
    }

    function onApprove() {
        const approved = typeof blog?.approvedAt !== 'undefined' && blog?.approvedAt !== null
        approveBlog(idnum, !approved)
    }

    useActionToast({
        lastAction,
        status,
        errorMessage: error || undefined,
    });
    return (
        <div>
            {/* <Toaster richColors theme='dark' /> */}
            <BlogForm initialValues={blogValue} onFormSubmit={onSubmitUpdate} mode={'update'} onApprove={onApprove}
                      uiTitles={{
                          formTitle: t('update_blog'),
                          buttonTitle: t('Update')
                      }}
            />
        </div>
    )
}
