// lib/apiClient.ts
import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios';

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance(config);
    return response.data as T;
  } catch (error: any) {
    // Optionally handle common error format here
    throw error?.response?.data || error;
  }
}
