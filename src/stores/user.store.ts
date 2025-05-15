import { ApiClient, User, UserProfileSchema, UserProfileUpdate, UserSchema } from "@/api";
import { SetState } from "@/lib/set_state";
import { ApiError } from "next/dist/server/api-utils";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

const userClient = ApiClient.getInstance();

type UserState = {
  user: User | null;
  lastAction: "getUser"| "updateProfile" | null;
  error: string | null;
  status: "idle" | "loading" | "error" | "success";
};

type UserActions = {
  getUser: () => Promise<void>;
  updateProfile: (profile: UserProfileUpdate) => Promise<void>;
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
    getUser: () => getProfile(set),
    updateProfile: (profile: UserProfileUpdate) => updateProfile(set, profile),
  }));



const getProfile = async (set: SetState<UserStore>) => {
  set({ lastAction: "getUser" , status: "loading", error: null });

  try {
    const response = await userClient.get("/users", UserSchema);
    const data = UserSchema.parse(response);
    set({ user: data, status: "success" });
  } catch (error) {
    set({ user: null,status: "error", error: (error as ApiError).message });
  }
};

async function updateProfile(
  set: SetState<UserStore>,
  profile: UserProfileUpdate
) {
  set({ lastAction: "updateProfile",status: "loading", error: null });
try {
    const response = await  userClient
    .patch("/users", UserProfileSchema, profile , {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
   
    set((state) => state.user ? ({
      user: {
        ...state.user,
        profile: {
          ...state.user.profile,
          fullName: response.fullName,
          imageUrl: response.imageUrl ?? state.user.profile.imageUrl,
        },
      },
      status: "success",
    }) : { status: "success" });

  } catch (error) {
    set({ user: null,status: "error", error: (error as ApiError).message });
  }

}
