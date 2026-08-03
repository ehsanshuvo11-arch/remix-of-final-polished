import { useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import SwipeProgress from '@/components/landing/SwipeProgress';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { PricingSkeleton } from '@/components/landing/Skeleton';
import { ArrowRight } from 'lucide-react';
import { useSiteSetting } from '@/hooks/use-site-content';
import { DEFAULT_PRICING } from '@/lib/pricing-defaults';
import type { PricingContent, PricingTier } from '@/types/database';


export default function Pricing({ isLoading = false }: { isLoading?: boolean }) {
  const { lang } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  useDragScroll(trackRef);
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



  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="investment" className="bg-primary">
      <div className="py-24 md:py-32 px-6 md:px-14 max-w-[1200px] mx-auto">
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
          className={`font-heading font-normal text-primary-foreground mb-7 leading-[1.1] ${
            isBn
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
              {/* Mobile-only: native horizontal swipe carousel */}
              <div
                ref={trackRef}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex md:hidden w-full max-w-full overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide cursor-grab gap-4 pb-6 -mx-6 px-6 mt-10 [-webkit-overflow-scrolling:touch]"
              >
                {pricingTiers.map((tier, index) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    index={index}
                    isBn={isBn}
                    variant="mobile"
                    onCtaClick={scrollToContact}
                  />
                ))}
              </div>

              {/* Desktop: unchanged three-column grid */}
              <div className="hidden md:grid md:grid-cols-3 md:gap-8 md:mt-14">
                {pricingTiers.map((tier, index) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    index={index}
                    isBn={isBn}
                    variant="desktop"
                    onCtaClick={scrollToContact}
                  />
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
        {!isLoading && (
          <SwipeProgress containerRef={trackRef} count={pricingTiers.length} tone="light" />
        )}




        <div className="mt-10 md:mt-20">
          <MotionReveal>
            <CustomBanner isBn={isBn} onCtaClick={scrollToContact} customContent={customContent} />
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

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

  return (
    <MotionReveal
      delay={0.12 * (index + 1)}
      className={variant === 'mobile' ? 'min-w-[85vw] max-w-[85vw] shrink-0 snap-center' : ''}
    >
      <div
        className={`relative flex flex-col h-full p-6 md:p-10 transition-all duration-700 ease-out group hover:-translate-y-1 ${
          tier.featured
            ? 'bg-primary/80 border border-accent/40 ring-1 ring-accent/30 md:shadow-[0_0_60px_-12px_rgba(251,146,60,0.15)]'
            : 'bg-primary/95 md:bg-primary/60 border border-primary-foreground/15 md:backdrop-blur-md hover:border-primary-foreground/25'
        }`}
      >
        {tier.featured && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        )}
        <div className="mb-8">
          <div
            className={`text-[10px] tracking-[2px] uppercase mb-3 font-medium ${
              tier.featured ? 'text-accent' : 'text-primary-foreground/50'
            }`}
          >
            {target}
          </div>
          <h3
            lang={isBn ? 'bn' : 'en'}
            className={`font-heading text-2xl md:text-3xl font-normal text-primary-foreground leading-tight ${
              isBn ? 'font-bangla' : ''
            }`}
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {title}
          </h3>
        </div>
        <p
          lang={isBn ? 'bn' : 'en'}
          className="text-[13px] leading-[1.75] text-primary-foreground/60 mb-8 flex-grow"
          style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }}
        >
          {desc}
        </p>
        <button
          type="button"
          onClick={onCtaClick}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-[11px] font-medium transition-all duration-500 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
            tier.featured
              ? 'bg-accent text-accent-foreground tracking-[2px] uppercase hover:shadow-[0_10px_28px_rgba(251,146,60,0.35)]'
              : 'border border-primary-foreground/20 text-primary-foreground tracking-[2px] uppercase hover:border-accent hover:bg-accent/10 hover:shadow-[0_6px_20px_rgba(251,146,60,0.2)]'
          }`}
        >
          {cta}
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
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
    <div className="relative overflow-hidden rounded-sm border border-primary-foreground/15 bg-primary p-8 md:p-12">
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
          className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase font-medium rounded-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(251,146,60,0.35)] active:scale-[0.97]"
        >
          {isBn ? customContent.cta_bn : customContent.cta_en}
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
