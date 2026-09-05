import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ASSET_OPTIONS,
  ASSET_PRESETS,
  assetKind,
  type AssetId,
  type Receipt,
  type SlipStatus,
} from "@/lib/receipt";
import { cn } from "@/lib/utils";
import { AssetMark } from "@/components/slip/marks";

type Props = {
  data: Receipt;
  onChange: <K extends keyof Receipt>(key: K, value: Receipt[K]) => void;
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

const inputClass = cn(
  "h-10 w-full rounded-md border border-border bg-bg-subtle px-3 text-sm text-fg",
  "outline-none transition-[border-color,box-shadow] duration-150",
  "placeholder:text-subtle focus:border-ring focus:ring-2 focus:ring-ring/25",
);

const areaClass = cn(inputClass, "h-auto min-h-16 py-2.5 resize-y");

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        {title}
      </h2>
      {children}
    </section>
  );
}

function applyAssetPreset(
  id: AssetId,
  onChange: Props["onChange"],
) {
  const preset = ASSET_PRESETS[id];
  onChange("asset", preset.asset);
  onChange("price", preset.price);
  onChange("network", preset.network);
  onChange("networkFee", preset.networkFee);
}

function AssetField({
  data,
  onChange,
}: {
  data: Receipt;
  onChange: Props["onChange"];
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = assetKind(data.asset);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted">Asset</span>
      <div ref={wrapRef} className="asset-field">
        <select
          className={inputClass}
          value={selected}
          aria-label="Asset"
          onChange={(e) => {
            applyAssetPreset(e.target.value as AssetId, onChange);
            setOpen(false);
          }}
        >
          {ASSET_OPTIONS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="asset-picker-btn"
          aria-label="Choose asset logo"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((v) => !v)}
        >
          <AssetMark asset={data.asset} size={28} />
        </button>
        {open ? (
          <div className="asset-picker-menu" role="listbox" aria-label="Asset logo">
            {ASSET_OPTIONS.map((id) => (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={selected === id}
                className={cn(
                  "asset-picker-item",
                  selected === id && "is-active",
                )}
                onClick={() => {
                  applyAssetPreset(id, onChange);
                  setOpen(false);
                }}
              >
                <AssetMark asset={id} size={22} />
                {id}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function EditorPanel({ data, onChange }: Props) {
  return (
    <form
      className="grid gap-8"
      onSubmit={(e) => e.preventDefault()}
      autoComplete="off"
    >
      <Section title="Amount">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Action">
            <input
              className={inputClass}
              value={data.verb}
              onChange={(e) => onChange("verb", e.target.value)}
            />
          </Field>
          <AssetField data={data} onChange={onChange} />
        </div>
        <Field label="Amount">
          <input
            className={inputClass}
            inputMode="decimal"
            value={data.amount}
            onChange={(e) => onChange("amount", e.target.value)}
          />
        </Field>
        <Field label="Fiat equivalent">
          <input
            className={inputClass}
            value={data.fiatApprox}
            onChange={(e) => onChange("fiatApprox", e.target.value)}
          />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={data.status}
            onChange={(e) => onChange("status", e.target.value as SlipStatus)}
          >
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </select>
        </Field>
      </Section>

      <Section title="Destination">
        <Field label="Address">
          <textarea
            className={areaClass}
            rows={2}
            spellCheck={false}
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </Field>
        <Field label="Price">
          <input
            className={inputClass}
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Network">
        <Field label="Network">
          <input
            className={inputClass}
            value={data.network}
            onChange={(e) => onChange("network", e.target.value)}
          />
        </Field>
        <Field label="Network fee">
          <input
            className={inputClass}
            value={data.networkFee}
            onChange={(e) => onChange("networkFee", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Transaction">
        <Field label="Transaction ID" hint="Long hashes show as 6a92c…d3f91 on the slip">
          <input
            className={cn(inputClass, "font-mono text-sm")}
            spellCheck={false}
            value={data.txId}
            onChange={(e) => onChange("txId", e.target.value)}
          />
        </Field>
        <Field label="Submitted time">
          <input
            className={inputClass}
            value={data.submittedTime}
            onChange={(e) => onChange("submittedTime", e.target.value)}
          />
        </Field>
        <Field label="Reference no.">
          <input
            className={inputClass}
            value={data.referenceNo}
            onChange={(e) => onChange("referenceNo", e.target.value)}
          />
        </Field>
      </Section>

      <details className="group">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            Status bar & labels
            <span className="text-fg/40 transition-transform duration-150 group-open:rotate-90">
              ›
            </span>
          </span>
        </summary>
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Time">
              <input
                className={inputClass}
                value={data.statusBarTime}
                onChange={(e) => onChange("statusBarTime", e.target.value)}
              />
            </Field>
            <Field label="Signal label">
              <input
                className={inputClass}
                value={data.signalLabel}
                onChange={(e) => onChange("signalLabel", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Battery fill" hint="0–100, icon fill only — no number on the bar">
            <input
              className={inputClass}
              type="number"
              min={0}
              max={100}
              value={data.battery}
              onChange={(e) =>
                onChange("battery", Number(e.target.value) || 0)
              }
            />
          </Field>
          <label className="flex h-10 items-center gap-3 text-sm text-fg">
            <input
              type="checkbox"
              className="size-4 accent-fg"
              checked={data.showWifi}
              onChange={(e) => onChange("showWifi", e.target.checked)}
            />
            Show Wi‑Fi between 5G and battery
          </label>
          <label className="flex h-10 items-center gap-3 text-sm text-fg">
            <input
              type="checkbox"
              className="size-4 accent-fg"
              checked={data.showStatusBar}
              onChange={(e) => onChange("showStatusBar", e.target.checked)}
            />
            Show status bar
          </label>
          <label className="flex h-10 items-center gap-3 text-sm text-fg">
            <input
              type="checkbox"
              className="size-4 accent-fg"
              checked={data.showHomeIndicator}
              onChange={(e) => onChange("showHomeIndicator", e.target.checked)}
            />
            Show home indicator
          </label>
          <Field label="Explorer button">
            <input
              className={inputClass}
              value={data.explorerLabel}
              onChange={(e) => onChange("explorerLabel", e.target.value)}
            />
          </Field>
          <Field label="Help line">
            <input
              className={inputClass}
              value={data.helpText}
              onChange={(e) => onChange("helpText", e.target.value)}
            />
          </Field>
        </div>
      </details>
    </form>
  );
}
