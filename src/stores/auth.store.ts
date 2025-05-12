import { SetState } from "@/lib/set_state";
import { create } from "zustand";
import {
  ApiClient,
  ChangePassword,
  LoginRequest,
  LoginResponseSchema,
  RegisterRequest,
  User,
  UserSchema,
} from "@/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import { request } from "http";

const authClient = ApiClient.getInstance();

type AuthState = {
  user: User | null;
  lastAction: "login" | "register" | "logout" | "changePassword" |null;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
};

type AuthAction = {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (request: {email: string , password: string}) => Promise<void>;
  resetStatus: () => void;
};

type AuthStore = AuthState & AuthAction;

const initialState: AuthState = {
  user: null,
  lastAction: null,
  status: "idle",
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  login: (request) => login(set, request),
  register: (request) => register(set, request),
  logout: () => logout(set),
  resetStatus: () => set({ status: "idle", lastAction: null, error: null }),
  changePassword: (request) => changePassword(set, request),
}));
const login = async (set: SetState<AuthStore>, request: LoginRequest) => {
  set({ lastAction: "login", error: null });

  try {
    const response = await authClient.post("/accounts/login",LoginResponseSchema, request);

    set({ user: response.user, status: "success"});
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const register = async (set: SetState<AuthStore>, request: RegisterRequest) => {
  set({ lastAction: "register", status: "loading", error: null });

  try {
    await authClient.post("/accounts/register", z.void() ,request);

    set({ status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const logout = async (set: SetState<AuthStore>) => {
  set({ lastAction: "logout", status: "loading", error: null });

  try {
    await authClient.delete("/accounts/logout", z.void());

    set({ user: null, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const changePassword = async (set: SetState<AuthStore>, request : {email: string , password: string}) => {
  set({ lastAction: "changePassword", status: "loading", error: null});

  try {
    await authClient.put("/accounts/password", z.void(), request);

    set({ status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};


export const checkAuthorization = (router: AppRouterInstance) => useAuthStore.subscribe((state) => {
    console.log("Checking authorization", state);
    if (state.status === "loading") {
      return;
    }
    if (state.user) {
      console.log("User is logged in:", state);
      if(state.user.role === "ADMIN") {
        console.log("User is admin");
        router.replace("/admin/dashboard");
      }
    } else {
      console.log("User is not logged in", state);
      router.replace("/admin/login");
    }
  });