import {
  ApiClient,
  Category,
  CategoryCreate,
  CategoryList,
  CategoryListSchema,
  CategorySchema,
  CategoryUpdate,
  QueryParams,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";
import { create } from "zustand";
import { handleDeleteReloadGeneric } from "./reload.store";
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
  getCategoryById: (id: number) => Promise<void>;
  createCategory: (category: CategoryCreate) => Promise<void>;
  updateCategory: (category: CategoryUpdate) => Promise<void>;
  deleteCategories: (ids: number[]) => Promise<void>;
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

export const useCategoryStore = create<CategoryStore>((set) => ({
  ...initialState,
  getCategories: (queryParams) => getCategories(set, queryParams),
  getCategoryById: (id) => getCategoryById(set, id),
  createCategory: (category) => createCategory(set, category),
  updateCategory: (category) => updateCategory(set, category),
  deleteCategories: (ids) => deleteCategories(set, ids),

}));


const getCategories = async (
  set: SetState<CategoryStore>,
  query: QueryParams
) => {
  set(state => ({ error: null, queryParams: {
    ...state.queryParams,
    ...query
  } , categories: null }));

  try {
    const response = await categoryClient.post(
      "/categories/searches",
      CategoryListSchema,
      query
    );

    set((prev) => ({...prev, categories: response, status: "success" }));
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getCategoryById = async (set: SetState<CategoryStore>, id: number) => {
  set({ error: null });

  try {
    const response = await categoryClient.get(
      `/categories/${id}`,
      CategorySchema
    );
    set({ selectedCategory: response, status: "success" });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const createCategory = async (
  set: SetState<CategoryStore>,
  category: CategoryCreate
) => {
  set({ lastAction: "create", error: null, status: "loading" });

  try {
    const response = await categoryClient.post(
      "/categories",
      CategorySchema,
      category,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    set((prev) => {
      const existing = prev.categories?.data ?? [];
      let newData = [...existing];
      if (existing.length === prev.queryParams?.pageRequest?.size) {
        newData.pop();
      }
      newData = [response, ...newData];

      return {
        selectedCategory: response,
        status: "success",
        categories: {
          ...prev.categories,
          data: newData,
          totalInstances: (prev.categories?.totalInstances || 0) + 1,
        },
      };
    });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const updateCategory = async (
  set: SetState<CategoryStore>,
  category: CategoryUpdate
) => {
  set({ error: null, lastAction: "update", status: "loading" });

  try {
    const response = await categoryClient.put(
      `/categories`,
      CategorySchema,
      category,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    set((prev) => {
      const existing = prev.categories?.data ?? [];
      const newData = existing.map((item) =>
        item.id === response.id ? response : item
      );

      return {
        selectedCategory: response,
        categories: {
          ...prev.categories,
          data: newData,
        },
        status: "success",
      };
    });
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};



const deleteCategories = async (
  set: SetState<CategoryStore>,
  ids: number[]
) => {
  set({ lastAction: "delete", status: "loading", error: null });

  try {
    
    const res = await categoryClient.delete(`/categories`, z.number(), {
      params: { ids: ids.join(",") },
    });
    if (res < 0) {
      throw new ApiError("Xóa danh mục thất bại");
    } else {
      handleDeleteReloadGeneric(set , ids , "categories" , useCategoryStore.getState , getCategories)
    }
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
