"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

type Kind = "success" | "error";
type ToastItem = { id: number; message: string; kind: Kind };
type ToastFn = (message: string, kind?: Kind) => void;

const ToastContext = createContext<ToastFn>(() => {});

export function useToast(): ToastFn {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const toast = useCallback<ToastFn>((message, kind = "success") => {
    const id = nextId.current++;
    setItems((list) => [...list.slice(-2), { id, message, kind }]);
    window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 min-[860px]:bottom-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="pop-in pointer-events-auto flex max-w-md items-center gap-2.5 rounded-btn bg-text px-4 py-3 text-sm font-medium text-bg shadow-lg"
          >
            {t.kind === "success" ? (
              <CheckCircle size={20} weight="fill" className="shrink-0 text-success" aria-hidden />
            ) : (
              <WarningCircle size={20} weight="fill" className="shrink-0 text-accent" aria-hidden />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
