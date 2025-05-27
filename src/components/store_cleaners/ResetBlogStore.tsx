'use client'
import {usePathname} from "@/i18n/navigation";
import {useEffect} from "react";

import {BlogMany, BlogSingle} from "@/stores/blog/blog.store";

export function ResetBlogStore(){
    const pathname = usePathname();

    useEffect(() => {
        const cleaners:(()=>void)[] = [BlogSingle.useStore.getState().clean, BlogMany.useStore.getState().clean]
        cleaners.forEach(c=>c());
    }, [pathname]);

    return null;
};
