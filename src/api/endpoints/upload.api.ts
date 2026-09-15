import { apiClient } from "../client";
import type { UploadResponse, UploadOptions } from "../types/upload";

export const uploadApi = {
  // ============================================
  // آپلود یک فایل
  // ============================================
  uploadSingle: async (
    file: File,
    options?: UploadOptions,
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    if (options?.subFolder) {
      formData.append("subFolder", options.subFolder);
    }

    const response = await apiClient.post<UploadResponse>("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (options?.onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          options.onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },
};
