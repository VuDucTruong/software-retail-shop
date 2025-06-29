import {
  ApiClient,
  LoginRequest,
  LoginResponseSchema,
  RegisterRequest,
  User,
  UserProfileSchema,
  UserProfileUpdate,
  UserSchema,
} from "@/api";
import { Role } from "@/lib/constants";
import { SetState } from "@/lib/set_state";
import { getRoleWeight } from "@/lib/utils";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const authClient = ApiClient.getInstance();

type AuthState = {
  user: User | null;
  lastAction:
    | "login"
    | "register"
    | "logout"
    | "changePassword"
    | "getMe"
    | "sendOTP"
    | "updateProfile"
    | "verifyEmail"
    | null;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
  isAuthenticated: boolean;
};

type AuthAction = {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (request: {
    email: string;
    otp?: string;
    password: string;
  }) => Promise<void>;
  getMe: (isAdmin?: boolean) => Promise<void>;
  setUser: (user: User) => void;
  sendOTP: (email: string) => Promise<void>;
  resetStatus: () => void;
  updateProfile: (profile: UserProfileUpdate) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
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
      getMe: (isAdmin) => getMe(set, isAdmin),
      setUser: (user) => set({ user }),
      changePassword: (request) => changePassword(set, request),
      sendOTP: (email) => sendOTP(set, email),
      updateProfile: (profile: UserProfileUpdate) =>
        updateProfile(set, profile),
      verifyEmail: (email, otp) => verifyEmail(set, email, otp),
    }),
    {
      name: "auth-storage", // tên key trong localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // chỉ lưu những field cần thiết
    }
  )
);

const reloadAdminPage = (user: User | null) => {
  if (window.location.pathname.includes("/admin")) {
    if(user !== null && getRoleWeight(user.role) < Role.STAFF.weight) {
      throw new ApiError(401, "User does not have permission to access admin page");
    } else {
      window.location.reload();
    }
    
  }
};

const login = async (set: SetState<AuthStore>, request: LoginRequest) => {
  set({ lastAction: "login", status: "loading", error: null });

  try {
    const response = await authClient.post(
      "/accounts/login",
      LoginResponseSchema,
      request
    );

    set({ user: response.user, status: "success", isAuthenticated: true });

    reloadAdminPage(response.user);
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
    };

    await authClient.post("/accounts/register", z.any(), data);

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

    reloadAdminPage(null);
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const changePassword = async (
  set: SetState<AuthStore>,
  request: { email: string; otp?:string; password: string }
) => {
  set({ lastAction: "changePassword", status: "loading", error: null });

  try {
    await authClient.put("/accounts/password", z.any(), request);

    set({ status: "success", isAuthenticated: false });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getMe = async (set: SetState<AuthStore>, isAdmin?: boolean) => {
  set({ lastAction: "getMe", status: "loading", error: null });

  try {
    const response = await authClient.get("/users", UserSchema);

    if (isAdmin) {
      if (getRoleWeight(response.role) < Role.STAFF.weight) {
        throw new ApiError(401, "Unauthorized");
      }
    }

    if (useAuthStore.getState().isAuthenticated === false) {
      set({ user: response, status: "success", isAuthenticated: true });
    } else {
      set({ user: response, status: "success" });
    }
  } catch (error) {
    set({ user: null, status: "error", error: (error as ApiError).message });
  }
};

const sendOTP = async (set: SetState<AuthStore>, email: string) => {
  set({ lastAction: "sendOTP", status: "loading", error: null });

  try {
    await authClient.post("/accounts/otp", z.any(), { email });

    set({ status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

async function updateProfile(
  set: SetState<AuthStore>,
  profile: UserProfileUpdate
) {
  set({ lastAction: "updateProfile", status: "loading", error: null });
  try {
    const response = await authClient.patch(
      "/users",
      UserProfileSchema,
      profile,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    set((state) =>
      state.user
        ? {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                fullName: response.fullName,
                imageUrl: response.imageUrl ?? state.user.profile.imageUrl,
              },
            },
            status: "success",
          }
        : { status: "success" }
    );
  } catch (error) {
    set({ user: null, status: "error", error: (error as ApiError).message });
  }
}

const verifyEmail = async (
  set: SetState<AuthStore>,
  email: string,

  otp: string
) => {
  set({ lastAction: "verifyEmail", status: "loading", error: null });

  try {
    await authClient.put("/accounts/verification", z.any(), { email, otp });

    set({ status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
