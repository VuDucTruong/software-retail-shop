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

const authClient = new ApiClient();

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
    const response = await authClient.post("/accounts/login", request);
    const data = LoginResponseSchema.parse(response);

    set({ user: data.user, loading: false });
  } catch (error) {
    console.error(error);
    set({ error: error as string, loading: false });
  }
};

const register = async (set: SetState<AuthStore>, request: RegisterRequest) => {
  set({ loading: true, error: null });

  try {
    const response = await authClient.post("/accounts/register", request);

    set({ loading: false });
  } catch (error) {
    console.error(error);
    set({ error: error as string, loading: false });
  }
};

const logout = async (set: SetState<AuthStore>) => {
  set({ loading: true, error: null });

  try {
    await authClient.delete("/accounts/logout");

    set({ user: null, loading: false });
  } catch (error) {
    console.error(error);
    set({ error: error as string, loading: false });
  }
};

const getUser = async (set: SetState<AuthStore>) => {
  set({ loading: true, error: null });

  try {
    const response = await authClient.get("/users");
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