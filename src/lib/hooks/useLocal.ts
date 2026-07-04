import { useState } from "react";

export function useLocal<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  const set = (n: T) => {
    setV(n);
    try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
  };
  return [v, set];
}
