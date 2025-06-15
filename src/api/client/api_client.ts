import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { z, ZodType } from "zod";
import { ApiError, ValidationError } from "./base_client";
import * as Sentry from "@sentry/nextjs";

export class ApiClient {
  private static instances: Record<string, ApiClient> = {};
  private instance: AxiosInstance;

  private constructor(basePath: string = "") {
    this.instance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}${basePath}`,
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.initInterceptors();
  }

  public static getInstance(basePath: string = ""): ApiClient {
    if (!ApiClient.instances[basePath]) {
      ApiClient.instances[basePath] = new ApiClient(basePath);
    }
    return ApiClient.instances[basePath];
  }

  private initInterceptors() {
    this.instance.interceptors.request.use((config) => {
      console.warn(
        "➡️ Request:",
        config.method?.toUpperCase(),
        (config.baseURL ?? "") + config.url,
        {
          params: config.params,
          data: config.data,
        }
      );
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => {
        const fullUrl = (response.config.baseURL ?? "") + response.config.url;
        console.warn("\x1b[32m%s\x1b[0m","✅ Response:", response.status, fullUrl, response.data);
        return response;
      },
      (error) => {
        const appError = this.handleAxiosError(error);

        if ((appError.status ?? 0) >= 500) {
          this.reportToSentry(error);
        }

        return Promise.reject(appError);
      }
    );
  }

  private handleAxiosError(error: unknown): ApiError {
    if (!axios.isAxiosError(error)) {
      return new ApiError("Unknown error", 500);
    }

    if (error.code === "ERR_NETWORK") {
      return new ApiError("Network error", 1000);
    }

    if (error.code === "ECONNABORTED") {
      return new ApiError("Request timeout", 999);
    }

    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message || error.message || "Unknown error";

    return new ApiError(message, status);
  }

  private reportToSentry(error: unknown) {
    if (!axios.isAxiosError(error)) return;

    try {
      const data = JSON.parse(window.localStorage.getItem("authStore") || "{}");
      const user = data?.state?.user;

      Sentry.captureException(error, {
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        },
        tags: {
          appError: "true",
        },
        user: {
          id: user?.id || "unauthenticated",
          email: user?.email || "unauthenticated",
          name: user?.name || "unauthenticated",
        },
      });

      console.error("Sentry captured an error:", error);
    } catch (e) {
      console.error("Error parsing user info for Sentry:", e);
    }
  }

  public async request<T extends ZodType>(
    config: AxiosRequestConfig,
    schema: T
  ): Promise<z.infer<T>> {
    try {
      const response = await this.instance(config);
      const parsed = schema.safeParse(response.data);

      if (!parsed.success) {
        throw new ValidationError(parsed.error);
      }

      return parsed.data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      Sentry.captureException(error , {
        extra: {
          url: config.url,
          method: config.method,
          params: config.params,
          data: config.data,
        },
        tags: {
          requestError: "true",
        },
      });

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError("An unexpected error occurred" , 500);
    }
  }

  public async get<T extends ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: "GET", url }, schema);
  }

  public async post<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: "POST", url, data }, schema);
  }

  public async put<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: "PUT", url, data }, schema);
  }

  public async delete<T extends ZodType>(
    url: string,
    schema: T,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: "DELETE", url }, schema);
  }

  public async patch<T extends ZodType>(
    url: string,
    schema: T,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<z.infer<T>> {
    return this.request({ ...config, method: "PATCH", url, data }, schema);
  }

}
