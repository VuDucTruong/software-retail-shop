import { CategoryCreate, CategoryCreateScheme } from "@/api/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { CgAdd } from "react-icons/cg";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Payment } from "@/api/payment";
import { Eye } from "lucide-react";

type TransactionDetailDialogProps = {
    payment: Payment
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
