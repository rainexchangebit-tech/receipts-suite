import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_RECEIPT,
  explorerFor,
  type ReceiptData,
  type TradingPair,
} from "./receipt";

type ReceiptState = {
  data: ReceiptData;
  patch: (partial: Partial<ReceiptData>) => void;
  setPair: (id: string, partial: Partial<TradingPair>) => void;
  reset: () => void;
};

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      data: DEFAULT_RECEIPT,
      patch: (partial) =>
        set((s) => {
          const next = { ...s.data, ...partial };
          if (partial.blockchain !== undefined || partial.txid !== undefined) {
            const auto = explorerFor(next.blockchain, next.txid);
            const prevAuto = explorerFor(s.data.blockchain, s.data.txid);
            if (!s.data.explorerUrl || s.data.explorerUrl === prevAuto) {
              next.explorerUrl = auto;
            }
          }
          return { data: next };
        }),
      setPair: (id, partial) =>
        set((s) => ({
          data: {
            ...s.data,
            pairs: s.data.pairs.map((p) =>
              p.id === id ? { ...p, ...partial } : p,
            ),
          },
        })),
      reset: () => set({ data: DEFAULT_RECEIPT }),
    }),
    {
      name: "deposit-slip-v1",
      partialize: (s) => ({ data: s.data }),
      skipHydration: true,
    },
  ),
);
