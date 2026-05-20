
# Tero Studios Website — Build Plan

A multi-page React + Vite + Tailwind site implementing the "Kinetic Editorial" concept from the spec doc: light-mode, editorial typography, Vermillion accent, motion-rich, animation-studio caliber.

## Design System (locked from spec)

**Colors**
- Background: Studio Cream `#FDFAF6`, Warm White `#FFFFFF`
- Contrast: Graphite Ink `#111318`
- Text: Near Black `#0E0E10`, Warm Slate `#4A4E5A`
- Accent: Tero Vermillion `#E8390E` (with `#C42D06` gradient)
- Support: Deep Violet `#2D1B6E`, Studio Amber `#C49A3C`, Parchment Line `#E4DDD6`

**Typography (Google Fonts + Fontshare)**
- Display/H1: Cormorant Garamond Bold Italic (700)
- H2/H3: Syne 700
- Body/UI: Satoshi 400/500
- Labels/overlines: Space Mono 400 (uppercase, 0.2em tracking)

**Motion tokens**: `--ease-out-expo`, durations 120/250/350/600/1200ms. Built with Framer Motion.

## Pages & Key Sections

1. **Homepage** — Hero with parallax + clip-path headline reveal, client logo strip, scrollable services with live visual switching, horizontal-scroll portfolio showcase, numbered process steps, animated stats count-up, testimonials ("Portfolio of Consensus"), awards/press strip, FAQ accordion, final CTA strip.
2. **Services Hub** — Hero, three-pillar value strip, full service list (3D, 2D, Motion Graphics, Explainer, VFX, etc.), each linking to outcomes + CTA.
3. **Portfolio** — Hero, filter chips by service & industry, masonry/grid of project cards with hover video preview.
4. **About Us** — Studio statement hero, philosophy, timeline/milestones, values.
5. **Our Team** — Team hero, team-by-department grid with hover reveal.
6. **Blog** — Featured post hero + article grid.
7. **Contact** — Hero + three-step project-brief form with success state and "book a call" option.

## Global Elements
- Branded loading screen (logomark SVG draw-on, first visit per session)
- Custom cursor (dot + lerp ring, desktop only)
- Sticky nav (transparent → cream blur after 60px scroll, Vermillion active underline)
- Top scroll-progress bar (1px Vermillion)
- Route transition (Vermillion sweep + fade) via Framer Motion AnimatePresence
- Footer: 4-column with all services listed for SEO
- 404 page with looping motion graphic

## Technical Approach
- React + Vite + TypeScript (existing stack), React Router for pages
- Tailwind: extend theme with the color, font, easing & duration tokens above; semantic CSS variables in `index.css`
- Framer Motion for scroll reveals, headline clip-path, horizontal pinned scroll, count-up, page transitions
- Lucide icons (outline, 1.5px)
- Logo: fetched from terostudios.com; placed in `src/assets/`
- Content: written fresh using aadhyanimatics.com as reference for tone/structure (services list, process steps, testimonial framing) — no copy-paste
- Imagery: generated placeholders (animation-still aesthetic) in `src/assets/`
- SEO: per-page title/meta/H1, semantic HTML, JSON-LD for Organization
- Responsive: 12-col desktop / 4-col mobile, max width 1340px

## Build Order
1. Design tokens + global styles + fonts + layout shell (nav, footer, cursor, progress bar, route transition)
2. Homepage with all sections + animations
3. Services Hub, Portfolio (with filtering), Contact (3-step form)
4. About, Team, Blog
5. 404 + loading screen polish + SEO meta

## Scope Notes
This is a sizable build. I'll ship it as one coherent v1 covering all 7 pages with the spec'd animations. Some advanced details (e.g., bespoke service SVG illustrations, real client logos, actual case-study videos) will use tasteful generated/placeholder content you can swap later.
