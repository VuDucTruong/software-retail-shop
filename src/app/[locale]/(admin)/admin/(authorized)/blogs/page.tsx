"use client";

import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import SortingHeader from "@/components/common/table/SortingHeader";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BlogDomainType} from "@/api";
import {ColumnDef, PaginationState, SortingState,} from "@tanstack/react-table";
import {Eye, Trash2Icon} from "lucide-react";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import {useActionToast} from "@/hooks/use-action-toast";
import {useShallow} from "zustand/shallow";
import {BlogMany} from "@/stores/blog/blog.store";
import Link from "next/link";
import BlogFilterSheet from "@/components/blog/BlogFilterSheet";

export default function BlogManagementPage() {
    const t = useTranslations();

    const [status, lastAction, error, blogs,queryParams, totalInstances, totalPages, getBlogs,  deleteBlogs] =
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
            ])
        );


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
    }, [sorting, pagination, getBlogs]);

    const cols: ColumnDef<BlogDomainType>[] = [
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
            header: "TIêu đề",
            cell: ({row}) => {
                return row.original.title
            },
        },
        {
            accessorKey: "author",
            header: ({column}) => (
                <SortingHeader column={column} title={"Tác giả"}/>
            ),
            cell: ({row}) => {
                return <div className="font-bold">{row.original.author.fullName}</div>;
            },
            enableHiding: false,
        },
        {
            accessorKey: "genres",
            header: "Thể loại",
            cell: ({row}) => {
                return row.original.genre2Ids.join(", ");
            },
        },
        {
            accessorKey: "publishedAt",
            header: "Ngày xuất bản",
            cell: ({row}) => {
                return row.original.publishedAt;
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
                        <CommonConfirmDialog
                            triggerName={
                                <Button variant={"destructive"} size="icon" className="w-8 h-8">
                                    <Trash2Icon/>
                                </Button>
                            }
                            title={"Xóa danh mục"}
                            description={"Bạn có chắc chắn muốn xóa bài viết này không?"}
                            onConfirm={() => handleDelete(row.original.id)}
                        />
                    </div>
                );
            },
        },
    ];

    const handleDelete = (id: number) => {
        deleteBlogs([id])
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <h2>{"Quản lý bài viết"}</h2>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/blogs/create`}>
                            <Button>
                                Tạo bài viết
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
                    isLoading={blogs===null}
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
