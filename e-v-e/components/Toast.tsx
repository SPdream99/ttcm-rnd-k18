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

      const duration = toast.duration ?? 3500;
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
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      toast: {
        success: (message: string, title?: string) => console.log("[Toast Success]", title, message),
        error: (message: string, title?: string) => console.error("[Toast Error]", title, message),
        info: (message: string, title?: string) => console.info("[Toast Info]", title, message),
        warning: (message: string, title?: string) => console.warn("[Toast Warning]", title, message),
      },
    };
  }

  return {
    toast: {
      success: (message: string, title?: string) =>
        ctx.addToast({ type: "success", message, title }),
      error: (message: string, title?: string) =>
        ctx.addToast({ type: "error", message, title }),
      info: (message: string, title?: string) =>
        ctx.addToast({ type: "info", message, title }),
      warning: (message: string, title?: string) =>
        ctx.addToast({ type: "warning", message, title }),
    },
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
    glow: string;
    bg: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/40",
    iconColor: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    bg: "bg-emerald-500/10",
  },
  error: {
    icon: XCircle,
    border: "border-red-500/40",
    iconColor: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    bg: "bg-red-500/10",
  },
  info: {
    icon: Info,
    border: "border-cyan-500/40",
    iconColor: "text-cyan-400",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    bg: "bg-cyan-500/10",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/40",
    iconColor: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    bg: "bg-amber-500/10",
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
        flex items-start gap-3 w-80 rounded-2xl border backdrop-blur-xl p-4
        bg-[#0f1524]/90 transition-all duration-300
        ${cfg.border} ${cfg.glow}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${cfg.bg}`}>
        <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-white leading-tight">
            {toast.title}
          </p>
        )}
        <p className={`text-xs leading-5 ${toast.title ? "text-[#8e9bb4] mt-0.5" : "text-[#c8d0e0]"}`}>
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="shrink-0 text-[#8e9bb4] hover:text-white transition-colors mt-0.5 cursor-pointer"
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
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {ctx.toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={() => ctx.removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}
