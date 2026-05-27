'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { X } from 'lucide-react';

type ToastVariant = 'default' | 'success' | 'danger';

export type ToastPayload = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastPayload & {
  id: string;
  createdAt: number;
};

type ToastContextValue = {
  push: (toast: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

function getVariantClasses(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'border-emerald-500/30 bg-emerald-500/10';
    case 'danger':
      return 'border-rose-500/30 bg-rose-500/10';
    default:
      return 'border-zinc-800 bg-zinc-950';
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastPayload) => {
      const id = crypto.randomUUID();
      const item: ToastItem = {
        id,
        createdAt: Date.now(),
        variant: toast.variant ?? 'default',
        durationMs: toast.durationMs ?? 4500,
        title: toast.title,
        description: toast.description,
      };

      setItems((prev) => [item, ...prev].slice(0, 5));

      window.setTimeout(() => remove(id), item.durationMs);
    },
    [remove]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${getVariantClasses(t.variant ?? 'default')}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100">{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 text-sm text-zinc-400">{t.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

