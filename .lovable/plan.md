# Mobile Hero — Proportional Refinement Plan

Goal: Make the mobile Hero a faithful scaled-down replica of the desktop composition (Image 1). Surgical edits to `src/components/landing/Hero.tsx` only — no desktop (`md:`) classes touched, no global styles changed.

## Diagnosis (Image 2 vs Image 1)

| Element | Current Mobile | Desktop Reference | Fix Needed |
|---|---|---|---|
| Logo | `w-14 h-14 mb-6` (~14% width, OK) | Dominant centered badge | Keep size, slightly more bottom margin |
| Eyebrow | `text-[10px] mb-8` | Subtle kicker above tagline | Keep |
| Tagline | `text-4xl` (36px) | Dominates ~40% of viewport height | Scale up to `text-[40px]` with tighter leading |
| Sub paragraph | `hidden md:block` ✅ | Hidden on mobile | Already correct — no change |
| Play button | `max-w-[280px]` ✅ | Sleek pill | Keep |
| View Work / Start Project | Inconsistent — fall back to auto width on mobile, stack awkwardly | Unified pill bars | Force `max-w-[280px]` to match Play button |
| Vertical rhythm | Cramped between tagline → buttons | Generous breathing room | Increase `mb` on tagline accent line |

## Changes

### 1. Tagline scaling (more dominance)
- Line 1 (`Make Your Collection`): `text-4xl` → `text-[40px]`, add `tracking-[-0.01em]` for tighter premium feel
- Line 2 (`Unmissable!`): `text-4xl` → `text-[40px]`, increase `mb-12` → `mb-14` for airy gap before buttons

### 2. Unify button widths (fix the broken stack in Image 2)
The second button group currently uses `md:flex-row md:max-w-none` but on mobile the inner `MagneticButton`s collapse to content-width because `MagneticButton` wraps children in `<div className="inline-block">`. Fix by ensuring the wrapper enforces `max-w-[280px]` and inner buttons keep `w-full`:
- Confirm wrapper: `flex flex-col w-full max-w-[280px] mx-auto gap-4 mt-4`
- Add explicit `w-full` to the inline-block wrapper inside `MagneticButton` on mobile via passing through, OR override at button group level by adding a child selector / explicit `[&>div]:w-full` on the wrapper so the magnetic wrapper expands.

Cleanest fix: add `[&>div]:w-full md:[&>div]:w-auto` to both button-group wrappers so the magnetic `inline-block` wrapper stretches to the constrained 280px container on mobile, leaving desktop unchanged.

### 3. Spacing rhythm
- Logo: `mb-6` → `mb-7` (slightly more breathing room)
- Eyebrow: `mb-8` → `mb-6` (closer to tagline, matches desktop)
- Tagline accent line: `mb-12` → `mb-14`
- Gap between Play button and CTA pair: `mt-4` → `mt-5`

### 4. No-touch list
- Desktop classes (`md:*`, `lg:*`) — untouched
- `hidden md:block` paragraph — already hidden on mobile, no change
- Animations, fonts, colors, RevealText logic — untouched
- All other components — untouched

## Verification
After edit: screenshot mobile viewport (390x844) and compare side-by-side with desktop reference. Confirm all 3 buttons render as identical-width pill bars stacked center.
