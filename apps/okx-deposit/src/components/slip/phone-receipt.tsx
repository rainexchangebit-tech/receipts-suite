import { toast } from "sonner";
import {
  formatTxId,
  networkKind,
  type Receipt,
  type SlipStatus,
} from "@/lib/receipt";
import { cn } from "@/lib/utils";
import {
  BackChevron,
  BatteryMark,
  BnbMark,
  BtcMark,
  CheckGlyph,
  ClockGlyph,
  CloseGlyph,
  CopyMark,
  EthMark,
  GenericNetMark,
  InfoMark,
  LocationArrow,
  SignalBars,
  AssetMark,
  TronMark,
  WifiMark,
} from "@/components/slip/marks";

type Props = {
  data: Receipt;
  interactive?: boolean;
  captureId?: string;
  onChange?: <K extends keyof Receipt>(key: K, value: Receipt[K]) => void;
};

function SlipField({
  interactive,
  value,
  onChange,
  className,
  label,
  align = "right",
  multiline = false,
}: {
  interactive: boolean;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  label: string;
  align?: "left" | "center" | "right";
  multiline?: boolean;
}) {
  const shared = cn("slip-edit", align === "center" && "slip-edit-center", className);
  if (!interactive) {
    return <span className={className}>{value}</span>;
  }
  if (multiline) {
    return (
      <textarea
        aria-label={label}
        className={shared}
        value={value}
        rows={2}
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  }
  return (
    <input
      aria-label={label}
      className={shared}
      value={value}
      size={Math.max(1, value.length)}
      spellCheck={false}
      autoComplete="off"
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

function copyValue(label: string, value: string) {
  void navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.error("Could not copy"),
  );
}

function StatusBadge({ status }: { status: SlipStatus }) {
  const tone =
    status === "Completed" ? "ok" : status === "Processing" ? "wait" : "bad";
  return (
    <span className={cn("slip-badge", `slip-badge-${tone}`)} aria-hidden="true">
      {status === "Completed" ? (
        <CheckGlyph />
      ) : status === "Processing" ? (
        <ClockGlyph />
      ) : (
        <CloseGlyph />
      )}
    </span>
  );
}

function NetworkIcon({ network }: { network: string }) {
  const kind = networkKind(network);
  if (kind === "tron") return <TronMark />;
  if (kind === "eth") return <EthMark />;
  if (kind === "bnb") return <BnbMark />;
  if (kind === "btc") return <BtcMark size={16} />;
  return <GenericNetMark />;
}

function CopyBtn({
  label,
  value,
  interactive,
}: {
  label: string;
  value: string;
  interactive: boolean;
}) {
  return (
    <button
      type="button"
      className="slip-icon-btn"
      aria-label={`Copy ${label}`}
      tabIndex={interactive ? 0 : -1}
      onClick={() => {
        if (interactive) copyValue(label, value);
      }}
    >
      <CopyMark />
    </button>
  );
}

export function PhoneReceipt({
  data,
  interactive = false,
  captureId,
  onChange,
}: Props) {
  const change = <K extends keyof Receipt>(key: K, value: Receipt[K]) => {
    onChange?.(key, value);
  };

  return (
    <article
      id={captureId}
      className="slip"
      aria-label="Withdrawal receipt"
    >
      {data.showStatusBar ? (
        <header className="bn-statusbar">
          <div className="bn-status-left">
            <SlipField
              interactive={interactive}
              value={data.statusBarTime}
              onChange={(v) => change("statusBarTime", v)}
              className="bn-time"
              label="Status bar time"
              align="left"
            />
            <LocationArrow />
          </div>
          <div className="bn-status-right">
            <SignalBars />
            <SlipField
              interactive={interactive}
              value={data.signalLabel}
              onChange={(v) => change("signalLabel", v)}
              className="bn-5g"
              label="Signal label"
              align="left"
            />
            {data.showWifi ? (
              <span className="bn-wifi">
                <WifiMark />
              </span>
            ) : null}
            <BatteryMark percent={data.battery} />
          </div>
        </header>
      ) : (
        <div className="slip-statusbar-spacer" />
      )}

      <button type="button" className="slip-back" tabIndex={-1} aria-hidden="true">
        <BackChevron />
      </button>

      <div className="slip-hero">
        <span className="slip-tether">
          <AssetMark asset={data.asset} size={44} />
        </span>
        <h1 className="slip-title">
          <SlipField
            interactive={interactive}
            value={data.verb}
            onChange={(v) => change("verb", v)}
            label="Action"
            align="center"
          />
          <SlipField
            interactive={interactive}
            value={data.amount}
            onChange={(v) => change("amount", v)}
            label="Amount"
            align="center"
          />
          <SlipField
            interactive={interactive}
            value={data.asset}
            onChange={(v) => change("asset", v)}
            label="Asset"
            align="center"
          />
        </h1>
        <p className="slip-fiat">
          <SlipField
            interactive={interactive}
            value={data.fiatApprox}
            onChange={(v) => change("fiatApprox", v)}
            label="Fiat equivalent"
            align="center"
          />
        </p>
      </div>

      <div className="slip-status">
        <StatusBadge status={data.status} />
        <span className="slip-status-label">Status</span>
        <span className="slip-status-value">{data.status}</span>
      </div>

      <div className="slip-rule" />

      <div className="slip-rows">
        <div className="slip-row">
          <span className="slip-label">Address</span>
          <div className="slip-value-cluster">
            <SlipField
              interactive={interactive}
              value={data.address}
              onChange={(v) => change("address", v)}
              className="slip-address"
              label="Address"
              multiline
            />
            <CopyBtn label="Address" value={data.address} interactive={interactive} />
          </div>
        </div>

        <div className="slip-row slip-row-center">
          <span className="slip-label">
            Price
            <span className="slip-info" aria-hidden="true">
              <InfoMark />
            </span>
          </span>
          <span className="slip-value">
            <SlipField
              interactive={interactive}
              value={data.price}
              onChange={(v) => change("price", v)}
              label="Price"
            />
          </span>
        </div>

        <div className="slip-row slip-row-center">
          <span className="slip-label">Network</span>
          <span className="slip-value slip-network">
            <NetworkIcon network={data.network} />
            <SlipField
              interactive={interactive}
              value={data.network}
              onChange={(v) => change("network", v)}
              label="Network"
            />
          </span>
        </div>

        <div className="slip-row slip-row-center">
          <span className="slip-label">Network fee</span>
          <span className="slip-value">
            <SlipField
              interactive={interactive}
              value={data.networkFee}
              onChange={(v) => change("networkFee", v)}
              label="Network fee"
            />
          </span>
        </div>

        <div className="slip-row slip-row-center">
          <span className="slip-label">Transaction ID</span>
          <div className="slip-value-cluster slip-value-cluster-mid">
            <SlipField
              interactive={interactive}
              value={formatTxId(data.txId)}
              onChange={(v) => change("txId", v)}
              label="Transaction ID"
            />
            <CopyBtn label="Transaction ID" value={data.txId} interactive={interactive} />
          </div>
        </div>

        <div className="slip-row slip-row-center">
          <span className="slip-label">Submitted time</span>
          <span className="slip-value">
            <SlipField
              interactive={interactive}
              value={data.submittedTime}
              onChange={(v) => change("submittedTime", v)}
              label="Submitted time"
            />
          </span>
        </div>

        <div className="slip-row slip-row-center">
          <span className="slip-label">Reference no.</span>
          <div className="slip-value-cluster slip-value-cluster-mid">
            <SlipField
              interactive={interactive}
              value={data.referenceNo}
              onChange={(v) => change("referenceNo", v)}
              label="Reference number"
            />
            <CopyBtn
              label="Reference number"
              value={data.referenceNo}
              interactive={interactive}
            />
          </div>
        </div>
      </div>

      <div className="slip-cta">
        <button type="button" className="slip-explorer" tabIndex={interactive ? 0 : -1}>
          <SlipField
            interactive={interactive}
            value={data.explorerLabel}
            onChange={(v) => change("explorerLabel", v)}
            className="slip-explorer-label"
            label="Explorer button"
            align="center"
          />
        </button>
        <p className="slip-help">
          <SlipField
            interactive={interactive}
            value={data.helpText}
            onChange={(v) => change("helpText", v)}
            className="slip-help-label"
            label="Help text"
            align="center"
          />
        </p>
      </div>

      {data.showHomeIndicator ? <div className="slip-home" /> : <div className="slip-home-gap" />}
    </article>
  );
}
