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
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Inject the transition once. We animate the CSS HSL tokens directly so
    // every Tailwind utility (bg-background, text-foreground) crossfades.
    const style = document.createElement('style');
    style.setAttribute('data-section-theme', '');
    style.textContent = `
      :root {
        transition:
          background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1),
          color 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      body {
        transition:
          background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1),
          color 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);

    const root = document.documentElement;
    // Snapshot the original tokens so we can always restore.
    const baseBg = getComputedStyle(root).getPropertyValue('--background').trim();
    const baseFg = getComputedStyle(root).getPropertyValue('--foreground').trim();

    const THEMES: Record<string, { bg: string; fg: string }> = {
      light: { bg: baseBg, fg: baseFg },
      // Brand Navy + Off-white text — same tokens used by the loader curtain.
      navy: { bg: '224 65% 33%', fg: '210 20% 98%' },
    };

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('section[data-theme], footer[data-theme]')
    );
    if (sections.length === 0) return;

    let activeTheme = 'light';
    const apply = (themeName: string) => {
      if (themeName === activeTheme) return;
      const t = THEMES[themeName];
      if (!t) return;
      activeTheme = themeName;
      root.style.setProperty('--background', t.bg);
      root.style.setProperty('--foreground', t.fg);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose center is closest to viewport center.
        const vh = window.innerHeight;
        const center = vh / 2;
        let best: { name: string; dist: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const rect = entry.boundingClientRect;
          const sectionCenter = rect.top + rect.height / 2;
          const dist = Math.abs(sectionCenter - center);
          const name = (entry.target as HTMLElement).dataset.theme;
          if (!name) continue;
          if (!best || dist < best.dist) best = { name, dist };
        }
        if (best) apply(best.name);
      },
      {
        // Trigger when section crosses the middle band of the viewport.
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
      style.remove();
      // Restore original tokens.
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
    };
  }, []);

  return null;
}
