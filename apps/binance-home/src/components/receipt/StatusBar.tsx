import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  clampBars,
  networkText,
  parseBattery,
  statusDirty,
  ORIGINAL,
  type ReceiptFields,
} from "@/lib/receipt";

const INK = "#111111";
const WHITE = "#ffffff";
const LOW = "#e33e5c";

export const SPRITES = {
  time: { x: 72, y: 28, w: 80, h: 28 },
  cell: { x: 410, y: 31, w: 38, h: 23 },
  wifi: { x: 451, y: 31, w: 31, h: 23 },
  bat: { x: 486, y: 31, w: 48, h: 24 },
} as const;

type Rect = { x: number; y: number; w: number; h: number };

const TIME_X = 81;
const TIME_CY = 43.5;
const DIGIT_TILE_W = 14;
const DIGIT_TILE_H = 22;
const DIGIT_ADVANCE = 13;
const COLON_ADVANCE = 6;
const MUTE_H = 17;
const MUTE_GAP = 8;
const ICON_CY = 43;
const FIVEG_H = 15;
const CELL_H = 20;
const GAP = 8;
const NET_FONT = `600 12px "IBM Plex Sans", "SF Pro Text", -apple-system, sans-serif`;
const BAT_FONT = `600 20px "IBM Plex Sans", "SF Pro Text", -apple-system, sans-serif`;
const BAT_BODY_X = 486;
const BAT_BODY_Y = 31;
const BAT_NUB_W = 6;
const CELL_BAR_CUT = [0, 0.26, 0.5, 0.74, 1];

export type StatusAssets = {
  mute: CanvasImageSource;
  fiveg: CanvasImageSource;
  cell: CanvasImageSource;
  batBody: CanvasImageSource;
  digits: CanvasImageSource;
};

function cover(ctx: CanvasRenderingContext2D, r: Rect, pad = 1) {
  ctx.fillStyle = WHITE;
  ctx.fillRect(r.x - pad, r.y - pad, r.w + pad * 2, r.h + pad * 2);
}

function srcSize(img: CanvasImageSource) {
  if (img instanceof HTMLImageElement) {
    return { w: img.naturalWidth, h: img.naturalHeight };
  }
  if (img instanceof HTMLCanvasElement) {
    return { w: img.width, h: img.height };
  }
  const anyImg = img as { width: number; height: number };
  return { w: anyImg.width, h: anyImg.height };
}

function blitSprite(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  cy: number,
  targetH: number,
) {
  const { w: sw, h: sh } = srcSize(img);
  if (!sw || !sh) return 0;
  const h = targetH;
  const w = (sw / sh) * h;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, x, cy - h / 2, w, h);
  return w;
}

function whiteOutHighBars(
  ctx: CanvasRenderingContext2D,
  x: number,
  cy: number,
  w: number,
  h: number,
  bars: number,
) {
  const n = clampBars(bars);
  if (n >= 4) return;
  const cut = CELL_BAR_CUT[n] ?? 1;
  ctx.fillStyle = WHITE;
  ctx.fillRect(x + w * cut, cy - h / 2, w * (1 - cut) + 0.5, h);
}

function glyphIndex(ch: string) {
  if (ch === ":") return 10;
  const n = ch.charCodeAt(0) - 48;
  if (n >= 0 && n <= 9) return n;
  return -1;
}

function timeAdvance(text: string) {
  let w = 0;
  for (const ch of text) {
    w += ch === ":" ? COLON_ADVANCE : DIGIT_ADVANCE;
  }
  return w;
}

function drawTime(
  ctx: CanvasRenderingContext2D,
  digits: CanvasImageSource,
  text: string,
  x: number,
  cy: number,
) {
  const { w: aw } = srcSize(digits);
  if (!aw) return timeAdvance(text);
  const tileW = DIGIT_TILE_W;
  const tileH = DIGIT_TILE_H;
  let cx = x;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  for (const ch of text) {
    const i = glyphIndex(ch);
    const adv = ch === ":" ? COLON_ADVANCE : DIGIT_ADVANCE;
    if (i >= 0) {
      const dx = cx + (adv - tileW) / 2;
      const dy = cy - tileH / 2;
      ctx.drawImage(digits, i * tileW, 0, tileW, tileH, dx, dy, tileW, tileH);
    }
    cx += adv;
  }
  return cx - x;
}

function whiteAtlas(img: CanvasImageSource): HTMLCanvasElement | CanvasImageSource {
  const { w, h } = srcSize(img);
  if (!w || !h) return img;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const t = c.getContext("2d");
  if (!t) return img;
  t.drawImage(img, 0, 0);
  t.globalCompositeOperation = "source-in";
  t.fillStyle = WHITE;
  t.fillRect(0, 0, w, h);
  return c;
}

function drawWhiteDigits(
  ctx: CanvasRenderingContext2D,
  digits: CanvasImageSource,
  text: string,
  cx: number,
  cy: number,
  scale: number,
) {
  const white = whiteAtlas(digits);
  let w = 0;
  for (const ch of text) {
    w += (ch === ":" ? COLON_ADVANCE : DIGIT_ADVANCE) * scale;
  }
  let x = cx - w / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  for (const ch of text) {
    const i = glyphIndex(ch);
    const adv = (ch === ":" ? COLON_ADVANCE : DIGIT_ADVANCE) * scale;
    if (i >= 0) {
      ctx.drawImage(
        white,
        i * DIGIT_TILE_W,
        0,
        DIGIT_TILE_W,
        DIGIT_TILE_H,
        x + (adv - DIGIT_TILE_W * scale) / 2,
        cy - (DIGIT_TILE_H * scale) / 2,
        DIGIT_TILE_W * scale,
        DIGIT_TILE_H * scale,
      );
    }
    x += adv;
  }
}

function drawBattery(
  ctx: CanvasRenderingContext2D,
  batBody: CanvasImageSource,
  digits: CanvasImageSource,
  pct: number,
  showPct: boolean,
  inside: boolean,
) {
  const fill = Math.max(0, Math.min(100, pct));
  const label = String(fill);
  cover(ctx, SPRITES.bat, 2);

  if (inside && showPct) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(batBody, BAT_BODY_X, BAT_BODY_Y);
    const { w, h } = srcSize(batBody);
    const bodyW = Math.max(24, w - BAT_NUB_W);
    const cx = BAT_BODY_X + bodyW / 2 - 0.5;
    const cy = BAT_BODY_Y + h / 2 + 0.4;
    ctx.save();
    ctx.beginPath();
    ctx.rect(BAT_BODY_X + 1, BAT_BODY_Y + 1, bodyW - 2, h - 2);
    ctx.clip();
    drawWhiteDigits(ctx, digits, label, cx, cy, 0.9);
    ctx.restore();
    return;
  }

  const bodyW = 22;
  const bodyH = 15.5;
  const radius = 3.2;
  const nubW = 2.4;
  const right = SPRITES.bat.x + SPRITES.bat.w - 1.5;
  const nubX = right - nubW;
  const bodyX = nubX - 0.7 - bodyW;
  const bodyY = SPRITES.bat.y + (SPRITES.bat.h - bodyH) / 2;
  const fillColor = fill <= 20 ? LOW : INK;

  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.roundRect(bodyX + 0.55, bodyY + 0.55, bodyW - 1.1, bodyH - 1.1, radius - 0.4);
  ctx.stroke();
  const inner = Math.max(0, (bodyW - 3.2) * (fill / 100));
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(bodyX + 1.6, bodyY + 1.6, inner, bodyH - 3.2, 1);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(nubX, bodyY + 4.2, nubW, bodyH - 8.4, 0.7);
  ctx.fill();
  if (showPct) {
    ctx.font = BAT_FONT;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(label, bodyX - 4, bodyY + bodyH / 2);
  }
}

function originalBattery(fields: ReceiptFields) {
  return (
    parseBattery(fields.batteryPct) === parseBattery(ORIGINAL.batteryPct) &&
    fields.batteryPctOn === ORIGINAL.batteryPctOn &&
    fields.batteryPctInside === ORIGINAL.batteryPctInside
  );
}

function originalCell(fields: ReceiptFields) {
  return fields.cellularOn && clampBars(fields.cellularBars) === ORIGINAL.cellularBars;
}

export function drawStatusBar(
  ctx: CanvasRenderingContext2D,
  fields: ReceiptFields,
  assets: StatusAssets,
) {
  const { mute, fiveg, cell, batBody, digits } = assets;
  const time = fields.statusTime || "11:22";
  const timeDirty = time !== ORIGINAL.statusTime;
  const timeW = timeAdvance(time);
  const muteW = fields.muteOn ? (srcSize(mute).w / Math.max(1, srcSize(mute).h)) * MUTE_H : 0;

  if (timeDirty) {
    const span = Math.max(SPRITES.time.w, timeW + (fields.muteOn ? MUTE_GAP + muteW : 16));
    ctx.fillStyle = WHITE;
    ctx.fillRect(SPRITES.time.x, SPRITES.time.y, span + 10, SPRITES.time.h);
    drawTime(ctx, digits, time, TIME_X, TIME_CY);
  }

  if (fields.muteOn) {
    const muteX = TIME_X + timeW + MUTE_GAP;
    blitSprite(ctx, mute, muteX, TIME_CY, MUTE_H);
  }

  const wifiOn = fields.wifiOn;
  const cellOn = fields.cellularOn;
  const netOn = fields.networkOn;
  const net = networkText(fields);
  const useFivegSprite = netOn && net === "5G";
  const batOrig = originalBattery(fields);
  const cellOrig = originalCell(fields);
  const wifiOrig = wifiOn === ORIGINAL.wifiOn;
  const rightNeedsWork = netOn || !cellOrig || !wifiOrig || !batOrig;

  if (!rightNeedsWork) return;

  if (!wifiOn) cover(ctx, SPRITES.wifi);
  if (!cellOn && !netOn) cover(ctx, SPRITES.cell);
  if (!batOrig) {
    drawBattery(
      ctx,
      batBody,
      digits,
      parseBattery(fields.batteryPct),
      fields.batteryPctOn,
      fields.batteryPctInside,
    );
  }

  if (!netOn) {
    if (cellOn && clampBars(fields.cellularBars) !== 4) {
      cover(ctx, SPRITES.cell);
      const cellW = blitSprite(ctx, cell, SPRITES.cell.x + 4, ICON_CY, CELL_H);
      whiteOutHighBars(ctx, SPRITES.cell.x + 4, ICON_CY, cellW, CELL_H, fields.cellularBars);
    }
    return;
  }

  const wifiLeft = wifiOn ? SPRITES.wifi.x : SPRITES.bat.x;
  const fivegSize = srcSize(fiveg);
  const fivegW = useFivegSprite ? (fivegSize.w / fivegSize.h) * FIVEG_H : 0;
  ctx.font = NET_FONT;
  const netW = useFivegSprite ? fivegW : ctx.measureText(net).width;
  const netX = wifiLeft - GAP - netW;
  const cellSize = srcSize(cell);
  const cellW = (cellSize.w / cellSize.h) * CELL_H;
  const cellX = cellOn ? netX - GAP - cellW : netX;
  const coverLeft = Math.min(cellOn ? cellX : netX, SPRITES.cell.x);
  ctx.fillStyle = WHITE;
  ctx.fillRect(coverLeft - 2, SPRITES.cell.y - 1, wifiLeft - coverLeft + 1, SPRITES.cell.h + 2);

  if (useFivegSprite) {
    blitSprite(ctx, fiveg, netX, ICON_CY, FIVEG_H);
  } else {
    ctx.fillStyle = INK;
    ctx.font = NET_FONT;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(net, netX, ICON_CY);
  }

  if (cellOn) {
    blitSprite(ctx, cell, cellX, ICON_CY, CELL_H);
    if (clampBars(fields.cellularBars) !== 4) {
      whiteOutHighBars(ctx, cellX, ICON_CY, cellW, CELL_H, fields.cellularBars);
    }
  }
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`status asset ${src}`));
    img.src = src;
  });
}

let assetsPromise: Promise<StatusAssets> | null = null;

export function loadStatusAssets(): Promise<StatusAssets> {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      loadImg("/binance-home/status/mute.png"),
      loadImg("/binance-home/status/fiveg.png"),
      loadImg("/binance-home/status/cell.png"),
      loadImg("/binance-home/status/bat-body.png"),
      loadImg("/binance-home/status/digits.png"),
    ]).then(([mute, fiveg, cell, batBody, digits]) => ({
      mute,
      fiveg,
      cell,
      batBody,
      digits,
    }));
  }
  return assetsPromise;
}

export function StatusBarOverlay({ fields }: { fields: ReceiptFields }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [assets, setAssets] = useState<StatusAssets | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const dirty = statusDirty(fields);

  useEffect(() => {
    let alive = true;
    void loadStatusAssets().then((a) => {
      if (alive) setAssets(a);
    });
    void document.fonts.ready.then(() => {
      if (alive) setFontsReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas || !assets || !dirty) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);
    drawStatusBar(ctx, fields, assets);
  }, [fields, assets, dirty, fontsReady]);

  if (!dirty) return null;

  return (
    <canvas
      ref={ref}
      className="receipt-statusbar-canvas"
      width={1178}
      height={108}
      data-status-bar="true"
    />
  );
}
