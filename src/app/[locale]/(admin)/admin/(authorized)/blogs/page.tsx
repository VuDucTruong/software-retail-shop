"use client";

import {BlogDomainType, Order} from "@/api";
import BlogFilterSheet from "@/components/blog/BlogFilterSheet";
import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import SortingHeader from "@/components/common/table/SortingHeader";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useActionToast} from "@/hooks/use-action-toast";
import {BlogMany} from "@/stores/blog/blog.store";
import {ColumnDef, PaginationState, SortingState,} from "@tanstack/react-table";
import {Eye, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useShallow} from "zustand/shallow";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import {GenreDomain} from "@/stores/blog/genre.store";
import { TbChecklist } from "react-icons/tb";

const genCols = (t: ReturnType<typeof useTranslations>, toGenreDisplay: (ids:number[])=>string, handleDelete: (id: number) => void): ColumnDef<BlogDomainType>[] => {

    return [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({row}) => {
                return row.original.id;
            },
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: t('Title'),
            cell: ({row}) => {
                return row.original.title
            },
        },
        {
            accessorKey: "author",
            header: ({column}) => (
                <SortingHeader column={column} title={t('Author')}/>
            ),
            cell: ({row}) => {
                return <div className="font-bold">{row.original.author.fullName}</div>;
            },
            enableHiding: false,
        },
        {
            accessorKey: "genres",
            header: t('Genres'),
            cell: ({row}) => {
                return toGenreDisplay(row.original.genre2Ids);
            },
        },
        {
            accessorKey: "publishedAt",
            header: t('publish_date'),
            cell: ({row}) => {
                return row.original.publishedAt ?? <div className="flex flex-col items-center justify-center">
                    <div className="text-red-500 font-medium">{t('not_published')}</div>
                    <div className="italic text-muted-foreground">{t('not_published_description')}</div>
                </div>;
            },
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({row}) => {
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/blogs/${row.original.id}`}>
                            <Button variant={"outline"} size="icon" className="w-8 h-8">
                                <Eye/>
                            </Button>
                        </Link>

                        {!row.original.publishedAt ? null : (
                            <CommonConfirmDialog
                                triggerName={
                                    <Button
                                        size="icon"
                                        className="w-8 h-8"
                                    >
                                        <TbChecklist />
                                    </Button>
                                }
                                title={"Xác nhận xuất bản"}
                                description={
                                    "Bạn có chắc chắn muốn xuất bản bài viết này không?"
                                }
                                onConfirm={() => {
                                    // TODO: Implement publish logic
                                }}
                            />
                        )}

                        {row.original.deletedAt ? null : (
                            <CommonConfirmDialog
                                triggerName={
                                    <Button
                                        variant={"destructive"}
                                        size="icon"
                                        className="w-8 h-8"
                                    >
                                        <Trash2/>
                                    </Button>
                                }
                                title={"Cấm người dùng"}
                                description={
                                    "Bạn có chắc chắn muốn xóa đơn hàng này không?"
                                }
                                onConfirm={() => handleDelete(row.original.id)}
                            />
                        )}

                        
                    </div>
                );
            },
        },
    ];
}

export default function BlogManagementPage() {
    const t = useTranslations();

    const [status, lastAction, error, blogs, queryParams, totalInstances, totalPages, getBlogs, deleteBlogs, deleteBlogById] =
        BlogMany.useStore(
            useShallow((state) => [
                state.status,
                state.lastAction,
                state.error,
                state.blogs,
                state.queryParams,
                state.totalInstances,
                state.totalPages,
                state.getBlogs,
                state.deleteBlogs,
                state.deleteById,
            ])
        );
    const [genre2s, getGenre1s] = GenreDomain.useStore(useShallow(s => [s.genre2s, s.getGenre1s]))

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: queryParams?.pageRequest?.page ?? 0,
        pageSize: queryParams?.pageRequest?.size ?? 10,
    });

    useActionToast({
        status, lastAction, errorMessage: error || undefined,
    });

    const [sorting, setSorting] = useState<SortingState>([{
        id: queryParams?.pageRequest?.sortBy ?? "createdAt",
        desc: queryParams?.pageRequest?.sortDirection === "desc",
    },
    ]);

    useEffect(() => {
        getBlogs({
            pageRequest: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sortBy: sorting[0]?.id,
                sortDirection: sorting[0]?.desc ? "desc" : "asc",
            },
        });
    }, []);
    function fromGenre2IdsToDisplays(ids:number[]){
        return genre2s.filter(g2=>ids.some(id=>id===g2.id)).map(g2=>g2.name).join(",");
    }


    const cols = genCols(t,fromGenre2IdsToDisplays, deleteBlogById)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <h2 className="capitalize">{t('blog_management')}</h2>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/blogs/create`}>
                            <Button>
                                {t('create_blog')}
                            </Button>
                        </Link>
                        <BlogFilterSheet/>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CommmonDataTable
                    objectName={t('blog')}
                    // isLoading={status === "loading" && lastAction === null}
                    isLoading={blogs === null}
                    columns={cols}
                    data={blogs ?? []}
                    totalCount={totalInstances ?? 0}
                    pageCount={totalPages ?? 0}
                    pagination={pagination}

                    onPaginationChange={(updater) => {
                        setPagination((old) =>
                            typeof updater === "function" ? updater(old) : updater
                        );
                    }}
                    canSelect
                    onDeleteRows={(rows) => {
                        deleteBlogs(rows)
                    }}
                    sorting={sorting}
                    onSortingChange={(updater) => {
                        setSorting((prev) =>
                            typeof updater === "function" ? updater(prev) : updater
                        );
                    }}
                />
            </CardContent>
        </Card>
    );
}
