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
    let lastVisible = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY;
        const threshold = 550;
        const next = scrollY > threshold;
        if (next !== lastVisible) {
          lastVisible = next;
          setIsVisible(next);
        }
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
                      <span className="text-[#fb923c] font-bold">সপ্তাহে মাত্র ৩টি পেজের কাজ নেওয়া হয়</span> • ডেলিভারি: ৪৮–৭২ ঘণ্টা
                    </>
                  ) : (
                    <>
                      <span className="text-[#fb923c] font-bold">Only 3 Brands Weekly</span> • Delivery: 48–72h
                    </>
                  )}
                </p>
                <p className="text-[9px] text-white/50 hidden sm:block truncate">
                  {isBn ? '১টি ভিডিও রিল + ২টি ছবির পোস্ট • বিকাশ ও নগদ' : '1x Reel + 2x Statics • bKash & Nagad'}
                </p>
              </div>
            </div>

            {/* Conversion CTA Group */}
            <div className="flex items-center gap-2 shrink-0">
              <m.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => openQuickBookingModal({
                  tierId: 'test-drive',
                  tierTitle: 'Test Pack (টেস্ট প্যাক)',
                  tierTitleBn: 'টেস্ট প্যাক (Test Pack)',
                  price: '৳2,500',
                  priceBn: '৳২,৫০০',
                  delivery: '48–72h Delivery',
                  deliveryBn: '৪৮–৭২ ঘণ্টায় ডেলিভারি',
                  source: 'Sticky Conversion Bar',
                })}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 bg-accent hover:bg-accent/90 text-[#f9fafb] font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-full shadow-[0_2px_12px_rgba(251,146,60,0.4)] hover:shadow-[0_4px_18px_rgba(251,146,60,0.6)] cursor-pointer btn-shimmer"
              >
                <Sparkles className="w-3 h-3 hidden sm:inline text-[#f9fafb]" />
                <span>{isBn ? '⚡ ৳২,৫০০ টেস্ট প্যাক নিন →' : '⚡ ৳২,৫০০ TEST PACK →'}</span>
              </m.button>

              <m.a
                href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%A8%2C%E0%A7%AB%E0%A7%A6%E0%A7%A6%20%E0%A6%9F%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%9F%E0%A7%87%E0%A6%B8%E0%A7%8D%E0%A6%9F%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%20%E0%A6%A6%E0%A6%BF%E0%A7%9F%E0%A7%87%20%E0%A6%B6%E0%A7%81%E0%A6%B0%E0%A7%81%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                title="Direct WhatsApp"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] text-white hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4" />
              </m.a>

              <m.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => setIsDismissed(true)}
                className="w-6 h-6 rounded-full text-white/40 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </m.button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
