import { useCallback, useEffect, useState } from "react";
import {
  SCREENSHOT_DEFAULTS,
  STORAGE_KEY,
  type Receipt,
} from "@/lib/receipt";

export function useReceipt() {
  const [data, setData] = useState<Receipt>(SCREENSHOT_DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Receipt>;
        setData({ ...SCREENSHOT_DEFAULTS, ...parsed });
      }
    } catch {
      /* keep defaults */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota */
    }
  }, [data, ready]);

  const setField = useCallback(
    <K extends keyof Receipt>(key: K, value: Receipt[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setData(SCREENSHOT_DEFAULTS), []);

  return { data, setData, setField, reset, ready };
}
