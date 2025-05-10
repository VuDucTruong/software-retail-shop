import {
  ApiClient,
  CategoryCreate,
  CategoryList,
  CategoryListSchema,
  CategorySchema,
  CategoryUpdate,
} from "@/api";
import { Category } from "@/api";
import { QueryParams } from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";
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
  getCategories: (queryParams: QueryParams) => Promise<void>;
  getCategoryById: (id: number) => Promise<void>;
  createCategory: (category: CategoryCreate) => Promise<void>;
  updateCategory: (category: CategoryUpdate) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  deleteCategories: (ids: number[]) => Promise<void>;
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

export const useCategoryStore = create<CategoryStore>((set) => ({
  ...initialState,
  getCategories: (queryParams) => getCategories(set, queryParams),
  getCategoryById: (id) => getCategoryById(set, id),
  createCategory: (category) => createCategory(set, category),
  updateCategory: (category) => updateCategory(set, category),
  deleteCategory: (id) => deleteCategory(set, id),
  deleteCategories: (ids) => deleteCategories(set, ids),
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
}));


const currentState = () => useCategoryStore.getState();
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
    set((prev) => ({ categories: response, status: "success" }));
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const getCategoryById = async (set: SetState<CategoryStore>, id: number) => {
  set({ lastAction: null, error: null, status: "loading" });

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
      const newData = [response, ...existing.slice(0, -1)]; // thêm vào đầu, bỏ phần tử cuối

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
  category: CategoryUpdate,
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
        status: "success",
        categories: {
          ...prev.categories,
          data: newData,
        },
      };
    });
    
    
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};

const deleteCategory = async (set: SetState<CategoryStore>, id: number) => {
  set({ error: null, lastAction: "delete", status: "loading" });

  try {
    const resposne = await categoryClient.delete(
      `/categories/${id}`,
      z.number()
    );
    if (resposne > 0) {
      set({ status: "success", lastAction: "delete" });
    } else {
      throw new ApiError("Xóa danh mục thất bại");
    }
    categoryClient.clearCache();
    await getCategories(set, currentState().queryParams);
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
    if (res > 0) {
      set({ status: "success", lastAction: "delete" });
    } else {
      throw new ApiError("Xóa danh mục thất bại");
    }
    categoryClient.clearCache();
    await getCategories(set, currentState().queryParams);
  } catch (error) {
    const appError = error as ApiError;
    set({ error: appError.message, status: "error" });
  }
};
