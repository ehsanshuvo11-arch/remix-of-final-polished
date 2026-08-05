import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLenis } from '@/components/landing/SmoothScroll';

export const MOBILE_MENU_EVENT = 'polished:toggle-menu';

const LUXE = [0.22, 1, 0.36, 1] as const;

/**
 * Thumb-zone dock for mobile only. Keeps the two actions people actually need
 * — navigation and "talk to us" — within one-handed reach at all times, so the
 * user never has to stretch to the top-right hamburger mid-page.
 */
export default function MobileActionBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reveal once the hero is behind us; hide again at the very top.
  useEffect(() => {
    let frame = 0;
    let last = false;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > window.innerHeight * 0.6;
        if (next !== last) {
          last = next;
          setVisible(next);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Mirror the navbar's menu state so the dock icon reflects reality.
  useEffect(() => {
    const onState = (e: Event) => setMenuOpen((e as CustomEvent<boolean>).detail);
    window.addEventListener('polished:menu-state', onState);
    return () => window.removeEventListener('polished:menu-state', onState);
  }, []);

  const tap = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(8);
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.55, ease: LUXE }}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          className="md:hidden fixed bottom-0 inset-x-0 z-[400] px-4 pb-3 pt-2 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto flex items-center gap-2 rounded-full border border-primary-foreground/12 bg-primary/95 p-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              onClick={() => {
                tap();
                window.dispatchEvent(new Event(MOBILE_MENU_EVENT));
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-primary-foreground/80 transition-colors duration-300 active:bg-primary-foreground/10 active:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                tap();
                scrollToId('contact');
              }}
              lang={isBn ? 'bn' : 'en'}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 font-medium text-accent-foreground transition-transform duration-200 active:scale-[0.97] ${
                isBn ? 'text-[13px]' : 'text-[11px] uppercase tracking-[2px]'
              }`}
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn ? 'কথা বলুন' : "Let's Talk"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                tap();
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(0, { duration: 1.6 });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Back to top"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-primary-foreground/80 transition-colors duration-300 active:bg-primary-foreground/10 active:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
