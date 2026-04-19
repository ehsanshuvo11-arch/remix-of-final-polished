

## Goal
Add Instagram/Facebook Story–style invisible tap zones to `MockupLightbox` so clicks/taps on the left or right 30% of the lightbox paginate prev/next, while the middle 40% stays neutral (closes lightbox via existing overlay click).

## File
- `src/components/landing/Portfolio.tsx` — only inside the `MockupLightbox` component (lines ~321–411).

## Changes

1. **Add two invisible tap zones** as direct children of the overlay `motion.div`, placed BEFORE the close button / arrows in the JSX so they sit underneath them in stacking when needed (z-index handles ordering anyway).

2. **Left zone** (prev):
   ```tsx
   <button
     type="button"
     aria-label="Previous mockup"
     onClick={(e) => { e.stopPropagation(); goPrev(); }}
     disabled={current === 0}
     className="absolute left-0 top-0 h-full w-[30%] z-40 bg-transparent border-0 outline-none cursor-w-resize disabled:cursor-default disabled:pointer-events-none"
     style={{ WebkitTapHighlightColor: 'transparent' }}
   />
   ```

3. **Right zone** (next):
   ```tsx
   <button
     type="button"
     aria-label="Next mockup"
     onClick={(e) => { e.stopPropagation(); goNext(); }}
     disabled={current === total - 1}
     className="absolute right-0 top-0 h-full w-[30%] z-40 bg-transparent border-0 outline-none cursor-e-resize disabled:cursor-default disabled:pointer-events-none"
     style={{ WebkitTapHighlightColor: 'transparent' }}
   />
   ```

4. **Z-index hierarchy preserved**:
   - Tap zones: `z-40`
   - Close (X), arrows, counter, dots: already `z-10`… bump these to `z-50` so they remain clickable above the zones. (Close `z-50`, arrows `z-50`, counter `z-50`, dots `z-50`.)
   - Image stays at default — middle 40% is uncovered, so clicking the image still bubbles to overlay `onClick={onClose}` (existing behavior).

5. **Mobile tap-highlight**: handled via inline `WebkitTapHighlightColor: 'transparent'`. No visible gray flash on tap.

6. **Single-image safety**: zones still render but are disabled when `total === 1` (both edges already prevent navigation; also disable when at first/last).

7. **No conflict with existing drag-to-swap**: the image sits in the center 40%, untouched by zones. Arrows remain as visible affordances on top.

## Untouched
- Drag-to-swap logic on image
- Touch swipe on overlay (still works in middle 40%)
- Keyboard navigation
- Glow / expanded inline view / collapsed cards
- All styling outside `MockupLightbox`

## Verification
- Click left 30% → previous image; right 30% → next image.
- Middle 40% click → closes lightbox (existing behavior preserved).
- Desktop cursor: `w-resize` left, `e-resize` right.
- Mobile tap: no gray highlight box.
- Close (X), arrows, dots, counter remain clickable.

