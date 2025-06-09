import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { z, ZodType } from 'zod';
import { ApiError, ValidationError } from './base_client';

export class ApiClient {
  private static instances: Record<string, ApiClient> = {};
  private instance: AxiosInstance;
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
      console.warn("Method:",config.method,'Request:',(config.baseURL ?? "") + config.url, config.params, {
        data: config.data,
      });	
      return config;
    });

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {

        if(response.status === 200) {
          console.warn("\x1b[32m%s\x1b[0m","Response:",(response.config.baseURL ?? "") + response.config.url,response.status, {
            data: response.data,
          });
          
        } else {
          console.error("Response:",(response.config.baseURL ?? "") + response.config.url,response.status, {
            data: response.data,
          });
        }
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

   public async request<T extends ZodType>(
    config: AxiosRequestConfig,
    schema: T,
  ): Promise<z.infer<T>> {

    try {
      const response = await this.instance(config);
      const parsed = schema.safeParse(response.data);

      if (!parsed.success) {
        throw new ValidationError(parsed.error);
      }

      const result = parsed.data;

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


  public async get<T extends ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig,
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: 'GET', url }, schema);
  }

  public async post<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig,
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