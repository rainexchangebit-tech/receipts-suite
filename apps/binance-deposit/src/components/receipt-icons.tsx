type IconProps = { className?: string; size?: number };

export function ChevronLeftIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M15.4 4.8L8.2 12l7.2 7.2"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeadphoneIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <rect x="3.4" y="12.4" width="4.4" height="7.2" rx="1.7" stroke="currentColor" strokeWidth="1.85" />
      <rect x="16.2" y="12.4" width="4.4" height="7.2" rx="1.7" stroke="currentColor" strokeWidth="1.85" />
    </svg>
  );
}

export function CopyIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="8.4" y="8.4" width="11" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M15.6 8.2V6.7A2.5 2.5 0 0 0 13.1 4.2H6.7A2.5 2.5 0 0 0 4.2 6.7v6.4a2.5 2.5 0 0 0 2.5 2.5h1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function BookmarkPlusIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7.1 3.8h9.8c.9 0 1.6.7 1.6 1.6v15.1L12 16.8 5.5 20.5V5.4c0-.9.7-1.6 1.6-1.6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 7.6v5.1M9.45 10.15h5.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 16, className, color = "#2ebd85" }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7.15" fill={color} />
      <path
        d="M4.55 8.2l2.2 2.15 4.7-4.75"
        fill="none"
        stroke="#fff"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockCircleIcon({ size = 16, className, color = "#f0b90b" }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7.15" fill={color} />
      <path d="M8 4.6v3.6l2.3 1.4" fill="none" stroke="#17181C" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

export function CloseCircleIcon({ size = 16, className, color = "#f6465d" }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7.15" fill={color} />
      <path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MinusCircleIcon({ size = 16, className, color = "#848e9c" }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7.15" fill={color} />
      <path d="M4.8 8h6.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ScanReportIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 4.4h6.4L18.6 9v10.6H8A1.6 1.6 0 0 1 6.4 18V6A1.6 1.6 0 0 1 8 4.4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14.2 4.6V9h4.4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.3 12.3h6.3M9.3 15.5h4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function WifiIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
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

export function SignalIcon({ size = 17, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 12" className={className} aria-hidden>
      <rect x="0.2" y="8.4" width="3.2" height="3.4" rx="0.55" fill="currentColor" />
      <rect x="4.8" y="5.7" width="3.2" height="6.1" rx="0.55" fill="currentColor" />
      <rect x="9.4" y="2.9" width="3.2" height="8.9" rx="0.55" fill="currentColor" />
      <rect x="14" y="0.2" width="3.2" height="11.6" rx="0.55" fill="currentColor" />
    </svg>
  );
}

export function LocationArrowIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} aria-hidden>
      <path d="M10.85 1.2L1.15 5.15l4.2 1.45 1.45 4.2L10.85 1.2z" fill="currentColor" />
    </svg>
  );
}

export function BatteryIcon({
  percent = 56,
  sizeW = 27,
  sizeH = 13,
}: {
  percent?: number;
  sizeW?: number;
  sizeH?: number;
}) {
  const inner = Math.max(0, Math.min(100, percent));
  const fillW = 18.8 * (inner / 100);
  return (
    <svg width={sizeW} height={sizeH} viewBox="0 0 27 13" aria-hidden>
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
      <rect x="2.1" y="2.15" width={fillW} height="8.7" rx="1.25" fill="currentColor" />
      <path d="M24.75 4.15c.95.4 1.5 1 1.5 2.35s-.55 1.95-1.5 2.35V4.15z" fill="currentColor" opacity="0.88" />
    </svg>
  );
}
