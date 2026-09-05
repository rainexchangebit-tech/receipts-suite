export type SlipStatus = "Completed" | "Processing" | "Failed";

export type Receipt = {
  verb: string;
  amount: string;
  asset: string;
  fiatApprox: string;
  status: SlipStatus;
  address: string;
  price: string;
  network: string;
  networkFee: string;
  txId: string;
  submittedTime: string;
  referenceNo: string;
  explorerLabel: string;
  helpText: string;
  statusBarTime: string;
  signalLabel: string;
  battery: number;
  showWifi: boolean;
  showStatusBar: boolean;
  showHomeIndicator: boolean;
};

export const SCREENSHOT_DEFAULTS: Receipt = {
  verb: "Withdrawn",
  amount: "262.152",
  asset: "USDT",
  fiatApprox: "~$262.09",
  status: "Completed",
  address: "TDqBobJZT1h6N7gEj5e1YzNQreCZHfmYuv",
  price: "$0.99/USDT",
  network: "Tron (TRC20)",
  networkFee: "1.5 USDT",
  txId: "6a92c...d3f91",
  submittedTime: "Jun 18, 2026, 23:03",
  referenceNo: "406859708",
  explorerLabel: "View on blockchain explorer",
  helpText: "Why hasn't my transaction arrived?",
  statusBarTime: "23:03",
  signalLabel: "5G",
  battery: 56,
  showWifi: true,
  showStatusBar: true,
  showHomeIndicator: true,
};

export const STORAGE_KEY = "withdrawal-slip-v2";

export const ASSET_OPTIONS = ["USDT", "BTC", "ETH"] as const;
export type AssetId = (typeof ASSET_OPTIONS)[number];

export function assetKind(asset: string): AssetId {
  const a = asset.trim().toUpperCase();
  if (a === "BTC" || a.includes("BTC") || a.includes("BITCOIN")) return "BTC";
  if (a === "ETH" || a.includes("ETH") || a.includes("ETHER")) return "ETH";
  return "USDT";
}

export const ASSET_PRESETS: Record<
  AssetId,
  Pick<Receipt, "asset" | "price" | "network" | "networkFee">
> = {
  USDT: {
    asset: "USDT",
    price: "$0.99/USDT",
    network: "Tron (TRC20)",
    networkFee: "1.5 USDT",
  },
  BTC: {
    asset: "BTC",
    price: "$64250.00/BTC",
    network: "Bitcoin",
    networkFee: "0.00032 BTC",
  },
  ETH: {
    asset: "ETH",
    price: "$3180.00/ETH",
    network: "Ethereum (ERC20)",
    networkFee: "0.0012 ETH",
  },
};

export function formatTxId(id: string): string {
  const t = id.trim();
  if (!t || t.includes("...")) return t;
  if (t.length <= 12) return t;
  return `${t.slice(0, 5)}...${t.slice(-5)}`;
}

export function networkKind(
  network: string,
): "tron" | "eth" | "bnb" | "btc" | "generic" {
  const n = network.toLowerCase();
  if (n.includes("tron") || n.includes("trc") || n.includes("trx")) return "tron";
  if (n.includes("eth") || n.includes("erc")) return "eth";
  if (n.includes("bsc") || n.includes("bep") || n.includes("bnb")) return "bnb";
  if (n.includes("bitcoin") || n.includes("btc")) return "btc";
  return "generic";
}

export function downloadFilename(data: Receipt, ext: "pdf" | "png"): string {
  const asset = data.asset.replace(/[^\w]+/g, "") || "ASSET";
  const ref = data.referenceNo.replace(/[^\w.-]+/g, "") || "slip";
  return `Withdrawn_${data.amount}_${asset}_${ref}.${ext}`;
}
