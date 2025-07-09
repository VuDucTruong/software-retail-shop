"use client";

import {BlogDomainType} from "@/api";
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
import { GenreDomain } from "@/stores/blog/genre.store";
import { TbChecklist } from "react-icons/tb";
import { GrUndo } from "react-icons/gr";
import { SearchWith2LevelsDropdown } from "@/components/blog/search/SearchWith2LevelsDropDown";
import CommonTooltip from "@/components/common/CommonTooltip";

type GenColsParams = {
  t: ReturnType<typeof useTranslations>;
  toGenreDisplay: (ids: number[]) => string;
  handleDelete: (id: number) => void;
  handleApprove: (id: number) => void;
  handleUndoApprove: (id: number) => void;
  isAdmin?: boolean;
};

const genCols = ({
                   t,
                   toGenreDisplay,
                   handleDelete,
                   handleApprove,
                   handleUndoApprove,
                 }: GenColsParams): ColumnDef<BlogDomainType>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
              <SortingHeader column={column} title={"ID"} />
            ),
      cell: ({row}) => {
        return row.original.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({column}) => (
        <SortingHeader column={column} title={t("Title")}/>
      ),
      cell: ({row}) => {
        return row.original.title;
      },
    },
    {
      accessorKey: "author",
      header: ({column}) => (
        <SortingHeader column={column} title={t("Author")}/>
      ),
      cell: ({row}) => {
        return <div className="font-bold">{row.original.author.fullName}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "genres",
      header: t("Genres"),
      cell: ({row}) => {
        return toGenreDisplay(row.original.genre2Ids);
      },
    },
    {
      accessorKey: "publishedAt",
      header: ({column}) => (
        <SortingHeader column={column} title={t("publish_date")}/>
      ),
      cell: ({row}) => {
        return (
          row.original.publishedAt ?? (
            <div className="flex flex-col items-center justify-center">
              <div className="text-red-500 font-medium">
                {t("not_published")}
              </div>
              <div className="italic text-muted-foreground">
                {t("not_published_description")}
              </div>
            </div>
          )
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({row}) => {
        const approvedAt = row.original.approvedAt;
        const approved =
          typeof approvedAt !== "undefined" && approvedAt !== null;
        const deletedAt = row.original.deletedAt;
        const deleted = typeof deletedAt !== "undefined" && deletedAt !== null;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/admin/blogs/${row.original.id}`}>
              <CommonTooltip content={t("view_details")}>
                <Button variant={"outline"} size="icon" className="w-8 h-8">
                  <Eye/>
                </Button>
              </CommonTooltip>
            </Link>
            {
              <CommonTooltip content={approved? t("cancel_publish") : t("confirm_publish")}>
                  <CommonConfirmDialog
                    triggerName={
                      <Button
                        size="icon"
                        variant={"outline"}
                        className={`w-8 h-8 ${
                          approved ? "bg-muted text-foreground" : "text-green-600 "
                        }`}
                      >
                        {approved ? (
                          <GrUndo/>
                        ) : (
                          <TbChecklist strokeWidth={2.5}/>
                        )}
                      </Button>
                    }
                    title={`${approved? t("cancel_publish") : t("confirm_publish")}?`}
                    description={`${approved? t("cancel_warn") : t("publish_warn")}?`}
                    onConfirm={() => {
                      if (approved) {
                        handleUndoApprove(row.original.id);
                      } else {
                        handleApprove(row.original.id);
                      }
                    }}
                  />
              </CommonTooltip>

            }
            {
              <CommonTooltip content={t("Delete")}>
                  <CommonConfirmDialog
                    triggerName={
                      <Button
                        disabled={deleted}
                        variant={"destructive"}
                        size="icon"
                        className="w-8 h-8"
                      >
                        <Trash2/>
                      </Button>
                    }
                    title={"Xóa bài viết"}
                    description={"Bạn có chắc chắn muốn xóa bài viết này không?"}
                    onConfirm={() => handleDelete(row.original.id)}
                  />
              </CommonTooltip>

            }
          </div>
        );
      },
    },
  ];
};

export default function BlogManagementPage() {
  const t = useTranslations();

  const [
    status,
    lastAction,
    error,
    blogs,
    queryParams,
    totalInstances,
    totalPages,
    getBlogs,
    deleteBlogs,
    deleteBlogById,
    approveBlogById,
    proxyLoading,
  ] = BlogMany.useStore(
    useShallow((s) => [
      s.status,
      s.lastAction,
      s.error,
      s.blogs,
      s.queryParams,
      s.totalInstances,
      s.totalPages,
      s.getBlogs,
      s.deleteBlogs,
      s.deleteById,
      s.approveBlog,
      s.proxyLoading,
    ])
  );
  const [genre2s, genre1s] = GenreDomain.useStore(
    useShallow((s) => [s.genre2s, s.genre1s])
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
  });

  useActionToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: queryParams?.pageRequest?.sortBy ?? "createdAt",
      desc: queryParams?.pageRequest?.sortDirection === "desc",
    },
  ]);

  useEffect(() => {
    proxyLoading(
      () =>
        getBlogs({
          pageRequest: {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sortBy: sorting[0]?.id,
            sortDirection: sorting[0]?.desc ? "desc" : "asc",
          },
        }),
      "get"
    );
  }, [sorting, pagination, getBlogs, proxyLoading]);

  function fromGenre2IdsToDisplays(ids: number[]) {
    return genre2s
      .filter((g2) => ids.some((id) => id === g2.id))
      .map((g2) => g2.name)
      .join(",");
  }

  const cols = genCols({
    t,
    toGenreDisplay: fromGenre2IdsToDisplays,
    handleDelete: deleteBlogById,
    handleApprove: (id) => approveBlogById(id, true),
    handleUndoApprove: (id) => approveBlogById(id, false),
  });

  function onSearchAndGenresDebounced(
    genre2Ids: (number | string)[],
    search: string
  ) {
    proxyLoading(() => {
      getBlogs({
        pageRequest: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sortBy: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? "desc" : "asc",
        },
        search: search,
        genreIds: genre2Ids,
      });
    }, "get");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2 className="capitalize">{t("blog_management")}</h2>
          <div className="flex items-center gap-2">
            <Link href={`/admin/blogs/create`}>
              <Button>{t("create_blog")}</Button>
            </Link>
            <BlogFilterSheet/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          objectName={t("blog")}
          isLoading={status === "loading" && blogs.length === 0}
          columns={cols}
          data={blogs ?? []}
          totalCount={totalInstances ?? 0}
          pageCount={totalPages ?? 0}
          pagination={pagination}
          searchComponent={
            <SearchWith2LevelsDropdown
              key={1}
              menus={{
                items: genre1s.map((g1) => ({
                  id: g1.id,
                  name: g1.name,
                  children: g1.genre2s.map((g2) => ({...g2})),
                })),
              }}
              search={{}}
              onDebounced={onSearchAndGenresDebounced}
            />
          }
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(rows) => {
            deleteBlogs(rows);
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
