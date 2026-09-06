import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ORIGINAL, type ReceiptFields } from "@/lib/receipt";

type ReceiptState = ReceiptFields & {
  setField: <K extends keyof ReceiptFields>(key: K, value: ReceiptFields[K]) => void;
  reset: () => void;
};

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      ...ORIGINAL,
      setField: (key, value) => set({ [key]: value }),
      reset: () => set({ ...ORIGINAL }),
    }),
    {
      name: "slip-studio-fields-v3",
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<ReceiptFields>),
      }),
    },
  ),
);
