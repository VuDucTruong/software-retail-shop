// stores/generic-dialog.store.ts
import { Category, UserComment } from "@/api";
import { create } from "zustand";

type DialogState<T> = {
  open: boolean;
  data: T | null;
  openDialog: (data: T) => void;
  closeDialog: () => void;
};

function createDialogStore<T>() {
  return create<DialogState<T>>((set) => ({
    open: false,
    data: null,
    openDialog: (data) => set({ open: true, data }),
    closeDialog: () => set({ open: false, data: null }),
  }));
}


export const useCommentDialogStore = createDialogStore<UserComment>();
export const useCategoryDialogStore = createDialogStore<Category>();
