import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils"
import {Ban, CheckCircle2, Clock, Loader2, PackageCheck, PackageX, Rss, XCircle} from "lucide-react"
import {useTranslations} from "next-intl"
import {OrderStatus, PaymentStatus} from "@/api";
import {LuMailWarning} from "react-icons/lu";

export function convertStatus(os: OrderStatus) {
  switch (os) {
    case 'PENDING':
      return 'pending'
    case "FAILED":
      return 'canceled'
    case "COMPLETED":
      return "completed";
    case 'FAILED_MAIL':
      return 'failed_mail'
    case 'RETRY_1':
      return 'canceled'
    case 'PROCESSING':
      return 'processing';
  }
}
export function convertPaymentStatus(ps?:PaymentStatus | null): Status{
  switch (ps){
    case 'PENDING':
    case null:
    case undefined:
      return 'pending'
    case 'FAILED':
      return 'canceled'
    case 'SUCCESS':
      return 'completed';
    default:
      return 'pending'
  }
}


type Status = "pending" | "processing" | "completed" | "canceled" | "in_stock" | "out_stock"	| "active" | "banned" | "used" | "unused" | "failed_mail"

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {

  const t = useTranslations()
  const statusConfig = {
    pending: {
      icon: <Clock className="h-3 w-3 mr-1" />,
      label: "ORDER_STATUS.Pending",
      styles: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-100",
    },
    processing: {
      icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
      label: "ORDER_STATUS.Processing",
      styles: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-100",
    },
    completed: {
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
      label: "ORDER_STATUS.Completed",
      styles: "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-100",
    },
    canceled: {
      icon: <XCircle className="h-3 w-3 mr-1" />,
      label: "ORDER_STATUS.Canceled",
      styles: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-100",
    },
    in_stock: {
      icon: <PackageCheck className="h-3 w-3 mr-1" />,
      label: "in_stock",
      styles:  "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-100",
    },
    out_stock: {
      icon: <PackageX className="h-3 w-3 mr-1" />,
      label: "out_of_stock",
      styles: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-100",
    },
    active: {
      icon: <Rss className="h-3 w-3 mr-1" />,
      label: "Active",
      styles: "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-100",
    },
    banned: {
      icon: <Ban className="h-3 w-3 mr-1" />,
      label: "Banned",
      styles: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-100",
    },
    used: {
      icon: <Clock className="h-3 w-3 mr-1" />,
      label: "Used",
      styles: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-100",
    },
    unused: {
      icon: <Rss className="h-3 w-3 mr-1" />,
      label: "Unused",
      styles: "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-100",
    },
    failed_mail: {
      icon: <LuMailWarning className="h-3 w-3 mr-1" />,
      label: "failed_mail",
      styles: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-100",
    },
  }

  const { icon, label, styles } = statusConfig[status]

  return (
    <Badge className={cn(
      "inline-flex items-center",
      styles,
      className
    )}>
      {icon}
      {t(label)}
    </Badge>
  )
}