import { ApiClient, BlogCreate, BlogList, BlogListSchema, BlogSchema, Genre, GenreSchema, QueryParams } from "@/api"
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";


import { create } from "zustand";

const apiClient = ApiClient.getInstance();

type BlogState = {
    blogs: BlogList | null;
    lastAction: "create" | "update" | "delete" | null;
    status: "idle" | "loading" | "error" | "success";
    error: string | null;
    queryParams: QueryParams | null;
    genres: Genre[] | null;
}

type BlogAction = {
    getBlogs: (query: QueryParams) => Promise<void>;
    deleteBlogs: (ids: number[]) => Promise<void>;
    createBlog: (data: BlogCreate) => Promise<void>;
    getGenres: () => Promise<void>;
}

type BlogStore = BlogState & BlogAction;

const initialState: BlogState = {
    blogs: null,
    genres: null,
    lastAction: null,
    status: "idle",
    error: null,
    queryParams: {
    pageRequest: {
      page: 0,
      size: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
}

export const useBlogStore = create<BlogStore>((set) => ({
    ...initialState,
    getBlogs: (query) => getBlogs(set, query),
    deleteBlogs: (ids) => deleteBlogs(set, ids),
    createBlog: (data) => createBlog(set, data),
    getGenres: () => getGenres(set),
}));

const getBlogs = async (set: SetState<BlogStore>, query: QueryParams) => {
    set({status: "loading", lastAction: null,queryParams: query});
    try {
        const response = await apiClient.post("/blogs/searches",BlogListSchema , query);
        set({ blogs: response, status: "success" });
    } catch (error) {
        set({ status: "error", error: (error as ApiError).message, lastAction: null });
    }
}

const deleteBlogs = async (set: SetState<BlogStore>, ids: number[]) => {
    set({ status: "loading", lastAction: "delete" });
    try {
        const response = await apiClient.delete("/blogs", z.number() , {
            params: {
                ids: ids.join(","),
            }
        });

        if(response < 1) {
            throw new Error("No blogs deleted");
        }
        
        set(state => ({
            ...state,
            status: "success",
            blogs: state.blogs
                ? {
                    ...state.blogs,
                    data: (state.blogs.data ?? []).filter((blog) => !ids.includes(blog.id)),
                  }
                : null,
        }))

    } catch (error) {
        set({ status: "error", error: (error as ApiError).message });
    }
}

const createBlog = async (set: SetState<BlogStore>, data: BlogCreate) => {
    set({ status: "loading", lastAction: "create" });
    try {
        const response = await apiClient.post("/blogs", BlogSchema, data , {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        set({ status: "success" });
    } catch (error) {
        set({ status: "error", error: (error as ApiError).message });
    }
}

const getGenres = async (set: SetState<BlogStore>) => {
    set({ status: "loading", lastAction: null });
    try {
        const response = await apiClient.get("/genres", z.array(GenreSchema));
        set({ genres: response, status: "success" });
    } catch (error) {
        set({ status: "error", error: (error as ApiError).message });
    }
}