import { Check, Copy, FileDown, ImageDown, Loader2 } from "lucide-react";
import { useState, type RefObject } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  copyReceiptPng,
  downloadReceiptPdf,
  downloadReceiptPng,
} from "@/lib/export-receipt";
import { fileStamp, type ReceiptData } from "@/lib/receipt";

export function ExportBar({
  targetRef,
  data,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  data: ReceiptData;
}) {
  const [busy, setBusy] = useState<"png" | "pdf" | "copy" | null>(null);
  const [copied, setCopied] = useState(false);

  async function run(kind: "png" | "pdf" | "copy", fn: () => Promise<void>) {
    const el = targetRef.current;
    if (!el) {
      toast.error("Receipt is not ready yet.");
      return;
    }
    setBusy(kind);
    try {
      await fn();
      if (kind === "copy") {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        toast.success("PNG copied to clipboard");
      } else if (kind === "png") {
        toast.success("PNG downloaded");
      } else {
        toast.success("PDF downloaded");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(null);
    }
  }

  const stamp = fileStamp(data);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        onClick={() =>
          run("png", () => downloadReceiptPng(targetRef.current!, `${stamp}.png`))
        }
        disabled={busy !== null}
        size="sm"
      >
        {busy === "png" ? <Loader2 className="size-4 animate-spin" /> : <ImageDown className="size-4" />}
        PNG
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          run("pdf", () => downloadReceiptPdf(targetRef.current!, `${stamp}.pdf`))
        }
        disabled={busy !== null}
        size="sm"
      >
        {busy === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
        PDF
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => run("copy", () => copyReceiptPng(targetRef.current!))}
        disabled={busy !== null}
        size="sm"
      >
        {busy === "copy" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : copied ? (
          <Check className="size-4" />
        ) : (
          <Copy className="size-4" />
        )}
        Copy
      </Button>
    </div>
  );
}
