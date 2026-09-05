import { useEffect, useRef } from "react";
import {
  useReceiptStore,
  DEFAULT_RECEIPT,
  type Receipt,
  type ReceiptStatus,
} from "@/lib/receipt-store";
import { cn } from "@/lib/cn";

const STATUSES: ReceiptStatus[] = ["Completed", "Processing", "Failed", "Cancelled"];

type FieldDef = {
  key: keyof Receipt;
  label: string;
  kind?: "text" | "textarea" | "number" | "select";
};

const SECTIONS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Status bar",
    fields: [
      { key: "time", label: "Time" },
      { key: "battery", label: "Battery fill", kind: "number" },
      { key: "networkType", label: "Signal label" },
    ],
  },
  {
    title: "Header",
    fields: [
      { key: "title", label: "Title" },
      { key: "signedAmount", label: "Shown amount" },
      { key: "asset", label: "Asset" },
      { key: "status", label: "Status", kind: "select" },
      { key: "note", label: "Note", kind: "textarea" },
      { key: "helpLink", label: "Help link" },
    ],
  },
  {
    title: "Transaction",
    fields: [
      { key: "network", label: "Network" },
      { key: "address", label: "Address", kind: "textarea" },
      { key: "txid", label: "Txid", kind: "textarea" },
      { key: "amount", label: "Amount" },
      { key: "fee", label: "Network fee" },
      { key: "wallet", label: "Wallet" },
      { key: "date", label: "Date" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "saveAddress", label: "Save label" },
      { key: "scanReport", label: "Scan report" },
      { key: "button", label: "Button" },
    ],
  },
];

function LockedSignedAmount() {
  const signedAmount = useReceiptStore((s) => s.receipt.signedAmount);
  return <input className="ed-input" value={`${signedAmount}  (auto)`} disabled />;
}

function Field({ def }: { def: FieldDef }) {
  const value = useReceiptStore((s) => s.receipt[def.key]);
  const setField = useReceiptStore((s) => s.setField);
  const focused = useReceiptStore((s) => s.focused);
  const setFocused = useReceiptStore((s) => s.setFocused);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const active = focused === def.key;

  useEffect(() => {
    if (active) {
      ref.current?.focus();
      if (ref.current && "select" in ref.current) {
        try {
          ref.current.select();
        } catch {
          /* select() is not on every control */
        }
      }
    }
  }, [active]);

  const id = `field-${def.key}`;
  const common = {
    id,
    name: def.key,
    className: cn("ed-input", def.kind === "textarea" && "ed-textarea"),
    onFocus: () => setFocused(def.key),
    onBlur: () => setFocused(null),
  };

  return (
    <label className={cn("ed-field", active && "is-active")} htmlFor={id}>
      <span className="ed-label">{def.label}</span>
      {def.kind === "textarea" ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          {...common}
          rows={def.key === "note" ? 3 : 2}
          value={String(value)}
          onChange={(e) => setField(def.key, e.target.value as never)}
        />
      ) : def.kind === "select" ? (
        <select
          ref={ref as React.RefObject<HTMLSelectElement>}
          {...common}
          value={String(value)}
          onChange={(e) => setField("status", e.target.value as ReceiptStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : def.kind === "number" ? (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          {...common}
          type="number"
          min={0}
          max={100}
          value={Number(value)}
          onChange={(e) => setField("battery", Number(e.target.value) as never)}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          {...common}
          type="text"
          value={String(value)}
          onChange={(e) => setField(def.key, e.target.value as never)}
        />
      )}
    </label>
  );
}

export function EditorPanel() {
  const autoNet = useReceiptStore((s) => s.receipt.autoNet);
  const showWifi = useReceiptStore((s) => s.receipt.showWifi !== false);
  const setField = useReceiptStore((s) => s.setField);
  const reset = useReceiptStore((s) => s.reset);

  return (
    <aside className="ed-panel">
      <div className="ed-panel-head">
        <div>
          <p className="ed-kicker">Editable fields</p>
          <h2>Credentials</h2>
        </div>
        <button type="button" className="ed-reset" onClick={reset}>
          Reset screenshot
        </button>
      </div>

      <label className="ed-check">
        <input
          type="checkbox"
          checked={autoNet}
          onChange={(e) => setField("autoNet", e.target.checked as never)}
        />
        <span>Auto-update shown amount from Amount − Fee</span>
      </label>

      <label className="ed-check">
        <input
          type="checkbox"
          checked={showWifi}
          onChange={(e) => setField("showWifi", e.target.checked as never)}
        />
        <span>Show Wi‑Fi between 5G and battery</span>
      </label>

      {SECTIONS.map((section) => (
        <section key={section.title} className="ed-section">
          <h3>{section.title}</h3>
          <div className="ed-grid">
            {section.fields.map((def) => {
              if (def.key === "signedAmount" && autoNet) {
                return (
                  <label key={def.key} className="ed-field is-locked">
                    <span className="ed-label">{def.label}</span>
                    <LockedSignedAmount />
                  </label>
                );
              }
              return <Field key={def.key} def={def} />;
            })}
          </div>
        </section>
      ))}

      <p className="ed-footnote">
        Click any value on the receipt to jump here. Downloads capture the phone screen only — editor
        chrome is excluded. Original values match the screenshot of {DEFAULT_RECEIPT.date}.
      </p>
    </aside>
  );
}
