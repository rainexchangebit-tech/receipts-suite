import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PanelRight, SlidersHorizontal } from "lucide-react";
import { ExportBar } from "@/components/export-bar";
import { PhoneStage } from "@/components/phone-stage";
import { ReceiptEditor } from "@/components/receipt-editor";
import { ReceiptScreen } from "@/components/receipt-screen";
import { Button } from "@/components/ui/button";
import { useReceiptStore } from "@/lib/receipt-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const data = useReceiptStore((s) => s.data);
  const captureRef = useRef<HTMLDivElement>(null);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.16em] text-fg-subtle uppercase">
              Studio
            </p>
            <h1 className="font-display text-lg tracking-tight text-fg sm:text-xl">
              Deposit Receipt
            </h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowEditor((v) => !v)}
          >
            {showEditor ? (
              <PanelRight className="size-3.5" />
            ) : (
              <SlidersHorizontal className="size-3.5" />
            )}
            {showEditor ? "Preview" : "Edit"}
          </Button>
        </div>
        <ExportBar targetRef={captureRef} data={data} />
      </header>

      <div className="studio-grid">
        <aside
          className={`min-h-0 border-border bg-surface lg:block lg:border-r ${
            showEditor ? "block" : "hidden"
          }`}
        >
          <ReceiptEditor />
        </aside>
        <section
          className={`studio-preview ${showEditor ? "hidden lg:block" : "block"}`}
        >
          <PhoneStage data={data} />
        </section>
      </div>

      <div
        aria-hidden
        className="capture-slot"
      >
        <div ref={captureRef}>
          <ReceiptScreen data={data} />
        </div>
      </div>
    </main>
  );
}
