"use client";

import { Check } from "lucide-react";

export type ToastMessage = { id: number; message: string };

export function ToastStack({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <Check size={16} aria-hidden="true" className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
