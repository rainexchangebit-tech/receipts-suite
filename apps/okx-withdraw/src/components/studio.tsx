"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ClipboardCopy, Download, ImageDown, RotateCcw } from "lucide-react";
import { Toaster, toast } from "sonner";
import { ReceiptForm } from "@/components/receipt/receipt-form";
import { ReceiptPreview } from "@/components/receipt/receipt-preview";
import { Button } from "@/components/ui/button";
import {
  copyReceiptImage,
  downloadReceiptPdf,
  downloadReceiptPng,
} from "@/lib/pdf";
import { receiptFilename } from "@/lib/receipt";
import { useReceiptStore } from "@/lib/receipt-store";

export function Studio() {
  const data = useReceiptStore((s) => s.data);
  const patch = useReceiptStore((s) => s.patch);
  const setPair = useReceiptStore((s) => s.setPair);
  const reset = useReceiptStore((s) => s.reset);
  const captureRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState<"pdf" | "png" | "copy" | null>(null);
  const [tab, setTab] = useState<"preview" | "edit">("preview");

  useEffect(() => {
    useReceiptStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        void exportPdf();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function exportPdf() {
    const el = captureRef.current;
    if (!el || busyRef.current) return;
    busyRef.current = true;
    setBusy("pdf");
    try {
      const current = useReceiptStore.getState().data;
      await downloadReceiptPdf(el, receiptFilename(current, "pdf"));
      toast.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not build the PDF. Try again.");
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  }

  async function exportPng() {
    const el = captureRef.current;
    if (!el || busyRef.current) return;
    busyRef.current = true;
    setBusy("png");
    try {
      const current = useReceiptStore.getState().data;
      await downloadReceiptPng(el, receiptFilename(current, "png"));
      toast.success("PNG downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not export the image. Try again.");
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  }

  async function copyImage() {
    const el = captureRef.current;
    if (!el || busyRef.current) return;
    busyRef.current = true;
    setBusy("copy");
    try {
      await copyReceiptImage(el);
      toast.success("Image copied");
    } catch (err) {
      console.error(err);
      toast.error("Could not copy the image. Try Download PNG instead.");
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  }

  return (
    <div className="studio">
      <header className="studio-bar">
        <div className="studio-brand">
          <span className="studio-mark" aria-hidden="true" />
          <div>
            <p className="studio-name">Deposit Slip</p>
            <p className="studio-tag">Edit credentials, download a PDF</p>
          </div>
        </div>
        <div className="studio-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              toast("Restored original sample");
            }}
            aria-label="Reset to original"
          >
            <RotateCcw className="size-4" />
            <span className="hide-sm">Reset</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void exportPng()}
            disabled={busy !== null}
            aria-label="Download PNG"
          >
            <ImageDown className="size-4" />
            <span className="hide-sm">PNG</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void copyImage()}
            disabled={busy !== null}
            aria-label="Copy Image"
          >
            <ClipboardCopy className="size-4" />
            <span className="hide-sm">Copy Image</span>
          </Button>
          <Button
            size="sm"
            onClick={() => void exportPdf()}
            disabled={busy !== null}
          >
            <Download className="size-4" />
            {busy === "pdf" ? "Building…" : "Download PDF"}
          </Button>
        </div>
      </header>

      <div className="studio-tabs" role="tablist" aria-label="Studio views">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "preview"}
          className={tab === "preview" ? "studio-tab is-on" : "studio-tab"}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "edit"}
          className={tab === "edit" ? "studio-tab is-on" : "studio-tab"}
          onClick={() => setTab("edit")}
        >
          Edit fields
        </button>
      </div>

      <div className="studio-body" data-tab={tab}>
        <aside className="studio-editor">
          <p className="studio-editor-lead">
            Every line on the slip is live. Change the amount, address, hash, or
            time — the preview updates instantly.
          </p>
          <ReceiptForm data={data} onPatch={patch} onPair={setPair} />
        </aside>

        <section className="studio-stage" aria-label="Receipt preview">
          <ScaledPhone>
            <ReceiptPreview data={data} captureRef={captureRef} />
          </ScaledPhone>
          <p className="studio-hint">
            {busy
              ? "Rendering a high-resolution page…"
              : "⌘/Ctrl + Enter downloads the PDF"}
          </p>
        </section>
      </div>

      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1b1c21",
            color: "#f3f3f5",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
    </div>
  );
}

const SHELL_PAD = 24;
const SLIP_WIDTH = 390;

function ScaledPhone({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const ow = outer.clientWidth;
      const oh = outer.clientHeight;
      const iw = SLIP_WIDTH + SHELL_PAD;
      const ih = inner.scrollHeight;
      if (ow < 8 || ih < 8) return;
      const mobile = window.matchMedia("(max-width: 960px)").matches;
      const next = mobile
        ? Math.min(1, ow / iw)
        : Math.min(1, ow / iw, oh > 8 ? oh / ih : 1);
      setScale((prev) => {
        const v = Number.isFinite(next) && next > 0.2 ? next : 1;
        return Math.abs(v - prev) < 0.005 ? prev : v;
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    const mq = window.matchMedia("(max-width: 960px)");
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={outerRef} className="phone-wrap">
      <div
        style={{
          width: (SLIP_WIDTH + SHELL_PAD) * scale,
          height: innerRef.current
            ? innerRef.current.scrollHeight * scale
            : undefined,
          position: "relative",
        }}
      >
        <div
          ref={innerRef}
          className="phone-shell"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
