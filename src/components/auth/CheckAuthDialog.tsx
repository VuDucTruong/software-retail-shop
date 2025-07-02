"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useAuthDialogStore } from "@/stores/auth.dialog.store";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function CheckAuthDialog() {
  const t = useTranslations();
  const onOpenChange = useAuthDialogStore((state) => state.onOpenChange);
  const open = useAuthDialogStore((state) => state.open);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="max-w-1/3">
        <DialogHeader>
          <DialogTitle>{t('you_need_to_login')}</DialogTitle>
          <DialogDescription>
            {t('you_need_to_login_description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link className="w-full" href={"/login"}><Button className="w-full h-10" >{t('login_now')}</Button></Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
