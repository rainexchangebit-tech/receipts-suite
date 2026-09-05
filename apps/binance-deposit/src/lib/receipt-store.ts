import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReceiptStatus = "Completed" | "Processing" | "Failed" | "Cancelled";

export type Receipt = {
  time: string;
  battery: number;
  networkType: string;
  showWifi: boolean;
  title: string;
  signedAmount: string;
  asset: string;
  status: ReceiptStatus;
  note: string;
  helpLink: string;
  network: string;
  address: string;
  txid: string;
  amount: string;
  fee: string;
  wallet: string;
  date: string;
  button: string;
  scanReport: string;
  saveAddress: string;
  autoNet: boolean;
};

export const DEFAULT_RECEIPT: Receipt = {
  time: "11:26",
  battery: 56,
  networkType: "5G",
  showWifi: true,
  title: "Withdrawal Details",
  signedAmount: "-57",
  asset: "USDT",
  status: "Completed",
  note: "Crypto transferred out of Binance. Please contact the recipient platform for your transaction receipt.",
  helpLink: "Why hasn't my withdrawal arrived?",
  network: "TRX",
  address: "TPmeDSoHpskfgac93j9ASNovn4to71x5n4",
  txid: "0131685c305472d51bd86F9835241260e9993a7a29b2F70271e845da60288cb3",
  amount: "58.5 USDT",
  fee: "1.5 USDT",
  wallet: "Spot Wallet",
  date: "2026-08-06 23:24:36",
  button: "Withdraw Again",
  scanReport: "Scan Report",
  saveAddress: "Save Address",
  autoNet: true,
};

function parseLeadingNumber(value: string): number | null {
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}

export function computeSignedAmount(amount: string, fee: string): string {
  const a = parseLeadingNumber(amount);
  const f = parseLeadingNumber(fee) ?? 0;
  if (a === null) return DEFAULT_RECEIPT.signedAmount;
  const net = Math.round((a - f) * 1e8) / 1e8;
  const pretty = Number.isInteger(Math.abs(net))
    ? String(Math.abs(net))
    : String(Math.abs(net));
  return `-${pretty}`;
}

type ReceiptState = {
  receipt: Receipt;
  focused: keyof Receipt | null;
  exporting: boolean;
  hydrated: boolean;
  setField: <K extends keyof Receipt>(key: K, value: Receipt[K]) => void;
  setFocused: (key: keyof Receipt | null) => void;
  setExporting: (value: boolean) => void;
  markHydrated: () => void;
  reset: () => void;
};

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      receipt: { ...DEFAULT_RECEIPT },
      focused: null,
      exporting: false,
      hydrated: false,
      setField: (key, value) =>
        set((state) => {
          const next = { ...state.receipt, [key]: value };
          if (
            next.autoNet &&
            (key === "amount" || key === "fee" || key === "autoNet")
          ) {
            next.signedAmount = computeSignedAmount(next.amount, next.fee);
          }
          return { receipt: next };
        }),
      setFocused: (key) => set({ focused: key }),
      setExporting: (value) => set({ exporting: value }),
      markHydrated: () => set({ hydrated: true }),
      reset: () => set({ receipt: { ...DEFAULT_RECEIPT }, focused: null }),
    }),
    {
      name: "withdrawal-receipt-v1",
      partialize: (s) => ({ receipt: s.receipt }),
      skipHydration: true,
    },
  ),
);

export const STATUS_COLOR: Record<ReceiptStatus, string> = {
  Completed: "#2ebd85",
  Processing: "#f0b90b",
  Failed: "#f6465d",
  Cancelled: "#848e9c",
};
