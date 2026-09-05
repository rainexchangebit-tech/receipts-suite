import type { AssetId } from "@/lib/receipt";

type LogoProps = {
  size?: number;
  title?: string;
};

/** Official Tether mark — green circle, white two-bar T. Do not restyle. */
export function UsdtLogo({ size = 70, title = "USDT" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      role="img"
    >
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#FFFFFF"
        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.977-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.93-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.39-.202 7.694-1.073 7.694-2.116 0-1.043-3.305-1.915-7.694-2.117"
      />
    </svg>
  );
}

export function BtcLogo({ size = 70, title = "BTC" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      role="img"
    >
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#FFFFFF"
        d="M22.5 14.05c.31-2.07-1.27-3.18-3.42-3.93l.7-2.81-1.71-.42-.68 2.73c-.45-.11-.91-.22-1.37-.32l.69-2.76-1.7-.43-.7 2.81c-.37-.08-.74-.17-1.09-.26l-.01-.01-2.36-.59-.46 1.83s1.27.29 1.24.31c.69.17.82.63.79.99l-.79 3.19c.05.01.11.03.18.06l-.18-.04-1.12 4.48c-.08.21-.3.53-.62.41.01.02-1.24-.31-1.24-.31l-.85 1.96 2.22.55c.41.1.82.21 1.22.31l-.71 2.84 1.71.43.7-2.81c.47.13.92.24 1.36.36l-.7 2.8 1.71.42.71-2.83c2.91.55 5.1.33 6.02-2.3.74-2.12-.04-3.35-1.57-4.14 1.12-.26 1.96-1 2.18-2.51zm-3.9 5.47c-.53 2.12-4.1.97-5.26.69l.94-3.76c1.16.29 4.87.86 4.32 3.07zm.53-5.5c-.48 1.93-3.45.95-4.42.71l.85-3.41c.96.24 4.07.69 3.57 2.7z"
      />
    </svg>
  );
}

export function EthLogo({ size = 70, title = "ETH" }: LogoProps) {
  const diamondH = size * 0.62;
  const diamondW = diamondH * (256 / 417);
  return (
    <span
      className="eth-badge"
      style={{ width: size, height: size }}
      role="img"
      aria-label={title}
    >
      <svg
        width={diamondW}
        height={diamondH}
        viewBox="0 0 256 417"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#343434"
          d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
        />
        <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
        <path
          fill="#3C3C3B"
          d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
        />
        <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
        <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.138z" />
        <path fill="#393939" d="M0 212.32l127.96 75.638v-133.776z" />
      </svg>
    </span>
  );
}

export function AssetLogo({
  asset,
  size = 70,
}: {
  asset: AssetId;
  size?: number;
}) {
  if (asset === "USDT") return <UsdtLogo size={size} />;
  if (asset === "BTC") return <BtcLogo size={size} />;
  return <EthLogo size={size} />;
}
