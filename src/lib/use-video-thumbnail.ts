import { useEffect, useState } from "react";
import { resolveAssetUrl } from "./asset-url";

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string | null>>();

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
    const finish = (result: string | null) => {
      if (done) return;
      done = true;
      if (result) cache.set(url, result);
      pending.delete(url);
      resolve(result);
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
        finish(canvas.toDataURL("image/jpeg", 0.78));
      } catch {
        finish(null);
      }
    };

    video.addEventListener("loadeddata", () => {
      try {
        video.currentTime = Math.min(0.1, (video.duration || 1) * 0.05);
      } catch {
        grab();
      }
    });
    video.addEventListener("seeked", grab);
    video.addEventListener("error", () => finish(null));
    setTimeout(() => finish(null), 8000);
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
