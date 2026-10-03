import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { PricingSkeleton } from '@/components/landing/Skeleton';
import { triggerInquiry } from '@/lib/inquiry-events';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import { ArrowRight, Check } from 'lucide-react';
import { useSiteSetting } from '@/hooks/use-site-content';
import { DEFAULT_PRICING } from '@/lib/pricing-defaults';
import type { PricingContent, PricingTier } from '@/types/database';

export default function Pricing({ isLoading = false }: { isLoading?: boolean }) {
  const { lang } = useLanguage();
  const { data: cms } = useSiteSetting<PricingContent>('pricing');

  const content: PricingContent = { ...DEFAULT_PRICING, ...(cms ?? {}) };
  const pricingTiers: PricingTier[] =
    content.tiers && content.tiers.length > 0 ? content.tiers : DEFAULT_PRICING.tiers!;
  const sectionHeader = {
    label_en: content.labelEn ?? '',
    label_bn: content.labelBn ?? '',
    title_en: content.titleEn ?? '',
    title_em_en: content.titleEmEn ?? '',
    title_bn: content.titleBn ?? '',
    title_em_bn: content.titleEmBn ?? '',
  };
  const customContent = {
    heading_en: content.customHeadingEn ?? '',
    heading_bn: content.customHeadingBn ?? '',
    desc_en: content.customDescEn ?? '',
    desc_bn: content.customDescBn ?? '',
    cta_en: content.customCtaEn ?? '',
    cta_bn: content.customCtaBn ?? '',
  };

  const isBn = lang === 'bn';
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const [activeMobileTier, setActiveMobileTier] = useState(0);

  const handleTierClick = (tier: PricingTier) => {
    openQuickBookingModal({
      tierId: tier.id,
      tierTitle: tier.title_en,
      tierTitleBn: tier.title_bn,
      price: tier.price_en,
      priceBn: tier.price_bn,
      delivery: tier.id === 'trial-pack' ? '48-Hour Rapid Delivery' : '7-Day Dedicated Sprint',
      deliveryBn: tier.id === 'trial-pack' ? '৪৮ ঘণ্টায় দ্রুত ডেলিভারি' : '৭ দিনের ডেডিকেটেড স্প্রিন্ট',
      deliverables: tier.features_en,
      deliverablesBn: tier.features_bn,
      source: `Pricing Card: ${tier.title_en}`,
    });
  };

  const handleCustomQuote = () => {
    openQuickBookingModal({
      tierId: 'bespoke',
      tierTitle: 'Custom Bespoke Visual Partnership',
      tierTitleBn: 'কাস্টম বেসপোক ভিজ্যুয়াল পার্টনারশিপ',
      price: 'Custom Quote',
      priceBn: 'আলোচনা সাপেক্ষে',
      delivery: 'Ongoing Monthly Partnership',
      deliveryBn: 'মাসিক ডেডিকেটেড পার্টনারশিপ',
      deliverables: [
        'Dedicated Creative Director & Senior Brand Designer',
        'Unlimited Monthly Meta Ads, Packaging & Landing Page Systems',
        'Real-time private Slack/WhatsApp communication channel',
        'Priority 24-48h turnaround for high-velocity ad scaling',
      ],
      deliverablesBn: [
        'ডেডিকেটেড ক্রিয়েটিভ ডিরেক্টর ও সিনিয়র ব্র্যান্ড ডিজাইনার',
        'আনলিমিটেড মাসিক মেটা অ্যাডস, প্যাকেজিং ও স্টোরফ্রন্ট ভিজ্যুয়াল',
        'রিয়েল-টাইম প্রাইভেট স্ল্যাক/হোয়াটসঅ্যাপ ডিরেক্ট কমিউনিকেশন',
        'দ্রুততম ২৪-৪৮ ঘণ্টার মধ্যে প্রায়োরিটি ডেলিভারি',
      ],
      source: 'Custom Quote CTA',
    });
  };

  return (
    <section id="pricing" className="bg-primary relative scroll-mt-20">
      <div id="investment" className="absolute -top-20" aria-hidden="true" />
      <div className="py-20 md:py-32 px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          {isBn ? (
            <p
              lang="bn"
              className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {sectionHeader.label_bn}
            </p>
          ) : (
            <p
              lang="en"
              style={enFont}
              className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium"
            >
              {sectionHeader.label_en}
            </p>
          )}
        </MotionReveal>

        <h2
          lang={isBn ? 'bn' : 'en'}
          className={`font-heading font-normal text-primary-foreground mb-7 leading-[1.1] ${isBn
              ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]'
              : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'
            }`}
        >
          {isBn ? (
            <>
              <WordReveal delay={0.1}>{sectionHeader.title_bn}</WordReveal>
              <br />
              <em className="italic text-accent">
                <WordReveal delay={0.25}>{sectionHeader.title_em_bn}</WordReveal>
              </em>
            </>
          ) : (
            <>
              <WordReveal delay={0.1}>{sectionHeader.title_en}</WordReveal>
              <br />
              <em className="italic">
                <WordReveal delay={0.25}>{sectionHeader.title_em_en}</WordReveal>
              </em>
            </>
          )}
        </h2>

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <m.div
              key="pricing-skeleton"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <PricingSkeleton />
            </m.div>
          ) : (
            <m.div
              key={`pricing-tiers-${isBn ? 'bn' : 'en'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* MOBILE VIEW: Interactive Tab Switcher & Single High-Impact Active Card */}
              <div className="md:hidden mt-6">
                {/* 3 Tier Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.07] border border-white/12 mb-5">
                  {pricingTiers.map((tier, idx) => {
                    const isActive = activeMobileTier === idx;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setActiveMobileTier(idx)}
                        className={`flex-1 py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                          isActive
                            ? 'bg-accent text-accent-foreground shadow-sm'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <span className="block truncate">
                          {isBn ? (idx === 0 ? '৳৩,৯৯৯ ট্রায়াল' : idx === 1 ? 'গ্রোথ স্প্রিন্ট' : 'এজেন্সি') : tier.title_en.split(' ')[0]}
                        </span>
                        {tier.badge && (
                          <span className="block text-[8.5px] uppercase font-mono tracking-wider opacity-90">
                            ★ {tier.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active Mobile Tier Card */}
                {pricingTiers[activeMobileTier] && (
                  <TierCard
                    tier={pricingTiers[activeMobileTier]}
                    index={activeMobileTier}
                    isBn={isBn}
                    variant="desktop"
                    onCtaClick={() => handleTierClick(pricingTiers[activeMobileTier])}
                  />
                )}
              </div>

              {/* DESKTOP VIEW: Clean 3-Column Grid */}
              <div className={`hidden md:grid md:gap-8 mt-8 md:mt-14 gap-6 ${pricingTiers.length === 2 ? 'md:grid-cols-2 max-w-[940px] mx-auto' : 'md:grid-cols-3'}`}>
                {pricingTiers.map((tier, index) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    index={index}
                    isBn={isBn}
                    variant="desktop"
                    onCtaClick={() => handleTierClick(tier)}
                  />
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Local Payment & Peace of Mind Assurance */}
        <MotionReveal delay={0.2}>
          <div className="mt-8 p-4 md:p-5 rounded-2xl bg-white/[0.05] border border-white/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm text-primary-foreground/85 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-accent text-base">💳</span>
              <span style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
                {isBn ? 'সহজ পেমেন্ট: বিকাশ, নগদ, রকেট ও দেশি ব্যাংক ট্রান্সফার (কোনো ডলার কার্ড লাগে না)' : 'Accepted Payments: bKash, Nagad, Rocket & Local Bank Transfer.'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-base">🛡️</span>
              <span style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
                {isBn ? '১০০% ফ্রি রিভিশন: সম্পূর্ণ সন্তুষ্ট না হওয়া পর্যন্ত ফাইন-টিউনিং' : '100% Satisfaction: Unlimited free fine-tuning until approved.'}
              </span>
            </div>
          </div>
        </MotionReveal>

        <div className="mt-8 md:mt-14">
          <MotionReveal>
            <CustomBanner isBn={isBn} onCtaClick={handleCustomQuote} customContent={customContent} />
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

const TIER_FEATURES: Record<string, { en: string[]; bn: string[] }> = {
  'trial-pack': {
    en: [
      '5 High-Converting Meta Ad Creatives',
      'Psychological Bengali Sales Copywriting',
      'Audience Hook Testing Strategy',
      '48-Hour Rapid Delivery',
      '100% Meta Ad Policy Safe Guarantee',
    ],
    bn: [
      '৫টি হাই-কনভার্টিং মেটা অ্যাড ক্রিয়েটিভ',
      'মনস্তাত্ত্বিক বাংলা সেলস কপিরাইটিং',
      'অডিয়েন্স হুক টেস্টিং স্ট্র্যাটেজি',
      '৪৮ ঘণ্টার দ্রুত ডেলিভারি',
      '১০০% মেটা পলিসি সেফ গ্যারান্টি',
    ],
  },
  'growth-pack': {
    en: [
      '15 High-Converting Feed & Ad Creatives / mo',
      'High-Trust Storefront / PDP Conversion Graphics',
      'Persuasive Bengali Sales Copy for Every Creative',
      'AOV-Maximizing Combo Offer Visuals',
      'Unlimited Minor Revisions & Priority Support',
    ],
    bn: [
      '১৫টি হাই-কনভার্টিং ফিড ও অ্যাড ক্রিয়েটিভ / মাস',
      'হাই-ট্রাস্ট স্টোরফ্রন্ট / PDP কনভার্শন গ্রাফিক্স',
      'প্রতিটি অ্যাডের জন্য মনস্তাত্ত্বিক বাংলা সেলস কপি',
      'AOV বৃদ্ধিকারী কম্বো অফার ভিজ্যুয়াল',
      'আনলিমিটেড মাইনর রিভিশন ও প্রায়োরিটি সাপোর্ট',
    ],
  },
  'agency-pack': {
    en: [
      'Up to 30 White-Label Client Creatives / mo',
      'Strict 48-Hour Rapid Sprint Delivery SLA',
      'White-Label Figma Workspace (Zero POLISHED Branding)',
      'High ROAS Creatives to Maximize Client Retention',
      'Direct WhatsApp / Slack Access with Creative Lead',
    ],
    bn: [
      'মাসে সর্বোচ্চ ৩০টি হোয়াইট-লেবেল ক্লায়েন্ট ক্রিয়েটিভ',
      'কঠোর ৪৮ ঘণ্টার র্যাপিড ডেলিভারি SLA',
      'হোয়াইট-লেবেল ফিগমা/ড্রাইভ (আমাদের কোনো ব্র্যান্ডিং থাকবে না)',
      'ক্লায়েন্ট রিটেনশন ও আরওএএস সর্বোচ্চ করার আর্কিটেকচার',
      'ক্রিয়েটিভ লিডের সাথে ডিরেক্ট স্ল্যাক/হোয়াটসঅ্যাপ চ্যানেল',
    ],
  },
};

function TierCard({
  tier,
  index,
  isBn,
  variant = 'desktop',
  onCtaClick,
}: {
  tier: PricingTier;
  index: number;
  isBn: boolean;
  variant?: 'mobile' | 'desktop';
  onCtaClick: () => void;
}) {
  const title = isBn ? tier.title_bn : tier.title_en;
  const target = isBn ? tier.target_bn : tier.target_en;
  const desc = isBn ? tier.desc_bn : tier.desc_en;
  const cta = isBn ? tier.cta_bn : tier.cta_en;
  const price = isBn ? (tier.price_bn ?? tier.price_en) : (tier.price_en ?? tier.price_bn);
  const outcomeTag = isBn ? (tier.outcome_tag_bn ?? tier.outcome_tag_en) : (tier.outcome_tag_en ?? tier.outcome_tag_bn);

  const deliverables = isBn
    ? (tier.deliverables_bn ?? TIER_FEATURES[tier.id]?.bn ?? [])
    : (tier.deliverables_en ?? TIER_FEATURES[tier.id]?.en ?? []);

  return (
    <MotionReveal
      delay={0.12 * (index + 1)}
      className={variant === 'mobile' ? 'snap-center shrink-0 w-[86vw] max-w-[345px]' : ''}
    >
      <div
        data-pricing-card
        className={`relative flex flex-col h-full p-6 md:p-9 transition-all duration-700 ease-out group hover:-translate-y-1.5 ${
          variant === 'mobile' ? 'rounded-2xl' : 'rounded-sm'
        } ${tier.featured
            ? 'bg-primary/90 border-2 border-accent/80 ring-1 ring-accent/40 shadow-[0_12px_40px_-12px_rgba(251,146,60,0.35)]'
            : 'bg-primary/95 md:bg-primary/70 border border-primary-foreground/20 md:backdrop-blur-md hover:border-accent/50'
          }`}
      >
        {tier.featured && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-accent text-accent-foreground text-[9px] font-bold uppercase tracking-[2px] rounded-full shadow-md whitespace-nowrap">
              {isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
            </div>
          </>
        )}

        {/* Business Outcome Tag */}
        {outcomeTag && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-accent/15 text-accent border border-accent/30 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {outcomeTag}
            </span>
          </div>
        )}

        <div className="mb-3">
          <div
            className={`text-[10px] tracking-[2px] uppercase mb-1 font-semibold ${tier.featured ? 'text-accent' : 'text-primary-foreground/60'
              }`}
          >
            {target}
          </div>
          <h3
            lang={isBn ? 'bn' : 'en'}
            className={`font-heading text-2xl md:text-3xl font-bold text-primary-foreground leading-tight ${isBn ? 'font-bangla' : ''
              }`}
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {title}
          </h3>
        </div>

        {/* Price Display */}
        {price && (
          <div className="my-2 pb-4 border-b border-primary-foreground/10 flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight font-sans">
              {price}
            </span>
          </div>
        )}

        <p
          lang={isBn ? 'bn' : 'en'}
          className="text-[13px] leading-[1.7] text-primary-foreground/70 mb-6 mt-2"
          style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }}
        >
          {desc}
        </p>

        {/* Deliverables Check List */}
        <ul className="space-y-3 mb-8 flex-grow">
          {deliverables.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-primary-foreground/85 leading-relaxed font-medium">
              <span className="text-accent font-bold mt-0.5 shrink-0 text-sm">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onCtaClick}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 md:py-4 ${
            variant === 'mobile' ? 'rounded-full' : 'rounded-sm'
          } text-[11px] font-bold cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.97] btn-shimmer ${tier.featured
              ? 'bg-accent text-accent-foreground tracking-[2px] uppercase shadow-[0_4px_20px_rgba(251,146,60,0.35)] hover:shadow-[0_10px_32px_rgba(251,146,60,0.5)]'
              : 'bg-accent/10 border border-accent/60 text-accent tracking-[2px] uppercase hover:bg-accent hover:text-accent-foreground hover:shadow-[0_6px_20px_rgba(251,146,60,0.3)]'
            }`}
        >
          {cta}
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </MotionReveal>
  );
}

function CustomBanner({
  isBn,
  onCtaClick,
  customContent,
}: {
  isBn: boolean;
  onCtaClick: () => void;
  customContent: {
    heading_en: string;
    heading_bn: string;
    desc_en: string;
    desc_bn: string;
    cta_en: string;
    cta_bn: string;
  };
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-sm border border-primary-foreground/15 bg-primary p-8 md:p-12">
      {/* Subtle ambient orange glow — soft studio light */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent blur-3xl opacity-60"
      />
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h3
            lang={isBn ? 'bn' : 'en'}
            className="font-heading text-3xl md:text-[40px] font-normal text-primary-foreground mb-3 leading-tight"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {isBn ? customContent.heading_bn : customContent.heading_en}
          </h3>
          <p
            lang={isBn ? 'bn' : 'en'}
            className="text-[13px] md:text-[14px] leading-[1.75] text-primary-foreground/60"
            style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }}
          >
            {isBn ? customContent.desc_bn : customContent.desc_en}
          </p>
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase font-medium rounded-full md:rounded-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(251,146,60,0.35)] active:scale-[0.97]"
        >
          {isBn ? customContent.cta_bn : customContent.cta_en}
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
