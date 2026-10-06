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
    labelEn: 'Our Philosophy',
    labelBn: 'আমাদের ফিলোসফি',
    titleLine1En: 'Creatives that stop the scroll,',
    titleLine1Bn: 'যে বিজ্ঞাপন দেখে মানুষ থামে,',
    titleLine2En: 'and sell at full price.',
    titleLine2Bn: 'এবং ছাড় ছাড়াই কেনে।',
    p1En: 'In a market flooded with generic Canva templates, cheap visuals make local shoppers doubt product quality. POLISHED builds direct-response performance creatives and culturally persuasive Bengali sales copy that establish instant luxury authority—stopping ad budget leaks and driving full-price checkouts.',
    p1Bn: 'বাংলাদেশে ভালো প্রডাক্ট বানিয়েও সস্তা ক্যানভা ডিজাইনের কারণে ক্রেতার আস্থা হারানো অনেক বড় লোকসান। POLISHED তৈরি করে মনস্তাত্ত্বিক পারফরম্যান্স ক্রিয়েটিভ ও মার্জিত বাংলা সেলস কপি—যা প্রথম দেখাতেই পণ্যের আভিজাত্য ফুটিয়ে তোলে এবং বিজ্ঞাপনের অপচয় বন্ধ করে ফুল-প্রাইস সেলস নিশ্চিত করে।',
    quoteEn: '— 100% Bespoke Craft. Zero Recycled Templates.',
    quoteBn: '— ১০০% কাস্টম ক্রাফট। জিরো টেমপ্লেট।',
  };

  const defaultStats: Stat[] = [
    { id: '1', sort_order: 1, num: '72h', suffix: '', label_en: 'Sprint Delivery', label_bn: 'ডেলিভারি স্প্রিন্ট' },
    { id: '2', sort_order: 2, num: '0', suffix: '', label_en: 'Recycled Templates (100% Custom)', label_bn: 'টেমপ্লেট (সব কাস্টম ডিজাইন)' },
    { id: '3', sort_order: 3, num: 'বাং+EN', suffix: '', label_en: 'Bilingual Sales Copy', label_bn: 'দ্বিভাষিক সেলস কপি' },
    { id: '4', sort_order: 4, num: '1:1', suffix: '', label_en: 'Meta-Ready 1:1 & 9:16 Formats', label_bn: 'Meta-রেডি ফরম্যাট (১:১ ও ৯:১৬)' },
  ];

  const displayStats = defaultStats;

  // About typography
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = about.titleLine1En ?? 'Creatives that stop the scroll,';
  const line2 = about.titleLine2En ?? 'and sell at full price.';

  return (
    <section id="about" className="py-14 md:py-[100px] px-4 sm:px-6 md:px-14 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <MotionReveal>
            {isBn ? (
              <p lang="bn" className="text-[14px] md:text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                {about.labelBn}
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
                {about.labelEn}
              </p>
            )}
          </MotionReveal>
          <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary mb-6 md:mb-7 ${isBn ? 'text-[clamp(22px,6vw,32px)] md:text-[clamp(30px,4.2vw,50px)] leading-[1.3]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)] leading-[1.2]'}`}>
            {isBn ? (
              <>
                <RevealText as="span" className="block" stagger={0} delay={0}>
                  {about.titleLine1Bn}
                </RevealText>
                <RevealText as="span" className="block italic" stagger={0} delay={0}>
                  {about.titleLine2Bn}
                </RevealText>
              </>
            ) : (
              <>
                <RevealText as="span" className="block">{line1}</RevealText>
                <RevealText as="span" delay={0.15} className="block italic">{line2}</RevealText>
              </>
            )}
          </h2>
          <MotionReveal delay={0.3}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-muted-foreground mb-6">
              {isBn ? about.p1Bn : about.p1En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.4}>
            {isBn ? (
              <p lang="bn" className="text-[14px] md:text-[15px] font-semibold leading-[1.8] text-primary" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                {about.quoteBn}
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[13px] md:text-[14px] font-semibold tracking-wide uppercase leading-[1.8] text-primary">
                {about.quoteEn}
              </p>
            )}
          </MotionReveal>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-px md:bg-border md:border md:border-border mt-6 md:mt-0">
          {displayStats.map((stat, i) => (
            <MotionReveal key={stat.id} delay={0.15 * (i + 1)}>
              <div
                className="stat-box bg-card/60 md:bg-background p-4 sm:p-5 md:p-9 text-center rounded-2xl md:rounded-none border border-border/60 md:border-none shadow-sm md:shadow-none transition-all duration-700 ease-out relative overflow-hidden group hover:bg-primary/[0.03] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:scale-x-0 before:transition-transform before:duration-700 hover:before:scale-x-100"
              >
                <div className="font-heading text-[28px] sm:text-[36px] md:text-[48px] font-light text-primary leading-none mb-1.5 md:mb-2">
                  {stat.num}<span className="text-accent">{stat.suffix}</span>
                </div>
                {isBn ? (
                  <div lang="bn" className="text-[11.5px] sm:text-[13px] tracking-[0.3px] text-muted-foreground leading-snug py-0.5" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    {stat.label_bn}
                  </div>
                ) : (
                  <div lang="en" style={enFont} className="text-[10px] md:text-[11px] tracking-[1.5px] md:tracking-[2px] uppercase text-muted-foreground leading-snug">
                    {stat.label_en}
                  </div>
                )}
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
