import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const PHONE_W = 390;
const PHONE_H = 868;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(0.72);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const fit = () => {
      const styles = getComputedStyle(el);
      const padX =
        (Number.parseFloat(styles.paddingLeft) || 0) + (Number.parseFloat(styles.paddingRight) || 0);
      const padY =
        (Number.parseFloat(styles.paddingTop) || 0) + (Number.parseFloat(styles.paddingBottom) || 0);
      const w = Math.max(0, el.clientWidth - padX);
      const h = Math.max(0, el.clientHeight - padY);
      if (w < 40 || h < 40) return;
      const next = Math.min(1, w / PHONE_W, h / PHONE_H);
      const clamped = Number.isFinite(next) ? Math.max(0.28, next) : 0.72;
      setScale((prev) => {
        const rounded = Math.round(clamped * 1000) / 1000;
        return Math.abs(prev - rounded) < 0.002 ? prev : rounded;
      });
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <section ref={stageRef} className="studio-stage" aria-label="Receipt preview">
      <div
        className="phone-fit"
        style={{ "--phone-scale": String(scale) } as CSSProperties}
      >
        <div className="phone-scale">{children}</div>
      </div>
    </section>
  );
}
