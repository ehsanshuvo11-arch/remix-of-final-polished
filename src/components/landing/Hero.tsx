import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import MagneticButton from '@/components/landing/MagneticButton';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { HeroContent } from '@/types/database';
import RevealText from '@/components/landing/RevealText';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  content: HeroContent | null;
  logoUrl: string;
}

export default function Hero({ content, logoUrl }: HeroProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const isMobile = useIsMobileDevice();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const hero = {
    titleEn: 'Make Your Collection',
    title2En: 'Unmissable!',
    titleBn: 'Make Your Collection',
    title2Bn: 'Unmissable!',
    eyebrowEn: 'SKINCARE, HAIRCARE & BEAUTY CREATIVE STUDIO',
    eyebrowBn: 'SKINCARE, HAIRCARE & BEAUTY CREATIVE STUDIO',
    subHeadlineBn: 'রাত ১২টায় ইনবক্সে আর "Price please?" নয়—আসবে শুধু বিকাশের শেষ ৪ ডিজিট আর ডেলিভারির ঠিকানা।',
    subEn: 'Stop receiving "Price please?" at midnight—start getting bKash confirmation digits and delivery addresses.',
    subBn: 'রাত ১২টায় ইনবক্সে আর "Price please?" নয়—আসবে শুধু বিকাশের শেষ ৪ ডিজিট আর ডেলিভারির ঠিকানা।',
    scrollEn: 'Scroll',
    scrollBn: 'স্ক্রল',
  };

  return (
    <section
      id="hero"
      className="pt-20 pb-16 px-4 flex flex-col justify-center items-center relative overflow-hidden sm:px-8 md:px-14 md:pt-28 md:pb-36 lg:pb-40 bg-primary"
    >
      {/* Elegant quiet luxury ambient lighting without harsh blueprint lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(251,146,60,0.08) 0%, rgba(30,58,138,0.2) 50%, rgba(30,58,138,0) 80%)',
        }}
      />

      {/* Subtle slow moving grid (Quiet Luxury background texture across mobile & desktop) */}
      <div
        className="block absolute inset-0 pointer-events-none hero-desktop-grid"
        aria-hidden="true"
      />

      {/* Static ambient orbs with zero JS runtime / rAF cost */}
      <div className="absolute w-[800px] h-[800px] rounded-full pointer-events-none" style={{ top: '-200px', right: '-200px', background: 'radial-gradient(circle, rgba(251,146,60,0.07) 0%, rgba(251,146,60,0.02) 40%, rgba(251,146,60,0) 70%)' }} />
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ bottom: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(30,58,138,0.3) 0%, rgba(30,58,138,0.08) 40%, rgba(30,58,138,0) 70%)' }} />

      <div className="max-w-[960px] text-center relative z-10 pt-2 md:pt-8">
        <div className="w-full flex flex-col items-center justify-center mb-4 md:mb-6 gap-2.5">
          {/* Subtle live availability pill */}
          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-white/[0.07] border border-white/15 text-[10px] md:text-[11px] tracking-[1.5px] uppercase text-primary-foreground/95 font-medium shadow-sm"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>
              {isBn ? '৩টি ব্র্যান্ড স্লট এই সপ্তাহে • ৪৮–৭২ ঘণ্টার স্প্রিন্ট' : 'Now Accepting New Brands • 3 Slots Weekly'}
            </span>
          </m.div>

          <m.p
            lang={isBn ? 'bn' : 'en'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow-pill-kicker text-accent font-semibold max-w-[850px] leading-snug"
            style={{ 
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '0.14em',
            }}
          >
            {isBn ? hero.eyebrowBn : hero.eyebrowEn}
          </m.p>
        </div>

        <h1
          lang="en"
          className="hero-headline hero-display-h1 text-primary-foreground text-center mx-auto mb-4 md:mb-5"
        >
          <span className="block">
            {hero.titleEn}
          </span>
          <span className="hero-accent-line block mt-1.5 md:mt-2">
            {hero.title2En}
          </span>
        </h1>

        <m.p
          lang={isBn ? 'bn' : 'en'}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="section-lead-subtitle block text-primary-foreground/90 mx-auto mb-6 md:mb-8 text-center px-4"
          style={{
            fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
            lineHeight: isBn ? 1.85 : 1.7,
          }}
        >
          {isBn ? (
            <>
              রাত ১২টায় ইনবক্সে আর &quot;Price please?&quot; নয়—<br className="hidden sm:inline" />আসবে শুধু বিকাশের শেষ ৪ ডিজিট আর ডেলিভারির ঠিকানা।
            </>
          ) : (
            <>
              Stop receiving &quot;Price please?&quot; at midnight—<br className="hidden sm:inline" />start getting bKash confirmation digits and delivery addresses.
            </>
          )}
        </m.p>

        {/* Streamlined Action Container — Butter-smooth interactive CTA buttons */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col w-full max-w-[340px] md:max-w-none mx-auto gap-2.5 md:flex-row md:gap-4 md:mt-4 md:mb-2 justify-center items-center"
        >
          <m.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => openQuickBookingModal({
              tierId: 'trial-pack',
              tierTitle: 'The 72h Test Drive (টেস্ট প্যাক)',
              tierTitleBn: 'টেস্ট প্যাক (Test Pack)',
              price: '৳2,500',
              priceBn: '৳২,৫০০',
              delivery: '48–72h Rapid Delivery',
              deliveryBn: '৪৮–৭২ ঘণ্টায় রেডি',
              deliverables: [
                '1x Scroll-stopping product video reel (9:16)',
                '2x Authentic high-trust image ad posts (1:1)',
                'Persuasive Bengali sales copy that drives full-price checkout',
                '48–72h turnaround with 2 rounds of refinement included',
              ],
              deliverablesBn: [
                '১টি স্ক্রল-থামানো প্রোডাক্ট ভিডিও রিল (9:16)',
                '২টি আসল প্রোডাক্টের বিশ্বাসযোগ্য ছবির পোস্ট (1:1)',
                'মন ছুঁয়ে যাওয়া বাংলা সেলস ক্যাপশন',
                '৪৮–৭২ ঘণ্টায় ডেলিভারি (২ বার পরিবর্তনের সুযোগ)',
              ],
              source: 'Hero Primary CTA',
            })}
            className="w-full min-h-[48px] h-12 md:h-[54px] px-6 text-[14px] tracking-[0.5px] uppercase flex justify-center items-center gap-2 bg-accent text-[#f9fafb] border border-accent/80 md:inline-flex md:w-auto md:px-10 md:min-w-[240px] font-bold rounded-xl relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(251,146,60,0.5)] cursor-pointer btn-shimmer shadow-[0_6px_25px_rgba(251,146,60,0.4)]"
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'Start ৳২,৫০০ Test Pack →' : 'Start ৳2,500 Test Pack →'}
            </span>
          </m.button>

          {/* WhatsApp Free 5-Min Video Audit CTA */}
          <m.a
            href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20Skincare%2FBeauty%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A6%BF%E0%A6%82%20%E0%A6%85%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%B0%20%E0%A6%9C%E0%A6%A8%E0%A7%8D%E0%A6%AF%20Free%205-Min%20Video%20Audit%20%E0%A6%AA%E0%A7%87%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-full min-h-[48px] h-12 md:h-[54px] px-6 text-[14px] tracking-[0.5px] flex justify-center items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 md:inline-flex md:w-auto md:px-8 font-medium rounded-xl transition-all duration-300 hover:border-accent cursor-pointer"
          >
            <span>💬</span>
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'Free 5-Min Video Review' : 'Free 5-Min Video Review'}
            </span>
          </m.a>
        </m.div>

        {/* Desktop-only subtle horizontal trust line (Mobile reveals on scroll in AccessibleTrustBar) */}
        <m.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex md:flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 mt-8 text-[12px] text-primary-foreground/80 font-sans tracking-wide mx-auto"
        >
          <span className="flex items-center justify-center gap-1.5">
            <span>⚡ {isBn ? '৭২ঘণ্টা টেস্ট প্যাক' : '72h Test Pack'}</span>
          </span>
          <span className="text-white/25">•</span>
          <span className="flex items-center justify-center gap-1.5">
            <span>💳 bKash & Nagad</span>
          </span>
          <span className="text-white/25">•</span>
          <span className="flex items-center justify-center gap-1.5">
            <span>💬 Direct WhatsApp</span>
          </span>
          <span className="text-white/25">•</span>
          <span className="flex items-center justify-center gap-1.5">
            <span>🔄 {isBn ? '২টি ফ্রি রিভিশন' : '2 Free Revisions'}</span>
          </span>
        </m.div>
      </div>

      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="flex absolute bottom-3.5 md:bottom-9 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 md:gap-2 text-primary-foreground/40 md:text-primary-foreground/30 text-[9px] md:text-[10px] tracking-[3px] uppercase transform-gpu will-change-transform"
      >
        {hero.scrollEn ?? 'Scroll'}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.7s both' }} />
      </m.div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-accent/40" />
    </section>
  );
}
