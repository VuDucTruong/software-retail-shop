'use client'
import {usePathname} from "@/i18n/navigation";
import {useEffect} from "react";

import {BlogMany, BlogSingle} from "@/stores/blog/blog.store";
import {GenreDomain} from "@/stores/blog/genre.store";

export function ResetBlogStore() {
    const pathname = usePathname();

    useEffect(() => {
        const cleaners: (() => void)[] = [BlogSingle.useStore.getState().clean, BlogMany.useStore.getState().clean]
        cleaners.forEach(c => c());
    }, [pathname]);

    return null;
};

export function InitGenreStore() {

    useEffect(() => {
        GenreDomain.useStore.getState().getGenre1s()
    }, []);

    return null;

}