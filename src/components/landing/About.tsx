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
    labelEn: 'Brand Philosophy',
    labelBn: 'ব্র্যান্ড ফিলোসফি',
    titleLine1En: 'Visual authority that',
    titleLine1Bn: 'এমন ভিজ্যুয়াল, যা প্রথম দেখাতেই',
    titleLine2En: 'drives high conversions.',
    titleLine2Bn: 'বিশ্বাস ও কনভার্শন বাড়ায়।',
    p1En: 'POLISHED operates on two exclusive fronts: partnering directly with premium D2C & B2C skincare brands, and acting as the backend white-label creative engine for leading marketing agencies.',
    p1Bn: 'POLISHED হলো প্রিমিয়াম D2C স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ড এবং মার্কেটিং এজেন্সিগুলোর জন্য একটি স্পেশালাইজড ক্রিয়েটিভ ইঞ্জিন।',
    p2En: 'Our mission goes beyond aesthetics. We engineer high-converting visual identities and campaign assets designed to slash Customer Acquisition Cost (CAC) and maximize Return on Ad Spend (ROAS).',
    p2Bn: 'আমাদের লক্ষ্য শুধু সুন্দর ডিজাইন নয়। আমরা এমন কনভার্শন-ফোকাসড অ্যাসেট তৈরি করি যা কাস্টমার একুইজিশন খরচ (CAC) কমায় এবং বিজ্ঞাপনের রিটার্ন (ROAS) সর্বোচ্চ করে।',
    quoteEn: '— Our Signature: Performance-first creatives engineered to convert, scale, and dominate.',
    quoteBn: '— আমাদের সিগনেচার: পার্ফরম্যান্স-ফার্স্ট ক্রিয়েটিভস — কনভার্ট করতে, স্কেল করতে এবং মার্কেটে আধিপত্য বিস্তার করতে।',
  };

  const defaultStats: Stat[] = [
    { id: '1', sort_order: 1, num: '3.2x', suffix: '', label_en: 'Average ROAS Lift', label_bn: 'গড় ROAS বৃদ্ধি' },
    { id: '2', sort_order: 2, num: '30+', suffix: '', label_en: 'D2C Brand Partners', label_bn: 'ব্র্যান্ড পার্টনার' },
    { id: '3', sort_order: 3, num: '-38%', suffix: '', label_en: 'Avg. CAC Reduction', label_bn: 'গড় CAC হ্রাস' },
    { id: '4', sort_order: 4, num: '100%', suffix: '', label_en: 'Client Satisfaction', label_bn: 'ক্লায়েন্ট সন্তুষ্টি' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  // About copy is intentionally locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = about.titleLine1En ?? 'Design that earns';
  const line2 = about.titleLine2En ?? 'trust at first glance.';

  return (
    <section id="about" className="py-16 md:py-[110px] px-5 sm:px-6 md:px-14 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
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
          <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-[#1e3a8a] mb-7 ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)] leading-[1.4]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)] leading-[1.2]'}`}>
            {isBn ? (
              <>
                <RevealText as="span" className="block" stagger={0} delay={0}>
                  {(about.titleLine1Bn ?? 'এমন ভিজ্যুয়াল, যা প্রথম দেখাতেই')}
                </RevealText>
                <RevealText as="span" className="block italic text-accent" stagger={0} delay={0}>
                  {(about.titleLine2Bn ?? 'বিশ্বাস জন্মায়।')}
                </RevealText>
              </>
            ) : (
              <>
                <RevealText as="span" className="block">{line1}</RevealText>
                <RevealText as="span" delay={0.15} className="block italic text-accent">{line2}</RevealText>
              </>
            )}
          </h2>
          <MotionReveal delay={0.3}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-muted-foreground mb-5">
              {isBn ? (
                <><span lang="en">POLISHED</span>{' একটি প্রিমিয়াম ভিজ্যুয়াল আইডেন্টিটি পার্টনার যা D2C স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ড এবং ই-কমার্স মার্কেটিং এজেন্সিগুলোর জন্য হোয়াইট-লেবেল ক্রিয়েটিভ ইঞ্জিন হিসেবে কাজ করে।'}</>
              ) : about.p1En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.4}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-muted-foreground mb-5">
              {isBn ? about.p2Bn : about.p2En}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.5}>
            {isBn ? (
              <p lang="bn" className="text-[14px] md:text-[15px] leading-[1.8] text-[#1e3a8a] font-medium" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                — আমাদের সিগনেচার: পার্ফরম্যান্স-ফার্স্ট ক্রিয়েটিভস — কনভার্ট করতে, স্কেল করতে।
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[14px] md:text-[15px] leading-[1.8] text-[#1e3a8a] italic font-medium">
                {about.quoteEn ?? '— Identifying a gap: professional Bangla visual design done right.'}
              </p>
            )}
          </MotionReveal>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border border border-border mt-4 md:mt-0">
          {displayStats.map((stat, i) => (
            <MotionReveal key={stat.id} delay={0.15 * (i + 1)}>
              <div
                className="stat-box bg-background p-5 md:p-9 text-center transition-all duration-700 ease-out relative overflow-hidden group hover:bg-[#1e3a8a]/[0.03] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(30,58,138,0.06)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:scale-x-0 before:transition-transform before:duration-700 hover:before:scale-x-100"
              >
                <div className="font-heading text-[40px] md:text-[52px] font-light text-[#1e3a8a] leading-none mb-1.5 md:mb-2">
                  {stat.num}<span className="text-accent">{stat.suffix}</span>
                </div>
                {isBn ? (
                  <div lang="bn" className="text-[13px] tracking-[1px] text-muted-foreground leading-[1.15] py-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    {(['সফল প্রজেক্ট', 'ব্র্যান্ড পার্টনার', 'ইন্ডাস্ট্রি অভিজ্ঞতা', 'ক্লায়েন্ট সন্তুষ্টি'])[i] ?? stat.label_bn}
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
