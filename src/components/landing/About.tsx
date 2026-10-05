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
    labelEn: 'The Plain Truth About Us',
    labelBn: 'আমরা কে ও কেন আমাদের কাজ আলাদা',
    titleLine1En: 'Ads that stop the scroll,',
    titleLine1Bn: 'যে বিজ্ঞাপন দেখে মানুষ থামে,',
    titleLine2En: 'and sell without excuses.',
    titleLine2Bn: 'এবং দ্বিধা ছাড়া কেনে।',
    p1En: 'Building a brand in Bangladesh is brutal. You formulate a great product, yet cheap Canva ads make people doubt its quality. That hurts. We started POLISHED to fix this exact injustice. We build performance creatives that show your product’s true worth—instantly.',
    p1Bn: 'বাংলাদেশে একটা ব্র্যান্ড দাঁড় করাতে কতটা পরিশ্রম করতে হয়, তা আমরা জানি। কিন্তু দিনশেষে যখন ক্যানভা টেমপ্লেটের কারণে মানুষ প্রোডাক্টের কদর বোঝে না, তখন সবচেয়ে বেশি কষ্ট লাগে। POLISHED-এর জন্ম এই অবিচার দূর করতে। আমরা এমন পারফরম্যান্স ক্রিয়েটিভ বানাই যা আপনার ব্র্যান্ডের আসল মর্যাদা কাস্টমারের চোখে ফুটিয়ে তোলে।',
    p2En: 'We do not sell pretty wallpaper. We take ownership of your ROAS and bottom-line revenue. Our job is simple: stop your daily ad budget drain and convince shoppers to buy at full price without begging for discounts.',
    p2Bn: 'আমরা শুধু গ্রাফিক্স বানাই না। আমরা সরাসরি আপনার রেভিনিউ আর আরওএএস (ROAS) বাড়ানোর দায়িত্ব নিই। বিজ্ঞাপনের অপ্রয়োজনীয় ডলার অপচয় বন্ধ করা এবং কাস্টমারকে ডিসকাউন্ট ছাড়াই পূর্ণ মূল্যে অর্ডার করতে উদ্বুদ্ধ করাই আমাদের মূল কাজ।',
    quoteEn: '— No marketing buzzwords. Pure direct-response creatives that convert.',
    quoteBn: '— কোনো চটকদার ভনিতা নয়। খাঁটি পারফরম্যান্স ক্রিয়েটিভ যা বিক্রি বাড়ায়।',
  };

  const defaultStats: Stat[] = [
    { id: '1', sort_order: 1, num: '48h', suffix: '', label_en: 'Sprint Delivery', label_bn: 'ডেলিভারি স্প্রিন্ট' },
    { id: '2', sort_order: 2, num: '0', suffix: '', label_en: 'Recycled Templates (100% Custom)', label_bn: 'টেমপ্লেট (সব কাস্টম ডিজাইন)' },
    { id: '3', sort_order: 3, num: 'বাং+EN', suffix: '', label_en: 'Bilingual Sales Copy', label_bn: 'দ্বিভাষিক সেলস কপি' },
    { id: '4', sort_order: 4, num: '1:1', suffix: '', label_en: 'Meta-Ready 1:1 & 9:16 Formats', label_bn: 'Meta-রেডি ফরম্যাট (১:১ ও ৯:১৬)' },
  ];

  const displayStats = defaultStats;

  // About copy is intentionally locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = about.titleLine1En ?? 'Ads that stop the scroll,';
  const line2 = about.titleLine2En ?? 'and sell without excuses.';

  return (
    <section id="about" className="py-14 md:py-[110px] px-4 sm:px-6 md:px-14 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <MotionReveal>
            {isBn ? (
              <p lang="bn" className="text-[14px] md:text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                {about.labelBn ?? 'আমরা কে ও কেন আমাদের কাজ আলাদা'}
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
                {about.labelEn ?? 'The Plain Truth About Us'}
              </p>
            )}
          </MotionReveal>
          <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary mb-6 md:mb-7 ${isBn ? 'text-[clamp(22px,6vw,32px)] md:text-[clamp(30px,4.2vw,50px)] leading-[1.3]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)] leading-[1.2]'}`}>
            {isBn ? (
              <>
                <RevealText as="span" className="block" stagger={0} delay={0}>
                  {(about.titleLine1Bn ?? 'যে বিজ্ঞাপন দেখে মানুষ থামে,')}
                </RevealText>
                <RevealText as="span" className="block italic" stagger={0} delay={0}>
                  {(about.titleLine2Bn ?? 'এবং দ্বিধা ছাড়া কেনে।')}
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
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-muted-foreground mb-5">
              {isBn ? about.p1Bn : about.p1En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.4}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-muted-foreground mb-5">
              {isBn ? about.p2Bn : about.p2En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.5}>
            {isBn ? (
              <p lang="bn" className="text-[14px] md:text-[15px] leading-[1.8] text-primary" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                {about.quoteBn ?? '— কোনো চটকদার ভনিতা নয়। খাঁটি পারফরম্যান্স ক্রিয়েটিভ যা বিক্রি বাড়ায়।'}
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-primary italic">
                {about.quoteEn ?? '— No marketing buzzwords. Pure direct-response creatives that convert.'}
              </p>
            )}
          </MotionReveal>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border border border-border mt-4 md:mt-0">
          {displayStats.map((stat, i) => (
            <MotionReveal key={stat.id} delay={0.15 * (i + 1)}>
              <div
                className="stat-box bg-background p-5 md:p-9 text-center transition-all duration-700 ease-out relative overflow-hidden group hover:bg-primary/[0.03] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:scale-x-0 before:transition-transform before:duration-700 hover:before:scale-x-100"
              >
                <div className="font-heading text-[32px] sm:text-[40px] md:text-[48px] font-light text-primary leading-none mb-1.5 md:mb-2">
                  {stat.num}<span className="text-accent">{stat.suffix}</span>
                </div>
                {isBn ? (
                  <div lang="bn" className="text-[12px] sm:text-[13px] tracking-[0.5px] text-muted-foreground leading-[1.3] py-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    {stat.label_bn}
                  </div>
                ) : (
                  <div lang="en" style={enFont} className="text-[10px] md:text-[11px] tracking-[1.5px] md:tracking-[2px] uppercase text-muted-foreground leading-[1.4]">
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
