import React, { ReactElement, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type CommonConfirmDialogProps = {
  triggerName: string | ReactElement;
  title: string;
  description: string | ReactElement;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function CommonConfirmDialog(props: CommonConfirmDialogProps) {
  const { triggerName, title, description, onConfirm, onCancel } = props;
  const t = useTranslations();

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {typeof triggerName === "string" ? (
          <Button
            variant="ghost"
            className="w-full font-normal flex justify-start px-2"
          >
            {triggerName}
          </Button>
        ) : (
          triggerName
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {t("Confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
