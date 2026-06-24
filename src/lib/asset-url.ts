/**
 * Resolve a Lovable CDN asset URL across environments.
 *
 * Asset pointers store paths like `/__l5e/assets-v1/<id>/<file>`. That path
 * is served by Lovable's proxy on every Lovable-hosted origin (editor
 * preview, `*.lovable.app` published builds, custom domains). Vite's dev
 * server inside the Lovable sandbox proxies it too.
 *
 * In environments without that proxy (e.g. a bare `localhost` Playwright
 * run, a CI smoke test, a self-hosted preview), set
 * `VITE_LOVABLE_ASSET_BASE` to an origin that does serve `/__l5e/` and the
 * helper will rewrite to an absolute URL. Otherwise the original relative
 * path is returned unchanged so SSR and Lovable-hosted runtimes stay
 * cache-friendly and origin-relative.
 */

const ASSET_PREFIX = "/__l5e/";

function pickBase(): string | null {
  const override = import.meta.env.VITE_LOVABLE_ASSET_BASE as string | undefined;
  if (override && /^https?:\/\//i.test(override)) {
    return override.replace(/\/+$/, "");
  }

  if (typeof window === "undefined") return null;
  const { hostname, origin } = window.location;

  // Lovable-hosted origins already serve /__l5e/ — leave path relative.
  if (
    hostname.endsWith(".lovable.app") ||
    hostname.endsWith(".lovable.dev") ||
    hostname === "terostudios.com" ||
    hostname.endsWith(".terostudios.com")
  ) {
    return null;
  }

  // Local/unknown host: fall back to the published origin.
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
    return "https://terostudios.lovable.app";
  }

  return origin;
}

export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (/^(?:https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (!url.startsWith(ASSET_PREFIX)) return url;

  const base = pickBase();
  return base ? `${base}${url}` : url;
}
