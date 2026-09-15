import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadApi } from "../../../api/endpoints/upload.api";
import { toast } from "sonner";
import type { UploadResponse } from "../../../api/types/upload";
import type { AxiosError } from "axios";

// ============================================
// کلیدهای کش
// ============================================

export const uploadKeys = {
  all: ["upload"] as const,
  info: (filename: string) => [...uploadKeys.all, "info", filename] as const,
};

// ============================================
// Hook: آپلود یک فایل
// ============================================

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UploadResponse,
    Error,
    {
      file: File;
      options?: {
        subFolder?: string;
        onProgress?: (percent: number) => void;
      };
    }
  >({
    mutationFn: ({ file, options }) => uploadApi.uploadSingle(file, options),
    onSuccess: (data) => {
      toast.success("فایل با موفقیت آپلود شد");
      if (data.file?.filename) {
        queryClient.invalidateQueries({
          queryKey: uploadKeys.info(data.file.filename),
        });
      }
    },
    onError: (error) => {
      return toast.error(error.message || "خطا در آپلود فایل");
    },
  });
};
