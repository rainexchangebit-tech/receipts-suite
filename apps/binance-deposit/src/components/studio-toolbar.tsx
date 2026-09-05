import { useState } from "react";
import { Copy, FileDown, ImageDown, LoaderCircle, RotateCcw, Type } from "lucide-react";
import { toast } from "sonner";
import {
  copyPng,
  copyText,
  downloadPdf,
  downloadPng,
  formatReceiptText,
  receiptFilename,
} from "@/lib/export-receipt";
import { useReceiptStore } from "@/lib/receipt-store";

function captureNode(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-receipt-root='1']");
}

async function withExport<T>(fn: () => Promise<T>): Promise<T> {
  const setExporting = useReceiptStore.getState().setExporting;
  setExporting(true);
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  try {
    return await fn();
  } finally {
    setExporting(false);
  }
}

export function StudioToolbar() {
  const receipt = useReceiptStore((s) => s.receipt);
  const reset = useReceiptStore((s) => s.reset);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (id: string, work: () => Promise<void>, ok: string) => {
    if (busy) return;
    const node = captureNode();
    if (!node) {
      toast.error("Receipt is not ready yet");
      return;
    }
    setBusy(id);
    try {
      await withExport(work);
      toast.success(ok);
    } catch (err) {
      if (err instanceof Error && err.message === "FALLBACK_DOWNLOAD") {
        toast.success("Clipboard blocked — PNG downloaded instead");
      } else {
        toast.error(err instanceof Error ? err.message : "Export failed");
      }
    } finally {
      setBusy(null);
    }
  };

  const pngName = receiptFilename(receipt.asset, receipt.signedAmount, receipt.date, "png");
  const pdfName = receiptFilename(receipt.asset, receipt.signedAmount, receipt.date, "pdf");

  return (
    <header className="studio-bar">
      <div className="studio-brand">
        <span className="studio-mark" aria-hidden />
        <div>
          <p className="studio-kicker">Receipt studio</p>
          <h1>Withdrawal slip</h1>
        </div>
      </div>

      <div className="studio-actions">
        <button
          type="button"
          className="tb-btn"
          disabled={Boolean(busy)}
          onClick={() =>
            run(
              "copy-text",
              async () => {
                await copyText(formatReceiptText(receipt));
              },
              "Details copied",
            )
          }
        >
          {busy === "copy-text" ? <LoaderCircle className="spin" size={16} /> : <Type size={16} />}
          <span className="tb-full">Copy details</span>
          <span className="tb-short">Text</span>
        </button>
        <button
          type="button"
          className="tb-btn"
          disabled={Boolean(busy)}
          onClick={() => {
            const node = captureNode();
            if (!node) return;
            void run("copy-png", () => copyPng(node), "Image copied");
          }}
        >
          {busy === "copy-png" ? <LoaderCircle className="spin" size={16} /> : <Copy size={16} />}
          <span className="tb-full">Copy image</span>
          <span className="tb-short">Copy</span>
        </button>
        <button
          type="button"
          className="tb-btn"
          disabled={Boolean(busy)}
          onClick={() => {
            const node = captureNode();
            if (!node) return;
            void run("png", () => downloadPng(node, pngName), "PNG downloaded");
          }}
        >
          {busy === "png" ? <LoaderCircle className="spin" size={16} /> : <ImageDown size={16} />}
          PNG
        </button>
        <button
          type="button"
          className="tb-btn tb-primary"
          disabled={Boolean(busy)}
          onClick={() => {
            const node = captureNode();
            if (!node) return;
            void run("pdf", () => downloadPdf(node, pdfName), "PDF downloaded");
          }}
        >
          {busy === "pdf" ? <LoaderCircle className="spin" size={16} /> : <FileDown size={16} />}
          PDF
        </button>
        <button
          type="button"
          className="tb-btn tb-ghost"
          disabled={Boolean(busy)}
          onClick={() => {
            reset();
            toast.success("Reset to screenshot");
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </header>
  );
}
