import { ApiClient, User } from "@/api";
import { create } from "zustand";

const userClient = new ApiClient("/users");

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type UserActions = {

};

type UserStore = UserState & UserActions;

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const useUserStore = create<UserStore>((set) => ({
    ...initialState,
    
  }));
;