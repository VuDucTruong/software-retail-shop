import { StateCreator } from "zustand";

export type SetState<T> = Parameters<StateCreator<T>>[0]; // lấy kiểu set()
export type GetState<T> = Parameters<StateCreator<T>>[1]; // lấy kiểu get()
