import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import RevealText from '@/components/landing/RevealText';
import type { AboutContent, Stat } from '@/types/database';

interface AboutProps {
  content: AboutContent | null;
  stats: Stat[];
}

export default function About({ content, stats }: AboutProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';

  const about = {
    labelEn: 'OUR PHILOSOPHY',
    labelBn: 'OUR PHILOSOPHY',
    titleLine1En: 'Creatives That Sell at',
    titleLine2En: 'Full Price.',
    p1En: 'Shouting "DISCOUNT" degrades your brand. We build authentic trust in your photos and videos—so customers gladly checkout at full price.',
    p1Bn: 'চিৎকার করে "অফার" লিখলে ব্র্যান্ড ছোট হয়ে যায়। আমরা আপনার প্রোডাক্টের ছবি ও ভিডিওতে এমন ভরসা তৈরি করি—যাতে কাস্টমার পুরো দাম দিয়েই কেনে।',
    quoteEn: '— Zero Recycled Templates. Every Piece Handcrafted.',
    quoteBn: '— কোনো রেডিমেড টেমপ্লেট নয়। প্রতিটি কাজ হাতে গড়া।',
  };

  const defaultStats: Stat[] = [
    { id: '1', sort_order: 1, num: '72h', suffix: '', label_en: 'Turnaround', label_bn: isBn ? 'Turnaround' : 'Turnaround' },
    { id: '2', sort_order: 2, num: '0%', suffix: '', label_en: 'Templates', label_bn: isBn ? 'Templates' : 'Templates' },
    { id: '3', sort_order: 3, num: 'বাংলা', suffix: '', label_en: 'Refined Copy', label_bn: isBn ? 'Refined Copy' : 'Refined Copy' },
    { id: '4', sort_order: 4, num: '1:1 & 9:16', suffix: '', label_en: 'Meta Ready', label_bn: isBn ? 'Meta Ready' : 'Meta Ready' },
  ];

  const displayStats = defaultStats;

  // About typography
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;

  return (
    <section id="about" className="py-8 sm:py-12 md:py-[100px] px-4 sm:px-6 md:px-14 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div>
          <MotionReveal>
            <p className="eyebrow-pill-kicker text-accent mb-3 sm:mb-4 font-semibold" style={enFont}>
              {about.labelEn}
            </p>
          </MotionReveal>
          <h2 lang="en" className="section-heading-h2 font-heading font-normal text-primary mb-4 md:mb-6">
            <span className="block">Creatives That Sell at</span>
            <span className="block italic text-accent">Full Price.</span>
          </h2>
          <MotionReveal delay={0.2}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.8 } : enFont} className="section-lead-subtitle text-muted-foreground mb-4 sm:mb-6">
              {isBn ? about.p1Bn : about.p1En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.3}>
            {isBn ? (
              <p lang="bn" className="text-[12.5px] md:text-[14px] font-semibold leading-[1.6] text-primary" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                {about.quoteBn}
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[12px] md:text-[13px] font-semibold tracking-wide uppercase leading-[1.6] text-primary">
                {about.quoteEn}
              </p>
            )}
          </MotionReveal>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-px md:bg-border md:border md:border-border mt-4 md:mt-0">
          {displayStats.map((stat, i) => (
            <MotionReveal key={stat.id} delay={0.15 * (i + 1)}>
              <div
                className="stat-box bg-white/70 md:bg-background p-3 sm:p-5 md:p-9 text-center rounded-xl md:rounded-none border border-primary/10 md:border-none shadow-2xs md:shadow-none transition-all duration-700 ease-out relative overflow-hidden group hover:bg-primary/[0.03] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:scale-x-0 before:transition-transform before:duration-700 hover:before:scale-x-100"
              >
                <div className="font-heading text-[26px] sm:text-[32px] md:text-[40px] font-light text-primary leading-none mb-1.5 md:mb-2">
                  {stat.num}<span className="text-accent">{stat.suffix}</span>
                </div>
                <div className="text-[13px] text-muted-foreground leading-snug py-0.5 font-medium" style={enFont}>
                  {stat.label_en}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
