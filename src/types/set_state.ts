import { StateCreator } from "zustand";

export type SetState<T> = Parameters<StateCreator<T>>[0]; // lấy kiểu set()