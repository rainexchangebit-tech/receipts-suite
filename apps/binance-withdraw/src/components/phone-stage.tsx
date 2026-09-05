import { useEffect, useRef, useState } from "react";
import { ReceiptScreen } from "@/components/receipt-screen";
import { RECEIPT_H, RECEIPT_W, type ReceiptData } from "@/lib/receipt";

export function PhoneStage({ data }: { data: ReceiptData }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const next = Math.min(rect.width / RECEIPT_W, rect.height / RECEIPT_H, 1);
      if (Number.isFinite(next) && next > 0.2) setScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="phone-stage">
      <div
        className="phone-screen"
        style={{
          width: RECEIPT_W,
          height: RECEIPT_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <ReceiptScreen data={data} />
      </div>
    </div>
  );
}
