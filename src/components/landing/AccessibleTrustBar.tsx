import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Zap, CreditCard, MessageCircle } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';

export default function AccessibleTrustBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const pillars = [
    {
      icon: Zap,
      titleBn: 'নো-রিস্ক টেস্ট ড্রাইভ',
      titleEn: 'No-Risk Test Drive',
      subBn: '৳৩,৯৯৯ • ৪৮ ঘণ্টায় ৫টি অ্যাড',
      subEn: '৳3,999 • 48h 5-Ad Sprint',
    },
    {
      icon: CreditCard,
      titleBn: 'বিকাশ ও নগদ সাপোর্ট',
      titleEn: 'bKash & Nagad Payments',
      subBn: 'ডলার কার্ড ছাড়াই সহজ পেমেন্ট',
      subEn: 'No international cards needed',
    },
    {
      icon: MessageCircle,
      titleBn: 'সরাসরি হোয়াটসঅ্যাপ',
      titleEn: 'Direct WhatsApp',
      subBn: 'কোনো ফর্ম বা জটিল মিটিং নেই',
      subEn: 'No forms, direct 1-on-1 chat',
    },
    {
      icon: ShieldCheck,
      titleBn: '১০০% ফ্রি রিভিশন',
      titleEn: '100% Free Revisions',
      subBn: 'সম্পূর্ণ সন্তুষ্টি পর্যন্ত ফাইন-টিউনিং',
      subEn: 'Unlimited fine-tuning guaranteed',
    },
  ];

  return (
    <section className="relative z-20 py-6 md:py-8 bg-primary/98 text-primary-foreground border-y border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-14">
        <MotionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'pt-3 md:pt-0 md:pl-6' : ''}`}>
                  <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 
                      className="font-bold text-xs md:text-sm text-white tracking-wide truncate"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? pillar.titleBn : pillar.titleEn}
                    </h3>
                    <p 
                      className="text-[11px] md:text-xs text-white/70 truncate font-sans"
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
