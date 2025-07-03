'use client'
import {useEffect} from "react";

import {BlogMany} from "@/stores/blog/blog.store";
import {useShallow} from "zustand/shallow";
import {usePathname} from "@/i18n/navigation";

export function InitBlogStore() {
    const pathname = usePathname();

    const [getLatestBlogs, proxyLoading] = BlogMany.useStore(useShallow(s => [
        s.getBlogs, s.proxyLoading
    ]))

    useEffect(() => {
        if (pathname.startsWith("/blog/search"))
            return;
        proxyLoading(() => getLatestBlogs({
            pageRequest: {
                page: 0,
                size: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
            },
        }), 'get')
    }, []);

    return null;
}

