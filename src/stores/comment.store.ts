import {
  ApiClient,
  CategoryCreate,
  CategoryList,
  CategoryListSchema,
  CategorySchema,
  CategoryUpdate,
  CommentList,
  CommentListSchema,
  UserComment,
} from "@/api";
import { Category } from "@/api";
import { QueryParams } from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { z } from "zod";
import { create } from "zustand";
const commentApiClient = ApiClient.getInstance();

type CommentState = {
  comments: CommentList | null;
  selectedComment: UserComment | null;

  error: string | null;
  lastAction: "create" | "update" | "delete" | null;
  status: "idle" | "loading" | "success" | "error";

  queryParams: QueryParams;
};

type CommentAction = {
  getComments: (queryParams: QueryParams) => Promise<void>;
  resetStatus: () => void;
};

type CommentStore = CommentAction & CommentState;

const initialState: CommentState = {
  comments: null,
  selectedComment: null,

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

export const useCommentStore = create<CommentStore>((set) => ({
  ...initialState,
 getComments: (query) => getComments(set, query),
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
}));


async function getComments(set: SetState<CommentStore>, query: QueryParams) {
  set({status: "loading", error: null});

  try {
    const response = await commentApiClient.post("/comments/searches", CommentListSchema , query);

    set({status: "success", comments: response});
  } catch (error) {
    const apiError = error as ApiError;
    set({error: apiError.message, status: "error"});
  }
}