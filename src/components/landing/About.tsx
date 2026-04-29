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

  const about = content ?? {
    labelEn: 'About Polished',
    labelBn: 'পলিশড সম্পর্কে',
    titleLine1En: 'Design that earns',
    titleLine1Bn: 'এমন ভিজ্যুয়াল, যা প্রথম দেখাতেই',
    titleLine2En: 'trust at first glance.',
    titleLine2Bn: 'বিশ্বাস জন্মায়।',
    p1En: 'POLISHED is built for mid-range ecommerce-based skincare brands that want to look premium, intentional, and unforgettable — without the agency overhead.',
    p1Bn: 'POLISHED তৈরি হয়েছে ই-কমার্স স্কিনকেয়ার ব্র্যান্ডগুলোর জন্য, যারা প্রিমিয়াম এবং বিশ্বাসযোগ্য একটি পরিচয় দাঁড় করাতে চায়। আমাদের লক্ষ্য একটাই—আপনার ব্র্যান্ডকে সাধারণের ভিড় থেকে আলাদা করে একটি এক্সক্লুসিভ অবস্থানে নিয়ে যাওয়া।',
    p2En: 'We specialize in clean, structured visuals that position your brand above the noise of generic Canva-level design. From Instagram posts to full visual identities — everything is built with precision and purpose.',
    p2Bn: 'আমরা পরিচ্ছন্ন, কাঠামোবদ্ধ ভিজ্যুয়ালে বিশেষজ্ঞ যা আপনার ব্র্যান্ডকে জেনেরিক ক্যানভা-লেভেল ডিজাইনের উপরে তুলে ধরে।',
    quoteEn: '— Identifying a gap: professional Bangla visual design done right.',
    quoteBn: '— একটি ফাঁক চিহ্নিত করা: পেশাদার বাংলা ভিজ্যুয়াল ডিজাইন সঠিকভাবে।',
  };

  const defaultStats: Stat[] = [
    { id: '1', sort_order: 1, num: '50+', suffix: '', label_en: 'Projects Delivered', label_bn: 'প্রজেক্ট সম্পন্ন' },
    { id: '2', sort_order: 2, num: '30+', suffix: '', label_en: 'Brand Partners', label_bn: 'ব্র্যান্ড পার্টনার' },
    { id: '3', sort_order: 3, num: '2 yrs', suffix: '', label_en: 'Industry Experience', label_bn: 'ইন্ডাস্ট্রি অভিজ্ঞতা' },
    { id: '4', sort_order: 4, num: '100%', suffix: '', label_en: 'Client Satisfaction', label_bn: 'ক্লায়েন্ট সন্তুষ্টি' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  // About copy is intentionally locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = about.titleLine1En ?? 'Design that earns';
  const line2 = about.titleLine2En ?? 'trust at first glance.';

  return (
    <section id="about" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <MotionReveal>
            {isBn ? (
              <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                ব্র্যান্ড ফিলোসফি
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
                {about.labelEn ?? 'About Polished'}
              </p>
            )}
          </MotionReveal>
          <h2 lang={isBn ? 'bn' : 'en'} className="font-heading font-normal text-primary mb-7 text-[clamp(36px,5vw,60px)] leading-[1.2]">
            {isBn ? (
              <>
                <RevealText as="span" className="block">
                  {(about.titleLine1Bn ?? 'এমন ভিজ্যুয়াল, যা প্রথম দেখাতেই')}
                </RevealText>
                <RevealText as="span" delay={0.15} className="block italic">
                  {(about.titleLine2Bn ?? 'বিশ্বাস জন্মায়।')}
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
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[15px] leading-[1.85] text-muted-foreground mb-5">
              {isBn ? (
                <><span lang="en">POLISHED</span>{' তৈরি হয়েছে ই-কমার্স স্কিনকেয়ার ব্র্যান্ডগুলোর জন্য, যারা প্রিমিয়াম এবং বিশ্বাসযোগ্য একটি পরিচয় দাঁড় করাতে চায়। আমাদের লক্ষ্য একটাই—আপনার ব্র্যান্ডকে সাধারণের ভিড় থেকে আলাদা করে একটি এক্সক্লুসিভ অবস্থানে নিয়ে যাওয়া।'}</>
              ) : about.p1En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.4}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[15px] leading-[1.85] text-muted-foreground mb-5">
              {isBn ? about.p2Bn : about.p2En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.5}>
            {isBn ? (
              <p lang="bn" className="text-[15px] leading-[1.85] text-primary" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                — আমাদের সিগনেচার: নিখুঁত ও প্রফেশনাল বাংলা ভিজ্যুয়াল আইডেন্টিটি।
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[15px] leading-[1.85] text-primary italic">
                {about.quoteEn ?? '— Identifying a gap: professional Bangla visual design done right.'}
              </p>
            )}
          </MotionReveal>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border border border-border">
          {displayStats.map((stat, i) => (
            <MotionReveal key={stat.id} delay={0.15 * (i + 1)}>
              <div
                className="stat-box bg-background p-7 md:p-9 text-center transition-all duration-700 ease-out relative overflow-hidden group hover:bg-[#eef2ff] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:scale-x-0 before:transition-transform before:duration-700 hover:before:scale-x-100"
              >
                <div className="font-heading text-[52px] font-light text-primary leading-none mb-2">
                  {stat.num}<span className="text-accent">{stat.suffix}</span>
                </div>
                {isBn ? (
                  <div lang="bn" className="text-[11px] tracking-[2px] text-muted-foreground" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    {(['সফল প্রজেক্ট','ব্র্যান্ড পার্টনার','ইন্ডাস্ট্রি অভিজ্ঞতা','ক্লায়েন্ট সন্তুষ্টি'])[i] ?? stat.label_bn}
                  </div>
                ) : (
                  <div lang="en" style={enFont} className="text-[11px] tracking-[2px] uppercase text-muted-foreground">
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
