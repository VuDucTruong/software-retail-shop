import {z} from "zod";
import {QueyParamsSchema} from "@/api";
import type {StateCreator} from "zustand/vanilla";
import {SetState} from "@/lib/set_state";
import {ApiError} from "@/api/client/base_client";

export type QueryParams = z.infer<typeof QueyParamsSchema>;
export type LastActions = "create" | "update" | "delete" | null;
export type BaseState = {
    lastAction: LastActions;
    status: "idle" | "loading" | "error" | "success";
    error: string | null;
}
export type BaseAction = {
    proxyLoading: (run: () => void | Promise<void>, lastAction?: LastActions) => void
}
export const defaultAsyncState = {
    lastAction: null,
    status: "idle" as const,
    error: null,
}

export function setLoadAndDo<T extends BaseState>(
    set: SetState<T>,
    run: () => void | Promise<void>,
    lastAction: LastActions = null
) {
    try {
        set(state => ({ ...state, status: "loading", lastAction }));

        const result = run();

        if (result instanceof Promise) {
            result
                .then(() => {
                    set(state => ({ ...state, status: "success", error: null }));
                })
                .catch((e: unknown) => {
                    const err = e as Error;
                    set(state => ({ ...state, status: "error", error: err.message, lastAction: null }));
                });
        } else {
            set(state => ({ ...state, status: "success", error: null }));
        }
    } catch (e: unknown) {
        const err = e as Error;
        set(state => ({ ...state, status: "error", error: err.message, lastAction: null }));
    }
}

export type Pageable = {
    queryParams: QueryParams,
    totalInstances: number,
    totalPages: number,
}