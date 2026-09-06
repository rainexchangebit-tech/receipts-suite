export const RECEIPT_WIDTH = 589;
export const RECEIPT_HEIGHT = 1280;

export const ORIGINAL = {
  totalUsdt: "0.25251154",
  pnlUsdt: "-0.0003362",
  pnlPct: "-0.13",
  bnb: "722.40",
  bnbPct: "-0.48",
  statusTime: "11:22",
  muteOn: false,
  cellularOn: true,
  cellularBars: 4,
  networkOn: false,
  networkLabel: "5G",
  wifiOn: true,
  batteryPct: "32",
  batteryPctOn: true,
  batteryPctInside: true,
} as const;

export type ReceiptFields = {
  totalUsdt: string;
  pnlUsdt: string;
  pnlPct: string;
  bnb: string;
  bnbPct: string;
  statusTime: string;
  muteOn: boolean;
  cellularOn: boolean;
  cellularBars: number;
  networkOn: boolean;
  networkLabel: string;
  wifiOn: boolean;
  batteryPct: string;
  batteryPctOn: boolean;
  batteryPctInside: boolean;
};

export const OVERLAYS = {
  amount: {
    left: 16,
    top: 278,
    width: 380,
    height: 38,
    cover: "#f5f5f5",
    fontSize: 32,
    weight: 700,
    color: "#0b0b0b",
    tracking: "-0.04em",
    padX: 0,
  },
  usd: {
    left: 16,
    top: 326,
    width: 250,
    height: 28,
    cover: "#f5f5f5",
    fontSize: 13.5,
    weight: 400,
    color: "#8d8d8d",
    tracking: "0",
    padX: 0,
  },
  pnl: {
    left: 110,
    top: 352,
    width: 220,
    height: 22,
    cover: "#f5f5f5",
    fontSize: 13,
    weight: 400,
    colorDown: "#d14d68",
    colorUp: "#2ebd85",
    tracking: "0",
    padX: 0,
  },
  // Ink of "722.40" on the BNB card: x=36–118, y=867–884 (not the Markets row).
  bnb: {
    left: 26,
    top: 861,
    width: 140,
    height: 28,
    cover: "#ffffff",
    fontSize: 24,
    weight: 600,
    color: "#0b0b0b",
    tracking: "-0.02em",
    padX: 8,
  },
  // Ink of "▾ 0.48%" on the BNB card: x=36–100, y=898–909 — above the sparkline.
  bnbPct: {
    left: 26,
    top: 894,
    width: 120,
    height: 18,
    cover: "#ffffff",
    fontSize: 13,
    weight: 400,
    colorDown: "#e33e5c",
    colorUp: "#2ebd85",
    tracking: "0",
    padX: 8,
  },
  status: {
    left: 0,
    top: 0,
    width: 589,
    height: 54,
    cover: "#ffffff",
    fontSize: 16,
    weight: 600,
    color: "#111111",
    tracking: "-0.02em",
    padX: 0,
  },
} as const;

export function formatUsd(total: string) {
  const trimmed = total.trim();
  if (!trimmed) return "≈ $0";
  return `≈ $${trimmed}`;
}

export function formatPnl(amount: string, pct: string) {
  const a = amount.trim() || "0";
  const p = pct.trim().replace(/%/g, "") || "0";
  return `${a} USDT(${p}%)`;
}

export function parseSigned(raw: string) {
  const n = Number.parseFloat(raw.replace(/[%+\s,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function isDown(raw: string) {
  return parseSigned(raw) < 0;
}

export function absPercentLabel(raw: string) {
  const n = parseSigned(raw);
  const body = raw.trim().replace(/%/g, "").replace(/^[+-]/, "");
  if (!body) return "0%";
  if (n === 0 && (raw.trim() === "0" || raw.trim() === "0%" || raw.trim() === "+0")) {
    return "0%";
  }
  return `${body}%`;
}

export function clampBars(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(4, Math.round(n)));
}

export function parseBattery(raw: string) {
  const n = Number.parseInt(raw.replace(/[^\d-]/g, ""), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function networkText(fields: Pick<ReceiptFields, "networkLabel">) {
  const label = fields.networkLabel.trim();
  return label || "5G";
}

export function statusDirty(fields: ReceiptFields) {
  return (
    fields.statusTime !== ORIGINAL.statusTime ||
    fields.muteOn !== ORIGINAL.muteOn ||
    fields.cellularOn !== ORIGINAL.cellularOn ||
    clampBars(fields.cellularBars) !== ORIGINAL.cellularBars ||
    fields.networkOn !== ORIGINAL.networkOn ||
    (fields.networkOn && networkText(fields) !== ORIGINAL.networkLabel) ||
    fields.wifiOn !== ORIGINAL.wifiOn ||
    parseBattery(fields.batteryPct) !== parseBattery(ORIGINAL.batteryPct) ||
    fields.batteryPctOn !== ORIGINAL.batteryPctOn ||
    fields.batteryPctInside !== ORIGINAL.batteryPctInside
  );
}

export function fieldsMatchOriginal(fields: ReceiptFields) {
  return (
    fields.totalUsdt === ORIGINAL.totalUsdt &&
    fields.pnlUsdt === ORIGINAL.pnlUsdt &&
    fields.pnlPct === ORIGINAL.pnlPct &&
    fields.bnb === ORIGINAL.bnb &&
    fields.bnbPct === ORIGINAL.bnbPct &&
    !statusDirty(fields)
  );
}
