import {Payment, PaymentDomain} from "@/api";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

type TransactionDetailDialogProps = {
    payment: PaymentDomain
}

export default function TransactionDetailDialog({payment}: TransactionDetailDialogProps) {

  const t = useTranslations();


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary text-white">
          <Eye/> {t("Detail")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle asChild className="text-2xl"><h2>{t("create_category")}</h2></DialogTitle>
        </DialogHeader>
        <div>
          {payment.id}
        </div>
      </DialogContent>
    </Dialog>
  );
}
