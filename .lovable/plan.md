## Goal

Make the site fully self-contained so it runs on your VPS with no dependency on Lovable's `/__l5e/` CDN. All videos, logos, and images will be served from your own server.

## Approach

Download every asset currently referenced via `.asset.json` pointers into `public/media/` (kept out of the JS bundle so large videos stream directly). Rewrite the resolver so it uses local `/media/...` paths in production instead of pointing back to `terostudios.lovable.app`.

## What gets migrated

- 17 videos in `src/assets/videos/*.mp4.asset.json` (~80 MB total, sotefin.mp4 alone is ~57 MB)
- 67 client logos in `src/assets/client-logos/*.png.asset.json`
- 5 white-variant client logos in `src/assets/client-logos-white/`
- 6 service icons in `src/assets/service-icons/`
- 5 brand images in `src/assets/*.png.asset.json` (Bhima, Forum, Lulu, etc.)

## Steps

1. **Download script** — Node script reads every `*.asset.json` under `src/assets/`, fetches the file from the CDN `url`, saves it to `public/media/<same-relative-path>` (e.g. `public/media/videos/sotefin.mp4`).
2. **Rewrite resolver** — `src/lib/asset-url.ts` maps `/__l5e/assets-v1/<id>/<filename>` → `/media/<category>/<filename>` using a lookup table built at module load from the same `import.meta.glob` of `.asset.json` files. Keeps a `VITE_LOVABLE_ASSET_BASE` override for anyone who wants to keep CDN hosting.
3. **Update LogoStrip and other direct consumers** — they already go through `resolveAssetUrl` after the previous fix; no further code changes needed.
4. **`.gitignore` guidance** — `public/media/` will be ~100 MB. Options:
   - Commit it to the repo (simplest, but bloats git history).
   - Add to `.gitignore` and re-run the download script on the VPS during deploy (recommended).
5. **Verify** — run `bun run build`, spot-check a couple of resolved URLs in the built HTML.

## Technical notes

- Vite serves anything in `public/` at the site root without processing, so `public/media/videos/sotefin.mp4` becomes `/media/videos/sotefin.mp4`. No bundling overhead, range requests work for video streaming.
- The `.asset.json` files stay in the repo — they're the source of truth mapping filenames to categories.
- On Lovable-hosted origins the resolver can keep using `/__l5e/` paths (unchanged) so your Lovable preview and terostudios.com continue to work; only non-Lovable hosts get the local `/media/` rewrite.
- The download script is idempotent — safe to re-run; skips files that already exist.

## Open question

Do you want `public/media/` committed to git, or gitignored with a `bun run download-media` step in your VPS deploy pipeline? I'd recommend the second — keeps the repo small and lets you pull fresh assets any time. Let me know and I'll implement.
