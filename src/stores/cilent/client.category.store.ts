import {
  ApiClient,
  Category,
  CategoryList,
  CategoryListSchema,
  QueryParams
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { create } from "zustand";
const categoryClient = ApiClient.getInstance();

type CategoryState = {
  categories: CategoryList | null;
  selectedCategory: Category | null;

  error: string | null;
  lastAction: "create" | "update" | "delete" | null;
  status: "idle" | "loading" | "success" | "error";

  queryParams: QueryParams;
};

type CategoryAction = {
  getCategories: (queryParams?: QueryParams) => Promise<void>;
  resetStatus: () => void;
};

type CategoryStore = CategoryState & CategoryAction;

const initialState: CategoryState = {
  categories: null,
  selectedCategory: null,

  error: null,
  lastAction: null,
  status: "idle",

  queryParams: {
    pageRequest: {
      page: 0,
      size: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const useClientCategoryState = create<CategoryStore>((set) => ({
  ...initialState,
  getCategories: (queryParams) => getCategories(set, queryParams),
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
}));

const getCategories = async (
  set: SetState<CategoryStore>,
  queryParams: QueryParams
) => {
  set({ lastAction: null, error: null, queryParams, status: "loading" });

  try {
    const response = await categoryClient.post(
      "/categories/searches",
      CategoryListSchema,
      queryParams
    );
    set((prev) => ({...prev ,categories: response, status: "success" }));
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};




