"use client";

import {Order, OrderStatusSchema} from "@/api";
import {convertStatus, StatusBadge} from "@/components/common/StatusBadge";
import {CommmonDataTable} from "@/components/common/table/CommonDataTable";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ColumnDef, PaginationState, SortingState} from "@tanstack/react-table";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {OrderMany} from "@/stores/order/order.store";
import {useShallow} from "zustand/shallow";
import {useActionToast} from "@/hooks/use-action-toast";
import {OrdersFilterForm} from "@/components/orders/OrdersFilterForm";
import {convertPriceToVND} from "@/lib/currency_helper";
import OrderResendMailDialogContent from "@/components/transactions/OrderResendMailDialogContent";
import {toast} from "sonner";
import {ApiError} from "@/api/client/base_client";
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {SearchWithDropDown} from "@/components/ui/search/SearchWithDropDown";
import {CollectionUtils, StringUtils} from "@/lib/utils";
import CommonToolTip from "@/components/common/CommonTooltip";

type GenColsParams = {
  t: ReturnType<typeof useTranslations>;
  handleResendMail: (id: number, email: string) => void,
  handleDelete(id: number): void
}

const ORDER_STATUS_NONE_ID = -1000;

const genCols = ({t, handleResendMail, handleDelete}: GenColsParams): ColumnDef<Order>[] => {

  return [
    {
      accessorKey: "Id",
      header: "ID",
      cell: ({row}) => {
        return row.original.id;
      },
      enableHiding: false,
    },
    {
      accessorKey: "User",
      header: t("User"),
      cell: ({row}) => {
        return <div className="font-bold">
          {`${row.original.profile.email}\n${row.original.profile.fullName}`
            .split('\n')
            .map((line, i) => (
              <div key={i}>{line}</div>
            ))}
        </div>
      },
    },
    {
      accessorKey: "By",
      header: t("payment_method"),
      cell: ({row}) => {
        return row.original.payment?.paymentMethod;
      },
    },
    {
      accessorKey: "Amount",
      header: t("Amount"),
      cell: ({row}) => {
        return convertPriceToVND(row.original.amount ?? 0);
      },
    },
    {
      accessorKey: "Status",
      header: t("Status"),
      cell: ({row}) => {
        return <StatusBadge status={convertStatus(row.original.orderStatus ?? 'PENDING')}/>;
      },
    },
    {
      accessorKey: "createdAt",
      header: t("Time"),
      cell: ({row}) => {
        return row.original.createdAt;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({row}) => {
        return (
          <>
            <div className="flex items-end gap-2">
              <TransactionDetailDialog orderId={row.original.id}/>
              {convertStatus(row.original.orderStatus ?? "PENDING") !== 'failed_mail' ? null : (
                <OrderResendMailDialogContent email={row.original.sentMail}
                                              onSubmit={(email) => handleResendMail(row.original.id, email ?? "",)}/>
              )}
              {row.original.deletedAt ? null : (
                <CommonToolTip content={t("Delete")}>
                  <CommonConfirmDialog
                    triggerName={
                      <Button
                        variant={"destructive"}
                        size="icon"
                        className="w-8 h-8">
                        <Trash2/>
                      </Button>
                    }
                    title={`${t("Delete")} ${t("Order")}`}
                    description={t("delete_order_warning")}
                    onConfirm={() => handleDelete(row.original.id)}
                  />
                </CommonToolTip>
              )}
            </div>

          </>
        );
      },
    }
  ];
}


export default function TransactionMangementPage() {
  const t = useTranslations();
  const [status, lastAction, error, orders, queryParams, totalInstances, totalPages, getOrders, deleteOrders, deleteById, resendMail, proxyLoading] =
    OrderMany.useStore(
      useShallow((state) => [
        state.status, state.lastAction, state.error, state.orders,
        state.queryParams, state.totalInstances, state.totalPages,
        state.getOrders, state.deleteOrders,
        state.deleteById, state.resendMail, state.proxyLoading
      ])
    );

  useActionToast({
    status, lastAction, errorMessage: error || undefined,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: queryParams?.pageRequest?.page ?? 0,
    pageSize: queryParams?.pageRequest?.size ?? 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{
    id: queryParams?.pageRequest?.sortBy ?? "createdAt",
    desc: queryParams?.pageRequest?.sortDirection === "desc",
  },
  ]);

  useEffect(() => {
    proxyLoading(() => getOrders({
      pageRequest: {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? "desc" : "asc",
      },
    }), 'get');
  }, [sorting, pagination, getOrders, proxyLoading]);


  function handleResendMail(id: number, email: string) {
    resendMail(id, email, true).then(() => {
      toast.success(t("success_resend_mail"))
    }).catch(e => {
      if (e instanceof ApiError) {
        const apiError = e as ApiError;
        toast.error(t("error_send_mail"), {description: apiError.message})
      }
    })
  }

  const cols = genCols({t, handleResendMail, handleDelete: deleteById});

  function onSearchAndStatusesDebounced(selectedStatuses: (number | string)[], search: string) {
    const firstCleaned = selectedStatuses.filter(s => s !== ORDER_STATUS_NONE_ID)

    if (!StringUtils.hasLength(search) && CollectionUtils.isEmpty(firstCleaned))
      return;
    const finalCleaned = firstCleaned.length === OrderStatusSchema.options.length ? [] : firstCleaned

    proxyLoading(() => {
      getOrders({
        pageRequest: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sortBy: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? "desc" : "asc",
        },
        search: search,
        statuses: finalCleaned
      });
    }, 'get')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2>{t("order_management")}</h2>
          <div className="flex items-center gap-2">
            <OrdersFilterForm mode={'all'}/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommmonDataTable
          searchComponent={<SearchWithDropDown
            menus={{
              items: [{id: ORDER_STATUS_NONE_ID, name: "All"}, ...OrderStatusSchema.options.map(status => ({
                id: status,
                name: status.toLowerCase()
              }))],
              multiple: true,
              enableAllId: ORDER_STATUS_NONE_ID,
              selectedIds: OrderStatusSchema.options
            }}
            search={{}}
            onDebounced={onSearchAndStatusesDebounced}
          />}

          isLoading={status === 'loading' && orders.length === 0}
          totalCount={totalInstances ?? 0}
          objectName={t('Order')}
          columns={cols}
          data={orders}
          pageCount={totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={(updater) => {
            setPagination((old) =>
              typeof updater === "function" ? updater(old) : updater
            );
          }}
          canSelect
          onDeleteRows={(ids) => {
            deleteOrders(ids)
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
