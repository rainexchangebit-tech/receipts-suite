import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CURRENCIES,
  NETWORKS,
  STATUSES,
  TYPES,
  formatTimeFromInput,
  type PairIcon,
  type ReceiptData,
  type TradingPair,
} from "@/lib/receipt";
import { cn } from "@/lib/utils";

type Props = {
  data: ReceiptData;
  onPatch: (partial: Partial<ReceiptData>) => void;
  onPair: (id: string, partial: Partial<TradingPair>) => void;
};

export function ReceiptForm({ data, onPatch, onPair }: Props) {
  return (
    <div className="form-stack">
      <Section title="Amount">
        <div className="field-grid-2">
          <Field label="Value">
            <Input
              inputMode="decimal"
              value={data.amount}
              onChange={(e) => onPatch({ amount: e.target.value })}
              autoComplete="off"
            />
          </Field>
          <Field label="Currency">
            <Input
              list="currency-list"
              value={data.currency}
              onChange={(e) => onPatch({ currency: e.target.value })}
              autoComplete="off"
            />
            <datalist id="currency-list">
              {CURRENCIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="Screen title">
          <Input
            value={data.title}
            onChange={(e) => onPatch({ title: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Status">
        <div className="chip-row" role="radiogroup" aria-label="Status">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={data.status === status}
              className={cn("chip", data.status === status && "is-on")}
              onClick={() => onPatch({ status })}
            >
              <span className={cn("chip-dot", `dot-${status.toLowerCase()}`)} />
              {status}
            </button>
          ))}
        </div>
        <div className="field-grid-2">
          <Field label="Type">
            <Input
              list="type-list"
              value={data.type}
              onChange={(e) => onPatch({ type: e.target.value })}
            />
            <datalist id="type-list">
              {TYPES.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Blockchain">
            <Input
              list="network-list"
              value={data.blockchain}
              onChange={(e) => onPatch({ blockchain: e.target.value })}
            />
            <datalist id="network-list">
              {NETWORKS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </Field>
        </div>
      </Section>

      <Section title="Credentials">
        <Field label="Deposit address">
          <Textarea
            rows={3}
            spellCheck={false}
            value={data.address}
            onChange={(e) => onPatch({ address: e.target.value.trim() })}
            className="font-mono text-sm"
          />
        </Field>
        <Field label="Transaction ID">
          <Textarea
            rows={3}
            spellCheck={false}
            value={data.txid}
            onChange={(e) => onPatch({ txid: e.target.value.trim() })}
            className="font-mono text-sm"
          />
        </Field>
        <Field label="Time shown on slip">
          <Input
            value={data.time}
            onChange={(e) => onPatch({ time: e.target.value })}
          />
        </Field>
        <Field label="Set from calendar">
          <Input
            type="datetime-local"
            step={1}
            onChange={(e) =>
              onPatch({ time: formatTimeFromInput(e.target.value) })
            }
          />
        </Field>
      </Section>

      <Section title="Trading cards">
        <Toggle
          label="Show trading section"
          checked={data.showTrading}
          onChange={(showTrading) => onPatch({ showTrading })}
        />
        {data.showTrading ? (
          <>
            <Field label="Section title">
              <Input
                value={data.tradingTitle}
                onChange={(e) => onPatch({ tradingTitle: e.target.value })}
              />
            </Field>
            {data.pairs.map((pair) => (
              <PairFields key={pair.id} pair={pair} onPair={onPair} />
            ))}
          </>
        ) : null}
      </Section>

      <Section title="Footer">
        <Toggle
          label="Show explorer button"
          checked={data.showExplorer}
          onChange={(showExplorer) => onPatch({ showExplorer })}
        />
        {data.showExplorer ? (
          <>
            <Field label="Button label">
              <Input
                value={data.explorerLabel}
                onChange={(e) => onPatch({ explorerLabel: e.target.value })}
              />
            </Field>
            <Field label="Explorer URL">
              <Input
                value={data.explorerUrl}
                onChange={(e) => onPatch({ explorerUrl: e.target.value })}
              />
            </Field>
          </>
        ) : null}
        <Toggle
          label="Home indicator bar"
          checked={data.showHomeIndicator}
          onChange={(showHomeIndicator) => onPatch({ showHomeIndicator })}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="form-section">
      <h2 className="form-section-title">{title}</h2>
      <div className="form-section-body">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="toggle-row"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span>{label}</span>
      <span className={cn("switch", checked && "is-on")}>
        <span className="switch-knob" />
      </span>
    </button>
  );
}

function PairFields({
  pair,
  onPair,
}: {
  pair: TradingPair;
  onPair: (id: string, partial: Partial<TradingPair>) => void;
}) {
  const icons: PairIcon[] = ["btc", "eth", "usdt", "generic"];
  return (
    <div className="pair-card">
      <div className="field-grid-2">
        <Field label="Pair">
          <Input
            value={pair.symbol}
            onChange={(e) => onPair(pair.id, { symbol: e.target.value })}
          />
        </Field>
        <Field label="Icon">
          <div className="chip-row">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                className={cn("chip chip-sm", pair.icon === icon && "is-on")}
                onClick={() => onPair(pair.id, { icon })}
              >
                {icon.toUpperCase()}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="field-grid-2">
        <Field label="Last price">
          <Input
            value={pair.price}
            onChange={(e) => onPair(pair.id, { price: e.target.value })}
          />
        </Field>
        <Field label="Change">
          <Input
            value={pair.change}
            onChange={(e) => onPair(pair.id, { change: e.target.value })}
          />
        </Field>
      </div>
      <Toggle
        label="Hot badge"
        checked={pair.hot}
        onChange={(hot) => onPair(pair.id, { hot })}
      />
    </div>
  );
}
