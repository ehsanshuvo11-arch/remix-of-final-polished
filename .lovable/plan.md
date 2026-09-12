# Portfolio lightbox performance optimization

## Scope
Surgically optimize only the mockup image mapping and its two immediate wrappers in `Portfolio.tsx`. Preserve URL extraction, gallery controls, slide behavior, layout, and visual design.

## Changes
1. Keep the existing optimization that mounts only the current image and its immediate neighbors, avoiding a DOM full of every large mockup.
2. Add GPU-compositing hints to both immediate image wrappers and each `<img>` using `transform-gpu`, `will-change-transform`, and an explicit `translateZ(0)` utility.
3. Replace the image’s broad `transition-all` with `transition-[opacity,transform]` so unrelated properties cannot trigger extra style, layout, or paint work.
4. Add native `loading="lazy"` and `decoding="async"` to each mockup image while retaining the existing load state, error diagnostics, object containment, and active/neighbor opacity logic.
5. Keep backdrop filtering off the image wrappers. The inspected wrappers currently have no blur filter; the overlay explicitly disables backdrop filters. Do not alter the separate desktop-only blur on navigation buttons because it is not attached to moving images.
6. Run focused TypeScript validation and inspect the lightbox in desktop and mobile viewports, checking image visibility, navigation, and scrolling.

## Technical detail
Only compositor-friendly `opacity` and `transform` will animate. No URL parser, state logic, controls, dimensions, or surrounding portfolio UI will be rewritten.
