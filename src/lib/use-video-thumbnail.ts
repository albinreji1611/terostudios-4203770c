import { useEffect, useState } from "react";
import { resolveAssetUrl } from "./asset-url";

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string | null>>();

// Try multiple timestamps (as fraction of duration). If a frame is mostly black
// (i.e. video hasn't faded in yet, or it's a black title card) we skip ahead.
const SEEK_FRACTIONS = [0.25, 0.4, 0.55, 0.7, 0.85, 0.15, 0.5, 0.33];

function isFrameUsable(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  try {
    const data = ctx.getImageData(0, 0, w, h).data;
    let bright = 0;
    let varSum = 0;
    let prev = 0;
    let darkPixels = 0;
    const step = 4 * 8; // sample every 8th pixel
    let count = 0;
    for (let i = 0; i < data.length; i += step) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      bright += lum;
      varSum += Math.abs(lum - prev);
      prev = lum;
      if (lum < 18) darkPixels++;
      count++;
    }
    const avg = bright / count;
    const variance = varSum / count;
    const darkRatio = darkPixels / count;
    // Reject dark, flat, or mostly-black frames
    return avg > 45 && variance > 12 && darkRatio < 0.55;
  } catch {
    // CORS-tainted canvas: assume usable, we can't inspect
    return true;
  }
}


function capture(url: string): Promise<string | null> {
  if (cache.has(url)) return Promise.resolve(cache.get(url)!);
  const existing = pending.get(url);
  if (existing) return existing;

  const p = new Promise<string | null>((resolve) => {
    if (typeof document === "undefined") return resolve(null);
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    let done = false;
    let attempt = 0;
    let lastDataUrl: string | null = null;

    const finish = (result: string | null) => {
      if (done) return;
      done = true;
      const out = result || lastDataUrl;
      if (out) cache.set(url, out);
      pending.delete(url);
      resolve(out);
    };

    const tryNext = () => {
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return finish(null);
      if (attempt >= SEEK_FRACTIONS.length) return finish(null);
      const t = Math.min(dur - 0.05, Math.max(0.05, dur * SEEK_FRACTIONS[attempt]));
      attempt++;
      try {
        video.currentTime = t;
      } catch {
        finish(null);
      }
    };

    const grab = () => {
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return finish(null);
        const targetW = Math.min(640, w);
        const targetH = Math.round((h / w) * targetW);
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return finish(null);
        ctx.drawImage(video, 0, 0, targetW, targetH);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.78);
        lastDataUrl = dataUrl;
        if (isFrameUsable(ctx, targetW, targetH)) {
          finish(dataUrl);
        } else {
          tryNext();
        }
      } catch {
        finish(null);
      }
    };

    video.addEventListener("loadeddata", tryNext);
    video.addEventListener("seeked", grab);
    video.addEventListener("error", () => finish(null));
    setTimeout(() => finish(null), 10000);
  });

  pending.set(url, p);
  return p;
}

export function useVideoThumbnail(url: string | undefined): string | null {
  const resolved = url ? resolveAssetUrl(url) : "";
  const [thumb, setThumb] = useState<string | null>(() =>
    resolved && cache.has(resolved) ? cache.get(resolved)! : null,
  );

  useEffect(() => {
    if (!resolved) return;
    let cancelled = false;
    capture(resolved).then((res) => {
      if (!cancelled && res) setThumb(res);
    });
    return () => {
      cancelled = true;
    };
  }, [resolved]);

  return thumb;
}
