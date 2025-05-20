import { SetState } from "@/lib/set_state";
import { create } from "zustand";
import {persist} from "zustand/middleware";
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
import { Role } from "@/lib/constants";
import { getRoleWeight } from "@/lib/utils";

const authClient = ApiClient.getInstance();

type AuthState = {
  user: User | null;
  lastAction: "login" | "register" | "logout" | "changePassword" | "getMe" | "sendOTP" |null;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
  isAuthenticated: boolean;
};

type AuthAction = {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (request: {email: string , password: string}) => Promise<void>;
  getMe: (isAdmin?: boolean) => Promise<void>;
  setUser: (user: User) => void;
  sendOTP: (email: string) => Promise<void>;
  resetStatus: () => void;
};

type AuthStore = AuthState & AuthAction;

const initialState: AuthState = {
  user: null,
  lastAction: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
};


export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      login: (request) => login(set, request),
      register: (request) => register(set, request),
      logout: () => logout(set),
      resetStatus: () => set({ status: "idle", lastAction: null, error: null }),
      getMe: (isAdmin) => getMe(set,isAdmin),
      setUser: (user) => set({ user }),
      changePassword: (request) => changePassword(set, request),
      sendOTP: (email) => sendOTP(set, email),
    }),
    {
      name: 'auth-storage', // tên key trong localStorage
      partialize: (state) => ({
        user: state.user,
      }), // chỉ lưu những field cần thiết
    }
  )
);
const login = async (set: SetState<AuthStore>, request: LoginRequest) => {
  set({ lastAction: "login", error: null });

  try {
    const response = await authClient.post("/accounts/login",LoginResponseSchema, request);

    set({ user: response.user, status: "success",isAuthenticated: true });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const register = async (set: SetState<AuthStore>, request: RegisterRequest) => {
  set({ lastAction: "register", status: "loading", error: null });

  try {

    const data = {
      email: request.email,
      password: request.password,
      fullName: request.fullName,
    }

    await authClient.post("/accounts/register", z.any() ,data);

    set({ status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const logout = async (set: SetState<AuthStore>) => {
  set({ lastAction: "logout", status: "loading", error: null });

  try {
    await authClient.delete("/accounts/logout", z.any());

    set({ user: null, status: "success", isAuthenticated: false });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const changePassword = async (set: SetState<AuthStore>, request : {email: string , password: string}) => {
  set({ lastAction: "changePassword", status: "loading", error: null});

  try {
    await authClient.put("/accounts/password", z.void(), request);

    set({ status: "success" , isAuthenticated: false });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getMe = async (set: SetState<AuthStore> , isAdmin?: boolean) => {
  set({ lastAction: "getMe" , status: "loading", error: null });
  
    try {
      const response = await authClient.get("/users", UserSchema);

      if (isAdmin) {
        if (getRoleWeight(response.role) < Role.STAFF.weight) {
          throw new ApiError(401,"Unauthorized");
        }
      }

      set({ user: response, status: "success" , isAuthenticated: true });
    } catch (error) {
      set({ user: null,status: "error", error: (error as ApiError).message });
    }
}


const sendOTP = async (set: SetState<AuthStore>, email: string) => {
  set({ lastAction: "sendOTP", status: "loading", error: null });

  try {
    await authClient.post("/accounts/otp", z.number() , { email });

    set({ status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};