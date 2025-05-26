import {
  ApiClient,
  CommentCreate,
  CommentList,
  CommentListSchema,
  CommentSchema,
  QueryParams,
  UserComment,
} from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { sortBy } from "lodash";
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
  getCommentsByProductId: (productId: number) => Promise<void>;
  createComment: (comment: CommentCreate, isReply?: boolean) => Promise<void>;
  deleteMyComment: (commentId: number, parentId?: number) => Promise<void>;
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

export const useClientCommentStore = create<CommentStore>((set) => ({
  ...initialState,
  getCommentsByProductId: (productId) => getCommentsByProductId(set, productId),
  createComment: (comment) => createComment(set, comment),
  deleteMyComment: (commentId, parentId) =>
    deleteMyComment(set, commentId, parentId),
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
}));

export const getCommentsByProductId = async (
  set: SetState<CommentStore>,
  productId: number
) => {
  set({ status: "loading", error: null, comments: null });

  try {
    const response = await commentApiClient.get(
      "/comments",
      CommentListSchema,
      {
        params: {
          productId,
          page: 0,
          size: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      }
    );

    set({
      comments: response,
      status: "success",
    });
  } catch (error) {
    const apiError = error as ApiError;
    set({
      error: apiError.message,
      status: "error",
    });
  }
};

const createComment = async (
  set: SetState<CommentStore>,
  comment: CommentCreate,
) => {
  set({ status: "loading", error: null, lastAction: "create" });

  try {
    const response = await commentApiClient.post(
      "/comments",
      CommentSchema,
      comment
    );

    if (comment.parentCommentId) {
      set((state) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            data: (state.comments?.data ?? []).map((c) => {
              if (c.id === comment.parentCommentId) {
                return {
                  ...c,
                  replies: [...(c.replies ?? []), response],
                };
              }
              return c;
            }),
          },
          status: "success",
        };
      });
    } else {
      set((state) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            data: [response, ...(state.comments?.data ?? [])],
          },
          status: "success",
        };
      });
    }
  } catch (error) {
    const apiError = error as ApiError;
    set({
      error: apiError.message,
      status: "error",
    });
  }
};

const deleteMyComment = async (
  set: SetState<CommentStore>,
  commentId: number,
  parentId?: number,
) => {
  set({ status: "loading", error: null, lastAction: "delete" });

  try {
    await commentApiClient.delete(`/comments`, z.number() , {
      params: {
        ids: [commentId].join(","),
      },
    });

    if (parentId) {
      set((state) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            data: (state.comments?.data ?? []).map((c) => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: c.replies?.filter((r) => r.id !== commentId),
                };
              }
              return c;
            }),
          },
          status: "success",
        };
      });
    } else {
      set((state) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            data:
              state.comments?.data.filter(
                (comment) => comment.id !== commentId
              ) ?? [],
          },
          status: "success",
        };
      });
    }
  } catch (error) {
    const apiError = error as ApiError;
    set({
      error: apiError.message,
      status: "error",
    });
  }
};
