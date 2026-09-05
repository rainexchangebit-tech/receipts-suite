import { downloadFilename, type Receipt } from "@/lib/receipt";

export const SLIP_WIDTH = 390;
export const SLIP_HEIGHT = 844;

type Html2Canvas = (typeof import("html2canvas"))["default"];

async function loadHtml2Canvas(): Promise<Html2Canvas> {
  const mod = await import("html2canvas");
  return mod.default;
}

function waitFrames(n = 2) {
  return new Promise<void>((resolve) => {
    const step = (left: number) => {
      if (left <= 0) resolve();
      else requestAnimationFrame(() => step(left - 1));
    };
    step(n);
  });
}

async function waitForCaptureReady(el: HTMLElement) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const images = Array.from(el.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
  await waitFrames(3);
}

function sanitizeClone(clonedDoc: Document) {
  const root = clonedDoc.getElementById("slip-capture");
  if (!root) return;
  const mount = root.parentElement as HTMLElement | null;
  if (mount) {
    mount.style.left = "0";
    mount.style.top = "0";
    mount.style.opacity = "1";
    mount.style.visibility = "visible";
    mount.style.position = "fixed";
    mount.style.transform = "none";
    mount.style.zIndex = "0";
    mount.style.pointerEvents = "none";
  }
  const el = root as HTMLElement;
  el.style.opacity = "1";
  el.style.visibility = "visible";
  el.style.transform = "none";
  el.style.width = `${SLIP_WIDTH}px`;
  el.style.height = `${SLIP_HEIGHT}px`;
  el.style.background = "#ffffff";
  root.querySelectorAll("input, textarea").forEach((node) => {
    const input = node as HTMLInputElement | HTMLTextAreaElement;
    const span = clonedDoc.createElement("span");
    span.textContent = input.value;
    span.className = input.className.replace(/\bslip-edit\b/g, "").trim();
    input.replaceWith(span);
  });
}

async function withPaintedMount<T>(
  el: HTMLElement,
  fn: () => Promise<T>,
): Promise<T> {
  const mount = el.parentElement;
  const prev = mount
    ? {
        cssText: mount.style.cssText,
        className: mount.className,
      }
    : null;

  const veil = document.createElement("div");
  veil.setAttribute("data-slip-export-veil", "");
  veil.style.cssText =
    "position:fixed;inset:0;background:#111214;z-index:2147483645;pointer-events:none;";

  if (mount) {
    Object.assign(mount.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      opacity: "1",
      visibility: "visible",
      pointerEvents: "none",
      zIndex: "2147483644",
      transform: "none",
    } as Partial<CSSStyleDeclaration>);
    mount.classList.add("is-capturing");
  }
  document.body.appendChild(veil);
  await waitForCaptureReady(el);
  try {
    return await fn();
  } finally {
    veil.remove();
    if (mount && prev) {
      mount.style.cssText = prev.cssText;
      mount.className = prev.className;
    }
  }
}

function flattenOpaque(
  source: HTMLCanvasElement,
  w: number,
  h: number,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) return source;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  return out;
}

function isBlankCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true;
  const sx = canvas.width / SLIP_WIDTH;
  const sy = canvas.height / SLIP_HEIGHT;
  const x = Math.max(0, Math.floor(170 * sx));
  const y = Math.max(0, Math.floor(88 * sy));
  const w = Math.max(1, Math.floor(50 * sx));
  const h = Math.max(1, Math.floor(50 * sy));
  const { data } = ctx.getImageData(x, y, w, h);
  let ink = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) continue;
    if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) ink += 1;
  }
  return ink < 20;
}

async function renderCanvas(el: HTMLElement, scale: number) {
  const html2canvas = await loadHtml2Canvas();
  return html2canvas(el, {
    scale,
    width: SLIP_WIDTH,
    height: SLIP_HEIGHT,
    backgroundColor: "#ffffff",
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000,
    scrollX: 0,
    scrollY: 0,
    onclone: sanitizeClone,
  });
}

async function capture(el: HTMLElement, scale: number) {
  const painted = await withPaintedMount(el, () => renderCanvas(el, scale));
  if (!isBlankCanvas(painted)) return painted;
  const retry = await withPaintedMount(el, () => renderCanvas(el, scale));
  if (isBlankCanvas(retry)) {
    throw new Error("Receipt capture was empty");
  }
  return retry;
}

async function captureExactPng(el: HTMLElement) {
  const canvas = await capture(el, 2);
  return flattenOpaque(canvas, SLIP_WIDTH, SLIP_HEIGHT);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob && blob.size > 32) resolve(blob);
      else reject(new Error("Could not encode PNG"));
    }, "image/png");
  });
}

async function asPngBlob(blob: Blob): Promise<Blob> {
  const bytes = await blob.arrayBuffer();
  const sig = new Uint8Array(bytes, 0, 8);
  const isPng =
    sig[0] === 0x89 &&
    sig[1] === 0x50 &&
    sig[2] === 0x4e &&
    sig[3] === 0x47;
  if (!isPng) throw new Error("Capture did not produce a PNG");
  return new Blob([bytes], { type: "image/png" });
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.position = "fixed";
  a.style.left = "0";
  a.style.top = "0";
  a.style.width = "1px";
  a.style.height = "1px";
  a.style.opacity = "0";
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 8_000);
}

async function capturePngBlob(el: HTMLElement) {
  const canvas = await captureExactPng(el);
  if (isBlankCanvas(canvas)) {
    throw new Error("Receipt capture was empty");
  }
  const blob = await canvasToBlob(canvas);
  return asPngBlob(blob);
}

export async function downloadReceiptPdf(el: HTMLElement, data: Receipt) {
  const canvas = await capture(el, 3);
  const opaque = flattenOpaque(canvas, canvas.width, canvas.height);
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [SLIP_WIDTH, SLIP_HEIGHT],
    hotfixes: ["px_scaling"],
    compress: true,
  });
  const img = opaque.toDataURL("image/png");
  pdf.addImage(img, "PNG", 0, 0, SLIP_WIDTH, SLIP_HEIGHT, undefined, "FAST");
  const blob = pdf.output("blob");
  saveBlob(blob, downloadFilename(data, "pdf"));
}

export async function downloadReceiptPng(el: HTMLElement, data: Receipt) {
  const blob = await capturePngBlob(el);
  saveBlob(blob, downloadFilename(data, "png"));
}

export async function copyReceiptPng(el: HTMLElement) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("Clipboard is not available");
  }

  const pngPromise = capturePngBlob(el);

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": pngPromise,
      }),
    ]);
    return;
  } catch {
    const png = await pngPromise;
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": png,
      }),
    ]);
  }
}
