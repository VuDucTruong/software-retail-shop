import axios, { AxiosInstance, AxiosRequestConfig } from "axios";


export class ApiClient {
    private instance: AxiosInstance;

    constructor(path: string = "") {
        this.instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL + path,
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

        this.initInterceptors();
    }
   
    private initInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                console.warn("Request", config);
                return config;
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                console.warn("Response", response);
                return response;
            },
            (error) => {
                console.error("Error", error);
                if (axios.isAxiosError(error)) {
                    switch (error.code) {
                        case axios.AxiosError.ERR_NETWORK:
                            return Promise.reject("INTERNAL.ERR_NETWORK");
                        case axios.AxiosError.ETIMEDOUT:
                            return Promise.reject("INTERNAL.ETIMEDOUT");
                        default:
                            const message = error.response?.data?.message || error.message;
                            return Promise.reject(message);
                    }
                }
                return Promise.reject("INTERNAL.UNKNOWN");
            }
        );
    }

    private async apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
        try {
          const response = await this.instance(config);
          return response.data as T;
        } catch (error: any) {
          // Optionally handle common error format here
          throw error?.response?.data || error;
        }
    }


    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.apiRequest<T>({ ...config, method: "GET", url });
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.apiRequest<T>({ ...config, method: "POST", url, data });
    }

    public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.apiRequest<T>({ ...config, method: "PUT", url, data });
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.apiRequest<T>({ ...config, method: "DELETE", url });
    }

    public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.apiRequest<T>({ ...config, method: "PATCH", url, data });
    }


}