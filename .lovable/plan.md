
Goal: surgically constrain the lightbox image to a perfect 1:1 square, centered, with zero extra styling. Do not touch the overlay, close button, arrows, counter, or dot indicators.

Scope
- File: `src/components/landing/Portfolio.tsx`
- Target: only the `<motion.img>` inside `MockupLightbox` (the main image element).
- Untouched: the outer `motion.div` overlay (`bg-black/90`), close button, prev/next arrows, counter, and dot indicators.

Changes
1. Replace the current `<motion.img>` styling so it strictly enforces:
   - `aspect-square` (locks 1:1 ratio)
   - `object-contain` (no distortion, no crop)
   - `w-full max-w-[85vh] max-h-[85vh]` (square fits inside viewport height)
   - centered via existing flex parent (no new wrapper)
2. Remove from the image: `maxWidth: '90vw'`, `maxHeight: '85vh'`, `width: 'auto'`, `height: 'auto'`, `borderRadius`, `boxShadow`, `filter`, `backdropFilter` overrides — replace with a minimal inline style that only kills shadow/filter to prevent inherited effects.
3. Do NOT introduce any wrapper div around the image. Keep it as a direct child of the overlay flex container so centering remains perfect.

Resulting image element (conceptual)
```tsx
<motion.img
  key={current}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  src={urls[current]}
  alt={`${title} mockup ${current + 1}`}
  className="aspect-square w-full max-w-[85vh] max-h-[85vh] object-contain cursor-default"
  style={{ backgroundColor: 'transparent', boxShadow: 'none', filter: 'none' }}
  onClick={(e) => e.stopPropagation()}
  draggable={false}
/>
```

Verification
- Open lightbox: image renders as a perfect square, centered, fits within viewport height, no scroll.
- Transparent mockups: show through to dark overlay, no colored box, no border/shadow.
- Overlay, close button, arrows, counter, dots: unchanged.

Files to change
- `src/components/landing/Portfolio.tsx` (only the `<motion.img>` block in `MockupLightbox`)
