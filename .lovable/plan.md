

## Restore premium hover animation on inline project images

Add a smooth "Old-Money" floating hover effect to the collapsed inline project images in `src/components/landing/Portfolio.tsx`, without disturbing the orange aura, lazy loading, or the Lightbox.

### What changes
Only the collapsed-state `<img>` (lines 123–138). Append hover transition classes so the image lifts, scales subtly, and gains a soft shadow on hover. The breathing aura div behind it (line 122) is untouched and continues to pulse independently.

### Technical detail
Update the className on the `<img>` from:
```tsx
className="relative z-10"
```
to:
```tsx
className="relative z-10 transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] cursor-pointer"
```

No other edits. Specifically untouched:
- The `-z-10` orange aura div (line 122)
- `loading="lazy"` and inline positioning styles
- The expanded-state `motion.img` branch (lines 108–117)
- The entire `MockupLightbox` component (tap zones, swipe, close, keyboard nav)

### Result
Hovering an inline project image produces a smooth 500ms float-up + 1.02 scale + soft drop shadow, while the orange aura keeps breathing behind it. Click-to-expand, lazy loading, and the dark lightbox behave exactly as before.

