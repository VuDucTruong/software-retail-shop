"use client";

import {BlogCreateRequest,} from "@/api";
import {useTranslations} from "next-intl";
import React, {useState} from "react";
import {useShallow} from "zustand/shallow";
import {useActionToast} from "@/hooks/use-action-toast";
import {BlogSingle} from "@/stores/blog/blog.store";
import BlogForm, {blogFormDefaultValues, BlogFormType} from "@/components/blog/BlogForm";

export default function CreateBlogPage() {
    const t = useTranslations();

    const [proxyLoading, createBlog, lastAction, status, error] = BlogSingle.useStore(
        useShallow((s) => [
            s.proxyLoading,
            s.createBlog,
            s.lastAction,
            s.status,
            s.error,
        ])
    );

    useActionToast({
        lastAction,
        status,
        errorMessage: error || undefined,
    });
    const [formValues, setFormValues] = useState<BlogFormType>(blogFormDefaultValues);

    const onSubmitUpdate = (f: BlogFormType): void => {
        const requestUpdate: BlogCreateRequest = {
            title: f.title,
            content: f.content,
            subtitle: f.subtitle,
            publishedAt: new Date(f.publishedAt).toISOString() ?? new Date().toISOString(),
            image: f.image,
            // imageUrl: f.imageUrl,
            genreIds: [...f.selectedGenre2Ids]
        }
        proxyLoading(() => createBlog(requestUpdate).then(v=>{
            setFormValues(blogFormDefaultValues)
        }), 'create')
    }

    return (
        <>
            <BlogForm initialValues={formValues} onFormSubmit={onSubmitUpdate} mode={'create'}
                      uiTitles={{
                          formTitle: t("create_blog"),
                          buttonTitle: t("Create")
                      }}
            />
        </>
    );
}
