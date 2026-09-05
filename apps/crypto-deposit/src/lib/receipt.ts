export type AssetId = "USDT" | "BTC" | "ETH";
export type Direction = "sent" | "received";

export const RECEIPT_W = 390;
export const RECEIPT_H = 844;

export type ReceiptData = {
  asset: AssetId;
  direction: Direction;
  title: string;
  amount: string;
  dateText: string;
  status: string;
  network: string;
  from: string;
  to: string;
  fee: string;
  feeUsd: string;
  feeSymbol: string;
  txHash: string;
  speedLabel: string;
  cancelLabel: string;
  explorerLabel: string;
  showSpeedUp: boolean;
  showCancel: boolean;
  showExplorer: boolean;
  statusTime: string;
  battery: number;
  showStatusBar: boolean;
  showHomeIndicator: boolean;
  carrier: string;
};

export type AssetMeta = {
  id: AssetId;
  symbol: string;
  name: string;
  network: string;
  feeSymbol: string;
};

export const ASSETS: Record<AssetId, AssetMeta> = {
  USDT: {
    id: "USDT",
    symbol: "USDT",
    name: "Tether",
    network: "Ethereum",
    feeSymbol: "ETH",
  },
  BTC: {
    id: "BTC",
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    feeSymbol: "BTC",
  },
  ETH: {
    id: "ETH",
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum",
    feeSymbol: "ETH",
  },
};

export const ASSET_ORDER: AssetId[] = ["USDT", "BTC", "ETH"];

export const DEFAULT_RECEIPT: ReceiptData = {
  asset: "ETH",
  direction: "sent",
  title: "Sent",
  amount: "3.5",
  dateText: "26 Mar 2026 at 21:52 PM",
  status: "Pending",
  network: "Ethereum",
  from: "0x7d1...35072",
  to: "0eEB3...24c3b",
  fee: "0.000099",
  feeUsd: "0.2055",
  feeSymbol: "ETH",
  txHash: "0xb91...4aaf7",
  speedLabel: "Speed up",
  cancelLabel: "Cancel Request",
  explorerLabel: "View on Explorer",
  showSpeedUp: true,
  showCancel: true,
  showExplorer: true,
  statusTime: "9:52",
  battery: 80,
  showStatusBar: true,
  showHomeIndicator: true,
  carrier: "5G",
};

export const NETWORK_PRESETS = [
  "Ethereum",
  "Bitcoin",
  "Tron",
  "BNB Smart Chain",
  "Polygon",
  "Solana",
  "Arbitrum",
  "Base",
  "Optimism",
];

export const STATUS_PRESETS = ["Pending", "Confirmed", "Failed", "Success"];

export function displayMiddle(value: string, head = 5, tail = 5): string {
  const v = value.trim();
  if (!v) return "";
  if (v.includes("...")) return v;
  if (v.length <= head + tail + 3) return v;
  return `${v.slice(0, head)}...${v.slice(-tail)}`;
}

export function displayAmount(data: ReceiptData): string {
  const raw = data.amount.trim().replace(/^[-+−–]/, "");
  const sign = data.direction === "sent" ? "-" : "+";
  const symbol = ASSETS[data.asset].symbol;
  return `${sign}${raw} ${symbol}`;
}

export function displayFee(data: ReceiptData): string {
  return `${data.fee.trim()} ${data.feeSymbol.trim() || ASSETS[data.asset].feeSymbol}`;
}

export function displayFeeUsd(value: string): string {
  const t = value.trim().replace(/^≈\s*/, "").replace(/^\$/, "");
  return `≈$${t}`;
}

export function statusTone(
  status: string,
): "pending" | "ok" | "bad" | "neutral" {
  const s = status.trim().toLowerCase();
  if (["pending", "processing", "unconfirmed"].includes(s)) return "pending";
  if (["confirmed", "success", "complete", "completed"].includes(s)) return "ok";
  if (["failed", "error", "rejected", "cancelled", "canceled"].includes(s))
    return "bad";
  return "neutral";
}

export function fileStem(data: ReceiptData): string {
  const amt = data.amount.replace(/[^\d.]/g, "") || "tx";
  const st = data.status.replace(/\s+/g, "-").toLowerCase() || "status";
  return `receipt-${data.asset}-${data.direction}-${amt}-${st}`.toLowerCase();
}
