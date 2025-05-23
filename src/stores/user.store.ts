import {
  ApiClient,
  QueryParams,
  User,
  UserCreate,
  UserList,
  UserListSchema,
  UserSchema,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { Role } from "@/lib/constants";
import { SetState } from "@/lib/set_state";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { create } from "zustand";

const apiClient = ApiClient.getInstance();

type UserState = {
  users: UserList | null;
  selectedUser: User | null;
  lastAction: string | null;
  queryParams: QueryParams;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
};

type UserAction = {
  getUsers: (query: QueryParams) => Promise<void>;
  getUserById: (id: number) => Promise<void>;
  deleteUsers: (ids: number[]) => Promise<void>;
  createUser: (user: UserCreate) => Promise<void>;
  resetStatus: () => void;
};

type UserStore = UserState & UserAction;

const initialState: UserState = {
  users: null,
  selectedUser: null,
  lastAction: null,
  queryParams: {
    pageRequest: {
      page: 0,
      size: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
  status: "idle",
  error: null,
};

export const useUserStore = create<UserStore>()((set) => ({
  ...initialState,
  getUsers: (query) => getUsers(set, query),
  getUserById: (id) => getUserById(set, id),
  deleteUsers: (ids) => deleteUsers(set, ids),
  createUser: (user) => createUser(set, user),
  resetStatus: () => set({ status: "idle", lastAction: null, error: null}),
}));

const getUsers = async (set: SetState<UserStore>, query: QueryParams) => {
  set({ status: "loading", lastAction: "getUsers", queryParams: query });

  
  if(window.location.pathname.includes("/staffs")) {
    query = {
      roles: [Role.ADMIN.value, Role.STAFF.value],
      ...query,
      deleted: true,
    };
  } else {
    query = {
      ...query,
      roles: [Role.CUSTOMER.value],
      deleted: true,
    };
  }

  try {
    const response = await apiClient.post(
      "/users/searches",
      UserListSchema,
      query
    );
    set({ users: response, status: "success", error: null });
  } catch (error) {
    set({ status: "error", error: (error as ApiError).message });
  }
};

const getUserById = async (set: SetState<UserStore>, id: number) => {
  set({ status: "loading", lastAction: "getUserById" });
  try {
    const response = await apiClient.get(`/users`, UserSchema, {
      params: {
        id,
      },
    });
    set({ selectedUser: response, status: "success", error: null });
  } catch (error) {
    set({ status: "error", error: (error as ApiError).message });
  }
};

const deleteUsers = async (set: SetState<UserStore>, ids: number[]) => {
  set({ status: "loading", lastAction: "deleteUsers" });
  try {
    await apiClient.delete("/users", z.number(), {
      params: {
        ids: ids.join(","),
      },
    });
    
    set((prev) => {
      const existing = prev.users?.data ?? [];
      const newData = existing.map((user) => {
        if (ids.includes(user.id)) {
          return {
            ...user,
            deletedAt: new Date().toLocaleString(),
          }
        }
        return user;
      })

      return {
        status: "success",
        users: {
          ...prev.users,
          data: newData,
        },
      };
    })

  } catch (error) {
    set({ status: "error", error: (error as ApiError).message });
  }
};

const createUser = async (set: SetState<UserStore>, user: UserCreate) => {
  set({ status: "loading", lastAction: "createUser" });
  try {
    const response = await apiClient.post("/users", z.any(), user , {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    set({status: "success", error: null});
  } catch (error) {
    set({ status: "error", error: (error as ApiError).message });
  }
};
