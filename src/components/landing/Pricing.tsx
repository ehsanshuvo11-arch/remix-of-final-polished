import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { PricingSkeleton } from '@/components/landing/Skeleton';
import { ArrowRight } from 'lucide-react';


interface PricingTier {
  id: string;
  title_en: string;
  title_bn: string;
  target_en: string;
  target_bn: string;
  desc_en: string;
  desc_bn: string;
  cta_en: string;
  cta_bn: string;
  featured?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'social',
    title_en: 'Social Media Retainer',
    title_bn: 'সোশ্যাল মিডিয়া রিটেইনার',
    target_en: 'Established D2C Brands',
    target_bn: 'প্রতিষ্ঠিত ডি২সি ব্র্যান্ড',
    desc_en: 'A recurring design partnership for skincare and self-care brands that need consistent, scroll-stopping content across every social touchpoint.',
    desc_bn: 'স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ডের জন্য একটি নিরন্তর ডিজাইন পার্টনারশিপ—প্রতিটি সোশ্যাল টাচপয়েন্টে কনসিস্টেন্ট, আকর্ষণীয় কন্টেন্ট।',
    cta_en: 'Get Started',
    cta_bn: 'শুরু করুন',
  },
  {
    id: 'visual',
    title_en: 'Visual Identity System',
    title_bn: 'ভিজ্যুয়াল আইডেন্টিটি সিস্টেম',
    target_en: 'E-commerce Makeovers',
    target_bn: 'ই-কমার্স মেকওভার',
    desc_en: 'A complete brand overhaul for stores ready to look premium — from logo and color to packaging, storefront UI, and launch assets.',
    desc_bn: 'লোগো, কালার, প্যাকেজিং থেকে স্টোরফ্রন্ট UI ও লঞ্চ অ্যাসেট পর্যন্ত—আপনার ব্র্যান্ডকে প্রিমিয়াম লুক দিতে একটি সম্পূর্ণ মেকওভার।',
    cta_en: 'Start Your Makeover',
    cta_bn: 'মেকওভার শুরু করুন',
    featured: true,
  },
  {
    id: 'white',
    title_en: 'White-Label Partner',
    title_bn: 'হোয়াইট-লেবেল পার্টনার',
    target_en: 'Marketing Agencies',
    target_bn: 'মার্কেটিং এজেন্সি',
    desc_en: 'Plug-and-play creative backend for agencies that want premium visuals delivered under their own brand name — without growing their headcount.',
    desc_bn: 'মার্কেটিং এজেন্সিগুলোর জন্য প্লাগ-অ্যান্ড-প্লে ক্রিয়েটিভ ব্যাকএন্ড—নিজেদের ব্র্যান্ড নামে প্রিমিয়াম ডেলিভারি, বাড়তি হেডকাউন্ট ছাড়াই।',
    cta_en: 'Partner With Us',
    cta_bn: 'পার্টনারশিপ করুন',
  },
];

const customContent = {
  heading_en: 'Need a Custom Solution?',
  heading_bn: 'কাস্টম সলিউশন প্রয়োজন?',
  desc_en: "Let's craft a bespoke visual strategy tailored exactly to your brand's unique scale and goals.",
  desc_bn: 'আপনার ব্র্যান্ডের নির্দিষ্ট চাহিদা এবং লক্ষ্য অনুযায়ী একটি সম্পূর্ণ কাস্টম ভিজ্যুয়াল স্ট্র্যাটেজি তৈরি করতে আমাদের সাথে কথা বলুন।',
  cta_en: 'Request Custom Quote',
  cta_bn: 'কাস্টম কোটেশন রিকোয়েস্ট করুন',
};

const sectionHeader = {
  label_en: 'Investment',
  label_bn: 'ইনভেস্টমেন্ট',
  title_en: 'Transparent partnerships.',
  title_em_en: 'Premium execution.',
  title_bn: 'স্বচ্ছ পার্টনারশিপ।',
  title_em_bn: 'প্রিমিয়াম এক্সিকিউশন।',
};

export default function Pricing({ isLoading = false }: { isLoading?: boolean }) {
  const { lang } = useLanguage();

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
      <div className="py-16 md:py-32 px-6 md:px-14 max-w-[1200px] mx-auto">
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-14"
            >
              {pricingTiers.map((tier, index) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  index={index}
                  isBn={isBn}
                  onCtaClick={scrollToContact}
                />
              ))}
            </m.div>
          )}
        </AnimatePresence>


        <div className="mt-10 md:mt-20">
          <MotionReveal>
            <CustomBanner isBn={isBn} onCtaClick={scrollToContact} />
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
  onCtaClick,
}: {
  tier: PricingTier;
  index: number;
  isBn: boolean;
  onCtaClick: () => void;
}) {
  const title = isBn ? tier.title_bn : tier.title_en;
  const target = isBn ? tier.target_bn : tier.target_en;
  const desc = isBn ? tier.desc_bn : tier.desc_en;
  const cta = isBn ? tier.cta_bn : tier.cta_en;

  return (
    <MotionReveal delay={0.12 * (index + 1)}>
      <div
        className={`relative flex flex-col h-full p-8 md:p-10 transition-all duration-700 ease-out group hover:-translate-y-1 ${
          tier.featured
            ? 'bg-primary/80 border border-accent/40 ring-1 ring-accent/30 shadow-[0_0_60px_-12px_rgba(251,146,60,0.15)]'
            : 'bg-primary/60 border border-primary-foreground/15 backdrop-blur-md hover:border-primary-foreground/25'
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
}: {
  isBn: boolean;
  onCtaClick: () => void;
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
