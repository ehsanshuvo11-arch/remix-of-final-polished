
Goal: remove the residual “liquid glass” look from the actual public portfolio image flow, not just one image wrapper.

What I found
- The active homepage path is: `src/App.tsx` → `src/pages/Index.tsx` → `src/components/landing/Portfolio.tsx`.
- The public “Recent Projects” gallery and its image rendering both live inside `Portfolio.tsx`.
- There is no separate public `ProjectCard`, `MobileProject`, `GalleryItem`, or duplicate portfolio renderer elsewhere. The only other image rendering match is in `src/pages/Admin.tsx`, which is just the admin upload preview.
- `src/index.css` does not contain any global `.glass`, `.glow`, or `.liquid` class affecting the portfolio gallery.
- The remaining glass-like styling is still inside `Portfolio.tsx`, especially in `MockupLightbox`:
  - backdrop blur on the fullscreen overlay
  - rounded image corners
  - large image shadow
  - animated modal presentation that preserves the “floating mockup” feel

Implementation plan
1. Clean the real active renderer in `src/components/landing/Portfolio.tsx`
- Keep the gallery card image on a hardcoded solid navy base: `#1e3a8a`.
- Replace any token-based or utility-based ambiguity for the image wrapper with explicit inline styles.
- Force the main card image to:
  - `width: 100%`
  - `height: 100%`
  - `objectFit: 'cover'`
  - `objectPosition: 'center'`
  - `backgroundColor: '#1e3a8a'`
  - `boxShadow: 'none'`
  - `filter: 'none'`
  - `backdropFilter: 'none'`

2. Remove the actual remaining glass effect from the mockup viewer too
- Strip the glassmorphism from `MockupLightbox` in the same file.
- Remove:
  - `backdropFilter: 'blur(24px)'`
  - `WebkitBackdropFilter`
  - image shadow
  - rounded corners if they contribute to the floating-card look
- Replace with a plain solid/dim navy-black overlay and a flush image presentation so transparent mockups do not appear suspended over a glossy backdrop.

3. Apply the nuclear option to every portfolio image surface
- Use direct inline styles on both:
  - the main project `<img>`
  - the lightbox/mockup `<img>`
- This avoids Tailwind precedence issues and guarantees the image covers the full bounds.

4. Hard-delete any leftover atmospheric wrappers in `Portfolio.tsx`
- Remove any wrapper `div` styles/classes that create:
  - reflection
  - glow
  - blur
  - floating panel depth
  - glass backdrop behavior
- Keep only structural containers needed for cropping and layout.

5. Verify both public states after implementation
- Test the collapsed “Recent Projects” gallery card.
- Test the expanded image state.
- Test “View project mockups” lightbox on transparent PNG/mockup assets.
- Confirm there is:
  - no empty transparent canvas look
  - no floating-object effect
  - no glass blur behind the image
  - no residual shadow/reflection from parent wrappers

Technical notes
- Exact active file to fix: `src/components/landing/Portfolio.tsx`
- Global CSS is not the root cause here.
- The likely missed source is the `MockupLightbox` block in the same component, not a duplicate component elsewhere.
- I would also hardcode `#1e3a8a` directly instead of relying on `bg-primary` / `hsl(var(--primary))` for these specific portfolio image surfaces, to match your brute-force requirement exactly.

Files to change once approved
- `src/components/landing/Portfolio.tsx`

Expected result
- All portfolio images, including transparent mockups, render as fully integrated full-bleed visuals.
- No liquid glass, blur, floating shadow, or glossy backdrop remains in the public portfolio experience.
