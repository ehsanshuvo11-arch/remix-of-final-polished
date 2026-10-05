import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Check, Clock, TrendingUp, Palette, ShoppingBag, Zap, ChevronDown, ChevronUp, Sparkles, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
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
    roiEn: '100% bespoke craft, zero templates',
    roiBn: '১০০% কাস্টম ক্রাফট, জিরো টেমপ্লেট',
  },
  'growth-pack': {
    icon: ShoppingBag,
    tabEn: 'D2C Growth',
    tabBn: 'D2C গ্রোথ',
    turnaroundEn: 'Monthly sprint',
    turnaroundBn: 'মাসিক স্প্রিন্ট',
    roiEn: 'Conversion architecture & full testing set',
    roiBn: 'কনভার্শন আর্কিটেকচার ও পূর্ণাঙ্গ টেস্টিং সেট',
  },
  'agency-pack': {
    icon: Zap,
    tabEn: 'Agency',
    tabBn: 'এজেন্সি',
    turnaroundEn: '48h SLA',
    turnaroundBn: '৪৮ ঘণ্টা SLA',
    roiEn: 'Scale client output with zero design hiring',
    roiBn: 'হায়ারিং ছাড়া হোয়াইট-লেবেল ক্রিয়েটিভ স্কেলিং',
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

  const content: PricingContent = DEFAULT_PRICING;
  const tiers: PricingTier[] = DEFAULT_PRICING.tiers!;

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
              {isBn ? 'স্বচ্ছ বিনিয়োগ ও আসল লাভ' : 'Direct Investment & Profit'}
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

          <p
            className="text-primary/65 text-[14px] md:text-[16px] leading-relaxed mb-4"
            style={isBn ? bnFont : undefined}
          >
            {isBn
              ? '৩টি নির্দিষ্ট স্প্রিন্ট—স্পষ্ট ফলাফল, নির্ধারিত বিনিয়োগ, কোনো লুকানো চার্জ নেই। আজই পরীক্ষা করে দেখুন।'
              : 'Three focused sprints — clear deliverables, fixed investment, real sales. No hidden fees. Test our quality today.'}
          </p>

          {/* Top Custom Consultation Badge Link */}
          <div className="flex justify-center">
            <a
              href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20am%20interested%20in%20a%20custom%20branding%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-[12px] font-semibold hover:bg-accent/20 transition-all active:scale-[0.98]"
              style={isBn ? bnFont : undefined}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>{isBn ? 'কাস্টম বাজেটের জন্য সরাসরি কথা বলুন' : 'Need custom scope? Chat directly'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* ── MOBILE: Vertical Stacked Compact Cards ── */}
        <div className="md:hidden space-y-4">
          {tiers.map((tier) => (
            <ServiceCard key={tier.id} tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
          ))}
        </div>

        {/* ── DESKTOP: 3 columns with middle featured card ── */}
        <div className={`hidden md:grid gap-6 lg:gap-7 items-start ${tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {tiers.map((tier, idx) => (
            <MotionReveal key={tier.id} delay={0.08 * (idx + 1)} className="h-full">
              <ServiceCard tier={tier} isBn={isBn} onBook={() => bookTier(tier)} />
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
  onBook,
}: {
  tier: PricingTier;
  isBn: boolean;
  onBook: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = SERVICE_META[tier.id] ?? FALLBACK_META;
  const Icon = meta.icon;
  const featured = !!tier.featured;

  const { amount, period } = splitPrice(isBn ? tier.price_bn ?? tier.price_en : tier.price_en ?? tier.price_bn);
  const deliverables = (isBn ? tier.deliverables_bn : tier.deliverables_en) ?? [];
  const previewCount = 2;
  const initialItems = deliverables.slice(0, previewCount);
  const remainingItems = deliverables.slice(previewCount);

  // WhatsApp prefilled message URL
  const waText = encodeURIComponent(
    isBn
      ? `হ্যালো POLISHED, আমি "${tier.title_bn}" (${tier.price_bn}) প্যাকেজটি নিয়ে সরাসরি কথা বলতে এবং শুরু করতে আগ্রহী।`
      : `Hi POLISHED, I am interested in booking the "${tier.title_en}" (${tier.price_en}) sprint.`
  );
  const waUrl = tier.whatsapp_url || `https://wa.me/8801346288210?text=${waText}`;

  // Featured card is inverted (navy) — creates clear visual depth without 3D gimmicks.
  const tone = featured
    ? {
        card: 'bg-primary text-white border-primary/40 shadow-[0_16px_45px_-12px_rgba(30,58,138,0.4)] md:scale-[1.02] md:z-10 ring-1 ring-accent/30',
        muted: 'text-white/70',
        soft: 'text-white/90',
        divider: 'border-white/15',
        chip: 'bg-white/10 text-white/90',
        iconBox: 'bg-accent text-white shadow-sm',
      }
    : {
        card: 'bg-white text-primary border-primary/15 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.06)] hover:border-primary/30 hover:shadow-[0_14px_36px_-12px_rgba(30,58,138,0.12)]',
        muted: 'text-primary/60',
        soft: 'text-primary/85',
        divider: 'border-primary/10',
        chip: 'bg-primary/[0.05] text-primary/75',
        iconBox: 'bg-primary/[0.06] text-primary',
      };

  return (
    <article
      data-service-card={tier.id}
      className={`relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-4.5 sm:p-6 md:p-7 transition-all duration-300 ${tone.card} md:hover:-translate-y-1 shadow-sm`}
    >
      {featured && (
        <span
          className="absolute -top-3 left-5 sm:left-6 px-3 py-0.5 sm:py-1 rounded-full bg-accent text-white text-[10px] sm:text-[10.5px] font-bold tracking-[1px] uppercase shadow-sm"
          style={isBn ? bnFont : undefined}
        >
          {isBn ? 'সবচেয়ে জনপ্রিয় গ্রোথ প্ল্যান' : 'Most popular growth sprint'}
        </span>
      )}

      <div>
        {/* Top row: icon + turnaround pill */}
        <div className="flex items-center justify-between mb-3">
          <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${tone.iconBox}`}>
            <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={1.75} />
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10.5px] sm:text-[11px] font-semibold ${tone.chip}`}
              style={isBn ? bnFont : undefined}
            >
              <Clock className="w-3 h-3 text-accent" />
              {isBn ? meta.turnaroundBn : meta.turnaroundEn}
            </span>
          </div>
        </div>

        {/* Target persona */}
        <p
          className={`text-[10.5px] sm:text-[11px] font-semibold mb-0.5 ${featured ? 'text-accent' : tone.muted} ${isBn ? '' : 'uppercase tracking-[1.5px]'}`}
          style={isBn ? bnFont : undefined}
        >
          {isBn ? tier.target_bn : tier.target_en}
        </p>

        {/* Title */}
        <h3
          className={`leading-tight mb-2 sm:mb-3 ${isBn ? 'text-[19px] sm:text-[21px] font-bold' : 'text-[22px] sm:text-[24px] md:text-[26px] font-medium'}`}
          style={isBn ? bnFont : serifFont}
        >
          {isBn ? tier.title_bn : tier.title_en}
        </h3>

        {/* Price Tag */}
        {amount && (
          <div className={`flex items-baseline gap-2 pb-3 mb-3 border-b ${tone.divider}`}>
            <span className="text-[30px] sm:text-[36px] font-bold tracking-tight leading-none font-sans text-accent">
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
              <span className={`text-[12px] sm:text-[13px] ${tone.muted}`} style={isBn ? bnFont : undefined}>
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
        <p className={`text-[12.5px] sm:text-[13px] leading-relaxed mb-3 ${tone.muted}`} style={isBn ? bnFont : undefined}>
          {isBn ? tier.desc_bn : tier.desc_en}
        </p>

        {/* Deliverables: Top 2 visible + Collapsible Accordion */}
        <div className="mb-3">
          <ul className="space-y-2">
            {initialItems.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-[12px] sm:text-[12.5px] leading-snug ${tone.soft}`}
                style={isBn ? bnFont : undefined}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-accent" strokeWidth={2.5} />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <AnimatePresence>
            {expanded && remainingItems.length > 0 && (
              <m.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-2 mt-2 pt-2 border-t border-dashed border-primary/10 overflow-hidden"
              >
                {remainingItems.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-[12px] sm:text-[12.5px] leading-snug ${tone.soft}`}
                    style={isBn ? bnFont : undefined}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-accent" strokeWidth={2.5} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </m.ul>
            )}
          </AnimatePresence>

          {remainingItems.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold transition-colors ${
                featured ? 'text-accent hover:text-white' : 'text-primary/70 hover:text-primary'
              }`}
              style={isBn ? bnFont : undefined}
            >
              <span>
                {expanded
                  ? (isBn ? 'সংক্ষিপ্ত করুন' : 'Show less')
                  : (isBn ? `সম্পূর্ণ ${deliverables.length}টি ডেলিভারেবল দেখুন` : `View all ${deliverables.length} deliverables`)}
              </span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* ROI / Craft Spec Highlight */}
        <div
          className="flex items-center gap-2 text-[11px] sm:text-[11.5px] font-semibold mt-2 mb-4 px-2.5 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent"
          style={isBn ? bnFont : undefined}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent" />
          <span>{isBn ? meta.roiBn : meta.roiEn}</span>
        </div>
      </div>

      {/* Conversion Actions Group — WhatsApp First */}
      <div className="space-y-2 pt-1">
        {/* Primary CTA: Direct WhatsApp Order */}
        <a
          id={`services-wa-${tier.id}`}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 sm:h-12 rounded-xl inline-flex items-center justify-center gap-2 text-[13px] font-bold tracking-wide transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-md bg-[#25D366] hover:bg-[#20bd5a] text-white btn-shimmer"
          style={isBn ? bnFont : undefined}
        >
          <MessageCircle className="w-4.5 h-4.5 fill-current" />
          <span>{isBn ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার' : 'Order via WhatsApp'}</span>
        </a>

        {/* Secondary: Web Booking Form */}
        <button
          id={`services-book-${tier.id}`}
          type="button"
          onClick={onBook}
          className={`w-full h-9 rounded-xl inline-flex items-center justify-center gap-1.5 text-[11.5px] font-medium transition-all active:scale-[0.98] cursor-pointer ${
            featured
              ? 'bg-white/10 hover:bg-white/15 text-white/90 border border-white/15'
              : 'bg-primary/5 hover:bg-primary/10 text-primary/80 border border-primary/10'
          }`}
          style={isBn ? bnFont : undefined}
        >
          <span>{isBn ? 'অথবা ওয়েবসাইটে ফরম পূরণ করুন' : 'Or fill website form'}</span>
          <ArrowRight className="w-3 h-3 opacity-70" />
        </button>

        {/* Mini Trust Row */}
        <div className="flex items-center justify-center gap-2 pt-1 text-[10px] sm:text-[10.5px] opacity-80 font-medium">
          <span>💳 বিকাশ / নগদ</span>
          <span>•</span>
          <span>🛡️ ফ্রি রিভিশন</span>
          <span>•</span>
          <span>⚡ ৩-৫ দিনে ডেলিভারি</span>
        </div>
      </div>
    </article>
  );
}

