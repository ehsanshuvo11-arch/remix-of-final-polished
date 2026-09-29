import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { openAuditModal } from '@/components/landing/VisualAuditModal';

export const MOBILE_MENU_EVENT = 'polished:toggle-menu';

const LUXE = [0.22, 1, 0.36, 1] as const;

/**
 * Ultra-minimalist luxury thumb-zone conversion dock for mobile.
 * Frictionless: Direct WhatsApp 1-tap + High-converting Free Audit CTA.
 */
export default function MobileActionBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listen for modal state to tuck dock away
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      if (detail) setIsModalOpen(detail.open);
    };
    window.addEventListener('polished:modal-state', handler);
    return () => window.removeEventListener('polished:modal-state', handler);
  }, []);

  // Reveal once user scrolls past hero threshold; hide at very top.
  useEffect(() => {
    let frame = 0;
    let last = false;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > window.innerHeight * 0.45;
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

  const tap = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
  };

  return (
    <AnimatePresence>
      {visible && !isModalOpen && (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease: LUXE }}
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
          className="md:hidden fixed bottom-0 inset-x-0 z-[400] px-4 pointer-events-none flex justify-center"
        >
          <div className="pointer-events-auto w-full max-w-[360px] mx-auto flex items-center justify-between gap-2.5 rounded-full border border-white/15 bg-primary/95 backdrop-blur-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)]">
            {/* Direct WhatsApp Quick Chat */}
            <a
              href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20am%20interested%20in%20scaling%20my%20brand%27s%20visual%20identity."
              target="_blank"
              rel="noopener noreferrer"
              onClick={tap}
              aria-label="Direct WhatsApp"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 transition-all duration-300 active:scale-95 hover:bg-[#25D366]/25"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a8 8 0 00-6.93 12L2 18l4.07-1.07A8 8 0 1010 2z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M7.5 8.5s.5 1 1.5 2 2 1.5 2 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </a>

            {/* Primary Conversion Action: Claim Free Audit */}
            <button
              type="button"
              onClick={() => {
                tap();
                openAuditModal({ source: 'Mobile Action Bar' });
              }}
              lang={isBn ? 'bn' : 'en'}
              className="flex h-11 flex-1 items-center justify-between gap-2 rounded-full bg-accent px-4 text-accent-foreground font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(251,146,60,0.4)] btn-shimmer"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span
                  className={`text-[11px] font-extrabold truncate ${isBn ? 'text-[12px]' : ''}`}
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  {isBn ? 'ফ্রি ক্রিয়েটিভ অডিট নিন' : 'CLAIM FREE AUDIT'}
                </span>
              </div>

              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-xs">
                →
              </span>
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
