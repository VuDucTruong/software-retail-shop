import { create } from "zustand";


type AuthDialogState = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useAuthDialogStore = create<AuthDialogState>((set) => ({
  open: false,
  onOpenChange: (open) => set({ open }),
}));

