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

function LocationArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M10.85 1.2L1.15 5.15l4.2 1.45 1.45 4.2L10.85 1.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 12" aria-hidden="true">
      <rect x="0.2" y="8.4" width="3.2" height="3.4" rx="0.55" fill="currentColor" />
      <rect x="4.8" y="5.7" width="3.2" height="6.1" rx="0.55" fill="currentColor" />
      <rect x="9.4" y="2.9" width="3.2" height="8.9" rx="0.55" fill="currentColor" />
      <rect x="14" y="0.2" width="3.2" height="11.6" rx="0.55" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      className="bn-wifi"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
  );
}

function BatteryIcon({ level }: { level: number }) {
  const pct = Math.max(0, Math.min(100, level));
  const fillW = 18.8 * (pct / 100);
  return (
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
      <rect
        x="2.1"
        y="2.15"
        width={fillW}
        height="8.7"
        rx="1.25"
        fill="currentColor"
      />
      <path
        d="M24.75 4.15c.95.4 1.5 1 1.5 2.35s-.55 1.95-1.5 2.35V4.15z"
        fill="currentColor"
        opacity="0.88"
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
        <div className="bn-statusbar">
          <div className="bn-status-left">
            <span className="bn-time">{data.statusTime}</span>
            <LocationArrow />
          </div>
          <div className="bn-status-right">
            <SignalIcon />
            <span className="bn-5g">{data.carrier || "5G"}</span>
            {data.showWifi ? <WifiIcon /> : null}
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
        <AssetLogo asset={data.asset} size={64} />
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
