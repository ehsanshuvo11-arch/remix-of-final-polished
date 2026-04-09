import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import type { AboutContent, Stat } from '@/types/database';

interface AboutProps {
  content: AboutContent | null;
  stats: Stat[];
}

export default function About({ content, stats }: AboutProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const labelRef = useScrollReveal();
  const titleRef = useScrollReveal(0.1);
  const p1Ref = useScrollReveal(0.2);
  const p2Ref = useScrollReveal(0.3);
  const quoteRef = useScrollReveal(0.4);

  const about = content ?? {
    labelEn: 'About Polished',
    labelBn: 'পলিশড সম্পর্কে',
    titleLine1En: 'Design that earns',
    titleLine1Bn: 'ডিজাইন যা অর্জন করে',
    titleLine2En: 'trust at first glance.',
    titleLine2Bn: 'প্রথম দর্শনেই বিশ্বাস।',
    p1En: 'POLISHED is built for mid-range ecommerce-based skincare brands that want to look premium, intentional, and unforgettable — without the agency overhead.',
    p1Bn: 'POLISHED তৈরি হয়েছে মিড-রেঞ্জ ইকমার্স-ভিত্তিক স্কিনকেয়ার ব্র্যান্ডের জন্য যারা প্রিমিয়াম, উদ্দেশ্যমূলক এবং অবিস্মরণীয় দেখতে চায়।',
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

  return (
    <section id="about" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <p ref={labelRef} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
            {t(about.labelEn ?? 'About Polished', about.labelBn ?? 'পলিশড সম্পর্কে')}
          </p>
          <h2 ref={titleRef} className="font-heading font-normal text-primary mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
            {t(about.titleLine1En ?? 'Design that earns', about.titleLine1Bn ?? 'ডিজাইন যা অর্জন করে')}<br />
            <em className="italic">{t(about.titleLine2En ?? 'trust at first glance.', about.titleLine2Bn ?? 'প্রথম দর্শনেই বিশ্বাস।')}</em>
          </h2>
          <p ref={p1Ref} className="text-[15px] leading-[1.85] text-muted-foreground mb-5">
            {t(about.p1En, about.p1Bn)}
          </p>
          <p ref={p2Ref} className="text-[15px] leading-[1.85] text-muted-foreground mb-5">
            {t(about.p2En, about.p2Bn)}
          </p>
          <p ref={quoteRef} className="text-[15px] leading-[1.85] text-primary italic">
            {t(about.quoteEn ?? '— Identifying a gap: professional Bangla visual design done right.', about.quoteBn ?? '— একটি ফাঁক চিহ্নিত করা: পেশাদার বাংলা ভিজ্যুয়াল ডিজাইন সঠিকভাবে।')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border border border-border">
          {displayStats.map((stat) => (
            <div
              key={stat.id}
              className="stat-box bg-background p-7 md:p-9 text-center transition-all duration-300 relative overflow-hidden group hover:bg-[#eef2ff] hover:-translate-y-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:scale-x-0 before:transition-transform before:duration-400 hover:before:scale-x-100"
            >
              <div className="font-heading text-[52px] font-light text-primary leading-none mb-2">
                {stat.num}<span className="text-accent">{stat.suffix}</span>
              </div>
              <div className="text-[11px] tracking-[2px] uppercase text-muted-foreground">
                {t(stat.label_en, stat.label_bn)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
