import { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import { useSiteSetting } from '@/hooks/use-site-content';
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
  'trial-pack': {
    prefixEn: '01 / TRIAL SPRINT',
    prefixBn: '০১ / টেস্ট ড্রাইভ',
    turnaroundEn: '48h Delivery',
    turnaroundBn: '৪৮ ঘণ্টার ডেলিভারি',
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
    turnaroundBn: '৪৮ ঘণ্টার ফাস্ট SLA',
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

  // Mobile Carousel state & scroll tracking
  const [activeMobileIdx, setActiveMobileIdx] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleMobileScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, offsetWidth } = carouselRef.current;
    const index = Math.round(scrollLeft / (offsetWidth * 0.88));
    if (index >= 0 && index < tiers.length) {
      setActiveMobileIdx(index);
    }
  };

  const scrollToMobileCard = (idx: number) => {
    if (!carouselRef.current) return;
    const cardEl = carouselRef.current.children[idx] as HTMLElement;
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveMobileIdx(idx);
    }
  };

  // Default scroll to featured card on initial mount
  useEffect(() => {
    if (carouselRef.current && tiers.length > 1) {
      const featuredIndex = tiers.findIndex((t) => t.featured);
      if (featuredIndex !== -1) {
        setTimeout(() => scrollToMobileCard(featuredIndex), 300);
      }
    }
  }, []);

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
      className="relative py-20 sm:py-24 md:py-32 bg-[#faf7f2] text-primary border-y border-primary/10 overflow-hidden"
    >
      <span id="pricing" className="absolute -top-20" aria-hidden="true" />
      <span id="investment" className="absolute -top-20" aria-hidden="true" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <header className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <MotionReveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span
                className="text-[10.5px] sm:text-[11px] uppercase tracking-[2.5px] font-bold text-primary/80"
                style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
              >
                {isBn ? 'স্বচ্ছ বিনিয়োগ • নির্দিষ্ট ফলাফল' : 'Transparent Investment • Fixed Deliverables'}
              </span>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <h2
              id="services-pricing-heading"
              className={`tracking-tight text-primary leading-[1.12] mb-4 ${
                isBn ? 'text-[28px] sm:text-[38px] md:text-[46px] font-bold' : 'text-[34px] sm:text-[44px] md:text-[54px] font-normal'
              }`}
              style={isBn ? bnFont : serifFont}
            >
              {isBn ? (
                <>
                  বিজ্ঞাপনে আর লস নয়।
                  <br />
                  <em className="italic text-accent">আসল সেলস আনার সিস্টেমে আসুন।</em>
                </>
              ) : (
                <>
                  Stop Guessing on Ads.
                  <br />
                  <em className="italic text-accent">Pay for creatives that actually convert.</em>
                </>
              )}
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <p
              className="text-primary/70 text-[14px] md:text-[16px] leading-relaxed max-w-xl mx-auto"
              style={isBn ? bnFont : undefined}
            >
              {isBn
                ? '৩টি নির্দিষ্ট স্প্রিন্ট—স্পষ্ট ফলাফল, নির্ধারিত বাজেট, কোনো লুকানো চার্জ নেই। আজই পরীক্ষা করে দেখুন।'
                : 'Three focused sprints — clear deliverables, fixed investment, real sales. Zero hidden charges.'}
            </p>
          </MotionReveal>
        </header>

        {/* ── MOBILE: Apple-Style Snap Carousel with Peek ── */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 scrollbar-none -mx-5"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="w-[85vw] max-w-[340px] snap-center shrink-0 transition-transform duration-300"
              >
                <ServiceCard tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
              </div>
            ))}
          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex justify-center items-center gap-2 mt-4 mb-2">
            {tiers.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToMobileCard(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeMobileIdx === idx ? 'w-6 bg-accent' : 'w-1.5 bg-primary/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP: 3 Balanced Editorial Columns ── */}
        <div className={`hidden md:grid gap-6 lg:gap-8 items-stretch ${tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {tiers.map((tier, idx) => (
            <MotionReveal key={tier.id} delay={0.08 * (idx + 1)} className="h-full">
              <ServiceCard tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
            </MotionReveal>
          ))}
        </div>

        {/* ── Unified Global Reassurance Bar (Clean, Minimal, Non-Intrusive) ── */}
        <MotionReveal delay={0.15}>
          <div className="mt-12 md:mt-16 pt-8 border-t border-primary/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Trust Badges */}
              <ul
                className="flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-[12.5px] md:text-[13px] text-primary/70 font-medium"
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

              {/* Secondary Actions */}
              <div
                className="flex items-center justify-center lg:justify-end gap-x-5 text-[13px]"
                style={isBn ? bnFont : undefined}
              >
                <button
                  id="services-custom-quote"
                  type="button"
                  onClick={requestCustomQuote}
                  className="group inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent transition-colors"
                >
                  <span>{isBn ? content.customCtaBn || 'কাস্টম কোটেশন নিন' : content.customCtaEn || 'Need a custom scope?'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <span className="w-px h-4 bg-primary/15" aria-hidden />
                <button
                  id="services-free-audit"
                  type="button"
                  onClick={() => openAuditModal({ source: 'Services & Pricing' })}
                  className="inline-flex items-center gap-1.5 text-primary/60 hover:text-accent transition-colors font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>{isBn ? 'ফ্রি ৫-মিনিট অডিট' : 'Free 5-min audit'}</span>
                </button>
              </div>
            </div>
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
  const meta = SERVICE_META[tier.id] ?? FALLBACK_META;
  const featured = !!tier.featured;

  const { amount, period } = splitPrice(isBn ? tier.price_bn ?? tier.price_en : tier.price_en ?? tier.price_bn);
  const deliverables = (isBn ? tier.deliverables_bn : tier.deliverables_en) ?? [];

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
        card: 'bg-primary text-white border-primary shadow-[0_20px_50px_-15px_rgba(30,58,138,0.4)] md:scale-[1.03] md:z-10 ring-1 ring-accent/30',
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
      className={`relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-6 sm:p-7 md:p-8 transition-all duration-300 ${tone.card}`}
    >
      {featured && (
        <span
          className="absolute -top-3 left-6 px-3.5 py-1 rounded-full bg-accent text-white text-[10px] sm:text-[10.5px] font-bold tracking-[1.5px] uppercase shadow-sm"
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          {isBn ? 'সবচেয়ে জনপ্রিয় গ্রোথ স্প্রিন্ট' : 'Most Popular Growth Sprint'}
        </span>
      )}

      <div>
        {/* Top row: Numbered prefix + SLA Turnaround Pill */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-[10.5px] font-bold uppercase tracking-[2px] ${tone.prefix}`}
            style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
          >
            {isBn ? meta.prefixBn : meta.prefixEn}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${tone.pill}`}
            style={isBn ? bnFont : undefined}
          >
            <Clock className="w-3 h-3 text-accent" />
            <span>{isBn ? meta.turnaroundBn : meta.turnaroundEn}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          className={`leading-tight mb-3 ${isBn ? 'text-[22px] sm:text-[24px] font-bold' : 'text-[24px] sm:text-[28px] font-normal'}`}
          style={isBn ? bnFont : serifFont}
        >
          {isBn ? tier.title_bn : tier.title_en}
        </h3>

        {/* Price Row */}
        {amount && (
          <div className={`flex items-baseline gap-2 pb-4 mb-4 border-b ${tone.divider}`}>
            <span className="text-[34px] sm:text-[40px] font-bold tracking-tight leading-none font-sans text-accent">
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
              <span className={`text-[13px] ${tone.muted}`} style={isBn ? bnFont : undefined}>
                / {period}
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                {isBn ? 'এককালীন টেস্ট স্প্রিন্ট' : 'One-Time Sprint'}
              </span>
            )}
          </div>
        )}

        {/* Value Proposition Description */}
        <p className={`text-[13px] leading-relaxed mb-5 ${tone.muted}`} style={isBn ? bnFont : undefined}>
          {isBn ? tier.desc_bn : tier.desc_en}
        </p>

        {/* Deliverables Checklist (Airy & Clean) */}
        <ul className="space-y-3 mb-6">
          {deliverables.map((item, i) => (
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

        {/* ROI / Craft Spec Highlight */}
        <div
          className={`flex items-center gap-2 text-[11.5px] sm:text-[12px] font-semibold mb-6 px-3 py-2 rounded-xl ${tone.specBg}`}
          style={isBn ? bnFont : undefined}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent" />
          <span>{isBn ? meta.roiBn : meta.roiEn}</span>
        </div>
      </div>

      {/* Conversion Actions Group — High Contrast Editorial Dual CTAs */}
      <div className="space-y-2.5 pt-2">
        {/* Primary Sprint Trigger Button */}
        <button
          id={`services-book-${tier.id}`}
          type="button"
          onClick={onBook}
          className={`w-full h-12 rounded-xl inline-flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-md btn-shimmer ${
            featured
              ? 'bg-accent hover:bg-accent/90 text-white shadow-[0_6px_20px_-6px_rgba(251,146,60,0.6)]'
              : 'bg-primary hover:bg-primary/90 text-white shadow-[0_4px_16px_-4px_rgba(30,58,138,0.25)]'
          }`}
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          <span>{isBn ? tier.cta_bn : tier.cta_en}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Sleek Outline WhatsApp CTA (No tacky solid green) */}
        <a
          id={`services-wa-${tier.id}`}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full h-10 rounded-xl inline-flex items-center justify-center gap-2 text-[12px] font-semibold transition-all active:scale-[0.98] ${
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


