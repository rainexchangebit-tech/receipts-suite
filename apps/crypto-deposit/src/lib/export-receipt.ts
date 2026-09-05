import { fileStem, type ReceiptData } from "@/lib/receipt";

const CAPTURE = {
  pixelRatio: 3,
  cacheBust: true,
  backgroundColor: "#F7F8FA",
} as const;

async function waitForPaint(node: HTMLElement) {
  await document.fonts.ready;
  // Let layout/paint settle after font swap so capture isn't blurry.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  void node.offsetWidth;
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function capturePng(node: HTMLElement): Promise<string> {
  const { toPng } = await import("html-to-image");
  await waitForPaint(node);
  return toPng(node, CAPTURE);
}

export async function downloadPng(node: HTMLElement, data: ReceiptData) {
  const url = await capturePng(node);
  triggerDownload(url, `${fileStem(data)}.png`);
}

export async function downloadPdf(node: HTMLElement, data: ReceiptData) {
  const url = await capturePng(node);
  const { jsPDF } = await import("jspdf");
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  const widthMm = w * 0.264583;
  const heightMm = h * 0.264583;
  const pdf = new jsPDF({
    orientation: heightMm >= widthMm ? "portrait" : "landscape",
    unit: "mm",
    format: [widthMm, heightMm],
    compress: true,
  });
  pdf.addImage(url, "PNG", 0, 0, widthMm, heightMm, undefined, "FAST");
  pdf.save(`${fileStem(data)}.pdf`);
}

export async function copyPng(
  node: HTMLElement,
  data: ReceiptData,
): Promise<boolean> {
  const { toBlob } = await import("html-to-image");
  await waitForPaint(node);
  const blob = await toBlob(node, CAPTURE);
  if (!blob) throw new Error("Could not render the receipt image.");
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
      throw new Error("no-clipboard");
    }
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch {
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileStem(data)}.png`);
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return false;
  }
}
