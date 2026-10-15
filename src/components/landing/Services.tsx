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
  'test-drive': {
    prefixEn: '01 / TEST PACK',
    prefixBn: '০১ / টেস্ট প্যাক',
    turnaroundEn: 'Ready in 48–72h',
    turnaroundBn: '৪৮–৭২ ঘণ্টায় রেডি',
    roiEn: '⚡ 2–3 orders recoup the entire cost',
    roiBn: '⚡ ২–৩টি অর্ডার এলেই এই খরচ উঠে আসে',
  },
  'monthly-partner': {
    prefixEn: '02 / MONTHLY PARTNER',
    prefixBn: '০২ / মাসিক পার্টনার',
    turnaroundEn: '48h Delivery',
    turnaroundBn: '৪৮ ঘণ্টায় ডেলিভারি',
    roiEn: "★ Designer salary replacement (৳9,999/mo)",
    roiBn: "★ ২০–২৫ হাজার টাকার ডিজাইনারের বদলে মাত্র ৳৯,৯৯৯/মাস",
  },
  'campaign-pack': {
    prefixEn: '03 / 4-AD PACK',
    prefixBn: '০৩ / বড় প্যাক',
    turnaroundEn: 'One-Time',
    turnaroundBn: 'এককালীন',
    roiEn: '💡 Add just ৳2,000 for 8 ads all month!',
    roiBn: '💡 মাত্র ৳২,০০০ বাড়ালেই পুরো মাসের ৮টি বিজ্ঞাপন!',
  },
  // Backward compatibility fallbacks
  'pkg-01': {
    prefixEn: '01 / TEST PACK',
    prefixBn: '০১ / টেস্ট প্যাক',
    turnaroundEn: 'Ready in 48–72h',
    turnaroundBn: '৪৮–৭২ ঘণ্টায় রেডি',
    roiEn: '⚡ 2–3 orders recoup the entire cost',
    roiBn: '⚡ ২–৩টি অর্ডার এলেই এই খরচ উঠে আসে',
  },
  'pkg-02': {
    prefixEn: '02 / MONTHLY PARTNER',
    prefixBn: '০২ / মাসিক পার্টনার',
    turnaroundEn: '48h Delivery',
    turnaroundBn: '৪৮ ঘণ্টায় ডেলিভারি',
    roiEn: "★ Designer salary replacement (৳9,999/mo)",
    roiBn: "★ ২০–২৫ হাজার টাকার ডিজাইনারের বদলে মাত্র ৳৯,৯৯৯/মাস",
  },
  'pkg-03': {
    prefixEn: '03 / 4-AD PACK',
    prefixBn: '০৩ / বড় প্যাক',
    turnaroundEn: 'One-Time',
    turnaroundBn: 'এককালীন',
    roiEn: '💡 Add just ৳2,000 for 8 ads all month!',
    roiBn: '💡 মাত্র ৳২,০০০ বাড়ালেই পুরো মাসের ৮টি বিজ্ঞাপন!',
  },
  'trial-pack': {
    prefixEn: '01 / TEST PACK',
    prefixBn: '০১ / টেস্ট প্যাক',
    turnaroundEn: 'Ready in 48–72h',
    turnaroundBn: '৪৮–৭২ ঘণ্টায় রেডি',
    roiEn: '⚡ 2–3 orders recoup the entire cost',
    roiBn: '⚡ ২–৩টি অর্ডার এলেই এই খরচ উঠে আসে',
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

  // Playbook 3 Tiers (Test Drive, Monthly Partner, Campaign Pack)
  const displayTiers = tiers;

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
        <header className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <MotionReveal>
            <div className="eyebrow-pill-kicker inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/5 border border-primary/10 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>TRANSPARENT INVESTMENT</span>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <h2
              id="services-pricing-heading"
              className="section-heading-h2 mx-auto tracking-tight text-primary mb-3.5 font-normal"
              style={serifFont}
            >
              Simple, Clear <em className="italic text-accent">Packages.</em>
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <p
              className="section-lead-subtitle mx-auto text-primary/85"
              style={{ ...bnFont, lineHeight: 1.85 }}
            >
              মাত্র ২–৩টি অতিরিক্ত অর্ডার এলেই আপনার টেস্ট প্যাকের পুরো খরচ উঠে আসে।
            </p>
          </MotionReveal>
        </header>

        {/* ── MOBILE: Horizontal Snap Carousel with Card Peek (<768px) ── */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 pb-4 pt-2 px-4 -mx-4 touch-pan-x"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displayTiers.map((tier) => (
              <div
                key={tier.id}
                className="w-[85vw] max-w-[340px] shrink-0 snap-start flex flex-col"
              >
                <ServiceCard tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
              </div>
            ))}
          </div>

          {/* Micro Indicator Dots (<768px) */}
          <div className="flex items-center justify-center gap-1.5 mt-2 mb-1" aria-label="Pricing package pagination">
            {displayTiers.map((tier, idx) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => scrollToMobileCard(idx)}
                className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
                  activeMobileIdx === idx
                    ? 'w-5 bg-accent shadow-[0_0_8px_rgba(251,146,60,0.5)]'
                    : 'w-1.5 bg-primary/25 hover:bg-primary/40'
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
              className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2.5 gap-x-6 text-[12.5px] text-primary/75 font-medium"
              style={isBn ? bnFont : undefined}
            >
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{isBn ? '💳 বিকাশ, নগদ ও ব্যাংক' : '💳 bKash, Nagad & Bank'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{isBn ? '⚡ ৪৮–৭২ ঘণ্টায় দ্রুত ডেলিভারি' : '⚡ 48–72h Delivery'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{isBn ? '🔄 ২ বার পরিবর্তনের সুযোগ' : '🔄 Up to 2 Rounds of Minor Refinements'}</span>
              </li>
            </ul>

            <a
              id="services-free-audit"
              href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20Skincare%2FBeauty%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A6%BF%E0%A6%82%20%E0%A6%85%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%B0%20%E0%A6%9C%E0%A6%A8%E0%A7%8D%E0%A6%AF%20Free%205-Min%20Video%20Audit%20%E0%A6%AA%E0%A7%87%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary/75 hover:text-accent transition-colors font-semibold text-[12.5px] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? '💬 ফ্রি ৫-মিনিট ভিডিও রিভিউ চান?' : '💬 Want a free 5-min review?'}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </a>
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
  const previewCount = 4;
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
      className={`relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-5 sm:p-7 md:p-7.5 transition-all duration-300 ${tone.card}`}
    >
      {featured ? (
        <span
          className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-accent text-[#1e3a8a] text-[10px] sm:text-[10.5px] font-extrabold tracking-[1px] uppercase shadow-md flex items-center gap-1.5"
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          {isBn
            ? (tier.badge_bn || '⭐ MOST POPULAR • 50% LESS THAN A DESIGNER')
            : (tier.badge_en || '⭐ MOST POPULAR • 50% LESS THAN A DESIGNER')}
        </span>
      ) : tier.badge_bn ? (
        <span
          className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase border border-primary/15"
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          {isBn ? tier.badge_bn : tier.badge_en}
        </span>
      ) : null}

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
          className={`card-title-h3 leading-tight mb-2.5 ${isBn ? 'font-bold' : 'font-normal'}`}
          style={isBn ? bnFont : serifFont}
        >
          {isBn ? tier.title_bn : tier.title_en}
        </h3>

        {/* Concession Pill (if applicable) */}
        {(tier.concession_bn || tier.concession_en) && (
          <div className="mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-semibold">
            <span>{isBn ? tier.concession_bn : tier.concession_en}</span>
          </div>
        )}

        {/* Price Row */}
        {amount && (
          <div className={`flex items-baseline gap-2 pb-3.5 mb-3.5 border-b ${tone.divider}`}>
            <span className={`text-[32px] sm:text-[38px] font-bold tracking-tight leading-none font-sans ${featured ? 'text-[#fb923c]' : 'text-accent'}`}>
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
                {isBn ? 'এককালীন' : 'One-Time'}
              </span>
            )}
          </div>
        )}

        {/* Value Proposition Description */}
        <p className={`card-body-text mb-4 ${tone.muted}`} style={isBn ? bnFont : undefined}>
          {isBn ? tier.desc_bn : tier.desc_en}
        </p>

        {/* Deliverables Checklist: 4 Core Items */}
        <div className="mb-4">
          <ul className="space-y-2.5">
            {initialItems.map((item, i) => (
              <li
                key={i}
                className={`pricing-bullet-text flex items-start gap-2.5 ${tone.soft}`}
                style={isBn ? bnFont : undefined}
              >
                <div className="w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Smooth Collapsible remaining items (if > 4) */}
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
                    className={`pricing-bullet-text flex items-start gap-2.5 ${tone.soft}`}
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
        <m.button
          id={`services-book-${tier.id}`}
          type="button"
          onClick={onBook}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`w-full min-h-[44px] sm:min-h-[48px] h-11 sm:h-12 rounded-xl inline-flex items-center justify-center gap-2 text-[12.5px] sm:text-[13px] uppercase tracking-wider transition-colors duration-200 cursor-pointer shadow-md btn-shimmer ${
            featured
              ? 'bg-[#fb923c] hover:bg-[#fb923c]/90 text-[#f9fafb] font-extrabold shadow-[0_6px_20px_-6px_rgba(251,146,60,0.6)]'
              : 'bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold shadow-[0_4px_16px_-4px_rgba(30,58,138,0.25)]'
          }`}
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          <span>{isBn ? tier.cta_bn : tier.cta_en}</span>
        </m.button>

        {/* Secondary Sleek Outline WhatsApp CTA */}
        <m.a
          id={`services-wa-${tier.id}`}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`w-full min-h-[40px] sm:min-h-[48px] h-10 sm:h-12 rounded-xl inline-flex items-center justify-center gap-2 text-[12px] sm:text-[12.5px] font-semibold transition-colors ${
            featured
              ? 'border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/10'
              : 'border border-primary/15 text-primary/80 hover:border-primary/35 hover:bg-primary/[0.04]'
          }`}
          style={isBn ? bnFont : undefined}
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>{isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}</span>
        </m.a>
      </div>
    </article>
  );
}




