import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileText,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { RECEIPT_H, RECEIPT_W } from "@/lib/receipt";
import { EditorPanel } from "@/components/editor-panel";
import { ReceiptScreen } from "@/components/receipt-screen";
import { copyPng, downloadPdf, downloadPng } from "@/lib/export-receipt";
import { useReceiptStore } from "@/store/receipt-store";

export const Route = createFileRoute("/")({ component: Home });

type Job = "png" | "pdf" | "copy" | null;

function Home() {
  const data = useReceiptStore();
  const reset = useReceiptStore((s) => s.reset);
  const receiptRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [job, setJob] = useState<Job>(null);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => {
      const pad = 32;
      const w = Math.max(120, el.clientWidth - pad);
      const h = Math.max(120, el.clientHeight - pad);
      const next = Math.min(w / RECEIPT_W, h / RECEIPT_H, 1);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab]);

  async function run(
    kind: Exclude<Job, null>,
    fn: () => Promise<void>,
    ok: string,
  ) {
    const node = receiptRef.current;
    if (!node) {
      toast.error("Receipt is not ready yet.");
      return;
    }
    setJob(kind);
    try {
      await fn();
      toast.success(ok);
      if (kind === "copy") {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed.";
      toast.error(message);
    } finally {
      setJob(null);
    }
  }

  const busy = job !== null;

  return (
    <div className="studio">
      <div className="capture-slot" aria-hidden="true">
        <ReceiptScreen ref={receiptRef} data={data} />
      </div>

      <header className="studio-header">
        <div className="studio-brand">
          <span className="studio-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <rect
                x="3"
                y="2"
                width="12"
                height="14"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M6 6.5h6M6 9.5h6M6 12.5h4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <h1>Receipt Studio</h1>
            <p>Edit credentials · download PNG or PDF</p>
          </div>
        </div>
        <div className="studio-exports">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              reset();
              toast.message("Restored the original ETH slip.");
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={async () => {
              const node = receiptRef.current;
              if (!node) {
                toast.error("Receipt is not ready yet.");
                return;
              }
              setJob("copy");
              try {
                const copied = await copyPng(node, data);
                if (copied) {
                  toast.success("Receipt copied as PNG.");
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                } else {
                  toast.message("Clipboard unavailable — PNG downloaded instead.");
                }
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : "Copy failed.";
                toast.error(message);
              } finally {
                setJob(null);
              }
            }}
          >
            {job === "copy" ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : copied ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
            Copy
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={() =>
              run(
                "png",
                () => downloadPng(receiptRef.current!, data),
                "PNG downloaded.",
              )
            }
          >
            {job === "png" ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            PNG
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={() =>
              run(
                "pdf",
                () => downloadPdf(receiptRef.current!, data),
                "PDF downloaded.",
              )
            }
          >
            {job === "pdf" ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <FileText size={14} />
            )}
            PDF
          </button>
        </div>
      </header>

      <div className="studio-tabs">
        <button
          type="button"
          className="studio-tab"
          data-active={tab === "edit"}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          className="studio-tab"
          data-active={tab === "preview"}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>

      <div className="studio-body">
        <aside className="panel-edit" data-show={tab === "edit"}>
          <div className="editor-head">
            <h2>Settings</h2>
            <p>Edits update the receipt instantly</p>
          </div>
          <div className="editor-scroll">
            <EditorPanel />
          </div>
        </aside>
        <section className="panel-preview" data-show={tab === "preview"}>
          <div ref={stageRef} className="preview-stage">
            <div
              className="preview-frame"
              style={{
                width: RECEIPT_W * scale,
                height: RECEIPT_H * scale,
              }}
            >
              <div
                style={{
                  width: RECEIPT_W,
                  height: RECEIPT_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <ReceiptScreen data={data} />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#16191e",
            border: "1px solid #262b33",
            color: "#eef0f3",
          },
        }}
      />
    </div>
  );
}
