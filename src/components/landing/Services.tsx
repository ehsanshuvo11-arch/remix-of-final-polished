import { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import { useSiteSetting } from '@/hooks/use-site-content';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { DEFAULT_PRICING } from '@/lib/pricing-defaults';
import type { Service, ServicesMetaContent, PricingContent, PricingTier } from '@/types/database';

interface ServicesProps {
  services: Service[];
  content: ServicesMetaContent | null;
}

const SERVICE_META: Record<
  string,
  {
    prefixEn: string;
    prefixBn: string;
    turnaroundEn: string;
    turnaroundBn: string;
    roiEn: string;
    roiBn: string;
  }
> = {
  // ── TRACK 1: VOLUME ENGINE ──
  'pkg-01': {
    prefixEn: '01 / STARTER PACK',
    prefixBn: '০১ / টেস্ট ড্রাইভ',
    turnaroundEn: '72h Delivery',
    turnaroundBn: '৭২ ঘণ্টা ডেলিভারি',
    roiEn: '৳200/Banner • 100% Bespoke Craft',
    roiBn: '৳২০০/ব্যানার • ১০০% কাস্টম ক্রাফট',
  },
  'pkg-02': {
    prefixEn: '02 / CORE RETAINER ★',
    prefixBn: '০২ / গ্রোথ পার্টনার ★',
    turnaroundEn: 'Weekly Delivery',
    turnaroundBn: 'সাপ্তাহিক ৩টি ব্যানার',
    roiEn: '৳191/Banner • Regular Page Growth',
    roiBn: '৳১৯১/ব্যানার • নিয়মিত পেজ গ্রোথ',
  },
  'pkg-03': {
    prefixEn: '03 / SCALE RETAINER',
    prefixBn: '০৩ / হাই-ভলিউম স্কেল',
    turnaroundEn: '5 Posts / Week',
    turnaroundBn: 'সপ্তাহে ৫টি পোস্ট',
    roiEn: '৳160/Banner • Combo Carousel Included',
    roiBn: '৳১৬০/ব্যানার • কম্বো ক্যারোসেল অন্তর্ভুক্ত',
  },

  // ── TRACK 2: PERFORMANCE AD SPRINT ──
  'pkg-04': {
    prefixEn: '01 / AD RESCUE SPRINT',
    prefixBn: '০১ / অ্যাড রেসকিউ স্প্রিন্ট',
    turnaroundEn: '48h Delivery',
    turnaroundBn: '৪৮ ঘণ্টা ডেলিভারি',
    roiEn: '৳1,000/Ad Set • Slash CPR on ৳60k+ Spend',
    roiBn: '৳১,০০০/অ্যাড সেট • CPR কমানোর জন্য',
  },
  'pkg-05': {
    prefixEn: '02 / CREATIVE PARTNER ★',
    prefixBn: '০২ / ক্রিয়েটিভ পার্টনার ★',
    turnaroundEn: 'Monthly Retainer',
    turnaroundBn: 'মাসিক পার্টনারশিপ',
    roiEn: '৳750/Ad Asset • Scale ৳1.5L-৳3L+ Spend',
    roiBn: '৳৭৫০/অ্যাড অ্যাসেট • ১.৫L-৩L+ স্পেন্ড স্কেলিং',
  },

  // Backward compatibility fallbacks
  'trial-pack': {
    prefixEn: '01 / TRIAL SPRINT',
    prefixBn: '০১ / টেস্ট ড্রাইভ',
    turnaroundEn: '48h Delivery',
    turnaroundBn: '৪৮ ঘণ্টা ডেলিভারি',
    roiEn: '100% bespoke craft, zero templates',
    roiBn: '১০০% কাস্টম ক্রাফট, জিরো টেমপ্লেট',
  },
  'growth-pack': {
    prefixEn: '02 / D2C GROWTH ★',
    prefixBn: '০২ / গ্রোথ পার্টনার ★',
    turnaroundEn: 'Monthly Sprint',
    turnaroundBn: 'মাসিক ডেডিকেটেড স্প্রিন্ট',
    roiEn: 'Engineered for 3x+ ROAS ad scaling',
    roiBn: 'বিজ্ঞাপনে ৩ গুণ+ সেলস স্কেলিংয়ের জন্য তৈরি',
  },
  'agency-pack': {
    prefixEn: '03 / SCALE & AGENCY',
    prefixBn: '০৩ / এজেন্সি হোয়াইট-লেবেল',
    turnaroundEn: '48h Fast SLA',
    turnaroundBn: '৪৮ ঘণ্টা ফাস্ট SLA',
    roiEn: 'Scale client output with zero design hiring',
    roiBn: 'হায়ারিং ছাড়া হোয়াইট-লেবেল ক্রিয়েটিভ স্কেলিং',
  },
};

const FALLBACK_META = {
  prefixEn: 'SPRINT TIER',
  prefixBn: 'স্প্রিন্ট প্যাকেজ',
  turnaroundEn: '3-5 days',
  turnaroundBn: '৩-৫ দিন',
  roiEn: 'Guaranteed performance lift',
  roiBn: 'পারফরম্যান্স নিশ্চিত বৃদ্ধির নিশ্চয়তা',
};

const bnFont = { fontFamily: "'Noto Serif Bengali', serif" } as const;
const serifFont = { fontFamily: "'Cormorant Garamond', serif" } as const;

function splitPrice(raw?: string): { amount: string; period: string | null } {
  if (!raw) return { amount: '', period: null };
  const parts = raw.split('/');
  return {
    amount: parts[0]?.trim() || '',
    period: parts[1]?.trim() || null,
  };
}

export default function Services(_props: ServicesProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const { data: pricingData } = useSiteSetting<PricingContent>('pricing_content', DEFAULT_PRICING);
  const content = pricingData || DEFAULT_PRICING;
  const tiers = (content.tiers && content.tiers.length > 0 ? content.tiers : DEFAULT_PRICING.tiers) || [];

  // Track switcher state: 'volume' (Track 1) vs 'performance' (Track 2)
  const [activeTrack, setActiveTrack] = useState<'volume' | 'performance'>('volume');

  // Segregate tiers by track (with backward compatibility)
  const volumeTiers = tiers.filter(
    (t) => t.track === 'volume' || t.id.startsWith('pkg-01') || t.id.startsWith('pkg-02') || t.id.startsWith('pkg-03') || t.id === 'trial-pack'
  );
  const performanceTiers = tiers.filter(
    (t) => t.track === 'performance' || t.id.startsWith('pkg-04') || t.id.startsWith('pkg-05') || t.id === 'growth-pack' || t.id === 'agency-pack'
  );

  const displayTiers = activeTrack === 'volume'
    ? (volumeTiers.length > 0 ? volumeTiers : tiers)
    : (performanceTiers.length > 0 ? performanceTiers : tiers);

  // If no pricing tiers exist, hide section
  if (tiers.length === 0) {
    return null;
  }

  // Mobile Carousel state & high-performance scroll tracking
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Desktop click-and-pull drag scrolling (mouse only, never interferes with touch)
  useDragScroll(carouselRef);

  // High-performance native passive scroll listener with requestAnimationFrame
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        // Determine the card that best aligns with the left scroll padding (20px)
        const scrollOffset = el.scrollLeft + 20;
        let nearest = 0;
        let minDiff = Infinity;

        Array.from(el.children).forEach((child, i) => {
          const c = child as HTMLElement;
          const diff = Math.abs(c.offsetLeft - scrollOffset);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = i;
          }
        });

        setActiveMobileIdx((prev) => (prev === nearest ? prev : nearest));
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [displayTiers.length]);

  const scrollToMobileCard = (idx: number, smooth: boolean = true) => {
    if (!carouselRef.current) return;
    const cardEl = carouselRef.current.children[idx] as HTMLElement;
    if (cardEl) {
      const targetLeft = Math.max(0, cardEl.offsetLeft - 20);
      carouselRef.current.scrollTo({
        left: targetLeft,
        behavior: smooth ? 'smooth' : 'auto',
      });
      setActiveMobileIdx(idx);
    }
  };

  // Reset scroll to first card smoothly on track switch
  useEffect(() => {
    if (carouselRef.current && displayTiers.length > 0) {
      scrollToMobileCard(0, false);
    }
  }, [activeTrack]);

  const bookTier = (tier: PricingTier) => {
    const meta = SERVICE_META[tier.id] ?? FALLBACK_META;
    openQuickBookingModal({
      tierId: tier.id,
      tierTitle: tier.title_en,
      tierTitleBn: tier.title_bn,
      price: tier.price_en,
      priceBn: tier.price_bn,
      delivery: meta.turnaroundEn,
      deliveryBn: meta.turnaroundBn,
      deliverables: tier.deliverables_en,
      deliverablesBn: tier.deliverables_bn,
      source: `Services & Pricing: ${tier.title_en}`,
    });
  };

  const requestCustomQuote = () =>
    openQuickBookingModal({
      tierId: 'bespoke',
      tierTitle: 'Custom Bespoke Visual Partnership',
      tierTitleBn: 'কাস্টম বেসপোক ভিজ্যুয়াল পার্টনারশিপ',
      price: 'Custom Quote',
      priceBn: 'আলোচনা সাপেক্ষে',
      source: 'Services & Pricing: Custom Quote',
    });

  return (
    <section
      id="services"
      aria-labelledby="services-pricing-heading"
      className="relative py-16 sm:py-20 md:py-24 bg-[#f9fafb] text-primary border-y border-primary/10 overflow-hidden"
    >
      <span id="pricing" className="absolute -top-20" aria-hidden="true" />
      <span id="investment" className="absolute -top-20" aria-hidden="true" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <header className="max-w-2xl mx-auto text-center mb-8 sm:mb-10">
          <MotionReveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/5 border border-primary/10 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span
                className="text-[11px] uppercase tracking-[2px] font-bold text-primary/80"
                style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
              >
                {isBn ? 'ডুয়াল-ট্র্যাক প্রাইসিং • নো-রেজিস্ট্যান্স অফার' : 'Dual-Track Investment • Fixed Deliverables'}
              </span>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <h2
              id="services-pricing-heading"
              className={`tracking-tight text-primary leading-[1.14] mb-3.5 ${
                isBn ? 'text-[28px] sm:text-[36px] md:text-[44px] font-bold' : 'text-[32px] sm:text-[42px] md:text-[50px] font-normal'
              }`}
              style={isBn ? bnFont : serifFont}
            >
              {isBn ? (
                <>
                  বিজ্ঞাপনে আর লস নয়।{' '}
                  <em className="italic text-accent">আসল সেলস আনার সিস্টেমে আসুন।</em>
                </>
              ) : (
                <>
                  Stop Guessing on Ads.{' '}
                  <em className="italic text-accent">Pay for creatives that actually convert.</em>
                </>
              )}
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <p
              className="text-primary/70 text-[14px] md:text-[15.5px] leading-relaxed max-w-xl mx-auto"
              style={isBn ? bnFont : undefined}
            >
              {isBn
                ? (activeTrack === 'volume'
                    ? 'ছোট ও মাঝারি ব্র্যান্ডের জন্য ৩টি নির্দিষ্ট ভলিউম প্যাক—জিরো-ঝুঁকি টেস্ট অফার থেকে রেগুলার মান্থলি রিটেইনার।'
                    : 'মেটা বিজ্ঞাপনে স্কেলিং ও কম খরচে বেশি সেলস আনতে ২টি হাই-আরওআই পারফরম্যান্স অ্যাড স্প্রিন্ট।')
                : (activeTrack === 'volume'
                    ? 'Three volume-focused sprints — from zero-risk starter test to predictable monthly organic growth.'
                    : 'Two high-impact performance ad sprints engineered to eliminate fatigue and cut CPR on Meta.')}
            </p>
          </MotionReveal>
        </header>

        {/* ── ULTRA-MINIMAL DUAL-TRACK SEGMENTED SWITCHER ── */}
        <MotionReveal delay={0.12}>
          <div className="flex justify-center mb-10 sm:mb-12">
            <div className="inline-flex items-center p-1 rounded-full bg-white border border-primary/10 shadow-[0_2px_12px_rgba(30,58,138,0.04)]">
              <button
                type="button"
                onClick={() => setActiveTrack('volume')}
                className={`px-4 sm:px-5 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeTrack === 'volume'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-primary/65 hover:text-primary hover:bg-primary/[0.04]'
                }`}
                style={isBn ? bnFont : undefined}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeTrack === 'volume' ? 'bg-accent' : 'bg-primary/30'}`} />
                <span>{isBn ? 'এফ-কমার্স ভলিউম প্যাক (৩টি)' : 'E-Commerce Volume Engine (3)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTrack('performance')}
                className={`px-4 sm:px-5 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeTrack === 'performance'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-primary/65 hover:text-primary hover:bg-primary/[0.04]'
                }`}
                style={isBn ? bnFont : undefined}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeTrack === 'performance' ? 'bg-accent' : 'bg-primary/30'}`} />
                <span>{isBn ? 'মেটা পারফরম্যান্স অ্যাড (২টি)' : 'Meta Performance Ads (2)'}</span>
              </button>
            </div>
          </div>
        </MotionReveal>

        {/* ── MOBILE: Ultra-Smooth Swipeable Cards ── */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory px-5 py-2.5 scrollbar-none -mx-5 overscroll-x-contain touch-auto cursor-grab active:cursor-grabbing select-none"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              scrollPaddingLeft: '1.25rem',
              scrollPaddingRight: '1.25rem',
              scrollBehavior: 'smooth',
            }}
          >
            {displayTiers.map((tier) => (
              <div
                key={tier.id}
                className="w-[84vw] max-w-[335px] snap-start shrink-0"
                style={{ scrollSnapStop: 'normal' }}
              >
                <ServiceCard tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
              </div>
            ))}
          </div>

          {/* Understated Minimal Dot Indicators in Brand Orange */}
          <div className="flex justify-center items-center gap-1.5 mt-2.5 mb-1.5">
            {displayTiers.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToMobileCard(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeMobileIdx === idx ? 'w-4 bg-accent' : 'w-1 bg-accent/30 hover:bg-accent/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP: Balanced Editorial Columns (Linear / Vercel Proportions) ── */}
        <div
          className={`hidden md:grid gap-6 lg:gap-7 items-stretch ${
            displayTiers.length === 2
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : displayTiers.length === 1
              ? 'md:grid-cols-1 max-w-md mx-auto'
              : 'md:grid-cols-3'
          }`}
        >
          {displayTiers.map((tier, idx) => (
            <MotionReveal key={tier.id} delay={0.08 * (idx + 1)} className="h-full">
              <ServiceCard tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
            </MotionReveal>
          ))}
        </div>

        {/* ── BESPOKE / CUSTOM PRICING BANNER (Vercel Enterprise Style) ── */}
        <MotionReveal delay={0.15}>
          <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-primary/15 bg-white/80 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:border-primary/25 transition-all">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'বেসপোক পার্টনারশিপ' : 'Bespoke Visual Partnership'}</span>
              </div>
              <h3
                className={`text-[20px] sm:text-[23px] text-primary font-bold mb-1.5 leading-snug`}
                style={isBn ? bnFont : serifFont}
              >
                {isBn
                  ? 'আপনার ব্র্যান্ডের কি কাস্টম স্কেল বা বিশেষ রিটেইনার প্রয়োজন?'
                  : 'Need custom creative volume or dedicated retainers?'}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-primary/70 leading-relaxed" style={isBn ? bnFont : undefined}>
                {isBn
                  ? 'নির্দিষ্ট মাসিক ভলিউম, হোয়াইট-লেবেল এজেন্সি স্কেলিং বা ফুল-ফানেল আর্কিটেকচারের জন্য সরাসরি কাস্টম কোট নিন।'
                  : 'Custom creative volume, white-label scaling, or full-funnel revamp tailored specifically for your brand goals.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <button
                id="services-custom-quote"
                type="button"
                onClick={requestCustomQuote}
                className="h-11.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[13px] inline-flex items-center justify-center gap-2 shadow-md btn-shimmer active:scale-[0.98] transition-all cursor-pointer"
                style={isBn ? bnFont : undefined}
              >
                <span>{isBn ? 'কাস্টম কোটেশন নিন' : 'Request Custom Quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20need%20a%20custom%20branding%20%26%20creative%20retainer."
                target="_blank"
                rel="noopener noreferrer"
                className="h-11.5 px-5 rounded-xl border border-primary/20 hover:border-primary/40 text-primary font-semibold text-[12px] inline-flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
                style={isBn ? bnFont : undefined}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </MotionReveal>

        {/* ── Unified Global Reassurance Bar (Minimal & Trust-Building) ── */}
        <MotionReveal delay={0.2}>
          <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <ul
              className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2.5 gap-x-6 text-[12.5px] text-primary/70 font-medium"
              style={isBn ? bnFont : undefined}
            >
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{isBn ? 'বিকাশ, নগদ ও ব্যাংক ট্রান্সফার' : 'bKash, Nagad & Bank Transfer'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{isBn ? 'সন্তুষ্ট না হওয়া পর্যন্ত ১০০% ফ্রি রিভিশন' : '100% Free Revisions Until Approved'}</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{isBn ? 'অফিসিয়াল ইনভয়েস ও চুক্তি' : 'Official Invoice & Agreement'}</span>
              </li>
            </ul>

            <button
              id="services-free-audit"
              type="button"
              onClick={() => openAuditModal({ source: 'Services & Pricing' })}
              className="inline-flex items-center gap-1.5 text-primary/70 hover:text-accent transition-colors font-medium text-[12.5px] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? 'ফ্রি ৫-মিনিট অডিট চান?' : 'Want a free 5-min audit?'}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function ServiceCard({
  tier,
  isBn,
  onBook,
}: {
  tier: PricingTier;
  isBn: boolean;
  onBook: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = SERVICE_META[tier.id] ?? FALLBACK_META;
  const featured = !!tier.featured;

  const { amount, period } = splitPrice(isBn ? tier.price_bn ?? tier.price_en : tier.price_en ?? tier.price_bn);
  const deliverables = (isBn ? tier.deliverables_bn : tier.deliverables_en) ?? [];
  const previewCount = 3;
  const initialItems = deliverables.slice(0, previewCount);
  const remainingItems = deliverables.slice(previewCount);

  // Refined WhatsApp prefilled URL
  const waText = encodeURIComponent(
    isBn
      ? `হ্যালো POLISHED, আমি "${tier.title_bn}" (${tier.price_bn}) প্যাকেজটি নিয়ে কথা বলতে ও শুরু করতে চাই।`
      : `Hi POLISHED, I would like to book the "${tier.title_en}" (${tier.price_en}) sprint.`
  );
  const waUrl = tier.whatsapp_url || `https://wa.me/8801346288210?text=${waText}`;

  // Luxury Editorial Card Tone
  const tone = featured
    ? {
        card: 'bg-primary text-white border-primary shadow-[0_16px_40px_-12px_rgba(30,58,138,0.35)] md:scale-[1.02] md:z-10 ring-1 ring-accent/30',
        prefix: 'text-accent',
        muted: 'text-white/70',
        soft: 'text-white/90',
        divider: 'border-white/15',
        pill: 'bg-white/10 text-white/90 border border-white/15',
        specBg: 'bg-white/5 border border-white/15 text-accent',
      }
    : {
        card: 'bg-white text-primary border-primary/10 shadow-[0_4px_24px_-4px_rgba(30,58,138,0.06)] hover:border-primary/25 hover:shadow-[0_16px_40px_-12px_rgba(30,58,138,0.12)]',
        prefix: 'text-primary/50',
        muted: 'text-primary/65',
        soft: 'text-primary/85',
        divider: 'border-primary/10',
        pill: 'bg-primary/[0.04] text-primary/75 border border-primary/10',
        specBg: 'bg-accent/10 border border-accent/20 text-accent',
      };

  return (
    <article
      data-service-card={tier.id}
      className={`relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-6 sm:p-7 md:p-7.5 transition-all duration-300 ${tone.card}`}
    >
      {featured && (
        <span
          className="absolute -top-3 left-6 px-3.5 py-0.5 sm:py-1 rounded-full bg-accent text-white text-[10px] sm:text-[10.5px] font-bold tracking-[1.5px] uppercase shadow-sm"
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          {isBn ? 'সবচেয়ে জনপ্রিয় গ্রোথ স্প্রিন্ট' : 'Most Popular Growth Sprint'}
        </span>
      )}

      <div>
        {/* Top row: Numbered prefix + SLA Turnaround Pill */}
        <div className="flex items-center justify-between mb-3.5">
          <span
            className={`text-[10.5px] font-bold uppercase tracking-[1.5px] ${tone.prefix}`}
            style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
          >
            {isBn ? meta.prefixBn : meta.prefixEn}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-semibold ${tone.pill}`}
            style={isBn ? bnFont : undefined}
          >
            <Clock className="w-3 h-3 text-accent" />
            <span>{isBn ? meta.turnaroundBn : meta.turnaroundEn}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          className={`leading-tight mb-2.5 ${isBn ? 'text-[21px] sm:text-[23px] font-bold' : 'text-[23px] sm:text-[26px] font-normal'}`}
          style={isBn ? bnFont : serifFont}
        >
          {isBn ? tier.title_bn : tier.title_en}
        </h3>

        {/* Price Row */}
        {amount && (
          <div className={`flex items-baseline gap-2 pb-3.5 mb-3.5 border-b ${tone.divider}`}>
            <span className="text-[32px] sm:text-[38px] font-bold tracking-tight leading-none font-sans text-accent">
              {amount.startsWith('৳') ? (
                <>
                  <span className="text-[0.6em] font-semibold align-[0.45em] mr-0.5 opacity-80">৳</span>
                  {amount.slice(1)}
                </>
              ) : (
                amount
              )}
            </span>
            {period ? (
              <span className={`text-[12.5px] sm:text-[13px] ${tone.muted}`} style={isBn ? bnFont : undefined}>
                / {period}
              </span>
            ) : (
              <span className="text-[10.5px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                {isBn ? 'এককালীন টেস্ট স্প্রিন্ট' : 'One-Time Sprint'}
              </span>
            )}
          </div>
        )}

        {/* Value Proposition Description */}
        <p className={`text-[12.5px] sm:text-[13px] leading-relaxed mb-4 ${tone.muted}`} style={isBn ? bnFont : undefined}>
          {isBn ? tier.desc_bn : tier.desc_en}
        </p>

        {/* Deliverables Checklist: 3 Preview Items + Expandable See More Toggle */}
        <div className="mb-4">
          <ul className="space-y-2.5">
            {initialItems.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-2.5 text-[12.5px] sm:text-[13px] leading-snug ${tone.soft}`}
                style={isBn ? bnFont : undefined}
              >
                <div className="w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Smooth Collapsible remaining items */}
          <AnimatePresence>
            {expanded && remainingItems.length > 0 && (
              <m.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="space-y-2.5 mt-2.5 pt-2.5 border-t border-dashed border-primary/10 overflow-hidden"
              >
                {remainingItems.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2.5 text-[12.5px] sm:text-[13px] leading-snug ${tone.soft}`}
                    style={isBn ? bnFont : undefined}
                  >
                    <div className="w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </m.ul>
            )}
          </AnimatePresence>

          {/* See More Toggle Button */}
          {remainingItems.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold cursor-pointer transition-colors ${
                featured ? 'text-accent hover:text-white' : 'text-primary/70 hover:text-accent'
              }`}
              style={isBn ? bnFont : undefined}
            >
              <span>
                {expanded
                  ? (isBn ? 'সংক্ষিপ্ত করুন' : 'Show less')
                  : (isBn ? `আরও ${remainingItems.length}টি ডেলিভারেবল দেখুন` : `+${remainingItems.length} more deliverables`)}
              </span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* ROI / Craft Spec Highlight */}
        <div
          className={`flex items-center gap-2 text-[11.5px] sm:text-[12px] font-semibold mb-5 px-3 py-2 rounded-xl ${tone.specBg}`}
          style={isBn ? bnFont : undefined}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent" />
          <span>{isBn ? meta.roiBn : meta.roiEn}</span>
        </div>
      </div>

      {/* Conversion Actions Group — Confident Dual CTAs */}
      <div className="space-y-2.5 pt-1">
        {/* Primary Sprint Trigger Button */}
        <button
          id={`services-book-${tier.id}`}
          type="button"
          onClick={onBook}
          className={`w-full h-11.5 sm:h-12 rounded-xl inline-flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-md btn-shimmer ${
            featured
              ? 'bg-accent hover:bg-accent/90 text-white shadow-[0_6px_20px_-6px_rgba(251,146,60,0.6)]'
              : 'bg-primary hover:bg-primary/90 text-white shadow-[0_4px_16px_-4px_rgba(30,58,138,0.25)]'
          }`}
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          <span>{isBn ? tier.cta_bn : tier.cta_en}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Sleek Outline WhatsApp CTA */}
        <a
          id={`services-wa-${tier.id}`}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full h-9.5 rounded-xl inline-flex items-center justify-center gap-2 text-[12px] font-semibold transition-all active:scale-[0.98] ${
            featured
              ? 'border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/10'
              : 'border border-primary/15 text-primary/80 hover:border-primary/35 hover:bg-primary/[0.04]'
          }`}
          style={isBn ? bnFont : undefined}
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>{isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}</span>
        </a>
      </div>
    </article>
  );
}




