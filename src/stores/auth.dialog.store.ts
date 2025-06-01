import { create } from "zustand";


type AuthDialogState<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useAuthDialogStore = create<AuthDialogState<any>>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
}));

