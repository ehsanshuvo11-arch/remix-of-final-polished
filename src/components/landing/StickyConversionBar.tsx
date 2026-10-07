import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';

export default function StickyConversionBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY;
        const threshold = 550;
        setIsVisible(scrollY > threshold);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block fixed md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-40"
        >
          <div
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', isolation: 'isolate' }}
            className="bg-primary/95 backdrop-blur-xl border border-[#fb923c]/40 text-white rounded-full p-2 pl-4 pr-3 sm:px-6 sm:py-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex items-center justify-between gap-3 sm:gap-6"
          >
            {/* Scarcity & Capacity signal */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fb923c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#fb923c]"></span>
              </span>
              <div className="truncate">
                <p className="text-[11px] sm:text-xs font-medium text-white/95 truncate">
                  {isBn ? (
                    <>
                      <span className="text-[#fb923c] font-bold">নতুন স্প্রিন্ট ওপেন</span> — প্রিমিয়াম D2C ভিজ্যুয়াল পার্টনারশিপ
                    </>
                  ) : (
                    <>
                      <span className="text-[#fb923c] font-bold">Sprint Available</span> — D2C & Agency Design Sprint
                    </>
                  )}
                </p>
                <p className="text-[9px] text-white/50 hidden sm:block truncate">
                  {isBn ? '১০০% কাস্টম ডিজাইন • ৪৮ ঘণ্টায় প্রথম ডেলিভারি' : '100% Bespoke Design • 48-Hour First Delivery'}
                </p>
              </div>
            </div>

            {/* Conversion CTA Group */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openQuickBookingModal({ source: 'Sticky Conversion Bar' })}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-[0_2px_12px_rgba(251,146,60,0.4)] hover:shadow-[0_4px_18px_rgba(251,146,60,0.6)] cursor-pointer active:scale-95 btn-shimmer"
              >
                <Sparkles className="w-3 h-3 hidden sm:inline" />
                <span>{isBn ? '৳৩,৯৯৯ টেস্ট ড্রাইভ' : 'Start ৳3,999 Sprint'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <a
                href="https://wa.me/8801346288210?text=Hi%20POLISHED%20Studio%2C%20I'd%20like%20to%20discuss%20a%20visual%20identity%20partnership%20for%20my%20brand."
                target="_blank"
                rel="noopener noreferrer"
                title="Direct WhatsApp"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] text-white hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="w-6 h-6 rounded-full text-white/40 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
