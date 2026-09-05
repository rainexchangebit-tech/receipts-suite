import { toast } from "sonner";
import { RECEIPT_H, RECEIPT_W, STATUS_COLOR, type ReceiptData } from "@/lib/receipt";

export function ReceiptScreen({ data }: { data: ReceiptData }) {
  const statusColor = STATUS_COLOR[data.status] ?? "#2ebd85";

  return (
    <div
      className="receipt-screen"
      data-receipt-root
      style={{ width: RECEIPT_W, height: RECEIPT_H }}
    >
      <IosStatusBar
        time={data.statusTime}
        battery={data.battery}
        signalLabel={data.signalLabel}
        showWifi={data.showWifi}
      />

      <header className="receipt-nav">
        <span className="receipt-nav-btn" aria-hidden="true">
          <BackChevron />
        </span>
        <h1 className="receipt-title">{data.title}</h1>
        <span className="receipt-nav-right" aria-hidden="true">
          <ShareGlyph />
          <HelpGlyph />
        </span>
      </header>

      <div className="receipt-hero">
        <div className="receipt-amount-row">
          <span className="receipt-amount">
            {data.amountSign}
            {data.amount}
          </span>
          <span className="receipt-ccy">{data.currency}</span>
        </div>

        <div className="receipt-status">
          <StatusMark color={statusColor} />
          <span className="receipt-status-text" style={{ color: statusColor }}>
            {data.status}
          </span>
        </div>

        <p className="receipt-message">{data.message}</p>
      </div>

      <div className="receipt-rule" />

      <div className="receipt-rows">
        <DetailRow label="Network" value={data.network} />
        <DetailRow label="Address" value={data.address} wrap copyable />
        <DetailRow label="Txid" value={data.txid} wrap copyable />
        <DetailRow label="Wallet" value={data.wallet} />
        <DetailRow label="Date" value={data.date} />
      </div>

      <div className="receipt-rule receipt-rule-strong" />

      {data.showSupport ? <SupportFab /> : null}

      <div className="receipt-home">
        <div className="receipt-home-bar" />
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  wrap,
  copyable,
}: {
  label: string;
  value: string;
  wrap?: boolean;
  copyable?: boolean;
}) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className={`receipt-row${wrap ? " is-wrap" : ""}`}>
      <div className="receipt-label">{label}</div>
      <div className="receipt-value-cluster">
        <div className={`receipt-value${wrap ? " is-wrap" : ""}`}>{value}</div>
        {copyable ? (
          <button
            type="button"
            className="receipt-copy"
            aria-label={`Copy ${label}`}
            onClick={copy}
          >
            <CopyGlyph />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function IosStatusBar({
  time,
  battery,
  signalLabel,
  showWifi,
}: {
  time: string;
  battery: number;
  signalLabel: string;
  showWifi: boolean;
}) {
  const pct = Math.max(0, Math.min(100, battery));
  const fillWidth = 18.8 * (pct / 100);

  return (
    <div className="bn-statusbar">
      <div className="bn-status-left">
        <span className="bn-time">{time}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M10.85 1.2L1.15 5.15l4.2 1.45 1.45 4.2L10.85 1.2z" fill="currentColor" />
        </svg>
      </div>
      <div className="bn-status-right">
        <svg width="17" height="17" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0.2" y="8.4" width="3.2" height="3.4" rx="0.55" fill="currentColor" />
          <rect x="4.8" y="5.7" width="3.2" height="6.1" rx="0.55" fill="currentColor" />
          <rect x="9.4" y="2.9" width="3.2" height="8.9" rx="0.55" fill="currentColor" />
          <rect x="14" y="0.2" width="3.2" height="11.6" rx="0.55" fill="currentColor" />
        </svg>
        <span className="bn-5g">{signalLabel}</span>
        {showWifi ? (
          <span className="bn-wifi">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3.55 9.85c4.75-4.6 12.15-4.6 16.9 0"
                stroke="currentColor"
                strokeWidth="2.55"
                strokeLinecap="round"
              />
              <path
                d="M6.65 13.15c2.95-2.85 7.75-2.85 10.7 0"
                stroke="currentColor"
                strokeWidth="2.55"
                strokeLinecap="round"
              />
              <path
                fill="currentColor"
                d="M12 20.55c0 0-3.15-4.05-2.35-5.15.85-1.15 3.85-1.15 4.7 0 .8 1.1-2.35 5.15-2.35 5.15z"
              />
            </svg>
          </span>
        ) : null}
        <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
          <rect
            x="0.65"
            y="0.65"
            width="23.3"
            height="11.7"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            opacity="0.92"
          />
          <rect x="2.1" y="2.15" width={fillWidth} height="8.7" rx="1.25" fill="currentColor" />
          <path
            d="M24.75 4.15c.95.4 1.5 1 1.5 2.35s-.55 1.95-1.5 2.35V4.15z"
            fill="currentColor"
            opacity="0.88"
          />
        </svg>
      </div>
    </div>
  );
}

function StatusMark({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill={color} />
      <path
        d="M4.35 8.15 6.7 10.45 11.7 5.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SupportFab() {
  return (
    <div className="receipt-fab" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="56" height="56">
        <rect
          x="12"
          y="12"
          width="40"
          height="40"
          rx="11"
          transform="rotate(45 32 32)"
          fill="#f0b90b"
        />
        <g fill="none" stroke="#1a1408" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="26.2" cy="28.5" r="1.15" fill="#1a1408" stroke="none" />
          <circle cx="37.8" cy="28.5" r="1.15" fill="#1a1408" stroke="none" />
          <path d="M25.5 36.2c2.4 3.2 10.6 3.2 13 0" />
        </g>
      </svg>
    </div>
  );
}

function CopyGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.2"
        y="5.2"
        width="9.3"
        height="9.3"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M10.6 5.2V3.7A1.7 1.7 0 0 0 8.9 2H3.7A1.7 1.7 0 0 0 2 3.7v5.2A1.7 1.7 0 0 0 3.7 10.6H5.2"
        stroke="currentColor"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path
        d="M10.2 1.6 1.8 10l8.4 8.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareGlyph() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.2v11.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M7.6 7.4 12 3.2l4.4 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 10.8v7.2a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2v-7.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HelpGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.1" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9.6 9.4a2.5 2.5 0 0 1 4.85.8c0 1.5-2.2 1.85-2.2 3.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12.25" cy="16.85" r="1" fill="currentColor" />
    </svg>
  );
}
