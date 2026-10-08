"use client";

import { useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let memoryToasts: Toast[] = [];

function notify() {
  toastListeners.forEach((listener) => listener([...memoryToasts]));
}

export function toast({
  type = "info",
  title,
  message,
  duration = 4000,
}: {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { id, type, title, message, duration };
  memoryToasts.push(newToast);
  notify();

  if (duration > 0) {
    setTimeout(() => {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
      notify();
    }, duration);
  }
}

export function removeToast(id: string) {
  memoryToasts = memoryToasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  useState(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  });

  return {
    toasts,
    toast,
    dismiss: removeToast,
  };
}
