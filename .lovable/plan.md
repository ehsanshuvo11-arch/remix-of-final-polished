

## Add subtle film grain overlay (Old-Money texture)

A global, fixed SVG noise overlay that sits above the page but never intercepts pointer events. Pure additive change — no existing component is touched.

### What changes

**1. New file: `src/components/FilmGrain.tsx`**
A single presentational component returning a `<div>` with:
- `position: fixed; inset: 0; z-index: 50; pointer-events: none;`
- `mix-blend-mode: overlay` for a paper-like blend over any background
- Inline `background-image` set to a base64-encoded inline SVG using `<feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>` (fractal noise)
- `opacity: 0.04`
- Hidden on the admin route via a `body.admin-panel ~ * &` style — simpler: render `null` when `document.body.classList.contains('admin-panel')` so it never interferes with the admin UI

**2. Mount once in `src/App.tsx`**
Add `<FilmGrain />` inside the existing providers tree, alongside `Toaster`/`Sonner` — a single global instance, rendered for every route. No layout reflow, no wrapper changes.

### Strict preservation guarantees

- `src/components/landing/CustomCursor.tsx` — not opened, not edited. The grain sits at `z-50`; the cursor lives at `z-99998`/`z-99999`, so the cursor still paints above the grain.
- `src/components/landing/Portfolio.tsx` — not opened, not edited. Tap zones, orange aura, tilt/zoom hover, gradient overlay, lazy loading, and the Lightbox stay byte-identical.
- `pointer-events: none` guarantees no click, hover, drag, or scroll event is ever intercepted.
- Admin panel detection skips render so `cursor: auto` and form interactions remain pristine.
- No changes to `index.css`, Tailwind config, or any existing component.

### Technical details

- SVG grain is inlined (no network request, no asset pipeline change).
- `mix-blend-mode: overlay` + `opacity: 0.04` produces the vintage-paper feel without visibly tinting brand colors (navy `#1e3a8a`, orange `#fb923c`, off-white `#f9fafb`).
- z-index map after change: page content (default) → grain (50) → toasts (Sonner default ~100) → custom cursor (99998/99999). Toasts and cursor remain on top.
- Zero new dependencies. ~30 lines total.

### Files touched

- `src/components/FilmGrain.tsx` (new)
- `src/App.tsx` (one import + one `<FilmGrain />` line)

