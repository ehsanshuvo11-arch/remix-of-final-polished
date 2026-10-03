import { useEffect, useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';

export const MOBILE_MENU_EVENT = 'polished:toggle-menu';

const LUXE = [0.22, 1, 0.36, 1] as const;

/**
 * Ultra-minimalist luxury thumb-zone conversion dock for mobile.
 * Features Smart Auto-Hide: hides on scroll down to free up reading space,
 * glides into view on scroll up or stop with direct 1-tap WhatsApp and ৳3,999 sprint trigger.
 */
export default function MobileActionBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  // Listen for modal state to tuck dock away
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      if (detail) setIsModalOpen(detail.open);
    };
    window.addEventListener('polished:modal-state', handler);
    return () => window.removeEventListener('polished:modal-state', handler);
  }, []);

  // Smart Auto-Hide Scroll Listener with Idle Reveal
  useEffect(() => {
    let frame = 0;
    let idleTimer: any = null;

    const onScroll = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const currentScrollY = window.scrollY;
        const pastHero = currentScrollY > window.innerHeight * 0.35;
        const delta = currentScrollY - lastScrollYRef.current;

        if (!pastHero) {
          setVisible(false);
        } else if (delta < -8) {
          // Scrolling up: reveal conversion bar
          setVisible(true);
        } else if (delta > 8) {
          // Scrolling down: auto-hide bar to avoid blocking content
          setVisible(false);
          // When user pauses scrolling for 1.2s, gently reveal conversion bar
          idleTimer = setTimeout(() => {
            if (window.scrollY > window.innerHeight * 0.35) {
              setVisible(true);
            }
          }, 1200);
        }
        lastScrollYRef.current = Math.max(0, currentScrollY);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  const tap = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
  };

  return (
    <AnimatePresence>
      {visible && !isModalOpen && (
        <m.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: LUXE }}
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
          className="md:hidden fixed bottom-0 inset-x-0 z-[400] px-4 pointer-events-none flex justify-center"
        >
          <div className="pointer-events-auto w-full max-w-[360px] mx-auto flex items-center justify-between gap-2.5 rounded-full border border-white/15 bg-[#1e3a8a]/95 backdrop-blur-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)]">
            {/* Direct WhatsApp Quick Chat */}
            <a
              href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20am%20interested%20in%20scaling%20my%20brand%27s%20visual%20identity."
              target="_blank"
              rel="noopener noreferrer"
              onClick={tap}
              aria-label="Direct WhatsApp"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 transition-all duration-300 active:scale-95 hover:bg-[#25D366]/30 shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a8 8 0 00-6.93 12L2 18l4.07-1.07A8 8 0 1010 2z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M7.5 8.5s.5 1 1.5 2 2 1.5 2 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </a>

            {/* Primary Conversion Action: 1-Tap ৳3,999 Quick Booking */}
            <button
              type="button"
              onClick={() => {
                tap();
                openQuickBookingModal({
                  tierId: 'trial-pack',
                  tierTitle: 'No-Risk Test Drive Sprint',
                  tierTitleBn: 'নো-রিস্ক টেস্ট ড্রাইভ স্প্রিন্ট',
                  price: '৳3,999',
                  priceBn: '৳৩,৯৯৯',
                  source: 'Mobile Action Bar',
                });
              }}
              lang={isBn ? 'bn' : 'en'}
              className="flex h-11 flex-1 items-center justify-between gap-2 rounded-full bg-accent px-4 text-accent-foreground font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(251,146,60,0.4)] btn-shimmer cursor-pointer"
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
                  {isBn ? '৳৩,৯৯৯ টেস্ট ড্রাইভ' : 'START ৳3,999 SPRINT'}
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
