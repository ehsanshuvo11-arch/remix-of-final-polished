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

  const hero = {
    titleEn: 'Make Your Collection',
    title2En: '*Unmissable!*',
    titleBn: 'আপনার কালেকশন হোক',
    title2Bn: '*অনবদ্য!*',
    eyebrowEn: 'Performance Visual Identity & High-Conversion Design Agency',
    eyebrowBn: 'পারফরম্যান্স ভিজ্যুয়াল আইডেন্টিটি ও হাই-কনভার্শন ডিজাইন স্টুডিও',
    subEn: 'Your Ads Manager charges you every morning. Meanwhile, people comment "Price please?" and vanish. We build high-converting ad visuals and psychological copy that build instant trust—so shoppers buy at full price without begging for discounts.',
    subBn: 'প্রতিদিন ডলার কাটছে, অথচ ইনবক্সে "দাম কত" বলে মানুষ উধাও। ক্যানভা টেমপ্লেটের দিন শেষ। আমরা এমন পারফরম্যান্স ক্রিয়েটিভ আর বাংলা সেলস কপি তৈরি করি—যা কাস্টমারের মনে খাঁটি বিশ্বাস এনে দেয়, যাতে তারা ডিসকাউন্ট ছাড়াই অর্ডার করে।',
    scrollEn: 'Scroll',
    scrollBn: 'স্ক্রল',
  };

  return (
    <section
      className="min-h-[85svh] pt-20 pb-8 px-4 flex flex-col justify-center items-center relative overflow-hidden sm:px-8 md:min-h-screen md:px-14 md:pt-28 md:pb-36 lg:pb-40 bg-primary"
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

      <div className="max-w-[960px] text-center relative z-10 pt-2 md:pt-8">
        <div className="w-full flex flex-col items-center justify-center mb-4 md:mb-8 gap-2.5">
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
              {isBn ? 'নতুন ব্র্যান্ড নেওয়া হচ্ছে • ৪৮ ঘণ্টার স্প্রিন্ট' : 'Now Accepting New Brands • 48h Sprint Available'}
            </span>
          </div>

          <p
            lang={isBn ? 'bn' : 'en'}
            className="font-sans-eyebrow text-[9px] tracking-[0.25em] text-accent md:text-[11px] md:tracking-[4px] uppercase font-semibold"
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
                className="hero-headline font-heading font-normal text-primary-foreground leading-[1.2] text-center mb-3 md:mb-6 max-w-[340px] sm:max-w-[480px] md:max-w-none mx-auto text-[clamp(26px,7vw,36px)] md:text-[clamp(44px,6vw,84px)]"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                <RevealText as="span" delay={BASE} triggerOnMount={true} className="block whitespace-normal" stagger={STAGGER}>
                  {hero.titleBn || 'আপনার কালেকশন হোক'}
                </RevealText>
                <RevealText as="span" delay={line2Delay} triggerOnMount={true} className="hero-accent-line block leading-[1.15] mt-1 md:mt-2 italic text-accent" stagger={STAGGER}>
                  {hero.title2Bn || '*অনবদ্য!*'}
                </RevealText>
              </h1>
            );
          }
          return (
            <h1
              lang="en"
              className="hero-headline font-heading font-light text-primary-foreground text-[clamp(30px,8vw,40px)] tracking-tight leading-[1.12] mx-auto mb-3 max-w-[340px] sm:max-w-[500px] md:max-w-none md:tracking-normal md:leading-[1.08] md:mb-6 md:text-[clamp(48px,8vw,96px)] text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '-0.01em',
                fontWeight: 400,
              }}
            >
              <RevealText
                as="span"
                delay={BASE}
                triggerOnMount={true}
                className="block md:inline whitespace-normal md:whitespace-nowrap"
                stagger={STAGGER}
              >
                {hero.titleEn}
              </RevealText>{' '}
              <br className="hidden md:inline" />
              <RevealText
                as="span"
                delay={line2Delay}
                triggerOnMount={true}
                className="hero-accent-line block md:inline text-[clamp(34px,8.8vw,46px)] md:text-[clamp(48px,8vw,96px)] leading-[1.08] mt-1 md:mt-0 italic text-accent md:whitespace-nowrap"
                stagger={STAGGER}
              >
                {hero.title2En}
              </RevealText>
            </h1>
          );
        })()}

        <p
          lang={isBn ? 'bn' : 'en'}
          className="block font-sans-body text-primary-foreground/90 leading-[1.6] md:leading-[1.75] max-w-[360px] md:max-w-[620px] mx-auto mb-5 md:mb-8 text-[13px] md:text-[16px] px-2 md:px-0"
          style={{
            fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
            animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.85s both',
          }}
        >
          {isBn ? hero.subBn : hero.subEn}
        </p>

        {/* Streamlined Action Container — Single Primary Conversion Action on Mobile */}
        <div className="flex flex-col w-full max-w-[320px] md:max-w-none mx-auto gap-3 md:flex-row md:gap-4 md:mt-8 md:mb-2 justify-center items-center" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.05s both' }}>
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
            className="w-full h-[50px] md:h-[54px] px-6 text-[13px] md:text-[14px] tracking-[0.5px] uppercase flex justify-center items-center gap-2 bg-accent text-accent-foreground border border-accent/80 md:inline-flex md:w-auto md:px-10 md:min-w-[240px] font-bold rounded-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(251,146,60,0.5)] active:scale-[0.98] cursor-pointer btn-shimmer shadow-[0_6px_25px_rgba(251,146,60,0.4)]"
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? '৳৩,৯৯৯ টেস্ট ড্রাইভ শুরু করুন' : 'Start ৳3,999 Test Drive'}
            </span>
            <span className="text-base font-bold">→</span>
          </button>

          {/* WhatsApp CTA visible on desktop; mobile has dedicated thumb-zone action bar */}
          <a
            href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20free%20advice%20regarding%20my%20brand%20design%20and%20ads."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex h-[54px] px-7 text-[13px] tracking-[0.5px] justify-center items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 md:w-auto md:px-8 font-medium rounded-xl transition-all duration-300 hover:border-accent active:scale-[0.98] cursor-pointer"
          >
            <span>💬</span>
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
            </span>
          </a>
        </div>

        {/* Minimalist Quiet Luxury Reassurance Strip */}
        <div 
          className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 mt-5 md:mt-10 text-[11px] sm:text-[12px] md:text-[13px] text-primary-foreground/80 font-sans tracking-wide"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.15s both' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-accent">⚡</span>
            <span>{isBn ? '৪৮ ঘণ্টায় ৫টি অ্যাড' : '48h Rapid Delivery'}</span>
          </span>
          <span className="text-white/25">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent">💳</span>
            <span>{isBn ? 'বিকাশ ও নগদ পেমেন্ট' : 'bKash & Nagad'}</span>
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="text-accent">🛡️</span>
            <span>{isBn ? 'কোনো চুক্তি নেই • ফ্রি রিভিশন' : 'Zero Lock-in • Free Revisions'}</span>
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="text-accent">★</span>
            <span>{isBn ? '১০০% কাস্টম, জিরো টেমপ্লেট' : '100% Custom, Zero Templates'}</span>
          </span>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 md:bottom-9 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-primary-foreground/40 md:text-primary-foreground/30 text-[9px] md:text-[10px] tracking-[3px] uppercase transform-gpu will-change-transform" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.45s both' }}>
        {hero.scrollEn ?? 'Scroll'}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.7s both' }} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-accent/40" />
    </section>
  );
}
