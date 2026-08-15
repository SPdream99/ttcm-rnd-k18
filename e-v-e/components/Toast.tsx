"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

// ============================================================
// TYPES
// ============================================================

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

// ============================================================
// CONTEXT
// ============================================================

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...toast, id }]);

      const duration = toast.duration ?? 4000;
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useToast() {
  const ctx = useContext(ToastContext);
  const helpers = {
    success: (message: string, title?: string) =>
      ctx ? ctx.addToast({ type: "success", message, title }) : console.log("[Toast Success]", title, message),
    error: (message: string, title?: string) =>
      ctx ? ctx.addToast({ type: "error", message, title }) : console.error("[Toast Error]", title, message),
    info: (message: string, title?: string) =>
      ctx ? ctx.addToast({ type: "info", message, title }) : console.info("[Toast Info]", title, message),
    warning: (message: string, title?: string) =>
      ctx ? ctx.addToast({ type: "warning", message, title }) : console.warn("[Toast Warning]", title, message),
  };

  return {
    ...helpers,
    toast: helpers,
  };
}

// ============================================================
// CONFIG
// ============================================================

const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: React.FC<{ className?: string }>;
    border: string;
    iconColor: string;
    bgIcon: string;
    badgeTitle: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-200 shadow-emerald-500/10",
    iconColor: "text-emerald-600",
    bgIcon: "bg-emerald-50 border-emerald-200",
    badgeTitle: "Thành công",
  },
  error: {
    icon: XCircle,
    border: "border-red-200 shadow-red-500/10",
    iconColor: "text-red-600",
    bgIcon: "bg-red-50 border-red-200",
    badgeTitle: "Lỗi xử lý",
  },
  info: {
    icon: Info,
    border: "border-blue-200 shadow-blue-500/10",
    iconColor: "text-blue-600",
    bgIcon: "bg-blue-50 border-blue-200",
    badgeTitle: "Thông tin",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200 shadow-amber-500/10",
    iconColor: "text-amber-600",
    bgIcon: "bg-amber-50 border-amber-200",
    badgeTitle: "Lưu ý",
  },
};

// ============================================================
// TOAST ITEM
// ============================================================

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);
  const cfg = TOAST_CONFIG[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onRemove, 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3.5 w-84 md:w-96 rounded-2xl border p-4
        bg-white shadow-xl transition-all duration-300 pointer-events-auto
        ${cfg.border}
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
      `}
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 rounded-xl p-2 border ${cfg.bgIcon}`}>
        <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${cfg.iconColor}`}>
            {toast.title || cfg.badgeTitle}
          </span>
        </div>
        <p className="text-xs text-zinc-700 font-medium leading-relaxed mt-0.5">
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors mt-0.5 p-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ============================================================
// CONTAINER
// ============================================================

function ToastContainer() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
      {ctx.toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => ctx.removeToast(t.id)} />
      ))}
    </div>
  );
}
