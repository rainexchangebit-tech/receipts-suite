import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, FileText, LoaderCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { WalletReceipt } from "@/components/receipt/WalletReceipt";
import { EditorPanel } from "@/components/receipt/EditorPanel";
import { copyPng, downloadPdf, downloadPng } from "@/components/receipt/export-receipt";
import { Button } from "@/components/ui/button";
import { ORIGINAL, RECEIPT_HEIGHT, RECEIPT_WIDTH, type ReceiptFields } from "@/lib/receipt";
import { useReceiptStore } from "@/lib/receipt-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const totalUsdt = useReceiptStore((s) => s.totalUsdt);
  const pnlUsdt = useReceiptStore((s) => s.pnlUsdt);
  const pnlPct = useReceiptStore((s) => s.pnlPct);
  const bnb = useReceiptStore((s) => s.bnb);
  const bnbPct = useReceiptStore((s) => s.bnbPct);
  const statusTime = useReceiptStore((s) => s.statusTime);
  const muteOn = useReceiptStore((s) => s.muteOn);
  const cellularOn = useReceiptStore((s) => s.cellularOn);
  const cellularBars = useReceiptStore((s) => s.cellularBars);
  const networkOn = useReceiptStore((s) => s.networkOn);
  const networkLabel = useReceiptStore((s) => s.networkLabel);
  const wifiOn = useReceiptStore((s) => s.wifiOn);
  const batteryPct = useReceiptStore((s) => s.batteryPct);
  const batteryPctOn = useReceiptStore((s) => s.batteryPctOn);
  const batteryPctInside = useReceiptStore((s) => s.batteryPctInside);
  const setField = useReceiptStore((s) => s.setField);
  const reset = useReceiptStore((s) => s.reset);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void Promise.resolve(useReceiptStore.persist.rehydrate()).then(() => setHydrated(true));
  }, []);

  const live: ReceiptFields = {
    totalUsdt,
    pnlUsdt,
    pnlPct,
    bnb,
    bnbPct,
    statusTime,
    muteOn,
    cellularOn,
    cellularBars,
    networkOn,
    networkLabel,
    wifiOn,
    batteryPct,
    batteryPctOn,
    batteryPctInside,
  };
  const fields: ReceiptFields = hydrated
    ? {
        ...ORIGINAL,
        ...live,
      }
    : { ...ORIGINAL };

  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [busy, setBusy] = useState<"png" | "pdf" | "copy" | null>(null);
  const [focusKey, setFocusKey] = useState<keyof ReceiptFields | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.max(0, el.clientWidth - 16);
      const h = Math.max(0, el.clientHeight - 16);
      const fitted = Math.min(w / RECEIPT_WIDTH, h / RECEIPT_HEIGHT);
      setScale(Math.min(1, Math.max(0.22, fitted)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  async function runExport(kind: "png" | "pdf" | "copy") {
    setBusy(kind);
    try {
      if (kind === "png") {
        await downloadPng(fields);
        toast.success("PNG downloaded");
      } else if (kind === "pdf") {
        await downloadPdf(fields);
        toast.success("PDF downloaded");
      } else {
        await copyPng(fields);
        toast.success("Copied to clipboard");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      toast.error(message);
    } finally {
      setBusy(null);
    }
  }

  const scaledH = RECEIPT_HEIGHT * scale;
  const scaledW = RECEIPT_WIDTH * scale;

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#18181c",
            border: "1px solid rgb(236 232 224 / 0.12)",
            color: "#ece8e0",
          },
        }}
      />

      <header className="shrink-0 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">
              Wallet snapshot
            </p>
            <h1 className="font-display text-[22px] leading-none font-medium tracking-tight">
              Slip Studio
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => void runExport("png")}
              disabled={busy !== null}
            >
              {busy === "png" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void runExport("pdf")}
              disabled={busy !== null}
            >
              {busy === "pdf" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void runExport("copy")}
              disabled={busy !== null}
            >
              {busy === "copy" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Copy className="size-4" />
              )}
              Copy
            </Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 overflow-hidden grid-rows-[minmax(0,38vh)_minmax(0,1fr)] lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
        <aside
          data-editor-pane
          className="editor-scroll min-h-0 h-full overflow-x-hidden overflow-y-auto overscroll-contain border-b border-border px-4 py-4 lg:border-r lg:border-b-0 lg:px-5 lg:py-5"
        >
          <EditorPanel
            fields={fields}
            focusKey={focusKey}
            onChange={(key, value) => {
              setField(key, value);
            }}
            onReset={() => {
              reset();
              toast.message("Restored original figures");
            }}
          />
        </aside>

        <div
          ref={stageRef}
          data-preview-pane
          className="flex h-full min-h-0 items-center justify-center overflow-hidden px-3 py-3"
        >
          <div
            className="relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgb(0_0_0/0.45)] ring-1 ring-white/8"
            style={{ width: scaledW, height: scaledH }}
          >
            <div
              style={{
                width: RECEIPT_WIDTH,
                height: RECEIPT_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <WalletReceipt fields={fields} onEdit={(key) => setFocusKey(key)} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
