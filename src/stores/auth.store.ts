import { SetState } from "@/lib/set_state";
import { create } from "zustand";
import {
  ApiClient,
  LoginRequest,
  LoginResponseSchema,
  RegisterRequest,
  User,
  UserSchema,
} from "@/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";

const authClient = ApiClient.getInstance();

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type AuthAction = {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
};

type AuthStore = AuthState & AuthAction;

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  login: (request) => login(set, request),
  register: (request) => register(set, request),
  logout: () => logout(set),
  getUser: () => getUser(set),
}));
const login = async (set: SetState<AuthStore>, request: LoginRequest) => {
  set({ loading: true, error: null });

  try {
    const response = await authClient.post("/accounts/login",LoginResponseSchema, request);

    set({ user: response.user, loading: false });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, loading: false });
  }
};

const register = async (set: SetState<AuthStore>, request: RegisterRequest) => {
  set({ loading: true, error: null });

  try {
    await authClient.post("/accounts/register", z.void() ,request);

    set({ loading: false });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, loading: false });
  }
};

const logout = async (set: SetState<AuthStore>) => {
  set({ loading: true, error: null });

  try {
    await authClient.delete("/accounts/logout", z.void());

    set({ user: null, loading: false });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, loading: false });
  }
};

const getUser = async (set: SetState<AuthStore>) => {
  set({ loading: true, error: null });

  try {
    const response = await authClient.get("/users", UserSchema);
    const data = UserSchema.parse(response);

    set({ user: data, loading: false });
  } catch (error) {
    set({ user: null, loading: false });
  }
};


export const checkAuthorization = (router: AppRouterInstance) => useAuthStore.subscribe((state) => {
    console.log("Checking authorization", state);
    if (state.loading) {
      return;
    }
    if (state.user) {
      console.log("User is logged in:", state);
      if(state.user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      }
    } else {
      console.log("User is not logged in", state);
      router.replace("/admin/login");
    }
  });