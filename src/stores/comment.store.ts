import {
  ApiClient,
  CategoryCreate,
  CategoryList,
  CategoryListSchema,
  CategorySchema,
  CategoryUpdate,
  CommentCreate,
  CommentList,
  CommentListSchema,
  CommentSchema,
  UserComment,
} from "@/api";
import { Category } from "@/api";
import { QueryParams } from "@/api";
import { ApiError } from "@/api/client/base_client";
import { SetState } from "@/lib/set_state";
import { use } from "react";
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
  getComments: (queryParams?: QueryParams) => Promise<void>;
  createComment: (comment: CommentCreate, isReply?: boolean) => Promise<void>;
  deleteComment: (commentId: number, parentId?: number) => Promise<void>;
  getCommentById: (commentId: number) => Promise<void>;
  deleteManyComments: (commentIds: number[]) => Promise<void>;
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
    createComment: (comment) => createComment(set, comment),
  deleteComment: (commentId, parentId) =>
    deleteComment(set, commentId, parentId),
  getCommentById: (commentId) =>
    getCommentById(set, commentId),
  deleteManyComments: (commentIds) =>
    deleteManyComments(set, commentIds),
  resetStatus: () =>
    set((state) => ({
      ...state,
      status: "idle",
      lastAction: null,
      error: null,
    })),
}));

async function getComments(set: SetState<CommentStore>, query?: QueryParams) {

  set(state => ({ error: null, queryParams: {
    ...state.queryParams,
    ...query,
  } }));

  try {
    const response = await commentApiClient.post(
      "/comments/searches",
      CommentListSchema,
      useCommentStore.getState().queryParams
    );

    set({ status: "success", comments: response });
  } catch (error) {
    const apiError = error as ApiError;
    set({ error: apiError.message, status: "error" });
  }
}


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

    set((state) => {

      // current comment
      const commentProduct = state.comments?.data.find(
        (c) => c.product?.id === comment.productId
      );

      // updated comment
      const newComment: UserComment = {
        ...response,
        product: commentProduct?.product ?? null,
        parentCommentId: comment.parentCommentId ?? null,
      }

      // update selected comment and data pagination
      return {
        ...state,
        comments: {
          ...state.comments,
          data: state.comments?.data
            ? [newComment,...state.comments.data].slice(0, state.queryParams?.pageRequest?.size ?? 10)
            : [newComment],
        },
        status: "success",
        selectedComment: state.selectedComment ? {
          ...state.selectedComment,
          replies: state.selectedComment.replies
            ? [...state.selectedComment.replies,newComment]
            : [newComment],
        } : newComment,
      }
    })
      
  } catch (error) {
    const apiError = error as ApiError;
    set({
      error: apiError.message,
      status: "error",
    });
  }
};

const deleteComment = async (
  set: SetState<CommentStore>,
  commentId: number,
  parentId?: number,
) => {
  set({ status: "loading", error: null, lastAction: "delete" });

  try {
    const res = await commentApiClient.delete(`/comments/${commentId}`, z.number());

    if(useCommentStore.getState().comments?.data.length === res) {
      getComments(set, useCommentStore.getState().queryParams);
      return;
    }

    set((state) => {
      const updatedComments = state.comments?.data.filter(c => c.id !== commentId) ?? [];

      const updatedSelectedComment = updateSelectedCommentAfterDelete(
        state.selectedComment,
        commentId,
        parentId
      );

      return {
        ...state,
        comments: {
          ...state.comments,
          data: updatedComments,
          totalInstances: state.comments?.totalInstances
            ? state.comments.totalInstances - 1 : 0,
        },
        selectedComment: updatedSelectedComment,
        status: "success",
      };
    });
  } catch (error) {
    const apiError = error as ApiError;
    set({ error: apiError.message, status: "error" });
  }
};

// Helper function to update selected comment
function updateSelectedCommentAfterDelete(
  selectedComment: UserComment | null,
  deletedId: number,
  parentId?: number
): UserComment | null {
  if (!selectedComment) return selectedComment;

  if (parentId) {
    const updatedReplies = selectedComment.replies?.filter(c => c.id !== deletedId) ?? [];
    return { ...selectedComment, replies: updatedReplies };
  }

  return {
    ...selectedComment,
    content: null,
    deletedAt: new Date().toISOString(),
  };
}

const getCommentById = async (
  set: SetState<CommentStore>,
  commentId: number,
) => {
  set({ error: null });

  try {
    const response = await commentApiClient.get(
      `/comments/${commentId}`,
      CommentSchema
    );

    set({ selectedComment: response, status: "success" });
  } catch (error) {
    const apiError = error as ApiError;
    set({ error: apiError.message, status: "error" });
  }
}

const deleteManyComments = async (
  set: SetState<CommentStore>,
  commentIds: number[],
) => {
  set({ status: "loading", error: null, lastAction: "delete" });

  try {
    await commentApiClient.delete("/comments", z.number(), {
      params: { ids: commentIds.join(",") },
    });

    set((state) => {
      const updatedComments = state.comments?.data.filter(c => !commentIds.includes(c.id)) ?? [];
      return {
        ...state,
        comments: {
          ...state.comments,
          data: updatedComments,
          totalInstances: state.comments?.totalInstances
            ? state.comments.totalInstances - commentIds.length : 0,
        },
        status: "success",
      };
    });
  } catch (error) {
    const apiError = error as ApiError;
    set({ error: apiError.message, status: "error" });
  }
}