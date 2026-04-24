
Goal: remove the hover-time color fill from Recent Projects so images stay in their original colors while preserving tilt, scale, and the breathing orange aura.

What the code currently shows
- In `src/components/landing/Portfolio.tsx`, there is no `from-accent` overlay div in `TiltImage` right now.
- There are also no `bg-blue`, `bg-primary`, `group-hover:bg-*`, or pseudo-element overlays attached to the project image area.
- The only hover effect on the project images is `group-hover:scale-[1.04]`.
- The only portfolio-local color surface touching the image area is `bg-card`, currently applied in both states:
  - Expanded view:
    - wrapper around the image
    - `<motion.img>` itself
  - Collapsed `TiltImage`:
    - inner wrapper
    - `<img>` itself

Implementation plan
1. Remove portfolio-local background fills from the image area
- Edit `src/components/landing/Portfolio.tsx`.
- Delete `bg-card` from the expanded image wrapper and the expanded `<motion.img>`.
- Delete `bg-card` from the collapsed `TiltImage` wrapper and the collapsed `<img>`.
- This restores a fully transparent image stage so no card-colored fill appears during hover scaling.

2. Confirm there are no hidden hover tint classes in the project media block
- Re-check the collapsed and expanded media markup in `Portfolio.tsx` and remove any image-area-only hover tint class if present.
- Specifically ensure there is no:
  - `bg-gradient-*`
  - `from-accent`
  - `bg-blue-*`
  - `bg-primary*`
  - `group-hover:bg-*`
  - `before:` / `after:` overlay attached to the image container

3. Preserve required visual behavior exactly
- Keep `handleTilt` / `handleTiltLeave` unchanged.
- Keep `group-hover:scale-[1.04]` unchanged.
- Keep the orange aura `bg-[#fb923c]/[0.06] blur-[90px] ... animate-pulse` unchanged and visible.
- Do not add `bg-white`.
- Do not change saturation, blend modes, pulse behavior, or animation timing.

4. Verify both portfolio states
- Collapsed card hover: image tilts/scales with no color fill.
- Expanded inline view: enlarged image remains clean with no tinted surface behind it.
- Lightbox remains untouched unless a portfolio-local tint is still visible there after the card cleanup.

Files to update
- `src/components/landing/Portfolio.tsx`

Technical details
```text
Current likely tint source inside Portfolio.tsx:
- Expanded wrapper: class includes bg-card
- Expanded image: class includes bg-card
- TiltImage wrapper: class includes bg-card
- TiltImage image: class includes bg-card

Planned outcome:
- remove those bg-card classes
- keep only transform/tilt/aura behavior
- leave all buttons/footer/case-study/lightbox controls unchanged
```

GitHub / deployment note
- After approval in default mode, I will make the code edit that triggers Lovable’s GitHub sync. Manual `git push --force` is not available from this environment, but the synced change is what will create the new GitHub commit and trigger deployment.
