import { useEffect, useRef } from 'react';
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

  const hero = content ?? {
    titleEn: 'Make Your Collection',
    title2En: '*Unmissable!*',
    titleBn: 'আপনার কালেকশন হোক',
    title2Bn: '*অনবদ্য!*',
    eyebrowEn: 'Performance Visual Identity & High-Conversion Design Agency',
    eyebrowBn: 'পারফরম্যান্স ভিজ্যুয়াল আইডেন্টিটি ও হাই-কনভার্শন ডিজাইন স্টুডিও',
    subEn: "We don't design generic Canva banners. We build high-converting Meta Ad creatives, luxury packaging, and high-trust storefront visuals that slash your CPR and drive 3.2x average ROAS for ambitious skincare brands.",
    subBn: "আমরা সাধারণ ক্যানভা ব্যানার বানাই না। আমরা তৈরি করি হাই-কনভার্টিং মেটা অ্যাড ক্রিয়েটিভ, লাক্সারি প্যাকেজিং ও ই-কমার্স ভিজ্যুয়াল—যা আপনার বিজ্ঞাপনের খরচ (CPR) কমায় এবং সেলস ৩.২ গুণ বৃদ্ধি করে।",
  };

  return (
    <section
      className="min-h-[100svh] py-14 px-5 flex flex-col justify-center items-center relative overflow-hidden sm:px-8 md:h-auto md:min-h-screen md:px-14 md:pt-20 md:pb-36 lg:pb-40 bg-primary"
    >
      {/* Elegant quiet luxury ambient lighting without harsh blueprint lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(251,146,60,0.08) 0%, rgba(30,58,138,0.2) 50%, rgba(30,58,138,0) 80%)',
        }}
      />

      {/* Static ambient orbs with zero JS runtime / rAF cost */}
      <div className="absolute w-[800px] h-[800px] rounded-full pointer-events-none" style={{ top: '-200px', right: '-200px', background: 'radial-gradient(circle, rgba(251,146,60,0.07) 0%, rgba(251,146,60,0.02) 40%, rgba(251,146,60,0) 70%)' }} />
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ bottom: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(30,58,138,0.3) 0%, rgba(30,58,138,0.08) 40%, rgba(30,58,138,0) 70%)' }} />

      <div className="max-w-[960px] text-center relative z-10 pt-4 md:pt-8">
        <div className="w-full flex flex-col items-center justify-center mb-6 md:mb-8 gap-3">
          {/* Subtle live availability pill */}
          <div
            className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-white/[0.07] border border-white/15 text-[10px] md:text-[11px] tracking-[1.5px] uppercase text-primary-foreground/95 font-medium shadow-sm"
            style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both' }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>
              {isBn ? '৩টি পার্টনার স্লট বাকি • মার্চ স্প্রিন্ট' : '3 Partner Slots Remaining • March Sprint'}
            </span>
          </div>

          <p
            lang={isBn ? 'bn' : 'en'}
            className="font-sans-eyebrow text-[9px] tracking-[0.28em] text-accent md:text-[11px] md:tracking-[4px] uppercase font-semibold"
            style={{ 
              animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both', 
              fontFamily: isBn ? "'Noto Serif Bengali', serif" : '"Inter", sans-serif',
              letterSpacing: isBn ? '1px' : undefined
            }}
          >
            {isBn ? hero.eyebrowBn : hero.eyebrowEn}
          </p>
        </div>

        {(() => {
          const BASE = 0.4;
          const STAGGER = 0.15;
          const line2Delay = BASE + 2 * STAGGER;
          if (isBn) {
            return (
              <h1
                lang="bn"
                className="hero-headline font-heading font-normal text-primary-foreground text-[32px] sm:text-[38px] tracking-normal leading-[1.2] mx-auto mb-3 md:max-w-none md:leading-[1.15] md:mb-6 md:text-[clamp(40px,6.2vw,74px)] text-center"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                <RevealText as="span" delay={BASE} className="inline block whitespace-normal" stagger={STAGGER}>
                  {hero.titleBn || 'আপনার ব্র্যান্ডের আসল রূপ,'}
                </RevealText>
                <RevealText as="span" delay={line2Delay} className="hero-accent-line block text-[32px] sm:text-[38px] leading-[1.2] mt-1 md:mt-2 text-[clamp(36px,6vw,70px)] italic text-accent" stagger={STAGGER}>
                  {hero.title2Bn || 'বিজ্ঞাপনে ৩.২x বেশি সেলস!'}
                </RevealText>
              </h1>
            );
          }
          return (
            <h1
              lang="en"
              className="hero-headline font-heading font-light text-primary-foreground text-[34px] sm:text-[40px] tracking-tight leading-[1.12] mx-auto mb-3 md:max-w-none md:tracking-normal md:leading-[1.08] md:mb-6 md:text-[clamp(48px,8vw,96px)] md:whitespace-nowrap text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '-0.01em',
                fontWeight: 400,
              }}
            >
              <RevealText
                as="span"
                delay={BASE}
                className="inline md:inline whitespace-normal md:whitespace-nowrap"
                stagger={STAGGER}
              >
                {hero.titleEn}
              </RevealText>
              <br className="hidden md:inline" />
              <RevealText
                as="span"
                delay={line2Delay}
                className="hero-accent-line block text-[34px] sm:text-[40px] leading-[1.1] mt-1 mb-3 md:mt-0 md:mb-0 md:pt-4 md:text-[clamp(42px,7vw,84px)] md:leading-[1.08] italic text-accent md:whitespace-nowrap"
                stagger={STAGGER}
              >
                {hero.title2En}
              </RevealText>
            </h1>
          );
        })()}

        <p
          lang={isBn ? 'bn' : 'en'}
          className="block font-sans-body text-primary-foreground/90 leading-[1.65] md:leading-[1.75] max-w-[380px] md:max-w-[620px] mx-auto mb-6 md:mb-8 text-[14px] md:text-[16px] px-2 md:px-0"
          style={{
            fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
            animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.85s both',
          }}
        >
          {isBn ? hero.subBn : hero.subEn}
        </p>

        {/* Streamlined Action Container — 2 Clear Conversion Actions */}
        <div className="flex flex-col w-full max-w-[340px] md:max-w-none mx-auto gap-3 md:flex-row md:gap-4 md:mt-8 md:mb-2 justify-center items-center" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.05s both' }}>
          <button
            type="button"
            onClick={() => openQuickBookingModal({
              tierId: 'trial-pack',
              tierTitle: 'No-Risk Test Drive Sprint',
              tierTitleBn: 'নো-রিস্ক টেস্ট ড্রাইভ স্প্রিন্ট',
              price: '৳3,999',
              priceBn: '৳৩,৯৯৯',
              delivery: '48-Hour Rapid Delivery',
              deliveryBn: '৪৮ ঘণ্টায় দ্রুত ডেলিভারি',
              source: 'Hero Primary CTA',
            })}
            className={`w-full h-[52px] md:h-[54px] px-8 text-[13px] md:text-[14px] tracking-[0.5px] uppercase flex justify-center items-center gap-2 bg-accent text-accent-foreground border border-accent/80 md:inline-flex md:w-auto md:px-10 md:min-w-[240px] font-bold rounded-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(251,146,60,0.5)] active:scale-[0.98] cursor-pointer btn-shimmer shadow-[0_6px_25px_rgba(251,146,60,0.4)]`}
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? '৳৩,৯৯৯ টেস্ট ড্রাইভ শুরু করুন' : 'Start ৳3,999 Test Drive'}
            </span>
            <span className="text-base font-bold">→</span>
          </button>

          <a
            href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20free%20advice%20regarding%20my%20brand%20design%20and%20ads."
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full h-[52px] md:h-[54px] px-7 text-[12px] md:text-[13px] tracking-[0.5px] flex justify-center items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 md:inline-flex md:w-auto md:px-8 font-medium rounded-xl transition-all duration-300 hover:border-accent active:scale-[0.98] cursor-pointer`}
          >
            <span>💬</span>
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
            </span>
          </a>
        </div>

        {/* Minimalist Quiet Luxury Reassurance Strip */}
        <div 
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-8 md:mt-10 text-[12px] md:text-[13px] text-primary-foreground/75 font-sans tracking-wide"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.15s both' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-accent">⚡</span>
            <span>{isBn ? '৪৮ ঘণ্টায় ৫টি অ্যাড' : '48h Rapid Delivery'}</span>
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent">💳</span>
            <span>{isBn ? 'বিকাশ ও নগদ পেমেন্ট' : 'bKash & Nagad'}</span>
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent">🛡️</span>
            <span>{isBn ? 'কোনো চুক্তি নেই • ফ্রি রিভিশন' : 'Zero Lock-in • Free Revisions'}</span>
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent">★</span>
            <span>{isBn ? 'গড় ৩.২x ROAS বৃদ্ধি' : '3.2x Avg. ROAS Lift'}</span>
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-9 left-1/2 -translate-x-1/2 flex md:hidden md:[@media(min-height:720px)]:flex flex-col items-center gap-2 text-primary-foreground/40 md:text-primary-foreground/30 text-[9px] md:text-[10px] tracking-[3px] uppercase transform-gpu will-change-transform" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.45s both' }}>
        {hero.scrollEn ?? 'Scroll'}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.7s both' }} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-accent/40" />
    </section>
  );
}
