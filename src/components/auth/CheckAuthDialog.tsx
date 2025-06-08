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

export default function CheckAuthDialog() {
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
          <DialogTitle>Bạn cần đăng nhập để tiếp tục</DialogTitle>
          <DialogDescription>
            Tính năng này chỉ dành cho người dùng đã đăng nhập. Vui lòng đăng nhập để tiếp tục thao tác của bạn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link className="w-full" href={"/login"}><Button className="w-full h-10" >Đăng nhập ngay</Button></Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
