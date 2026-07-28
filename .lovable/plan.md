## Goal
Every user-visible letter on the public site — English and Bengali — is editable from the `/admin` panel. No developer needed to change copy.

## What's already editable (no work needed)
Hero, Nav, About, Services (list + heading), Stats, Portfolio (list + heading), Evolution, Transformations (list + heading), Process (list + heading), Contact, Footer, Brand meta, Colors, Logo, Marquee. All EN + BN.

## What's missing today
1. **Testimonials section** — quotes, names, roles, companies, plus section label/heading/subheading. Fully hardcoded.
2. **Micro-copy hardcoded inside components** — buttons, form step labels, validation messages, loader text, "View case study", scroll hints, etc.
3. **`index.html` `<title>` / `<meta description>`** already covered by MetaEditor.

## Delivery plan (3 phases, shipped in order)

### Phase 1 — Testimonials CMS (biggest visible gap)
- Add a **Testimonials** tab to the admin Content page.
- Store data in `site_settings` under key `testimonials` (per your "in admin panel page" choice — no new table, edit everything in one JSON-backed editor on the page).
- Fields per entry (repeatable, reorderable, add/delete): quote_en, quote_bn, name, role_en, role_bn, company_en, company_bn.
- Also editable: section label (EN/BN), heading (EN/BN), subheading (EN/BN).
- Wire `Testimonials.tsx` to read from the setting, with the current hardcoded array as fallback so nothing breaks before first save.

### Phase 2 — UI Labels editor (all remaining inline micro-copy)
Add a new **UI Labels** tab grouping every remaining hardcoded EN/BN string:
- **LeadForm**: step titles, field labels, placeholders, validation errors, Back/Continue/Submit buttons, success state copy (~21 strings each language).
- **Portfolio**: "View case study", "Download PDF", "Close" labels.
- **PageLoader**: loading tagline.
- **Hero**: scroll hint, any inline labels not already in HeroContent.
- **Contact**: any inline labels not already in ContactContent.
- **Navbar / mobile menu**: any labels not in NavContent.
- Stored in `site_settings` under key `ui_labels` as one structured object; components read via a new `useUiLabels()` hook with typed defaults so missing keys always fall back to current text.

### Phase 3 — Sweep + verification
- Grep the codebase for any remaining string literals rendered to users, move them into `ui_labels`.
- Manual walkthrough of every section in both languages to confirm nothing is left hardcoded.
- Add a short note at the top of the admin Content page listing which tab controls which section.

## Technical notes
- No new database tables; both new keys (`testimonials`, `ui_labels`) live in the existing `site_settings` table, matching how Hero/About/Contact/etc. are already stored.
- Editors reuse `useSaveRegistration` + the existing Save All bar so you keep the unified save UX.
- Every field has a Bengali twin; the language toggle keeps working unchanged.
- Fallback defaults live in code, so if a setting is empty the site still renders today's copy.

## Out of scope
- Changing visual design, layouts, animations, or slider mechanics.
- Restructuring existing editors that already work.

I'll ship Phase 1 first, then Phase 2, then Phase 3, in separate turns so you can review each.
