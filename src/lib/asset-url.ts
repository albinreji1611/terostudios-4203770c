/**
 * Resolve a Lovable CDN asset URL across environments.
 *
 * Asset pointers store paths like `/__l5e/assets-v1/<id>/<file>`. This helper
 * rewrites them per host:
 *
 * - Lovable-hosted origins (`*.lovable.app`, `*.lovable.dev`, terostudios.com)
 *   serve `/__l5e/` natively → return the path unchanged.
 * - Any other host (self-hosted VPS, Vercel, Netlify, localhost) → rewrite to
 *   the local `/media/<category>/<filename>` copy produced by
 *   `scripts/download-media.mjs`. If a local mapping is missing (e.g. the
 *   media wasn't downloaded on that deploy) we fall back to the published
 *   Lovable origin so nothing 404s silently.
 *
 * Override with `VITE_LOVABLE_ASSET_BASE` to force a specific origin (useful
 * when you want to keep CDN hosting from a non-Lovable deploy).
 */

const ASSET_PREFIX = "/__l5e/";

// Build a map at bundle time: asset_id → local `/media/...` path.
// The key layout mirrors the on-disk structure produced by download-media.mjs.
type AssetPointer = { asset_id: string; original_filename: string };
const pointerModules = import.meta.glob<AssetPointer>(
  "@/assets/**/*.asset.json",
  { eager: true, import: "default" },
);

const LOCAL_BY_ASSET_ID = new Map<string, string>();
for (const [key, pointer] of Object.entries(pointerModules)) {
  if (!pointer?.asset_id) continue;
  // key = "/src/assets/videos/foo.mp4.asset.json" → "/media/videos/foo.mp4"
  const relative = key.replace(/^.*\/src\/assets\//, "").replace(/\.asset\.json$/, "");
  LOCAL_BY_ASSET_ID.set(pointer.asset_id, `/media/${relative}`);
}

function isLovableHost(hostname: string): boolean {
  return (
    hostname.endsWith(".lovable.app") ||
    hostname.endsWith(".lovable.dev") ||
    hostname === "terostudios.com" ||
    hostname.endsWith(".terostudios.com")
  );
}

function overrideBase(): string | null {
  const override = import.meta.env.VITE_LOVABLE_ASSET_BASE as string | undefined;
  if (override && /^https?:\/\//i.test(override)) {
    return override.replace(/\/+$/, "");
  }
  return null;
}

/** Extract the asset_id segment from a `/__l5e/assets-v1/<id>/<file>` path. */
function assetIdFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/__l5e\/assets-v1\/([^/]+)\//);
  return m ? m[1] : null;
}

function rewriteCdnPath(pathname: string, search: string, hash: string): string {
  // 1. Explicit override wins.
  const override = overrideBase();
  if (override) return `${override}${pathname}${search}${hash}`;

  // 2. On Lovable-hosted origins, keep the relative /__l5e/ path.
  if (typeof window !== "undefined" && isLovableHost(window.location.hostname)) {
    return `${pathname}${search}${hash}`;
  }
  // During SSR we don't know the host — default to relative so Lovable-hosted
  // SSR keeps working; the browser hydration pass will rewrite on non-Lovable
  // hosts before any request is actually made.
  if (typeof window === "undefined") {
    return `${pathname}${search}${hash}`;
  }

  // 3. Non-Lovable host: prefer the locally downloaded copy.
  const id = assetIdFromPath(pathname);
  const local = id ? LOCAL_BY_ASSET_ID.get(id) : null;
  if (local) return `${local}${search}${hash}`;

  // 4. Fallback: still fetch from the Lovable CDN so nothing breaks.
  return `https://terostudios.lovable.app${pathname}${search}${hash}`;
}

export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  // Absolute URL — only rewrite if it points at the Lovable CDN path.
  if (/^https?:\/\//i.test(url)) {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith(ASSET_PREFIX)) {
      return rewriteCdnPath(parsed.pathname, parsed.search, parsed.hash);
    }
    return url;
  }

  // Protocol-relative — normalize.
  if (url.startsWith("//")) {
    const proto = typeof window === "undefined" ? "https:" : window.location.protocol;
    const parsed = new URL(`${proto}${url}`);
    if (parsed.pathname.startsWith(ASSET_PREFIX)) {
      return rewriteCdnPath(parsed.pathname, parsed.search, parsed.hash);
    }
    return url;
  }

  if (!url.startsWith(ASSET_PREFIX)) return url;
  return rewriteCdnPath(url, "", "");
}
