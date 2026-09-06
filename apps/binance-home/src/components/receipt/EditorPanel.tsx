import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import {
  ORIGINAL,
  clampBars,
  fieldsMatchOriginal,
  parseBattery,
  type ReceiptFields,
} from "@/lib/receipt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  fields: ReceiptFields;
  focusKey: keyof ReceiptFields | null;
  onChange: <K extends keyof ReceiptFields>(key: K, value: ReceiptFields[K]) => void;
  onReset: () => void;
};

const VALUE_FIELDS: {
  key: "totalUsdt" | "pnlUsdt" | "pnlPct" | "bnb" | "bnbPct";
  label: string;
  hint: string;
  prefix?: string;
}[] = [
  { key: "totalUsdt", label: "Est. Total Value", hint: "USDT balance on the slip", prefix: "USDT" },
  { key: "pnlUsdt", label: "Today's PNL", hint: "Signed amount, e.g. -0.0003362", prefix: "USDT" },
  { key: "pnlPct", label: "PNL percent", hint: "Signed percent, e.g. -0.13", prefix: "%" },
  { key: "bnb", label: "BNB price", hint: "Figure on the BNB market card (not the Markets row)", prefix: "BNB" },
  { key: "bnbPct", label: "BNB change", hint: "Signed percent on the BNB card, e.g. -0.48", prefix: "%" },
];

function Toggle({
  on,
  onLabel,
  offLabel,
  onClick,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-lg border px-3 text-[13px] font-medium transition-colors",
        on ? "border-fg/30 bg-fg text-bg" : "border-border bg-transparent text-muted hover:text-fg",
      )}
    >
      {on ? onLabel : offLabel}
    </button>
  );
}

export function EditorPanel({ fields, focusKey, onChange, onReset }: Props) {
  const pristine = fieldsMatchOriginal(fields);
  const refs = useRef<Partial<Record<keyof ReceiptFields, HTMLInputElement | null>>>({});

  useEffect(() => {
    if (!focusKey) return;
    const el = refs.current[focusKey];
    if (!el) return;
    el.focus();
    el.select();
  }, [focusKey]);

  return (
    <section className="flex flex-col gap-5 pr-1 pb-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            Locked slip
          </p>
          <h2 className="mt-1 font-display text-xl font-medium tracking-tight text-fg">
            Editor
          </h2>
          <p className="mt-1.5 max-w-[36ch] text-[13px] leading-5 text-muted">
            Status bar, amount, PNL, and BNB print in place. Everything else stays as captured.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={pristine}>
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </header>

      <div className="rounded-xl border border-border bg-elevated/70 p-3">
        <p className="mb-3 text-[13px] font-medium text-fg">
          <span className="mr-2 font-mono text-[11px] text-subtle">00</span>
          Status bar
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="field-statusTime" className="mb-1.5 block text-[12px] text-muted">
              Time
            </label>
            <Input
              id="field-statusTime"
              ref={(el) => {
                refs.current.statusTime = el;
              }}
              value={fields.statusTime}
              onChange={(e) => onChange("statusTime", e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="11:22"
            />
          </div>

          <div>
            <p className="mb-1.5 text-[12px] text-muted">Icons</p>
            <div className="grid grid-cols-2 gap-2">
              <Toggle
                on={fields.muteOn}
                onLabel="Silent shown"
                offLabel="Silent hidden"
                onClick={() => onChange("muteOn", !fields.muteOn)}
              />
              <Toggle
                on={fields.cellularOn}
                onLabel="Cellular shown"
                offLabel="Cellular hidden"
                onClick={() => onChange("cellularOn", !fields.cellularOn)}
              />
              <Toggle
                on={fields.networkOn}
                onLabel="Network shown"
                offLabel="Network hidden"
                onClick={() => onChange("networkOn", !fields.networkOn)}
              />
              <Toggle
                on={fields.wifiOn}
                onLabel="Wi-Fi shown"
                offLabel="Wi-Fi hidden"
                onClick={() => onChange("wifiOn", !fields.wifiOn)}
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[12px] text-muted">Cellular signal</p>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange("cellularBars", n)}
                  className={cn(
                    "h-9 flex-1 rounded-lg border text-[13px] font-medium",
                    clampBars(fields.cellularBars) === n
                      ? "border-fg/30 bg-fg text-bg"
                      : "border-border text-muted hover:text-fg",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="field-networkLabel" className="mb-1.5 block text-[12px] text-muted">
              Network text
            </label>
            <Input
              id="field-networkLabel"
              value={fields.networkLabel}
              onChange={(e) => onChange("networkLabel", e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="5G"
            />
          </div>

          <div>
            <label htmlFor="field-batteryPct" className="mb-1.5 block text-[12px] text-muted">
              Battery percent
            </label>
            <div className="relative">
              <Input
                id="field-batteryPct"
                value={fields.batteryPct}
                onChange={(e) => onChange("batteryPct", e.target.value)}
                autoComplete="off"
                spellCheck={false}
                inputMode="numeric"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-medium text-subtle">
                {parseBattery(fields.batteryPct)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Toggle
              on={fields.batteryPctOn}
              onLabel="Percent shown"
              offLabel="Percent hidden"
              onClick={() => onChange("batteryPctOn", !fields.batteryPctOn)}
            />
            <Toggle
              on={fields.batteryPctInside}
              onLabel="Inside battery"
              offLabel="Beside battery"
              onClick={() => onChange("batteryPctInside", !fields.batteryPctInside)}
            />
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-3">
        {VALUE_FIELDS.map((field, i) => {
          const dirty = fields[field.key] !== ORIGINAL[field.key];
          return (
            <li key={field.key} className="rounded-xl border border-border bg-elevated/70 p-3">
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <label htmlFor={`field-${field.key}`} className="text-[13px] font-medium text-fg">
                  <span className="mr-2 font-mono text-[11px] text-subtle">0{i + 1}</span>
                  {field.label}
                </label>
                <span className={cn("text-[11px] font-medium", dirty ? "text-fg" : "text-subtle")}>
                  {dirty ? "Edited" : "Original"}
                </span>
              </div>
              <div className="relative">
                <Input
                  id={`field-${field.key}`}
                  ref={(el) => {
                    refs.current[field.key] = el;
                  }}
                  value={fields[field.key]}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="decimal"
                />
                {field.prefix ? (
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-medium tracking-wide text-subtle">
                    {field.prefix}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-subtle">{field.hint}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
