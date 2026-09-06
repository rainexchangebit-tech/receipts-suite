export type PairIcon = "btc" | "eth" | "usdt" | "generic";

export type TradingPair = {
  id: string;
  symbol: string;
  price: string;
  change: string;
  hot: boolean;
  icon: PairIcon;
};

export type ReceiptStatus = "Received" | "Processing" | "Failed" | "Cancelled";

export type ReceiptData = {
  title: string;
  amount: string;
  currency: string;
  status: ReceiptStatus;
  blockchain: string;
  type: string;
  address: string;
  txid: string;
  time: string;
  showTrading: boolean;
  tradingTitle: string;
  pairs: TradingPair[];
  showExplorer: boolean;
  explorerLabel: string;
  explorerUrl: string;
  showHomeIndicator: boolean;
};

export const DEFAULT_RECEIPT: ReceiptData = {
  title: "Deposit details",
  amount: "2672.35",
  currency: "USDT",
  status: "Received",
  blockchain: "TRC20",
  type: "Deposit",
  address: "THdy8AhoCAxBXFNwemeGDderigGhcVMHL6",
  txid: "9pa0h00rsgsq8khv39e5003vidx3zbffapokup86ruj6nlvl847aszvbuona9",
  time: "12/28/2025, 12:15:59",
  showTrading: true,
  tradingTitle: "Start trading popular crypto with your funds",
  pairs: [
    {
      id: "btc",
      symbol: "BTC/USDT",
      price: "87,767.46",
      change: "+0.12%",
      hot: true,
      icon: "btc",
    },
    {
      id: "eth",
      symbol: "ETH/USDT",
      price: "2,940.63",
      change: "+0.32%",
      hot: true,
      icon: "eth",
    },
  ],
  showExplorer: true,
  explorerLabel: "View on blockchain explorer",
  explorerUrl: "https://tronscan.org/#/transaction/9pa0h00rsgsq8khv39e5003vidx3zbffapokup86ruj6nlvl847aszvbuona9",
  showHomeIndicator: true,
};

export const NETWORKS = [
  "TRC20",
  "ERC20",
  "BEP20",
  "Solana",
  "Bitcoin",
  "Lightning",
  "Polygon",
  "Arbitrum",
  "Base",
  "TON",
  "AVAX C-Chain",
] as const;

export const CURRENCIES = [
  "USDT",
  "USDC",
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "TRX",
  "TON",
  "XRP",
] as const;

export const STATUSES: ReceiptStatus[] = [
  "Received",
  "Processing",
  "Failed",
  "Cancelled",
];

export const TYPES = ["Deposit", "Withdrawal", "Transfer", "Internal"] as const;

export function formatAmount(raw: string): string {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned) return "0.00";
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return raw;
  const frac = cleaned.split(".")[1];
  const decimals = frac ? Math.min(Math.max(frac.length, 2), 8) : 2;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 8,
  });
}

export function amountSign(type: string): "+" | "−" {
  const t = type.toLowerCase();
  if (t.includes("withdraw") || t.includes("send") || t.includes("out")) {
    return "−";
  }
  return "+";
}

export function isPositiveChange(change: string): boolean {
  const t = change.trim();
  if (t.startsWith("-") || t.startsWith("−")) return false;
  return true;
}

export function explorerFor(blockchain: string, txid: string): string {
  const net = blockchain.toUpperCase();
  const id = encodeURIComponent(txid);
  if (net.includes("TRC") || net.includes("TRON")) {
    return `https://tronscan.org/#/transaction/${id}`;
  }
  if (net.includes("BEP") || net.includes("BSC")) {
    return `https://bscscan.com/tx/${id}`;
  }
  if (net.includes("SOL")) {
    return `https://solscan.io/tx/${id}`;
  }
  if (net.includes("POLYGON") || net.includes("MATIC")) {
    return `https://polygonscan.com/tx/${id}`;
  }
  if (net.includes("ARB")) {
    return `https://arbiscan.io/tx/${id}`;
  }
  if (net.includes("BASE")) {
    return `https://basescan.org/tx/${id}`;
  }
  if (net.includes("BTC") || net.includes("BITCOIN")) {
    return `https://mempool.space/tx/${id}`;
  }
  if (net.includes("TON")) {
    return `https://tonviewer.com/transaction/${id}`;
  }
  return `https://etherscan.io/tx/${id}`;
}

export function receiptFilename(data: ReceiptData, ext: "pdf" | "png"): string {
  const amt = data.amount.replace(/[^\d.]/g, "") || "0";
  const coin = (data.currency || "COIN").replace(/[^\w]/g, "").toUpperCase();
  const kind = (data.type || "deposit").replace(/\s+/g, "-").toLowerCase();
  return `${kind}-${coin}-${amt}.${ext}`;
}

export function formatTimeFromInput(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy}, ${hh}:${min}:${ss}`;
}
