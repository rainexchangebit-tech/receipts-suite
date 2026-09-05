import {
  useReceiptStore,
  STATUS_COLOR,
  type Receipt,
  type ReceiptStatus,
} from "@/lib/receipt-store";
import { copyText } from "@/lib/export-receipt";
import {
  BatteryIcon,
  BookmarkPlusIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockCircleIcon,
  CloseCircleIcon,
  CopyIcon,
  HeadphoneIcon,
  LocationArrowIcon,
  MinusCircleIcon,
  ScanReportIcon,
  SignalIcon,
  WifiIcon,
} from "@/components/receipt-icons";
import { toast } from "sonner";

type Props = {
  receipt: Receipt;
};

function StatusGlyph({ status, color }: { status: ReceiptStatus; color: string }) {
  const size = 15;
  if (status === "Processing") return <ClockCircleIcon size={size} color={color} />;
  if (status === "Failed") return <CloseCircleIcon size={size} color={color} />;
  if (status === "Cancelled") return <MinusCircleIcon size={size} color={color} />;
  return <CheckCircleIcon size={size} color={color} />;
}

function Row({
  label,
  field,
  children,
}: {
  label: string;
  field?: keyof Receipt;
  children: React.ReactNode;
}) {
  const focused = useReceiptStore((s) => s.focused);
  const exporting = useReceiptStore((s) => s.exporting);
  const setFocused = useReceiptStore((s) => s.setFocused);
  const active = Boolean(field && focused === field && !exporting);
  return (
    <div
      className={`bn-row${active ? " is-active" : ""}`}
      onClick={() => field && setFocused(field)}
    >
      <span className="bn-label">{label}</span>
      <div className="bn-value">{children}</div>
    </div>
  );
}

async function handleCopy(label: string, value: string) {
  try {
    await copyText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Could not copy");
  }
}

export function ReceiptScreen({ receipt }: Props) {
  const statusColor = STATUS_COLOR[receipt.status];
  const setFocused = useReceiptStore((s) => s.setFocused);
  const focused = useReceiptStore((s) => s.focused);
  const exporting = useReceiptStore((s) => s.exporting);
  const mark = (key: keyof Receipt) => (focused === key && !exporting ? " is-active" : "");

  return (
    <div className="bn-receipt" data-receipt-root="1">
      <div className="bn-statusbar">
        <div className="bn-status-left">
          <span className={`bn-time${mark("time")}`} onClick={() => setFocused("time")}>
            {receipt.time}
          </span>
          <LocationArrowIcon size={11} className="bn-loc" />
        </div>
        <div className="bn-status-right">
          <SignalIcon size={17} />
          <span
            className={`bn-5g${mark("networkType")}`}
            onClick={() => setFocused("networkType")}
          >
            {receipt.networkType}
          </span>
          {receipt.showWifi !== false ? (
            <span
              className={`bn-wifi${mark("showWifi")}`}
              onClick={() => setFocused("showWifi")}
              aria-label="Wi‑Fi"
            >
              <WifiIcon size={16} />
            </span>
          ) : null}
          <span className={`bn-batt-wrap${mark("battery")}`} onClick={() => setFocused("battery")}>
            <BatteryIcon percent={receipt.battery} />
          </span>
        </div>
      </div>

      <header className="bn-nav">
        <button type="button" className="bn-nav-btn" aria-label="Back">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className={`bn-nav-title${mark("title")}`} onClick={() => setFocused("title")}>
          {receipt.title}
        </h1>
        <button type="button" className="bn-nav-btn" aria-label="Support">
          <HeadphoneIcon size={22} />
        </button>
      </header>

      <div className="bn-hero">
        <div
          className={`bn-amount${mark("signedAmount")}`}
          onClick={() => setFocused("signedAmount")}
        >
          {receipt.signedAmount} {receipt.asset}
        </div>
        <div className={`bn-status${mark("status")}`} onClick={() => setFocused("status")}>
          <StatusGlyph status={receipt.status} color={statusColor} />
          <span style={{ color: statusColor }}>{receipt.status}</span>
        </div>
        <p className={`bn-note${mark("note")}`} onClick={() => setFocused("note")}>
          {receipt.note}
        </p>
        <button
          type="button"
          className={`bn-help${mark("helpLink")}`}
          onClick={() => setFocused("helpLink")}
        >
          {receipt.helpLink}
        </button>
      </div>

      <div className="bn-divider" />

      <div className="bn-details">
        <Row label="Network" field="network">
          <span>{receipt.network}</span>
        </Row>

        <Row label="Address" field="address">
          <div className="bn-copy-block">
            <span className="bn-break">{receipt.address}</span>
            <button
              type="button"
              className="bn-copy"
              aria-label="Copy address"
              onClick={(e) => {
                e.stopPropagation();
                void handleCopy("Address", receipt.address);
              }}
            >
              <CopyIcon size={15} />
            </button>
          </div>
          <button
            type="button"
            className="bn-save"
            onClick={(e) => {
              e.stopPropagation();
              setFocused("saveAddress");
              toast.success("Address saved");
            }}
          >
            {receipt.saveAddress}
            <BookmarkPlusIcon size={14} />
          </button>
        </Row>

        <Row label="Txid" field="txid">
          <div className="bn-copy-block">
            <span className="bn-break">{receipt.txid}</span>
            <button
              type="button"
              className="bn-copy"
              aria-label="Copy transaction id"
              onClick={(e) => {
                e.stopPropagation();
                void handleCopy("Txid", receipt.txid);
              }}
            >
              <CopyIcon size={15} />
            </button>
          </div>
        </Row>

        <Row label="Amount" field="amount">
          <span>{receipt.amount}</span>
        </Row>
        <Row label="Network fee" field="fee">
          <span>{receipt.fee}</span>
        </Row>
        <Row label="Wallet" field="wallet">
          <span>{receipt.wallet}</span>
        </Row>
        <Row label="Date" field="date">
          <span>{receipt.date}</span>
        </Row>
      </div>

      <button
        type="button"
        className={`bn-scan${mark("scanReport")}`}
        onClick={() => setFocused("scanReport")}
      >
        <ScanReportIcon size={15} />
        {receipt.scanReport}
      </button>

      <div className="bn-spacer" />

      <div className="bn-bottom">
        <button
          type="button"
          className={`bn-cta${mark("button")}`}
          onClick={() => setFocused("button")}
        >
          {receipt.button}
        </button>
        <div className="bn-home" />
      </div>
    </div>
  );
}
