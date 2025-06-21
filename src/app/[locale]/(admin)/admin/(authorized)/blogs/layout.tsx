import React from 'react';
import {InitGenreStore, ResetBlogStore} from "@/components/store_cleaners/ResetBlogStore";


export default async function Layout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <InitGenreStore/>
            <ResetBlogStore/>
            {children}
        </>
    );
}

