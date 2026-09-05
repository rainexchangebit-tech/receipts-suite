export const RECEIPT_W = 390;
export const RECEIPT_H = 844;

export type ReceiptStatus = "Completed" | "Processing" | "Failed";

export type ReceiptData = {
  statusTime: string;
  battery: number;
  signalLabel: string;
  showWifi: boolean;
  title: string;
  amountSign: "+" | "-" | "";
  amount: string;
  currency: string;
  status: ReceiptStatus;
  message: string;
  network: string;
  address: string;
  txid: string;
  wallet: string;
  date: string;
  showSupport: boolean;
};

/** Pixel-matched defaults from the source screenshot. */
export const SCREENSHOT_DEFAULT: ReceiptData = {
  statusTime: "22:15",
  battery: 56,
  signalLabel: "5G",
  showWifi: true,
  title: "Deposit Details",
  amountSign: "+",
  amount: "2,000",
  currency: "USDT",
  status: "Completed",
  message:
    "Crypto has arrived in your Binance account. View your spot account balance for more details.",
  network: "TRX",
  address: "witTDqBobJZT1h6N7gEjJ5e1YzNQreCZHfmYuv",
  txid: "6ca1f3c64033d64b69f56aba594474d2230e6e5d9d5a9b1a60590ee542884378f",
  wallet: "Spot Wallet",
  date: "2026-08-08 22:15:00",
  showSupport: true,
};

export const STATUS_COLOR: Record<ReceiptStatus, string> = {
  Completed: "#2ebd85",
  Processing: "#f0b90b",
  Failed: "#f6465d",
};

export function fileStamp(data: ReceiptData) {
  const raw = data.date.replace(/[: ]/g, "-").slice(0, 16);
  return `deposit-${data.currency.toLowerCase()}-${raw || "receipt"}`;
}
