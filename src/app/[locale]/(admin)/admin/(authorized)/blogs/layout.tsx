import React from 'react';
import {ResetBlogStore} from "@/components/store_cleaners/ResetBlogStore";


export default async function Layout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ResetBlogStore/>
            {children}
        </>
    );
}

