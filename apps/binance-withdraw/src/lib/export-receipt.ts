import { toPng, toBlob } from "html-to-image";
import { jsPDF } from "jspdf";
import { RECEIPT_H, RECEIPT_W } from "./receipt";

function waitFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function withExportClass<T>(el: HTMLElement, run: () => Promise<T>): Promise<T> {
  el.classList.add("is-exporting");
  try {
    await waitFrame();
    return await run();
  } finally {
    el.classList.remove("is-exporting");
  }
}

const captureOpts = {
  pixelRatio: 3,
  cacheBust: true,
  backgroundColor: "#1d2027",
  width: RECEIPT_W,
  height: RECEIPT_H,
  style: {
    transform: "none",
    width: `${RECEIPT_W}px`,
    height: `${RECEIPT_H}px`,
    margin: "0",
  },
};

export async function captureReceiptPng(el: HTMLElement): Promise<string> {
  return withExportClass(el, () => toPng(el, captureOpts));
}

export async function captureReceiptBlob(el: HTMLElement): Promise<Blob> {
  return withExportClass(el, async () => {
    const blob = await toBlob(el, captureOpts);
    if (!blob) throw new Error("Could not render the receipt image.");
    return blob;
  });
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

export async function downloadReceiptPng(el: HTMLElement, filename: string) {
  const url = await captureReceiptPng(el);
  triggerDownload(url, filename);
}

export async function downloadReceiptPdf(el: HTMLElement, filename: string) {
  const url = await captureReceiptPng(el);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [RECEIPT_W, RECEIPT_H],
    hotfixes: ["px_scaling"],
    compress: true,
  });
  pdf.addImage(url, "PNG", 0, 0, RECEIPT_W, RECEIPT_H, undefined, "FAST");
  pdf.save(filename);
}

export async function copyReceiptPng(el: HTMLElement) {
  const blob = await captureReceiptBlob(el);
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("Clipboard is not available in this browser.");
  }
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
