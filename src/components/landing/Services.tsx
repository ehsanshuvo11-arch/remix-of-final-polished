import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Check, Clock, TrendingUp, Palette, ShoppingBag, Zap, ChevronDown, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
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

/**
 * Service-level details layered on top of each CMS pricing tier.
 * Keyed by tier id so Services + Pricing live in ONE section:
 * "what we do" and "what it costs" are read together, never twice.
 */
const SERVICE_META: Record<
  string,
  {
    icon: typeof Palette;
    tabEn: string;
    tabBn: string;
    turnaroundEn: string;
    turnaroundBn: string;
    roiEn: string;
    roiBn: string;
  }
> = {
  'trial-pack': {
    icon: Palette,
    tabEn: 'Test Drive',
    tabBn: '৳৩,৯৯৯ ট্রায়াল',
    turnaroundEn: '48 hours',
    turnaroundBn: '৪৮ ঘণ্টা',
    roiEn: 'Avg. −42% cost per result',
    roiBn: 'বিজ্ঞাপন খরচ গড়ে ৪২% কম',
  },
  'growth-pack': {
    icon: ShoppingBag,
    tabEn: 'D2C Growth',
    tabBn: 'D2C গ্রোথ',
    turnaroundEn: 'Monthly sprint',
    turnaroundBn: 'মাসিক স্প্রিন্ট',
    roiEn: '3.2x avg. ROAS lift',
    roiBn: 'গড়ে ৩.২x ROAS বৃদ্ধি',
  },
  'agency-pack': {
    icon: Zap,
    tabEn: 'Agency',
    tabBn: 'এজেন্সি',
    turnaroundEn: '48h SLA',
    turnaroundBn: '৪৮ ঘণ্টা SLA',
    roiEn: 'Scale clients 3x, zero hiring',
    roiBn: 'নিয়োগ ছাড়াই ৩ গুণ ক্লায়েন্ট',
  },
};

const FALLBACK_META = SERVICE_META['trial-pack'];
const bnFont = { fontFamily: "'Noto Serif Bengali', serif" } as const;
const serifFont = { fontFamily: "'Cormorant Garamond', serif" } as const;

const toBnDigits = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

/** Splits "৳32,299 / month" → { amount: "৳32,299", period: "month" } */
function splitPrice(price?: string) {
  if (!price) return { amount: '', period: '' };
  const [amount, period] = price.split('/').map((s) => s.trim());
  return { amount, period: period ?? '' };
}

export default function Services(_props: ServicesProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const { data: cms } = useSiteSetting<PricingContent>('pricing');

  const content: PricingContent = { ...DEFAULT_PRICING, ...(cms ?? {}) };
  const tiers: PricingTier[] = content.tiers && content.tiers.length > 0 ? content.tiers : DEFAULT_PRICING.tiers!;

  const [activeTier, setActiveTier] = useState(0);

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
      className="relative bg-[#f9fafb] text-primary border-y border-primary/10 scroll-mt-20"
    >
      {/* Legacy anchors so any #pricing / #investment link still lands here */}
      <span id="pricing" className="absolute -top-20" aria-hidden="true" />
      <span id="investment" className="absolute -top-20" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-14 py-14 md:py-28">
        {/* ── Header ── */}
        <header className="max-w-[820px] mb-8 md:mb-14">
          <MotionReveal>
            <p
              className={`text-accent font-semibold mb-4 ${isBn ? 'text-[14px] tracking-normal' : 'text-[10px] tracking-[4px] uppercase'}`}
              style={isBn ? bnFont : undefined}
            >
              {isBn ? 'সার্ভিস ও প্রাইসিং' : 'Services & Pricing'}
            </p>
          </MotionReveal>

          <h2
            id="services-pricing-heading"
            className={`font-normal text-primary leading-[1.12] tracking-tight mb-4 ${
              isBn ? 'text-[26px] sm:text-4xl md:text-[46px]' : 'text-[32px] sm:text-5xl md:text-[58px]'
            }`}
            style={isBn ? bnFont : serifFont}
          >
            {isBn ? (
              <>
                পারফরম্যান্স ক্রিয়েটিভ সিস্টেম।
                <br />
                <em className="italic text-accent">বিক্রি বাড়াতে তৈরি, স্বচ্ছ দামে।</em>
              </>
            ) : (
              <>
                Performance Creative Systems.
                <br />
                <em className="italic text-accent">Engineered to scale. Priced transparently.</em>
              </>
            )}
          </h2>

          <p
            className="text-primary/65 text-[14px] md:text-[16px] leading-relaxed"
            style={isBn ? bnFont : undefined}
          >
            {isBn
              ? '৩টি নির্দিষ্ট স্প্রিন্ট—স্পষ্ট ডেলিভারেবলস, নির্ধারিত দাম, পরিমাপযোগ্য ফলাফল। কোনো লুকানো খরচ নেই।'
              : 'Three focused sprints — clear deliverables, fixed prices, measurable ROI. No hourly billing, no hidden fees.'}
          </p>
        </header>

        {/* ── MOBILE: segmented switcher + one focused card ── */}
        <div className="md:hidden">
          <div
            role="tablist"
            aria-label={isBn ? 'প্যাকেজ নির্বাচন করুন' : 'Choose a package'}
            className="grid grid-cols-3 gap-1 p-1 rounded-full bg-primary/[0.06] mb-5"
          >
            {tiers.map((tier, idx) => {
              const meta = SERVICE_META[tier.id] ?? FALLBACK_META;
              const active = activeTier === idx;
              return (
                <button
                  key={tier.id}
                  id={`services-tab-${tier.id}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setActiveTier(idx)}
                  className={`relative h-10 rounded-full text-[12px] font-semibold transition-colors duration-300 ${
                    active ? 'text-white' : 'text-primary/60'
                  }`}
                  style={isBn ? bnFont : undefined}
                >
                  {active && (
                    <m.span
                      layoutId="services-tab-pill"
                      className="absolute inset-0 rounded-full bg-primary shadow-sm"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 truncate px-1">{isBn ? meta.tabBn : meta.tabEn}</span>
                  {tier.featured && !active && (
                    <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 rounded-full bg-accent z-10" />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {tiers[activeTier] && (
              <m.div
                key={`${tiers[activeTier].id}-${lang}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceCard tier={tiers[activeTier]} isBn={isBn} compact onBook={() => bookTier(tiers[activeTier])} />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── DESKTOP: 3 columns with middle featured card ── */}
        <div className={`hidden md:grid gap-6 lg:gap-7 items-start ${tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {tiers.map((tier, idx) => (
            <MotionReveal key={tier.id} delay={0.08 * (idx + 1)} className="h-full">
              <ServiceCard tier={tier} isBn={isBn} compact onBook={() => bookTier(tier)} />
            </MotionReveal>
          ))}
        </div>

        {/* ── Reassurance + secondary paths (quiet, single line) ── */}
        <MotionReveal delay={0.15}>
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 pt-6 md:pt-8 border-t border-primary/10">
            <ul
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-6 text-[12.5px] md:text-[13px] text-primary/65"
              style={isBn ? bnFont : undefined}
            >
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                {isBn ? 'বিকাশ, নগদ ও ব্যাংক ট্রান্সফার' : 'bKash, Nagad & bank transfer'}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                {isBn ? 'সন্তুষ্ট না হওয়া পর্যন্ত ফ্রি রিভিশন' : 'Free revisions until approved'}
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]" style={isBn ? bnFont : undefined}>
              <button
                id="services-custom-quote"
                type="button"
                onClick={requestCustomQuote}
                className="group inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent transition-colors"
              >
                {isBn ? content.customCtaBn || 'কাস্টম কোটেশন নিন' : content.customCtaEn || 'Request a custom quote'}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <span className="hidden sm:block w-px h-4 bg-primary/15" aria-hidden />
              <button
                id="services-free-audit"
                type="button"
                onClick={() => openAuditModal({ source: 'Services & Pricing' })}
                className="inline-flex items-center gap-1.5 text-primary/60 hover:text-accent transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {isBn ? 'ফ্রি ৫-মিনিট অডিট' : 'Free 5-min audit'}
              </button>
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
  compact = false,
  onBook,
}: {
  tier: PricingTier;
  isBn: boolean;
  compact?: boolean;
  onBook: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = SERVICE_META[tier.id] ?? FALLBACK_META;
  const Icon = meta.icon;
  const featured = !!tier.featured;

  const { amount, period } = splitPrice(isBn ? tier.price_bn ?? tier.price_en : tier.price_en ?? tier.price_bn);
  const deliverables = (isBn ? tier.deliverables_bn : tier.deliverables_en) ?? [];
  const visibleCount = compact && !expanded ? 3 : deliverables.length;
  const hiddenCount = deliverables.length - visibleCount;

  // Featured card is inverted (navy) — creates clear visual depth without 3D gimmicks.
  const tone = featured
    ? {
        card: 'bg-primary text-white border-primary/40 shadow-[0_20px_50px_-15px_rgba(30,58,138,0.45)] md:scale-[1.02] md:z-10',
        muted: 'text-white/70',
        soft: 'text-white/90',
        divider: 'border-white/15',
        chip: 'bg-white/10 text-white/90',
        iconBox: 'bg-accent text-white shadow-sm',
      }
    : {
        card: 'bg-white text-primary border-primary/15 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.06)] hover:border-primary/30 hover:shadow-[0_14px_36px_-12px_rgba(30,58,138,0.15)]',
        muted: 'text-primary/60',
        soft: 'text-primary/85',
        divider: 'border-primary/10',
        chip: 'bg-primary/[0.05] text-primary/75',
        iconBox: 'bg-primary/[0.06] text-primary',
      };

  return (
    <article
      data-service-card={tier.id}
      className={`relative h-full flex flex-col rounded-2xl border p-5 md:p-6 transition-all duration-300 ${tone.card} md:hover:-translate-y-1`}
    >
      {featured && (
        <span
          className="absolute -top-3 left-6 px-3.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold tracking-[1.5px] uppercase shadow-sm"
          style={isBn ? { ...bnFont, letterSpacing: 0 } : undefined}
        >
          {isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most popular'}
        </span>
      )}

      {/* Top row: icon + turnaround */}
      <div className="flex items-center justify-between mb-4">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone.iconBox}`}>
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${tone.chip}`}
          style={isBn ? bnFont : undefined}
        >
          <Clock className="w-3 h-3 text-accent" />
          {isBn ? meta.turnaroundBn : meta.turnaroundEn}
        </span>
      </div>

      {/* Who + what */}
      <p
        className={`text-[10.5px] font-semibold mb-1 ${featured ? 'text-accent' : tone.muted} ${isBn ? '' : 'uppercase tracking-[1.5px]'}`}
        style={isBn ? bnFont : undefined}
      >
        {isBn ? tier.target_bn : tier.target_en}
      </p>
      <h3
        className={`leading-tight mb-3.5 ${isBn ? 'text-[20px] font-semibold' : 'text-[24px] md:text-[25px] font-medium'}`}
        style={isBn ? bnFont : serifFont}
      >
        {isBn ? tier.title_bn : tier.title_en}
      </h3>

      {/* Price */}
      {amount && (
        <div className={`flex items-baseline gap-1.5 pb-3.5 mb-3.5 border-b ${tone.divider}`}>
          <span className="text-[32px] md:text-[36px] font-bold tracking-tight leading-none font-sans">
            {amount.startsWith('৳') ? (
              <>
                <span className="text-[0.55em] font-semibold align-[0.55em] mr-0.5 opacity-70">৳</span>
                {amount.slice(1)}
              </>
            ) : (
              amount
            )}
          </span>
          {period && (
            <span className={`text-[12.5px] ${tone.muted}`} style={isBn ? bnFont : undefined}>
              / {period}
            </span>
          )}
        </div>
      )}

      {/* One-line value statement */}
      <p className={`text-[13px] leading-relaxed mb-3.5 ${tone.muted}`} style={isBn ? bnFont : undefined}>
        {isBn ? tier.desc_bn : tier.desc_en}
      </p>

      {/* Deliverables */}
      <ul className="space-y-2 mb-1 flex-grow">
        {deliverables.slice(0, visibleCount).map((item, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-[12.5px] leading-snug ${tone.soft}`}
            style={isBn ? bnFont : undefined}
          >
            <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-[2px]" strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {compact && deliverables.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={`self-start inline-flex items-center gap-1 text-[11.5px] font-semibold mt-1 mb-1.5 cursor-pointer ${featured ? 'text-accent hover:underline' : 'text-primary/70 hover:text-primary'}`}
          style={isBn ? bnFont : undefined}
        >
          {expanded ? (isBn ? 'কম দেখুন' : 'Show less') : isBn ? `আরও ${toBnDigits(hiddenCount)}টি দেখুন` : `+${hiddenCount} more`}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* ROI outcome */}
      <div
        className={`flex items-center gap-1.5 text-[11.5px] font-medium mt-3 mb-4 text-accent`}
        style={isBn ? bnFont : undefined}
      >
        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
        {isBn ? meta.roiBn : meta.roiEn}
      </div>

      {/* Single CTA */}
      <button
        id={`services-book-${tier.id}`}
        type="button"
        onClick={onBook}
        className={`w-full h-11 rounded-full inline-flex items-center justify-center gap-2 text-[12.5px] font-semibold transition-all duration-300 active:scale-[0.98] cursor-pointer ${
          featured
            ? 'bg-accent text-white hover:brightness-105 shadow-[0_6px_20px_-6px_rgba(251,146,60,0.55)]'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
        style={isBn ? bnFont : undefined}
      >
        {isBn ? tier.cta_bn : tier.cta_en}
        <ArrowRight className="w-4 h-4" />
      </button>
    </article>
  );
}
