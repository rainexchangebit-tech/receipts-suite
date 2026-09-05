import { assetKind } from "@/lib/receipt";

export function TetherMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#0C8E93" />
      <path
        fill="#fff"
        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.39-.202 7.694-1.073 7.694-2.116 0-1.043-3.304-1.914-7.694-2.117"
      />
    </svg>
  );
}

export function BtcMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#fff"
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783-1.727-.43-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.802 1.005l-1.378 5.528c-.066.164-.233.398-.766.308.017.025-1.256-.313-1.256-.313l-.859 1.978 2.25.561c.192.168.1.3 1.256.307l-.711 2.854 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.727.43.71-2.847c2.964.562 5.194.335 6.135-2.345.757-2.153-.037-3.39-1.597-4.196 1.137-.26 1.99-1.003 2.218-2.538zm-3.97 5.56c-.538 2.156-4.169.992-5.348.7l.954-3.824c1.178.293 4.96.872 4.394 3.124zm.537-5.617c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.69 3.61 2.733z"
      />
    </svg>
  );
}

export function AssetMark({
  asset,
  size = 44,
}: {
  asset: string;
  size?: number;
}) {
  const kind = assetKind(asset);
  if (kind === "BTC") return <BtcMark size={size} />;
  if (kind === "ETH") return <EthMark size={size} />;
  return <TetherMark size={size} />;
}

export function TronMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#EF0027" />
      <path
        fill="#fff"
        d="M8.15 21.85 16 6.4l7.85 15.45-7.85-2.95-7.85 2.95zm2.55-1.15 5.3-2V10.4L10.7 20.7zm6.6-2 5.3 2L16.7 10.4v8.3z"
      />
    </svg>
  );
}

export function EthMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path fill="#fff" fillOpacity="0.92" d="M16 6.5v7.6l6.4 2.9L16 6.5z" />
      <path fill="#fff" fillOpacity="0.7" d="M16 6.5 9.6 17l6.4-2.9V6.5z" />
      <path fill="#fff" fillOpacity="0.92" d="M16 21.7v4.8l6.4-8.9L16 21.7z" />
      <path fill="#fff" fillOpacity="0.7" d="M16 26.5v-4.8l-6.4-4.1 6.4 8.9z" />
    </svg>
  );
}

export function BnbMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
      <path
        fill="#fff"
        d="M16 8.2 18.3 10.5 16 12.8 13.7 10.5 16 8.2zm-5.5 5.5L12.8 16l-2.3 2.3L8.2 16l2.3-2.3zm11 0L23.8 16l-2.3 2.3L19.2 16l2.3-2.3zM16 19.2 18.3 16.9 16 14.6 13.7 16.9 16 19.2zm0 4.6L13.7 21.5 16 19.2 18.3 21.5 16 23.8zM10.5 18.3 8.2 16l2.3-2.3L12.8 16l-2.3 2.3zm11 0L19.2 16l2.3-2.3L23.8 16l-2.3 2.3z"
      />
    </svg>
  );
}

export function GenericNetMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#8C8C8C" />
      <path
        fill="#fff"
        d="M16 8a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2.2a5.8 5.8 0 1 0 0 11.6 5.8 5.8 0 0 0 0-11.6z"
      />
    </svg>
  );
}

export function SignalBars() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden="true">
      <rect x="0.25" y="8.15" width="2.45" height="3.6" rx="0.45" fill="currentColor" />
      <rect x="4.7" y="5.45" width="2.45" height="6.3" rx="0.45" fill="currentColor" />
      <rect x="9.15" y="2.7" width="2.45" height="9.05" rx="0.45" fill="currentColor" />
      <rect x="13.6" y="0.2" width="2.45" height="11.55" rx="0.45" fill="currentColor" />
    </svg>
  );
}

export function WifiMark() {
  return (
    <svg width="15" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.1 10.2c4.4-4.25 11.4-4.25 15.8 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.05 13.35c2.75-2.55 7.15-2.55 9.9 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        fill="currentColor"
        d="M12 19.55c0 0-2.05-2.7-1.5-3.4.55-.7 2.45-.7 3 0 .55.7-1.5 3.4-1.5 3.4z"
      />
    </svg>
  );
}

export function LocationArrow() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M10.85 1.2L1.15 5.15l4.2 1.45 1.45 4.2L10.85 1.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BatteryMark({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  const fill = 18.4 * (p / 100);
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="21.2"
        height="11"
        rx="2.35"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.9"
      />
      <rect
        x="1.85"
        y="1.9"
        width={fill}
        height="8.2"
        rx="1.15"
        fill="currentColor"
      />
      <path
        d="M22.55 3.85c.75.32 1.2.82 1.2 2.15s-.45 1.83-1.2 2.15V3.85z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function CopyMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
      <rect
        x="5.4"
        y="5.4"
        width="8.2"
        height="8.2"
        rx="1.55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M10.5 5.35V3.7A1.7 1.7 0 0 0 8.8 2H3.7A1.7 1.7 0 0 0 2 3.7V8.8c0 .94.76 1.7 1.7 1.7H5.35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
      />
    </svg>
  );
}

export function InfoMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="6.05"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="7.28"
        y="7.05"
        width="1.44"
        height="4.35"
        rx="0.7"
        fill="currentColor"
      />
      <circle cx="8" cy="5.15" r="0.95" fill="currentColor" />
    </svg>
  );
}

export function BackChevron() {
  return (
    <svg width="12" height="21" viewBox="0 0 12 21" aria-hidden="true">
      <path
        d="M10.6 1.4 1.7 10.5l8.9 9.1"
        fill="none"
        stroke="#111"
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.1 8.15 6.45 11.5 12.9 4.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="5.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
      />
      <path
        d="M8 5.2V8l2 1.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 4 12 12M12 4 4 12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
