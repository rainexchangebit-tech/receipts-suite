import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SCREENSHOT_DEFAULT, type ReceiptData } from "./receipt";

type ReceiptStore = {
  data: ReceiptData;
  setField: <K extends keyof ReceiptData>(key: K, value: ReceiptData[K]) => void;
  patch: (partial: Partial<ReceiptData>) => void;
  reset: () => void;
};

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set) => ({
      data: SCREENSHOT_DEFAULT,
      setField: (key, value) =>
        set((s) => ({ data: { ...s.data, [key]: value } })),
      patch: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
      reset: () => set({ data: { ...SCREENSHOT_DEFAULT } }),
    }),
    {
      name: "deposit-receipt-v2",
      merge: (persisted, current) => {
        const from = (persisted as { data?: Partial<ReceiptData> } | undefined)?.data;
        return {
          ...current,
          data: { ...SCREENSHOT_DEFAULT, ...from },
        };
      },
    },
  ),
);
