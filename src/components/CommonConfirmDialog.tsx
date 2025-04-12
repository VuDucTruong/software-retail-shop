import React from "react";
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

type CommonConfirmDialogProps = {
    triggerName: string;
    title: string;
    description: string;
    onConfirm: () => void; 
    onCancel: () => void;
}

export default function CommonConfirmDialog(props: CommonConfirmDialogProps) {
  const {triggerName, title, description, onConfirm, onCancel } = props;
  const t = useTranslations();

    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onCancel();
    };

  return (
    <AlertDialog>
      <AlertDialogTrigger>{triggerName}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{t('Confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
