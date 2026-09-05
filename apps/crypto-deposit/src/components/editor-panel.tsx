import type { ReactNode } from "react";
import { AssetLogo } from "@/components/asset-logos";
import {
  ASSET_ORDER,
  NETWORK_PRESETS,
  STATUS_PRESETS,
  type AssetId,
} from "@/lib/receipt";
import { useReceiptStore } from "@/store/receipt-store";

function Row({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="set-row">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="set-row">
      <span>{label}</span>
      <button
        type="button"
        className="toggle"
        data-on={on}
        aria-pressed={on}
        onClick={onToggle}
      >
        <i />
      </button>
    </div>
  );
}

export function EditorPanel() {
  const s = useReceiptStore();

  return (
    <form className="editor-form" onSubmit={(e) => e.preventDefault()} autoComplete="off">
      <section className="set-block">
        <div className="set-kicker">Asset</div>
        <div className="seg" role="radiogroup" aria-label="Asset">
          {ASSET_ORDER.map((id: AssetId) => (
            <button
              key={id}
              type="button"
              className="seg-btn"
              data-active={s.asset === id}
              aria-pressed={s.asset === id}
              onClick={() => s.applyAsset(id)}
            >
              <AssetLogo asset={id} size={20} />
              {id}
            </button>
          ))}
        </div>
        <p className="set-hint">
          Logo, ticker, network and fee unit follow the asset. Addresses stay as
          typed.
        </p>
      </section>

      <section className="set-card">
        <div className="set-kicker">Transaction</div>
        <div className="seg seg-2" role="radiogroup" aria-label="Direction">
          <button
            type="button"
            className="seg-btn"
            data-active={s.direction === "sent"}
            onClick={() => s.applyDirection("sent")}
          >
            Sent
          </button>
          <button
            type="button"
            className="seg-btn"
            data-active={s.direction === "received"}
            onClick={() => s.applyDirection("received")}
          >
            Received
          </button>
        </div>
        <Row label="Title">
          <input
            value={s.title}
            onChange={(e) => s.update({ title: e.target.value })}
          />
        </Row>
        <Row label="Amount">
          <input
            value={s.amount}
            onChange={(e) => s.update({ amount: e.target.value })}
            inputMode="decimal"
          />
        </Row>
        <Row label="Date">
          <input
            value={s.dateText}
            onChange={(e) => s.update({ dateText: e.target.value })}
          />
        </Row>
        <Row label="Status">
          <input
            value={s.status}
            onChange={(e) => s.update({ status: e.target.value })}
          />
        </Row>
        <div className="chips">
          {STATUS_PRESETS.map((st) => (
            <button
              key={st}
              type="button"
              className="chip"
              data-active={s.status === st}
              onClick={() => s.update({ status: st })}
            >
              {st}
            </button>
          ))}
        </div>
        <Row label="Network">
          <input
            list="network-presets"
            value={s.network}
            onChange={(e) => s.update({ network: e.target.value })}
          />
        </Row>
        <datalist id="network-presets">
          {NETWORK_PRESETS.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </section>

      <section className="set-card">
        <div className="set-kicker">Addresses</div>
        <Row label="From">
          <input
            value={s.from}
            onChange={(e) => s.update({ from: e.target.value })}
            spellCheck={false}
          />
        </Row>
        <Row label="To">
          <input
            value={s.to}
            onChange={(e) => s.update({ to: e.target.value })}
            spellCheck={false}
          />
        </Row>
        <Row label="Tx hash">
          <input
            value={s.txHash}
            onChange={(e) => s.update({ txHash: e.target.value })}
            spellCheck={false}
          />
        </Row>
      </section>

      <section className="set-card">
        <div className="set-kicker">Network fee</div>
        <Row label="Fee">
          <input
            value={s.fee}
            onChange={(e) => s.update({ fee: e.target.value })}
            inputMode="decimal"
          />
        </Row>
        <Row label="Fee unit">
          <input
            value={s.feeSymbol}
            onChange={(e) => s.update({ feeSymbol: e.target.value })}
          />
        </Row>
        <Row label="Fiat USD">
          <input
            value={s.feeUsd}
            onChange={(e) => s.update({ feeUsd: e.target.value })}
            inputMode="decimal"
          />
        </Row>
      </section>

      <section className="set-card">
        <div className="set-kicker">Buttons</div>
        <Row label="Speed label">
          <input
            value={s.speedLabel}
            onChange={(e) => s.update({ speedLabel: e.target.value })}
          />
        </Row>
        <Row label="Cancel label">
          <input
            value={s.cancelLabel}
            onChange={(e) => s.update({ cancelLabel: e.target.value })}
          />
        </Row>
        <Row label="Explorer label">
          <input
            value={s.explorerLabel}
            onChange={(e) => s.update({ explorerLabel: e.target.value })}
          />
        </Row>
        <Toggle
          label="Show Speed up"
          on={s.showSpeedUp}
          onToggle={() => s.update({ showSpeedUp: !s.showSpeedUp })}
        />
        <Toggle
          label="Show Cancel"
          on={s.showCancel}
          onToggle={() => s.update({ showCancel: !s.showCancel })}
        />
        <Toggle
          label="Show Explorer"
          on={s.showExplorer}
          onToggle={() => s.update({ showExplorer: !s.showExplorer })}
        />
      </section>

      <section className="set-card set-card-last">
        <div className="set-kicker">Phone chrome</div>
        <Row label="Time">
          <input
            value={s.statusTime}
            onChange={(e) => s.update({ statusTime: e.target.value })}
          />
        </Row>
        <Row label="Signal">
          <input
            value={s.carrier}
            onChange={(e) => s.update({ carrier: e.target.value })}
          />
        </Row>
        <Row label="Battery fill">
          <input
            type="range"
            min={0}
            max={100}
            value={s.battery}
            aria-label="Battery fill"
            onChange={(e) => s.update({ battery: Number(e.target.value) })}
          />
        </Row>
        <label className="set-check">
          <input
            type="checkbox"
            checked={s.showWifi}
            onChange={() => s.update({ showWifi: !s.showWifi })}
          />
          <span>Show Wi‑Fi between 5G and battery</span>
        </label>
        <Toggle
          label="Status bar"
          on={s.showStatusBar}
          onToggle={() => s.update({ showStatusBar: !s.showStatusBar })}
        />
        <Toggle
          label="Home indicator"
          on={s.showHomeIndicator}
          onToggle={() =>
            s.update({ showHomeIndicator: !s.showHomeIndicator })
          }
        />
      </section>
    </form>
  );
}
