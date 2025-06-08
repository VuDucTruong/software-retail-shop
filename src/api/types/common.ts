import { QueyParamsSchema } from "@/api";
import { SetState } from "@/lib/set_state";
import { z } from "zod";

export type QueryParams = z.infer<typeof QueyParamsSchema>;
export type LastActions = "get" |"create" | "update" | "delete" | null;
export type BaseState = {
    lastAction: LastActions;
    status: "idle" | "loading" | "error" | "success";
    error: string | null;
}
export type BaseAction = {
    proxyLoading: (run: () => void | Promise<void>, lastAction?: LastActions) => void
}
export type DisposeAction = {
    clean(): void,
}
export const defaultAsyncState: BaseState = {
    lastAction: null,
    status: "loading" as const,
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
                    set(state => ({ ...state, status: "success", error: null, lastAction }));
                })
                .catch((e: unknown) => {
                    const err = e as Error;
                    set(state => ({ ...state, status: "error", error: err.message, lastAction }));
                });
        } else {
            set(state => ({ ...state, status: "success", error: null, lastAction }));
        }
    } catch (e: unknown) {
        const err = e as Error;
        set(state => ({ ...state, status: "error", error: err.message, lastAction }));
    }
}

export type Pageable = {
    queryParams: QueryParams,
    totalInstances: number,
    totalPages: number,
    currentPage: number,
}