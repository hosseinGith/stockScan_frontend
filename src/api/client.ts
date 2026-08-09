import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { store } from "../shared/stores";
import { setIsLoading } from "../shared/stores/ui";
import { toast } from "sonner";
import { faToEnNumbers } from "../shared/utils/helpers";

export const apiClient = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:3000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const convertAnyToStringWithEnglishNumbers = <T>(data: T): T => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    return faToEnNumbers(data) as T;
  }

  if (typeof data === "number") {
    return data;
  }

  if (typeof data === "boolean") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertAnyToStringWithEnglishNumbers(item)) as T;
  }

  if (typeof data === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newObj[key] = convertAnyToStringWithEnglishNumbers((data as any)[key]);
      }
    }
    return newObj as T;
  }
  console.log(data);

  return data;
};
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    store.dispatch(setIsLoading(true));
    if (config.data) {
      config.data = convertAnyToStringWithEnglishNumbers(config.data);
    }

    if (config.params) {
      config.params = convertAnyToStringWithEnglishNumbers(config.params);
    }

    if (config.url) {
      config.url = convertAnyToStringWithEnglishNumbers(config.url);
    }
    return config;
  },

  (error: AxiosError) => {
    if (error.message) {
      toast.error(`Request Error: ${error.message}`);
    }

    store.dispatch(setIsLoading(false));

    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    store.dispatch(setIsLoading(false));
    return response;
  },
  (error: AxiosError) => {
    store.dispatch(setIsLoading(false));

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data as { message: string };

      switch (status) {
        case 400:
          toast.error(
            responseData?.message ||
              "درخواست با شکست مواجه شد. لطفا مقادیر وارد شده را بررسی کنید",
          );
          break;

        case 401:
          toast.error("لطفا دوباره لاگین کنید");
          setTimeout(() => {
            location.pathname = "/auth";
            if (typeof window !== "undefined") {
              localStorage.removeItem("accessToken");
            }
          }, 1000);
          break;

        case 403:
          toast.error("دسترسی به این بخش ندارید");
          break;

        case 404:
          toast.error("پیدا نشد.");
          break;

        case 422:
          // if (responseData?.errors) {
          //   const firstError = Object.values(responseData.errors)[0];
          //   toast.error((firstError as string) || "Validation Error");
          // } else {
          //   toast.error(responseData?.message || "Validation Error");
          // }
          break;

        case 500:
          toast.error("مشکل در سمت سرور.");
          break;

        default:
          toast.error(responseData?.message || `Error ${status}`);
      }
    } else if (error.request) {
      toast.error("لطفا اینترنت خود را بررسی کنید.");
    } else {
      toast.error(`درخواست شکست خورد: ${error.message}`);
    }

    return Promise.reject(error);
  },
);
