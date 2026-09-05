import type { Receipt } from "@/lib/receipt-store";

function slugPart(value: string): string {
  return value.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function receiptFilename(
  asset: string,
  signedAmount: string,
  date: string,
  ext: string,
): string {
  const day = (date.split(" ")[0] || "receipt").replace(/[^\d-]/g, "");
  const amt = slugPart(signedAmount);
  const coin = slugPart(asset) || "ASSET";
  return `withdrawal-${amt}-${coin}-${day}.${ext}`;
}

export function formatReceiptText(r: Receipt): string {
  return [
    r.title,
    `${r.signedAmount} ${r.asset}`,
    r.status,
    r.note,
    "",
    `Network: ${r.network}`,
    `Address: ${r.address}`,
    `Txid: ${r.txid}`,
    `Amount: ${r.amount}`,
    `Network fee: ${r.fee}`,
    `Wallet: ${r.wallet}`,
    `Date: ${r.date}`,
  ].join("\n");
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function withNaturalScale<T>(node: HTMLElement, fn: () => Promise<T>): Promise<T> {
  const fit = node.closest(".phone-fit") as HTMLElement | null;
  const prev = fit?.style.getPropertyValue("--phone-scale") ?? "";
  if (fit) fit.style.setProperty("--phone-scale", "1");
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  try {
    return await fn();
  } finally {
    if (fit) {
      if (prev) fit.style.setProperty("--phone-scale", prev);
      else fit.style.removeProperty("--phone-scale");
    }
  }
}

async function capturePng(node: HTMLElement): Promise<string> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  return withNaturalScale(node, async () => {
    const { toPng } = await import("html-to-image");
    const options = {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#17181C",
      skipFonts: false,
      style: {
        transform: "none",
        inset: "auto",
      },
    };
    await toPng(node, options);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    return toPng(node, options);
  });
}

export async function downloadPng(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await capturePng(node);
  triggerDownload(dataUrl, filename);
}

export async function downloadPdf(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await capturePng(node);
  const { jsPDF } = await import("jspdf");
  const img = await loadImage(dataUrl);
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const pdf = new jsPDF({
    orientation: height >= width ? "portrait" : "landscape",
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
    compress: true,
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, width, height, undefined, "FAST");
  pdf.save(filename);
}

export async function copyPng(node: HTMLElement): Promise<void> {
  const dataUrl = await capturePng(node);
  const blob = await (await fetch(dataUrl)).blob();
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    triggerDownload(dataUrl, "withdrawal-receipt.png");
    throw new Error("FALLBACK_DOWNLOAD");
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type || "image/png"]: blob })]);
  } catch {
    triggerDownload(dataUrl, "withdrawal-receipt.png");
    throw new Error("FALLBACK_DOWNLOAD");
  }
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load captured image."));
    img.src = src;
  });
}
