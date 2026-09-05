import { forwardRef } from "react";
import { AssetLogo } from "@/components/asset-logos";
import {
  displayAmount,
  displayFee,
  displayFeeUsd,
  displayMiddle,
  statusTone,
  type ReceiptData,
} from "@/lib/receipt";

function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
      <rect x="0.2" y="8.4" width="3.1" height="3.4" rx="0.55" fill="#111111" />
      <rect x="4.9" y="5.8" width="3.1" height="6" rx="0.55" fill="#111111" />
      <rect x="9.6" y="3.1" width="3.1" height="8.7" rx="0.55" fill="#111111" />
      <rect x="14.3" y="0.4" width="3.1" height="11.4" rx="0.55" fill="#111111" />
    </svg>
  );
}

function BatteryIcon({ level }: { level: number }) {
  const pct = Math.max(0, Math.min(100, level));
  const fillW = 18.2 * (pct / 100);
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
      <rect
        x="0.55"
        y="1.05"
        width="22"
        height="10.9"
        rx="2.3"
        fill="none"
        stroke="#111111"
        strokeOpacity="0.32"
        strokeWidth="1.15"
      />
      <rect
        x="2.05"
        y="2.55"
        width={fillW}
        height="7.9"
        rx="1.35"
        fill="#111111"
      />
      <path
        d="M24.4 4.35c.95.4 1.45 1.1 1.45 2.15s-.5 1.75-1.45 2.15V4.35z"
        fill="#111111"
        opacity="0.38"
      />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width="13" height="22" viewBox="0 0 13 22" aria-hidden="true">
      <path
        d="M11.2 1.8L2.2 11l9 9.2"
        fill="none"
        stroke="#1c1c1e"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExplorerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6.4 3.1H4.2c-.9 0-1.6.7-1.6 1.6v7.5c0 .9.7 1.6 1.6 1.6h7.5c.9 0 1.6-.7 1.6-1.6V9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M8.2 7.8L14 2M9.7 2H14v4.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ReceiptScreen = forwardRef<
  HTMLDivElement,
  { data: ReceiptData }
>(function ReceiptScreen({ data }, ref) {
  const tone = statusTone(data.status);

  return (
    <div className="rw" ref={ref} data-receipt="true">
      {data.showStatusBar ? (
        <div className="rw-sb">
          <span className="rw-sb-time">{data.statusTime}</span>
          <div className="rw-sb-right">
            <SignalIcon />
            <span className="rw-sb-carrier">{data.carrier}</span>
            <BatteryIcon level={data.battery} />
          </div>
        </div>
      ) : (
        <div className="rw-sb-spacer" />
      )}

      <div className="rw-nav">
        <span className="rw-back">
          <BackChevron />
        </span>
        <div className="rw-title">{data.title || "Sent"}</div>
      </div>

      <div className="rw-hero">
        <AssetLogo asset={data.asset} size={68} />
        <div className="rw-amount">{displayAmount(data)}</div>
        <div className="rw-date">{data.dateText}</div>
      </div>

      <div className="rw-card">
        <div className="rw-row">
          <span className="rw-label">Status</span>
          <span className={`rw-value rw-value-nowrap rw-tone-${tone}`}>
            {data.status}
          </span>
        </div>
        <div className="rw-row">
          <span className="rw-label">Network</span>
          <span className="rw-value">{data.network}</span>
        </div>
        <div className="rw-row">
          <span className="rw-label">From</span>
          <span className="rw-value rw-value-nowrap">
            {displayMiddle(data.from)}
          </span>
        </div>
        <div className="rw-row">
          <span className="rw-label">To</span>
          <span className="rw-value rw-value-nowrap">
            {displayMiddle(data.to)}
          </span>
        </div>
        <div className="rw-row rw-row-fee">
          <span className="rw-label">Network Fee</span>
          <div className="rw-fee-col">
            <span className="rw-value rw-value-nowrap">{displayFee(data)}</span>
            <span className="rw-fee-usd">{displayFeeUsd(data.feeUsd)}</span>
          </div>
        </div>
        <div className="rw-row rw-row-hash">
          <span className="rw-label">Transaction Hash</span>
          <span className="rw-value rw-value-nowrap">
            {displayMiddle(data.txHash)}
          </span>
        </div>
      </div>

      {(data.showSpeedUp || data.showCancel) && (
        <div className="rw-actions">
          {data.showSpeedUp ? (
            <div className="rw-btn rw-btn-speed">
              {data.speedLabel || "Speed up"}
            </div>
          ) : null}
          {data.showCancel ? (
            <div className="rw-btn rw-btn-cancel">
              {data.cancelLabel || "Cancel Request"}
            </div>
          ) : null}
        </div>
      )}

      <div className="rw-spacer" />

      {data.showExplorer ? (
        <div className="rw-explorer-wrap">
          <div className="rw-btn rw-btn-explorer">
            {data.explorerLabel || "View on Explorer"}
            <ExplorerIcon />
          </div>
        </div>
      ) : null}

      {data.showHomeIndicator ? (
        <div className="rw-home">
          <div className="rw-home-pill" />
        </div>
      ) : (
        <div className="rw-home-spacer" />
      )}
    </div>
  );
});
