import { Toast } from "@base-ui/react/toast";

export const toastManager = Toast.createToastManager();

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title?: string;
  /** Fixed id: re-adding with the same id updates the existing toast instead of stacking a duplicate. */
  id?: string;
  timeout?: number;
}

function show(type: ToastVariant, description: string, options?: ToastOptions) {
  return toastManager.add({
    id: options?.id,
    type,
    title: options?.title,
    description,
    timeout: options?.timeout,
  });
}

export const toast = {
  success: (description: string, options?: ToastOptions) => show("success", description, options),
  error: (description: string, options?: ToastOptions) => show("error", description, options),
  warning: (description: string, options?: ToastOptions) => show("warning", description, options),
  info: (description: string, options?: ToastOptions) => show("info", description, options),
};
