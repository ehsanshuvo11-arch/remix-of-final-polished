
Goal: remove the blue hover tint from Recent Projects without touching the image files, 3D tilt/scale, orange aura, or footer text.

What is actually causing it
- The blue “gradient” is not coming from a remaining overlay inside `Portfolio.tsx`.
- It is coming from the global `FilmGrain` layer in `src/components/FilmGrain.tsx`:
  - `position: fixed`
  - `zIndex: 50`
  - `mixBlendMode: "overlay"`
- The current portfolio fix only raises inner image wrappers. Those wrappers are still inside transformed/animated ancestors (`MotionReveal` / card containers), so they remain trapped under the global blend layer. On hover/expand, that blend becomes much more visible over the project image.

Implementation plan
1. Raise the correct stacking level for the entire project card
- In `src/components/landing/Portfolio.tsx`, move the “above film grain” stacking context from the inner image wrappers to the outer portfolio card wrapper / `MotionReveal` wrapper.
- Apply `relative z-[60] isolate` at the card level so both:
  - collapsed image view
  - expanded inline full-view image
  are rendered above the global film-grain layer.

2. Keep the orange aura behind the image only
- Preserve the existing orange aura with `-z-10`.
- Keep it inside the new isolated card stacking context so it stays behind the image, but the whole card remains above the film grain.

3. Clean up now-unnecessary inner z-index workarounds
- Simplify the duplicated `z-[60] isolate` classes on inner image wrappers if they are no longer needed after the card-level fix.
- Do not touch:
  - `<img>` / `<motion.img>` sources
  - tilt math
  - hover scale
  - lightbox/tap zones
  - footer text/buttons

4. Verify both portfolio states
- Confirm the fix applies to:
  - collapsed recent-project card on hover
  - expanded inline “full view” image after clicking the card
- Ensure the mockup lightbox remains unchanged since it already renders via portal at high z-index.

Files to update
- `src/components/landing/Portfolio.tsx`
- Possibly minor adjustment in `src/components/FilmGrain.tsx` only if the card-level stacking fix alone is insufficient

Fallback if any tint still remains
- Keep the global film grain for the rest of the site, but explicitly exclude the portfolio media area by:
  - adding a portfolio-specific wrapper/class/data-attribute
  - rendering that area in a higher isolated stacking context above the blend layer
- This would still be a surgical fix, not a site-wide visual change.

Expected result
- The Recent Projects images display in their original colors.
- No blue hover wash in collapsed view.
- No blue wash in expanded inline full view.
- 3D tilt, scale animation, orange aura, footer text, and lightbox behavior all remain intact.
