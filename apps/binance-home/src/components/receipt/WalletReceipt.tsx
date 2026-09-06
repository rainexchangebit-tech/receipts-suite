import type { ReactNode } from "react";
import { OVERLAYS, ORIGINAL, formatPnl, formatUsd, isDown, absPercentLabel } from "@/lib/receipt";
import type { ReceiptFields } from "@/lib/receipt";
import { StatusBarOverlay } from "@/components/receipt/StatusBar";
import { cn } from "@/lib/utils";

type OverlayBox = {
  left: number;
  top: number;
  width: number;
  height: number;
  cover: string;
  fontSize: number;
  weight: number;
  tracking: string;
  padX: number;
};

type Props = {
  fields: ReceiptFields;
  exporting?: boolean;
  onEdit?: (key: keyof ReceiptFields) => void;
};

function CoverText({
  box,
  text,
  color,
  extra,
}: {
  box: OverlayBox;
  text: string;
  color: string;
  extra?: ReactNode;
}) {
  return (
    <div
      className="receipt-overlay"
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        paddingLeft: box.padX,
        background: box.cover,
        color,
        fontSize: box.fontSize,
        fontWeight: box.weight,
        letterSpacing: box.tracking,
      }}
    >
      {extra}
      <span className="min-w-0 truncate">{text}</span>
    </div>
  );
}

export function WalletReceipt({ fields, exporting = false, onEdit }: Props) {
  const amountDirty = fields.totalUsdt !== ORIGINAL.totalUsdt;
  const pnlDirty = fields.pnlUsdt !== ORIGINAL.pnlUsdt || fields.pnlPct !== ORIGINAL.pnlPct;
  const bnbDirty = fields.bnb !== ORIGINAL.bnb;
  const bnbPctDirty = fields.bnbPct !== ORIGINAL.bnbPct;

  const pnlDown = isDown(fields.pnlUsdt) || isDown(fields.pnlPct);
  const bnbDown = isDown(fields.bnbPct);

  return (
    <div className="receipt-stage" data-exporting={exporting ? "true" : "false"}>
      <img
        src="/binance-home/receipt-base.png"
        alt=""
        width={589}
        height={1280}
        draggable={false}
        className="receipt-base"
      />

      <StatusBarOverlay fields={fields} />

      {amountDirty ? (
        <CoverText box={OVERLAYS.amount} text={fields.totalUsdt || "0"} color={OVERLAYS.amount.color} />
      ) : null}
      {amountDirty ? (
        <CoverText box={OVERLAYS.usd} text={formatUsd(fields.totalUsdt)} color={OVERLAYS.usd.color} />
      ) : null}
      {pnlDirty ? (
        <CoverText
          box={OVERLAYS.pnl}
          text={formatPnl(fields.pnlUsdt, fields.pnlPct)}
          color={pnlDown ? OVERLAYS.pnl.colorDown : OVERLAYS.pnl.colorUp}
        />
      ) : null}
      {bnbDirty ? (
        <CoverText box={OVERLAYS.bnb} text={fields.bnb || "0"} color={OVERLAYS.bnb.color} />
      ) : null}
      {bnbPctDirty ? (
        <CoverText
          box={OVERLAYS.bnbPct}
          text={absPercentLabel(fields.bnbPct)}
          color={bnbDown ? OVERLAYS.bnbPct.colorDown : OVERLAYS.bnbPct.colorUp}
          extra={
            <span aria-hidden="true" className="mr-0.5 text-[11px] leading-none">
              {bnbDown ? "▾" : "▴"}
            </span>
          }
        />
      ) : null}

      {!exporting ? (
        <>
          <button
            type="button"
            className={cn("receipt-hit")}
            style={{
              left: OVERLAYS.amount.left,
              top: OVERLAYS.amount.top,
              width: OVERLAYS.amount.width,
              height: OVERLAYS.amount.height + OVERLAYS.usd.height,
            }}
            onClick={() => onEdit?.("totalUsdt")}
            aria-label="Edit total value"
          />
          <button
            type="button"
            className="receipt-hit"
            style={{
              left: OVERLAYS.pnl.left,
              top: OVERLAYS.pnl.top,
              width: OVERLAYS.pnl.width,
              height: OVERLAYS.pnl.height,
            }}
            onClick={() => onEdit?.("pnlUsdt")}
            aria-label="Edit today's PNL"
          />
          <button
            type="button"
            className="receipt-hit"
            style={{
              left: OVERLAYS.bnb.left,
              top: OVERLAYS.bnb.top,
              width: OVERLAYS.bnb.width,
              height: OVERLAYS.bnbPct.top + OVERLAYS.bnbPct.height - OVERLAYS.bnb.top,
            }}
            onClick={() => onEdit?.("bnb")}
            aria-label="Edit BNB value"
          />
          <button
            type="button"
            className="receipt-hit"
            style={{ left: 70, top: 26, width: 90, height: 30 }}
            onClick={() => onEdit?.("statusTime")}
            aria-label="Edit status time"
          />
        </>
      ) : null}
    </div>
  );
}
