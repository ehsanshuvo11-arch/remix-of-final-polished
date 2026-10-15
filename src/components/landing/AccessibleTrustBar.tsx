import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Zap, CreditCard, MessageCircle } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';

export default function AccessibleTrustBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const pillars = [
    {
      icon: Zap,
      titleBn: '৭২ ঘণ্টার টেস্ট প্যাক',
      titleEn: '72h Test Pack',
      subBn: '১টি ভিডিও রিল + ২টি ইমেজ অ্যাড',
      subEn: '1 Video Reel + 2 Image Ads',
    },
    {
      icon: CreditCard,
      titleBn: 'বিকাশ ও নগদ',
      titleEn: 'bKash & Nagad',
      subBn: 'আন্তর্জাতিক কার্ডের প্রয়োজন নেই',
      subEn: 'No international card needed',
    },
    {
      icon: MessageCircle,
      titleBn: 'সরাসরি হোয়াটসঅ্যাপ',
      titleEn: 'Direct WhatsApp',
      subBn: 'জিরো মিটিং, সরাসরি চ্যাট',
      subEn: 'Zero meetings. Instant chat',
    },
    {
      icon: ShieldCheck,
      titleBn: '২টি ফ্রি রিভিশন',
      titleEn: '2 Free Revisions',
      subBn: 'যতক্ষণ না দেখতে নিখুঁত হয়',
      subEn: 'Refined until it looks right',
    },
  ];

  return (
    <section className="relative z-20 py-2.5 sm:py-3 md:py-8 bg-white text-primary border-y border-primary/10 md:bg-[#1e3a8a] md:text-[#f9fafb] md:border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-14">
        <MotionReveal>
          {/* ── MOBILE: Clean, Subtle Minimal Horizontal Bar (<768px) ── */}
          <div className="md:hidden flex overflow-x-auto scrollbar-none items-center gap-2 py-1 px-1 -mx-2 touch-pan-x">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f9fafb] border border-primary/10 text-primary shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-accent" />
                  </div>
                  <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span
                      className="text-[11.5px] font-bold tracking-tight text-primary font-heading"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? pillar.titleBn : pillar.titleEn}
                    </span>
                    <span
                      className="text-[10px] text-primary/60 font-sans"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      • {isBn ? pillar.subBn : pillar.subEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── DESKTOP: 4-col Hairline Divided Grid (>=768px) 100% UNTOUCHED ── */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-8 items-stretch py-0.5 md:divide-x divide-white/10">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={i} 
                  className={`flex items-center gap-2.5 md:bg-transparent md:p-0 md:rounded-none md:border-none ${
                    i > 0 ? 'md:pl-6' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 
                      className="font-bold text-xs md:text-sm text-white tracking-tight leading-snug"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? pillar.titleBn : pillar.titleEn}
                    </h3>
                    <p 
                      className="text-[10.5px] md:text-xs text-white/70 font-sans leading-snug mt-0.5"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? pillar.subBn : pillar.subEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
