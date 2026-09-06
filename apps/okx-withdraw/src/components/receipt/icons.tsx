type IconProps = { className?: string };

export function BtcIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#fff"
        d="M22.3 14.1c.3-2.1-1.3-3.2-3.5-4l.7-2.9-1.7-.4-.7 2.8c-.5-.1-.9-.2-1.4-.3l.7-2.8-1.7-.4-.7 2.9c-.4-.1-.8-.2-1.1-.3l-2.4-.6-.5 1.8s1.3.3 1.3.3c.7.2.8.6.8 1l-.8 3.3c0 .1.1.1.1.1h-.1l-1.1 4.5c-.1.2-.3.5-.7.4 0 0-1.3-.3-1.3-.3l-.9 2 2.3.6c.4.1.8.2 1.2.3l-.7 3 .1.1 1.7.4.7-3c.5.1 1 .3 1.4.3l-.7 2.9 1.7.4.7-3c2.9.6 5.1.3 6-2.3.7-2.1 0-3.4-1.6-4.2 1.1-.3 2-1 2.2-2.6zm-3.2 4.5c-.5 2.1-4.1 1-5.3.7l.9-3.8c1.2.3 5 .9 4.4 3.1zm.5-4.6c-.5 1.9-3.4.9-4.4.7l.9-3.4c1 .2 4.1.7 3.5 2.7z"
      />
    </svg>
  );
}

export function EthIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path fill="#fff" fillOpacity="0.8" d="M16.5 6v7.5l6.3 2.8z" />
      <path fill="#fff" d="M16.5 6 10.2 16.3l6.3-2.8z" />
      <path fill="#fff" fillOpacity="0.8" d="M16.5 21.1v4.9l6.3-8.7z" />
      <path fill="#fff" d="M16.5 26v-4.9l-6.3-3.8z" />
      <path fill="#fff" fillOpacity="0.6" d="M16.5 19.4 22.8 16.3 16.5 13.6z" />
      <path fill="#fff" fillOpacity="0.8" d="m10.2 16.3 6.3 3.1V13.6z" />
    </svg>
  );
}

export function UsdtIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#fff"
        d="M17.9 17.6v.1c-.1 2.3-3.8 2.5-3.9 0v-.1H9.7c.2 3.2 2.7 4.4 4.7 4.8v2.4h3.1v-2.4c2.3-.4 4.6-1.8 4.7-4.8zm0-1.3c0-2.1-1.8-2.6-3.1-2.8V9.9h3.1V7.7h-8.1v2.2h3.1v3.6c-1.6.2-3.4.8-3.4 2.8h8.4z"
      />
    </svg>
  );
}

export function GenericCoinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#2B3139" />
      <circle
        cx="16"
        cy="16"
        r="9"
        fill="none"
        stroke="#F5F5F5"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CopyGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="8.5"
        y="8.5"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M15.5 8.5V6.8A2.3 2.3 0 0 0 13.2 4.5H6.8A2.3 2.3 0 0 0 4.5 6.8v6.4A2.3 2.3 0 0 0 6.8 15.5H8.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function FlameGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 14" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.1.4s.2 2.3-1.3 3.8C3.3 5.7 2.4 6.9 2.4 8.6c0 2 1.6 3.6 3.7 3.6s3.7-1.6 3.7-3.6c0-1.4-.5-2.3-1.5-3.5-.4-.5-.8-1-1-1.6C6.9 2.6 6.1.4 6.1.4Zm.1 10.6c-1.1 0-1.9-.8-1.9-1.8 0-.7.4-1.3 1-1.8.3 1 .9 1.3 1.3 1.3.5 0 .8-.3.8-.8 0-.3-.1-.6-.4-1 .7.3 1.5 1.1 1.5 2.2 0 1.1-.9 1.9-2.3 1.9Z"
      />
    </svg>
  );
}

export function StatusMark({
  status,
}: {
  status: "Received" | "Processing" | "Failed" | "Cancelled";
}) {
  if (status === "Processing") {
    return (
      <svg viewBox="0 0 16 16" className="slip-status-icon" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
          d="M8 4.2v4l2.4 1.4"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (status === "Failed" || status === "Cancelled") {
    return (
      <svg viewBox="0 0 16 16" className="slip-status-icon" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
          d="M5.4 5.4 10.6 10.6M10.6 5.4 5.4 10.6"
          fill="none"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="slip-status-icon" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="M4.7 8.2 6.9 10.4 11.3 5.8"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PairIconView({
  icon,
  className,
}: {
  icon: "btc" | "eth" | "usdt" | "generic";
  className?: string;
}) {
  if (icon === "btc") return <BtcIcon className={className} />;
  if (icon === "eth") return <EthIcon className={className} />;
  if (icon === "usdt") return <UsdtIcon className={className} />;
  return <GenericCoinIcon className={className} />;
}
