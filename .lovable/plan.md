## Goal
In Bengali mode, all Bengali text should render in **Noto Serif Bengali** (currently the CSS overrides are disabled, so Bengali text inherits Cormorant Garamond / DM Sans / Hind Siliguri fallbacks, which don't render Bengali correctly or consistently).

## Scope
Re-enable Bengali-only font overrides — but ONLY the font-family. Keep all sizing, weights, line-heights, letter-spacing, italic and DOM behavior identical to English (per existing brand memory).

## Changes

### 1. `src/index.css`
Replace the "DISABLED" Bengali typography block with a minimal font-family-only override scoped to `html[data-lang="bn"]`:

```css
html[data-lang="bn"] body,
html[data-lang="bn"] h1,
html[data-lang="bn"] h2,
html[data-lang="bn"] h3,
html[data-lang="bn"] h4,
html[data-lang="bn"] h5,
html[data-lang="bn"] h6,
html[data-lang="bn"] p,
html[data-lang="bn"] span,
html[data-lang="bn"] a,
html[data-lang="bn"] button,
html[data-lang="bn"] li,
html[data-lang="bn"] label,
html[data-lang="bn"] input,
html[data-lang="bn"] textarea {
  font-family: 'Noto Serif Bengali', serif !important;
}
```

Carve-outs (must remain English serif/sans, NOT Bengali):
- `.brand-wordmark` (logo) — already locked to Cormorant Garamond, keep as-is.
- `[lang="en"]` — any element explicitly tagged English (e.g. Hero headline locked to English) keeps its inherited font.
- Numbers / English-only stat boxes that use `[lang="en"]` are unaffected.

Add:
```css
html[data-lang="bn"] [lang="en"] {
  font-family: 'Cormorant Garamond', 'DM Sans', serif;
}
```

### 2. `src/contexts/LanguageContext.tsx` (line 98)
The language switcher button hardcodes `fontFamily: "'Hind Siliguri', sans-serif"`. Change to `'Noto Serif Bengali', serif` so the switcher itself shows Bengali in the correct font.

### 3. `src/components/landing/Portfolio.tsx` (lines 156, 234)
Currently uses `'Arial, Helvetica, "Noto Sans Bengali", sans-serif'`. Change Bengali fallback from Noto Sans Bengali → Noto Serif Bengali to match the rule.

### 4. `tailwind.config.ts` (line 19)
Update `bangla` font family token from `Hind Siliguri` to `Noto Serif Bengali` so any utility-based usage is consistent.

### 5. Memory update
Update `mem://style/bengali-typography` to reflect: Noto Serif Bengali is enforced via CSS in `[data-lang="bn"]` mode (no longer "disabled"), with English-tagged elements carved out.

## What stays the same
- All sizing, leading, weights, spacing, layout — unchanged (English parity preserved).
- Hero headline that's locked to English stays in Cormorant Garamond.
- Logo wordmark stays in Cormorant Garamond.
- Italic accent words (`.hero-accent-line`, `em.text-accent`) keep italic styling.

## Out of scope
- No layout, sizing, or spacing changes.
- No DOM/structure changes.
- No new font imports (Noto Serif Bengali is already loaded in `src/index.css` line 1).