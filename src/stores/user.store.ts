import { ApiClient, User, UserProfileUpdate, UserSchema } from "@/api";
import { SetState } from "@/lib/set_state";
import { ApiError } from "next/dist/server/api-utils";
import { create } from "zustand";

const userClient = ApiClient.getInstance();

type UserState = {
  user: User | null;
  lastAction: "getProfile"| "updateProfile" | null;
  error: string | null;
  status: "idle" | "loading" | "error" | "success";
};

type UserActions = {
  getProfile: () => Promise<void>;
};

type UserStore = UserState & UserActions;

const initialState: UserState = {
  user: null,
  lastAction: null,
  error: null,
  status: "idle",
};

export const useUserStore = create<UserStore>((set) => ({
    ...initialState,
    getProfile: () => getProfile(set),
    updateProfile: (profile: UserProfileUpdate) => updateProfile(set, profile),
  }));



const getProfile = async (set: SetState<UserStore>) => {
  set({ lastAction: "getProfile" , status: "loading", error: null });

  try {
    const response = await userClient.get("/users", UserSchema);
    const data = UserSchema.parse(response);
    set({ user: data, status: "success" });
  } catch (error) {
    set({ user: null,status: "error", error: (error as ApiError).message });
  }
};

function updateProfile(
  set: SetState<UserStore>,
  profile: UserProfileUpdate
) {
  set({ lastAction: "updateProfile",status: "loading", error: null });

  userClient
    .put("/users", UserSchema, profile)
    .then((response) => {
      const data = UserSchema.parse(response);
      set({ user: data, status: "success" });
    })
    .catch((error) => {
      set({ status: "error", error: (error as ApiError).message });
    });
}
