import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ReceiptData, ReceiptStatus } from "@/lib/receipt";
import { useReceiptStore } from "@/lib/receipt-store";

const STATUSES: ReceiptStatus[] = ["Completed", "Processing", "Failed"];

export function ReceiptEditor() {
  const data = useReceiptStore((s) => s.data);
  const setField = useReceiptStore((s) => s.setField);
  const reset = useReceiptStore((s) => s.reset);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-fg-subtle uppercase">
            Live editor
          </p>
          <h2 className="mt-1 font-display text-xl tracking-tight text-fg">Credentials</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Every field on the receipt is editable. PNG and PDF match the screen exactly.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={reset} className="shrink-0">
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-8">
        <Section title="Amount">
          <div className="editor-amount-grid">
            <Field label="Sign" htmlFor="field-sign">
              <Input
                id="field-sign"
                value={data.amountSign}
                maxLength={1}
                onChange={(e) =>
                  setField(
                    "amountSign",
                    (e.target.value.replace(/[^+-]/g, "").slice(0, 1) ||
                      "") as ReceiptData["amountSign"],
                  )
                }
              />
            </Field>
            <Field label="Amount" htmlFor="field-amount">
              <Input
                id="field-amount"
                value={data.amount}
                onChange={(e) => setField("amount", e.target.value)}
              />
            </Field>
            <Field label="Asset" htmlFor="field-asset">
              <Input
                id="field-asset"
                value={data.currency}
                onChange={(e) => setField("currency", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Status">
          <Field label="State">
            <div className="grid grid-cols-3 gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setField("status", s)}
                  className={`h-10 rounded-lg text-xs font-medium transition-colors duration-150 ${
                    data.status === s
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface-2 text-fg-muted hover:text-fg"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Message" htmlFor="field-message">
            <Textarea
              id="field-message"
              rows={3}
              value={data.message}
              onChange={(e) => setField("message", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Transfer">
          <Field label="Network" htmlFor="field-network">
            <Input
              id="field-network"
              value={data.network}
              onChange={(e) => setField("network", e.target.value)}
              list="network-options"
            />
            <datalist id="network-options">
              {["TRX", "ERC20", "BSC", "BTC", "SOL", "TON", "MATIC", "ARB", "OP", "AVAX"].map(
                (n) => (
                  <option key={n} value={n} />
                ),
              )}
            </datalist>
          </Field>
          <Field label="Address" htmlFor="field-address">
            <Textarea
              id="field-address"
              rows={3}
              className="font-mono text-sm leading-5"
              value={data.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </Field>
          <Field label="Txid" htmlFor="field-txid">
            <Textarea
              id="field-txid"
              rows={3}
              className="font-mono text-sm leading-5"
              value={data.txid}
              onChange={(e) => setField("txid", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Wallet" htmlFor="field-wallet">
              <Input
                id="field-wallet"
                value={data.wallet}
                onChange={(e) => setField("wallet", e.target.value)}
              />
            </Field>
            <Field label="Date" htmlFor="field-date">
              <Input
                id="field-date"
                value={data.date}
                onChange={(e) => setField("date", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Phone chrome">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Time" htmlFor="field-time">
              <Input
                id="field-time"
                value={data.statusTime}
                onChange={(e) => setField("statusTime", e.target.value)}
              />
            </Field>
            <Field label="Signal label" htmlFor="field-signal">
              <Input
                id="field-signal"
                value={data.signalLabel}
                onChange={(e) => setField("signalLabel", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Battery fill" htmlFor="field-battery">
            <Input
              id="field-battery"
              type="number"
              min={0}
              max={100}
              value={data.battery}
              onChange={(e) => setField("battery", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Header title" htmlFor="field-title">
            <Input
              id="field-title"
              value={data.title}
              onChange={(e) => setField("title", e.target.value)}
            />
          </Field>
          <label className="flex h-10 items-center gap-3 text-sm text-fg">
            <input
              type="checkbox"
              className="size-4 accent-accent"
              checked={data.showWifi}
              onChange={(e) => setField("showWifi", e.target.checked)}
            />
            Show Wi-Fi between 5G and battery
          </label>
          <label className="flex h-10 items-center gap-3 text-sm text-fg">
            <input
              type="checkbox"
              className="size-4 accent-accent"
              checked={data.showSupport}
              onChange={(e) => setField("showSupport", e.target.checked)}
            />
            Support button
          </label>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-medium tracking-[0.14em] text-fg-subtle uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
