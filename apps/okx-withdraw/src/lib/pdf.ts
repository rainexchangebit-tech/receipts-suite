import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const RECEIPT_WIDTH = 390;

async function capturePng(el: HTMLElement): Promise<string> {
  await document.fonts.ready;
  // Yield a frame so layout/paint settle before rasterizing.
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  const height = Math.max(el.scrollHeight, el.offsetHeight);
  return toPng(el, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: "#ffffff",
    width: RECEIPT_WIDTH,
    height,
    canvasWidth: RECEIPT_WIDTH * 3,
    canvasHeight: height * 3,
    style: {
      transform: "none",
      width: `${RECEIPT_WIDTH}px`,
      height: `${height}px`,
      margin: "0",
      inset: "auto",
    },
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function downloadReceiptPdf(
  el: HTMLElement,
  filename: string,
): Promise<void> {
  const dataUrl = await capturePng(el);
  const height = Math.max(el.scrollHeight, el.offsetHeight);
  const widthMm = 90;
  const heightMm = (height / RECEIPT_WIDTH) * widthMm;
  const pdf = new jsPDF({
    orientation: heightMm >= widthMm ? "portrait" : "landscape",
    unit: "mm",
    format: [widthMm, heightMm],
    compress: true,
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, widthMm, heightMm, undefined, "FAST");
  const blob = pdf.output("blob");
  triggerDownload(blob, filename);
}

export async function downloadReceiptPng(
  el: HTMLElement,
  filename: string,
): Promise<void> {
  const dataUrl = await capturePng(el);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  triggerDownload(blob, filename);
}

export async function copyReceiptImage(el: HTMLElement): Promise<void> {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("Image clipboard is not supported by this browser");
  }
  const dataUrl = await capturePng(el);
  const blob = await (await fetch(dataUrl)).blob();
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
