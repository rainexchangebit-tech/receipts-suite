import { create } from "zustand";
import {
  ASSETS,
  DEFAULT_RECEIPT,
  type AssetId,
  type Direction,
  type ReceiptData,
} from "@/lib/receipt";

type ReceiptStore = ReceiptData & {
  update: (patch: Partial<ReceiptData>) => void;
  applyAsset: (asset: AssetId) => void;
  applyDirection: (direction: Direction) => void;
  reset: () => void;
};

export const useReceiptStore = create<ReceiptStore>()((set) => ({
  ...DEFAULT_RECEIPT,
  update: (patch) => set(patch),
  applyAsset: (asset) =>
    set({
      asset,
      network: ASSETS[asset].network,
      feeSymbol: ASSETS[asset].feeSymbol,
    }),
  applyDirection: (direction) =>
    set({
      direction,
      title: direction === "sent" ? "Sent" : "Received",
    }),
  reset: () => set({ ...DEFAULT_RECEIPT }),
}));
