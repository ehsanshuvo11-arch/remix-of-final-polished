import { useEffect } from 'react';

/**
 * Section-level theme switcher.
 *
 * Honors the brand-locked palette (Navy / Off-white / Navy footer) — does NOT
 * introduce new colors. Crossfades the body background + foreground text color
 * via a CSS variable transition so every component using bg-background /
 * text-foreground inherits it for free. No re-renders, no React state, no
 * MutationObserver loops — pure IntersectionObserver + CSS transition.
 *
 * Stops:
 *   • hero            → Off-white (default)
 *   • work / portfolio → Off-white (kept for image legibility)
 *   • process / dark sections → can opt-in via data-theme="navy" on the section
 *   • footer          → Navy
 *
 * To opt a section into a theme, add `data-theme="navy" | "light"` on the
 * <section>. Anything without the attribute keeps the previous theme.
 */
export default function SectionTheme() {
  // Performance: Sections already define explicit Tailwind background classes.
  // Disabling runtime CSS variable transitions on :root eliminates full-DOM style recalculation jank.
  return null;
}
