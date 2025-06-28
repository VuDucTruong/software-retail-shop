import {ArrowLeftCircle} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

type NavPostLinkProps = {
    id: number;
    title: string;
    direction: "prev" | "next";
    disabled?: boolean;
};

export default function NavPostLink({
                                        direction,
                                        title,
                                        id,
                                        disabled = false,
                                    }: NavPostLinkProps) {
    const isPrev = direction === "prev";

    const content = (
        <div
            className={clsx(
                "group flex flex-col gap-2 w-full p-4 rounded-xl border border-primary bg-primary-50/50",
                "transition-all duration-200 shadow-sm hover:shadow-md",
                "hover:bg-rose-300 hover:border-rose-300",
                isPrev ? "items-start text-left" : "items-end text-right",
                disabled && "opacity-50 pointer-events-none"
            )}
        >
            <div
                className={clsx(
                    "text-sm font-medium flex items-center gap-1 text-primary group-hover:text-white",
                    isPrev ? "flex-row-reverse" : "flex-row"
                )}
            >
                {isPrev ? "Bài trước" : "Bài sau"}
                <ArrowLeftCircle className={clsx("w-5 h-5", !isPrev && "rotate-180")} />
            </div>
            <div className="text-base font-semibold leading-snug line-clamp-2 text-primary group-hover:text-white">
                {title}
            </div>
        </div>
    );

    return disabled ? content : <Link href={`/blog/${id}`}>{content}</Link>;
}