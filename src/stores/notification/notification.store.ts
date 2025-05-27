// import create from "zustand";
//
// export type NotifyStatus = "success" | "error" | "info" | "warn";
//
// export interface Notification {
//     id: string;
//     message: string;
//     status: NotifyStatus;
//     timeout?: number; // in ms, default 1000
// }
//
// interface NotifyStore {
//     notifications: Notification[];
//     publish: (notification: Omit<Notification, "id">) => void;
//     publishSuccess: (msg: string, timeout?: number) => void;
//     publishError: (msg: string, timeout?: number) => void;
//     publishInfo: (msg: string, timeout?: number) => void;
//     publishWarn: (msg: string, timeout?: number) => void;
//     remove: (id: string) => void;
// }
//
//
//
// export const useNotifyStore = create<NotifyStore>((set) => ({
//     notifications: [],
//     publish: ({ message, status, timeout }: {message: string, status: string, timeout: number}) => {
//         const id = crypto.randomUUID();
//         set((state) => ({
//             notifications: [...state.notifications, { id, message, status, timeout }],
//         }));
//         if (timeout === undefined) timeout = 1000;
//         setTimeout(() => set((state) => ({
//             notifications: state.notifications.filter((n) => n.id !== id),
//         })), timeout);
//     },
//     publishSuccess: (message: string, timeout: number = 1) =>
//         useNotifyStore.getState().publish({ message, status: "success", timeout }),
//     publishError: (message: string, timeout: number = 1) =>
//         useNotifyStore.getState().publish({ message, status: "error", timeout }),
//     publishInfo: (message: string, timeout: number = 1) =>
//         useNotifyStore.getState().publish({ message, status: "info", timeout }),
//     publishWarn: (message: string, timeout: number = 1) =>
//         useNotifyStore.getState().publish({ message, status: "warn", timeout }),
//     remove: (id) =>
//         set((state) => ({
//             notifications: state.notifications.filter((n) => n.id !== id),
//         })),
// }));
