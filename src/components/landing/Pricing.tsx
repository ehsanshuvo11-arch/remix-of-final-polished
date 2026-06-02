import { motion } from 'framer-motion';
import MotionReveal from '@/components/landing/MotionReveal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tier {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  priceEn: string;
  priceBn: string;
  highlight?: boolean;
}

const tiers: Tier[] = [
  {
    titleEn: 'The Conversion Starter',
    titleBn: 'দ্য কনভার্সন স্টার্টার',
    subtitleEn: 'Foot-in-the-door',
    subtitleBn: 'ফুট-ইন-দ্য-ডোর',
    priceEn: '$2,000',
    priceBn: '$২,০০০',
  },
  {
    titleEn: 'The Visual Retainer',
    titleBn: 'দ্য ভিজ্যুয়াল রিটেইনার',
    subtitleEn: 'Monthly Core Service',
    subtitleBn: 'মান্থলি কোর সার্ভিস',
    priceEn: '$5,000',
    priceBn: '$৫,০০০',
    highlight: true,
  },
  {
    titleEn: 'The Storefront Upgrade',
    titleBn: 'দ্য স্টোরফ্রন্ট আপগ্রেড',
    subtitleEn: 'High-Ticket',
    subtitleBn: 'হাই-টিকেট',
    priceEn: '$8,000',
    priceBn: '$৮,০০০',
  },
];

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export default function Pricing() {
  const { lang, t } = useLanguage();
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const bnFont = { fontFamily: "'Noto Serif Bengali', serif" } as const;

  return (
    <section id="pricing" className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Ambient luxury glow — drifting */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        animate={{
          backgroundPosition: ['0% 0%, 100% 100%', '20% 10%, 80% 90%', '0% 0%, 100% 100%'],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, hsl(var(--accent)) 0%, transparent 45%), radial-gradient(ellipse at 80% 100%, hsl(var(--accent)) 0%, transparent 45%)',
        }}
      />

      {/* Top + bottom hairline ornaments */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[60%] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[60%] bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

      <div className="relative py-[120px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span aria-hidden className="h-px w-8 bg-accent/50" />
            <p
              style={lang === 'bn' ? bnFont : enFont}
              className="text-[10px] tracking-[5px] uppercase text-accent font-medium text-center"
            >
              {t('Investment', 'বিনিয়োগ')}
            </p>
            <span aria-hidden className="h-px w-8 bg-accent/50" />
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <h2
            className="font-heading font-light mb-5 leading-[1.1] text-center text-[clamp(34px,5vw,60px)] text-primary-foreground"
            style={lang === 'bn' ? bnFont : undefined}
          >
            {lang === 'bn' ? (
              <>
                সিরিয়াস ব্র্যান্ডের জন্য{' '}
                <em className="italic text-accent font-normal">প্রাইসিং।</em>
              </>
            ) : (
              <>
                Pricing built for{' '}
                <em className="italic text-accent font-normal">serious brands.</em>
              </>
            )}
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.15}>
          <p
            style={lang === 'bn' ? bnFont : enFont}
            className="text-[13px] md:text-[14px] text-primary-foreground/55 leading-[1.8] text-center max-w-[560px] mx-auto mb-20"
          >
            {t(
              'Three transparent tiers. Built to scale with your brand — from first impression to full storefront overhaul.',
              'তিনটি স্বচ্ছ স্তর। আপনার ব্র্যান্ডের সাথে স্কেল করার জন্য তৈরি — প্রথম ইম্প্রেশন থেকে সম্পূর্ণ স্টোরফ্রন্ট পুনর্গঠন পর্যন্ত।'
            )}
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-full">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.titleEn} tier={tier} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier, lang, index }: { tier: Tier; lang: 'en' | 'bn'; index: number }) {
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const bnFont = { fontFamily: "'Noto Serif Bengali', serif" } as const;
  const labelFont = lang === 'bn' ? bnFont : enFont;
  const highlight = tier.highlight;

  const title = lang === 'bn' ? tier.titleBn : tier.titleEn;
  const subtitle = lang === 'bn' ? tier.subtitleBn : tier.subtitleEn;
  const price = lang === 'bn' ? tier.priceBn : tier.priceEn;
  const buttonLabel = lang === 'bn' ? 'প্রজেক্ট শুরু করুন' : 'Start A Project';
  const oneTime = lang === 'bn' ? 'এককালীন এনগেজমেন্ট' : 'One-time engagement';
  const mostChosen = lang === 'bn' ? 'সর্বাধিক নির্বাচিত' : 'Most Chosen';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, delay: 0.12 * index, ease: LUXURY_EASE as any }}
      whileHover={{ y: highlight ? -16 : -8 }}
      className={`group relative flex flex-col items-center text-center px-8 py-12 md:px-10 md:py-14 h-full min-h-[460px] backdrop-blur-[1px] ${
        highlight
          ? 'bg-[hsl(var(--primary))] border border-accent/45 md:-translate-y-3'
          : 'bg-[hsl(var(--primary))]/40 border border-primary-foreground/10 hover:border-primary-foreground/30'
      }`}
      style={{
        transition: 'border-color 0.6s ease, box-shadow 0.9s ease',
        boxShadow: highlight
          ? '0 0 0 1px hsl(var(--accent) / 0.18), 0 30px 80px -40px hsl(var(--accent) / 0.5)'
          : 'none',
      }}
    >
      {/* Sheen sweep on hover */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1400ms] ease-out"
          style={{
            background:
              'linear-gradient(115deg, transparent 35%, hsl(var(--accent) / 0.08) 50%, transparent 65%)',
          }}
        />
      </span>

      {/* Highlight pulsing aura */}
      {highlight && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.12) 0%, transparent 60%)',
          }}
        />
      )}

      {/* corner ornaments — animated reveal */}
      {[
        'top-0 left-0 w-px h-8',
        'top-0 left-0 h-px w-8',
        'bottom-0 right-0 w-px h-8',
        'bottom-0 right-0 h-px w-8',
      ].map((cls, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ scaleX: 0, scaleY: 0 }}
          whileInView={{ scaleX: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 + 0.08 * i, ease: LUXURY_EASE as any }}
          className={`absolute ${cls} origin-center ${highlight ? 'bg-accent/60' : 'bg-primary-foreground/25'}`}
        />
      ))}

      {highlight && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: LUXURY_EASE as any }}
          style={labelFont}
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-white text-[9px] tracking-[3px] uppercase font-semibold whitespace-nowrap z-20 shadow-[0_6px_20px_-6px_hsl(var(--accent)/0.6)]"
        >
          {mostChosen}
        </motion.span>
      )}

      <div className="relative z-[1] flex flex-col items-center w-full h-full">
        <p
          style={labelFont}
          className={`text-[10px] font-medium mb-7 text-accent ${lang === 'bn' ? 'tracking-[1px]' : 'tracking-[3.5px] uppercase'}`}
        >
          {subtitle}
        </p>

        <h3
          className="font-heading font-light leading-[1.2] text-[26px] md:text-[30px] mb-7 break-words max-w-full text-primary-foreground"
          style={lang === 'bn' ? bnFont : undefined}
        >
          {title}
        </h3>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 + 0.1 * index, ease: LUXURY_EASE as any }}
          className={`h-px w-12 mb-8 origin-center ${highlight ? 'bg-accent/70' : 'bg-primary-foreground/25'}`}
        />

        <div className="flex-1 flex flex-col items-center justify-center mb-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.35 + 0.1 * index, ease: LUXURY_EASE as any }}
            className="font-heading font-light text-[clamp(44px,7vw,62px)] leading-none text-primary-foreground tracking-tight"
            style={lang === 'bn' ? bnFont : undefined}
          >
            {price}
          </motion.span>
          <span
            style={labelFont}
            className="mt-4 text-[10px] tracking-[2.5px] uppercase text-primary-foreground/45"
          >
            {oneTime}
          </span>
        </div>

        <a
          href="#contact"
          style={labelFont}
          className={`relative inline-flex items-center justify-center w-full px-6 py-4 text-[10px] tracking-[3px] uppercase font-medium transition-all duration-500 border overflow-hidden ${
            highlight
              ? 'bg-accent text-primary border-accent hover:bg-transparent hover:text-accent'
              : 'bg-transparent text-primary-foreground border-primary-foreground/25 hover:bg-accent hover:text-primary hover:border-accent'
          }`}
        >
          <span className="relative z-[1]">{buttonLabel}</span>
        </a>
      </div>
    </motion.div>
  );
}
