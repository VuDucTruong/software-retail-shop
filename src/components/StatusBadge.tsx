import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

type Status = "pending" | "processing" | "completed" | "canceled"

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