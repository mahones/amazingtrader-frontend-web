"use client";

import { Toast } from "@base-ui/react/toast";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toastManager } from "@/lib/toast";
import { cn } from "@/lib/utils";

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const TOAST_ICON_STYLES = {
  success: "text-emerald-500",
  error: "text-destructive",
  warning: "text-amber-500",
  info: "text-sky-500",
} as const;

type ToastType = keyof typeof TOAST_ICONS;

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager} timeout={5000}>
      <Toast.Portal>
        <Toast.Viewport className="fixed top-4 left-1/2 z-100 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 outline-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((t) => {
    const type: ToastType = (t.type as ToastType) ?? "info";
    const Icon = TOAST_ICONS[type];

    return (
      <Toast.Root
        key={t.id}
        toast={t}
        swipeDirection="up"
        className={cn(
          "[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)+(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
          "absolute top-0 right-0 left-0 z-[calc(1000-var(--toast-index))] mx-auto w-full origin-top rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10",
          "h-[var(--height)] data-expanded:h-[var(--toast-height)]",
          "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]",
          "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
          "data-starting-style:[transform:translateY(-150%)] data-ending-style:opacity-0 data-ending-style:[transform:translateY(-150%)] data-limited:opacity-0",
          "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]"
        )}
      >
        <Toast.Content className="flex h-full items-start gap-3 overflow-hidden p-3.5 transition-opacity duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100">
          <Icon className={cn("mt-0.5 size-5 shrink-0", TOAST_ICON_STYLES[type])} />
          <div className="min-w-0 flex-1 space-y-0.5">
            {t.title && <Toast.Title className="text-sm font-semibold" />}
            <Toast.Description className="text-sm text-muted-foreground" />
          </div>
          <Toast.Close
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="size-4" />
          </Toast.Close>
        </Toast.Content>
      </Toast.Root>
    );
  });
}
