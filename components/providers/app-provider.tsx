"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { QuoteItem } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { CommandPalette } from "@/components/utilities/command-palette";
import { QuoteDrawer } from "@/components/utilities/quote-drawer";
import { ToastStack, type ToastMessage } from "@/components/utilities/toast-stack";

const STORAGE_KEY = "tyrespeed-quote-v1";

type AddInput = Omit<QuoteItem, "qty"> & { qty?: number };

type AppContextValue = {
  quote: QuoteItem[];
  quoteCount: number;
  quoteTotal: number;
  addToQuote: (item: AddInput) => void;
  removeFromQuote: (key: string) => void;
  setQuoteQty: (key: string, qty: number) => void;
  clearQuote: () => void;
  openDrawer: () => void;
  openPalette: () => void;
  toast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = useState<QuoteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setQuote(parsed as QuoteItem[]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
  }, [quote, hydrated]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message }]);
    const timer = setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3600);
    timers.current.push(timer);
  }, []);

  const addToQuote = useCallback(
    (item: AddInput) => {
      const quantity = item.qty ?? 1;
      trackEvent("quote_add");
      setQuote((current) => {
        const existing = current.find((line) => line.key === item.key);
        if (existing) {
          return current.map((line) =>
            line.key === item.key ? { ...line, qty: line.qty + quantity } : line,
          );
        }
        return [
          ...current,
          {
            key: item.key,
            kind: item.kind,
            ref: item.ref,
            label: item.label,
            meta: item.meta,
            price: item.price,
            minutes: item.minutes,
            qty: quantity,
          },
        ];
      });
      toast(`${item.label} added to quote`);
    },
    [toast],
  );

  const removeFromQuote = useCallback(
    (key: string) => {
      setQuote((current) => current.filter((line) => line.key !== key));
      toast("Line removed from quote");
    },
    [toast],
  );

  const setQuoteQty = useCallback((key: string, qty: number) => {
    setQuote((current) =>
      qty < 1
        ? current.filter((line) => line.key !== key)
        : current.map((line) => (line.key === key ? { ...line, qty } : line)),
    );
  }, []);

  const clearQuote = useCallback(() => setQuote([]), []);

  const quoteCount = quote.reduce((total, line) => total + line.qty, 0);
  const quoteTotal = quote.reduce((total, line) => total + line.price * line.qty, 0);

  const value = useMemo<AppContextValue>(
    () => ({
      quote,
      quoteCount,
      quoteTotal,
      addToQuote,
      removeFromQuote,
      setQuoteQty,
      clearQuote,
      openDrawer: () => setDrawerOpen(true),
      openPalette: () => setPaletteOpen(true),
      toast,
    }),
    [quote, quoteCount, quoteTotal, addToQuote, removeFromQuote, setQuoteQty, clearQuote, toast],
  );

  return (
    <AppContext.Provider value={value}>
      {children}

      <QuoteDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={quote}
        setQty={setQuoteQty}
        remove={removeFromQuote}
        clear={clearQuote}
        onSubmitted={toast}
      />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastStack toasts={toasts} />
    </AppContext.Provider>
  );
}
