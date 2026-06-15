import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { store } from "../stores";
import { setIsLoading } from "../stores/ui";
import { faToEnNumbers, url } from "../utils";

const apiClient = axios.create({
  baseURL: url + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
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
  return data;
};
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
  async (error: AxiosError) => {
    store.dispatch(setIsLoading(false));

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data as { message: string };
      if ((responseData?.message && status !== 401) || status !== 500) {
        toast.error(responseData?.message);
        return Promise.reject(error);
      }
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest?._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await apiClient.post(api.auth.refresh);
          const { access_token } = response.data;

          localStorage.setItem("token", access_token);

          processQueue(null, access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem("access_token");
          window.location.href = "/auth";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      switch (status) {
        case 400:
          toast.error(
            responseData?.message ||
              "درخواست با شکست مواجه شد. لطفا مقادیر وارد شده را بررسی کنید",
          );
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

export default apiClient;
export const api = {
  auth: {
    main: "/auth/",
    verifyCode: "/auth/verify-code",
    refresh: "/auth/refresh-token",
  },
  users: {
    main: "/users/",
    getUserInitialInfo: "/users/profile",
    updateUserData: "/users/updateUserData",
  },

  patient: {
    prescriptions: {
      main: "/patient/prescriptions/",
      search: "/patient/prescriptions/search",
    },
    doctor: {
      main: "/patient/doctor/",
      actives: "/patient/doctor/actives/",
      search: "/patient/doctor/search/",
      getDoctorForAppointments: "/patient/doctor/getDoctorForAppointments/",
    },

    appointment: {
      main: "/patient/appointment",
      /**
       * POST
       */
      active: "/patient/appointment/active",
    },
    /**
     * PATCH
     */
    patientUpdate: "/patient/patientUpdate/",
  },
  doctor: {
    main: "/doctor/",
    profile: "/doctor/profile/",
    public: {
      search: "/doctor/public/search",
      specialties: "/doctor/public/specialties",
    },
  },
  Houres: {
    /**
     * RESTFULL api
     */
    main: "/doctorhours/",
  },
  appointments: {
    /**
     * RESTFULL api
     */
    main: "/appointments/",
  },
  auditLogsMedical: {
    /**
     * RESTFULL api
     */
    main: "/auditLogsMedical/",
  },
  prescriptions: {
    /**
     * RESTFULL api
     */
    main: "/prescriptions/",
  },
};
