import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { z, ZodType } from 'zod';
import { ApiError, ValidationError } from './base_client';
type CacheEntry = {
  data: any;
  timestamp: number;
};
export class ApiClient {
  private static instances: Record<string, ApiClient> = {};
  private instance: AxiosInstance;
 private cache = new Map<string, CacheEntry>();
  private constructor(basePath: string = '') {
    this.instance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}${basePath}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.initInterceptors();
  }

  // Singleton pattern implementation
  public static getInstance(basePath: string = ''): ApiClient {
    if (!ApiClient.instances[basePath]) {
      ApiClient.instances[basePath] = new ApiClient(basePath);
    }
    return ApiClient.instances[basePath];
  }

  private initInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use((config) => {
      console.warn('Request:', {
        url: (config.baseURL ?? "") + config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      });	
      return config;
    });

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.warn('Response:', {
          url: (response.config.baseURL ?? "") + response.config.url,
          method: response.config.method,
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (axios.isAxiosError(error)) {
          // Handle network errors
          if (error.code === 'ERR_NETWORK') {
            return Promise.reject(new ApiError('Network error', 0));
          }

          // Handle timeout errors
          if (error.code === 'ECONNABORTED') {
            return Promise.reject(new ApiError('Request timeout', 0));
          }

          // Handle HTTP errors
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message || 'Unknown error';

          return Promise.reject(new ApiError(message, status));
        }

        return Promise.reject(new ApiError('Unknown error occurred'));
      }
    );
  }

   private generateCacheKey(config: AxiosRequestConfig): string {
    const { url, method, params, data } = config;
    return JSON.stringify({ url, method, params, data });
  }

   public async request<T extends ZodType>(
    config: AxiosRequestConfig,
    schema: T,
    options?: { useCache?: boolean; cacheTTL?: number }
  ): Promise<z.infer<T>> {
    
    const useCache = options?.useCache !== false; // default false
    const cacheTTL = options?.cacheTTL ?? 5 * 60 * 1000; // default 5 minutes

    const cacheKey = this.generateCacheKey(config);

    if (useCache && this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      const isExpired = Date.now() - entry.timestamp > cacheTTL;

      if (!isExpired) {
        return entry.data;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    try {
      const response = await this.instance(config);
      const parsed = schema.safeParse(response.data);

      if (!parsed.success) {
        throw new ValidationError(parsed.error);
      }

      const result = parsed.data;

      if (useCache) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error("Validation errors:", error.zodError);
        throw error;
      }
      if (error instanceof ApiError) {
        console.error("API error:", error.message);
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new ApiError('An unexpected error occurred');
    }
  }

  public clearCache() {
    this.cache.clear();
  }

  public async get<T extends ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'GET', url }, schema);
  }


  public async getPaginated<T extends ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'GET', url }, schema);
  }

  public async post<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'POST', url, data }, schema);
  }

  public async put<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'PUT', url, data }, schema);
  }

  public async delete<T extends ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'DELETE', url }, schema);
  }

  public async patch<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'PATCH', url, data }, schema);
  }
}