import { type RefObject, useState } from "react";
import {
  amountSign,
  formatAmount,
  isPositiveChange,
  type ReceiptData,
} from "@/lib/receipt";
import { CopyGlyph, FlameGlyph, PairIconView, StatusMark } from "./icons";

type Props = {
  data: ReceiptData;
  captureRef: RefObject<HTMLDivElement | null>;
};

export function ReceiptPreview({ data, captureRef }: Props) {
  return (
    <div
      ref={captureRef}
      className="slip"
      style={{
        background: "#ffffff",
        color: "#1e2329",
        fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
      }}
    >
      <header className="slip-nav">
        <span className="slip-nav-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="slip-nav-chevron">
            <path
              d="M15 5 8 12l7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className="slip-nav-title">{data.title || "Deposit details"}</h1>
        <span className="slip-nav-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="slip-nav-help">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.4-1 1-.1 1.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.6" r="1" fill="currentColor" />
          </svg>
        </span>
      </header>

      <section className="slip-hero">
        <p className="slip-hero-label">Amount</p>
        <p className="slip-hero-amount">
          {amountSign(data.type)} {formatAmount(data.amount)} {data.currency}
        </p>
        <p className={`slip-status is-${data.status.toLowerCase()}`}>
          <StatusMark status={data.status} />
          <span>{data.status}</span>
        </p>
      </section>

      <dl className="slip-rows">
        <Row label="Blockchain" value={data.blockchain} />
        <Row label="Type" value={data.type} />
        <Row label="Status" value={data.status} />
        <CopyRow label="Deposit address" value={data.address} />
        <CopyRow label="Transaction ID" value={data.txid} hint />
        <Row label="Time" value={data.time} />
      </dl>

      {data.showTrading ? (
        <section className="slip-trade">
          <h2 className="slip-trade-title">{data.tradingTitle}</h2>
          <div className="slip-trade-list">
            {data.pairs.map((pair) => (
              <article key={pair.id} className="slip-pair">
                <div className="slip-pair-top">
                  <div className="slip-pair-id">
                    <PairIconView icon={pair.icon} className="slip-pair-icon" />
                    <span>{pair.symbol}</span>
                  </div>
                  {pair.hot ? (
                    <span className="slip-hot">
                      Hot
                      <span className="slip-flames">
                        <FlameGlyph />
                        <FlameGlyph />
                        <FlameGlyph />
                      </span>
                    </span>
                  ) : null}
                </div>
                <div className="slip-pair-bottom">
                  <div className="slip-pair-stats">
                    <p>
                      <span>Last price:</span> {pair.price}
                    </p>
                    <p>
                      <span>Change:</span>{" "}
                      <em
                        className={
                          isPositiveChange(pair.change) ? "up" : "down"
                        }
                      >
                        {pair.change}
                      </em>
                    </p>
                  </div>
                  <span className="slip-explore">Explore now</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="slip-trade-spacer" />
      )}

      {data.showExplorer ? (
        <div className="slip-footer">
          <span className="slip-explorer">{data.explorerLabel}</span>
        </div>
      ) : null}

      {data.showHomeIndicator ? <div className="slip-home" /> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="slip-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function CopyRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="slip-row slip-row-copy">
      <dt>
        {label}
        {hint ? (
          <svg viewBox="0 0 16 16" className="slip-hint" aria-hidden="true">
            <circle
              cx="8"
              cy="8"
              r="6.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M6.5 6.3a1.6 1.6 0 1 1 2.2 1.5c-.5.3-.7.7-.7 1.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <circle cx="8" cy="11.3" r="0.7" fill="currentColor" />
          </svg>
        ) : null}
      </dt>
      <dd>
        <span className="slip-copy-value">{value}</span>
        <button
          type="button"
          className="slip-copy"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy ${label}`}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" className="slip-copy-icon">
              <path
                d="M5 12.5 9.5 17 19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <CopyGlyph className="slip-copy-icon" />
          )}
        </button>
      </dd>
    </div>
  );
}
