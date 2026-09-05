import { useEffect, useRef, useState, type ReactNode } from "react";
import { ClipboardCopy, Download, ImageDown, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useReceipt } from "@/lib/use-receipt";
import {
  copyReceiptPng,
  downloadReceiptPdf,
  downloadReceiptPng,
} from "@/lib/download-receipt";
import { EditorPanel } from "@/components/slip/editor-panel";
import { PhoneReceipt } from "@/components/slip/phone-receipt";

const FRAME_W = 410;
const FRAME_H = 864;

type Busy = "pdf" | "png" | "copy" | null;

function ScaledPhone({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 2) return;
      const byWidth = w / FRAME_W;
      const byHeight = h > 2 ? h / FRAME_H : 1;
      setScale(Math.min(1, byWidth, byHeight));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="phone-sizer">
      <div
        className="phone-sizer-inner"
        style={{ width: FRAME_W * scale, height: FRAME_H * scale }}
      >
        <div
          className="phone-scale"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ActionBar({
  busy,
  onReset,
  onCopy,
  onPng,
  onPdf,
}: {
  busy: Busy;
  onReset: () => void;
  onCopy: () => void;
  onPng: () => void;
  onPdf: () => void;
}) {
  const idle = busy === null;
  return (
    <>
      <button type="button" className="btn-ghost" onClick={onReset} disabled={!idle}>
        <RotateCcw className="size-4" strokeWidth={1.75} />
        Reset
      </button>
      <button type="button" className="btn-ghost" onClick={onCopy} disabled={!idle}>
        <ClipboardCopy className="size-4" strokeWidth={1.75} />
        {busy === "copy" ? "Copying…" : "Copy Image"}
      </button>
      <button type="button" className="btn-ghost" onClick={onPng} disabled={!idle}>
        <ImageDown className="size-4" strokeWidth={1.75} />
        {busy === "png" ? "Saving…" : "Download PNG"}
      </button>
      <button type="button" className="btn-primary" onClick={onPdf} disabled={!idle}>
        <Download className="size-4" strokeWidth={1.75} />
        {busy === "pdf" ? "Building PDF…" : "Download PDF"}
      </button>
    </>
  );
}

export function Studio() {
  const { data, setField, reset } = useReceipt();
  const captureRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<Busy>(null);

  function captureEl() {
    return captureRef.current?.querySelector<HTMLElement>("#slip-capture") ?? null;
  }

  async function run(kind: Exclude<Busy, null>) {
    const el = captureEl();
    if (!el) {
      toast.error("Receipt is not ready yet");
      return;
    }
    setBusy(kind);
    try {
      if (kind === "pdf") {
        await downloadReceiptPdf(el, data);
        toast.success("PDF downloaded");
      } else if (kind === "png") {
        await downloadReceiptPng(el, data);
        toast.success("PNG downloaded");
      } else {
        await copyReceiptPng(el);
        toast.success("Image copied");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        kind === "copy"
          ? "Could not copy image — try Download PNG"
          : "Download failed — try again",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="studio">
      <header className="studio-top">
        <div className="min-w-0">
          <p className="studio-kicker">Receipt studio</p>
          <h1 className="studio-name">Withdrawal Slip</h1>
          <p className="studio-lede">
            Every line is editable — amount, address, hash, fee. Download a PDF
            or PNG, or copy the image.
          </p>
        </div>
        <div className="studio-actions">
          <ActionBar
            busy={busy}
            onReset={() => {
              reset();
              toast("Restored screenshot values");
            }}
            onCopy={() => void run("copy")}
            onPng={() => void run("png")}
            onPdf={() => void run("pdf")}
          />
        </div>
      </header>

      <div className="studio-grid">
        <aside className="studio-form">
          <EditorPanel data={data} onChange={setField} />
        </aside>

        <section className="studio-stage" aria-label="Live receipt">
          <ScaledPhone>
            <div className="phone-frame">
              <PhoneReceipt data={data} interactive onChange={setField} />
            </div>
          </ScaledPhone>
          <p className="studio-hint">
            Tap any value on the slip to type. Export matches this 390×844 screen.
          </p>
        </section>
      </div>

      <div className="studio-dock">
        <ActionBar
          busy={busy}
          onReset={() => {
            reset();
            toast("Restored screenshot values");
          }}
          onCopy={() => void run("copy")}
          onPng={() => void run("png")}
          onPdf={() => void run("pdf")}
        />
      </div>

      <div ref={captureRef} className="slip-export-mount" aria-hidden="true">
        <PhoneReceipt data={data} captureId="slip-capture" />
      </div>
    </div>
  );
}
