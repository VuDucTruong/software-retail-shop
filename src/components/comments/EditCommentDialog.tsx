
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

import { Eye, Pen } from "lucide-react";

type EditCommentDialogProps = {
}

export default function EditCommentDialog() {

  const t = useTranslations();


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:text-yellow-500 hover:border-yellow-500">
          <Pen/>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle asChild className="text-2xl"><h2>{t("create_category")}</h2></DialogTitle>
        </DialogHeader>
        <div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
