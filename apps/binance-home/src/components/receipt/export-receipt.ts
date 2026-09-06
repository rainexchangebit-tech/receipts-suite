import { jsPDF } from "jspdf";
import {
  ORIGINAL,
  OVERLAYS,
  RECEIPT_HEIGHT,
  RECEIPT_WIDTH,
  absPercentLabel,
  formatPnl,
  formatUsd,
  isDown,
  statusDirty,
  type ReceiptFields,
} from "@/lib/receipt";
import { drawStatusBar, loadStatusAssets } from "@/components/receipt/StatusBar";

const SCALE = 2;

function stamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function fileBaseName(totalUsdt: string) {
  const safe = totalUsdt.replace(/[^\d.]/g, "").slice(0, 16) || "slip";
  return `wallet-receipt-${safe}-${stamp()}`;
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type Box = (typeof OVERLAYS)[keyof typeof OVERLAYS];

async function loadBaseImage() {
  const img = new Image();
  img.decoding = "sync";
  img.src = "/binance-home/receipt-base.png";
  await img.decode();
  return img;
}

export async function renderReceiptCanvas(fields: ReceiptFields) {
  await document.fonts.ready;
  const img = await loadBaseImage();

  const canvas = document.createElement("canvas");
  canvas.width = RECEIPT_WIDTH * SCALE;
  canvas.height = RECEIPT_HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not render the slip.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.scale(SCALE, SCALE);
  ctx.drawImage(img, 0, 0, RECEIPT_WIDTH, RECEIPT_HEIGHT);

  if (statusDirty(fields)) {
    const assets = await loadStatusAssets();
    drawStatusBar(ctx, fields, assets);
  }

  const cover = (box: Box) => {
    ctx.fillStyle = box.cover;
    ctx.fillRect(box.left, box.top, box.width, box.height);
  };

  const write = (box: Box, text: string, color: string) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.left, box.top, box.width, box.height);
    ctx.clip();
    ctx.fillStyle = color;
    ctx.font = `${box.weight} ${box.fontSize}px "IBM Plex Sans", "SF Pro Display", -apple-system, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(text, box.left + (box.padX || 2), box.top + box.height / 2 + 1);
    ctx.restore();
  };

  if (fields.totalUsdt !== ORIGINAL.totalUsdt) {
    cover(OVERLAYS.amount);
    cover(OVERLAYS.usd);
    write(OVERLAYS.amount, fields.totalUsdt || "0", OVERLAYS.amount.color);
    write(OVERLAYS.usd, formatUsd(fields.totalUsdt), OVERLAYS.usd.color);
  }

  if (fields.pnlUsdt !== ORIGINAL.pnlUsdt || fields.pnlPct !== ORIGINAL.pnlPct) {
    cover(OVERLAYS.pnl);
    const down = isDown(fields.pnlUsdt) || isDown(fields.pnlPct);
    write(
      OVERLAYS.pnl,
      formatPnl(fields.pnlUsdt, fields.pnlPct),
      down ? OVERLAYS.pnl.colorDown : OVERLAYS.pnl.colorUp,
    );
  }

  if (fields.bnb !== ORIGINAL.bnb) {
    cover(OVERLAYS.bnb);
    write(OVERLAYS.bnb, fields.bnb || "0", OVERLAYS.bnb.color);
  }

  if (fields.bnbPct !== ORIGINAL.bnbPct) {
    cover(OVERLAYS.bnbPct);
    const down = isDown(fields.bnbPct);
    const label = `${down ? "▾ " : "▴ "}${absPercentLabel(fields.bnbPct)}`;
    write(
      OVERLAYS.bnbPct,
      label,
      down ? OVERLAYS.bnbPct.colorDown : OVERLAYS.bnbPct.colorUp,
    );
  }

  return canvas;
}

export async function downloadPng(fields: ReceiptFields) {
  const canvas = await renderReceiptCanvas(fields);
  downloadDataUrl(canvas.toDataURL("image/png"), `${fileBaseName(fields.totalUsdt)}.png`);
}

export async function downloadPdf(fields: ReceiptFields) {
  const canvas = await renderReceiptCanvas(fields);
  const dataUrl = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [RECEIPT_WIDTH, RECEIPT_HEIGHT],
    compress: true,
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, RECEIPT_WIDTH, RECEIPT_HEIGHT, undefined, "FAST");
  pdf.save(`${fileBaseName(fields.totalUsdt)}.pdf`);
}

export async function copyPng(fields: ReceiptFields) {
  const canvas = await renderReceiptCanvas(fields);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not render the slip.");
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    throw new Error("Clipboard image copy is not available here. Download PNG instead.");
  }
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
