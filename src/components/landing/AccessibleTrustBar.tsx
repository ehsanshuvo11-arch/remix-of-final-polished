import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Zap, CreditCard, MessageCircle } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';

export default function AccessibleTrustBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const pillars = [
    {
      icon: Zap,
      titleBn: 'বিজ্ঞাপন টেস্ট ড্রাইভ',
      titleEn: 'No-Risk Test Drive',
      subBn: '৭২ ঘণ্টায় ৫টি ব্যানার ডিজাইন',
      subEn: '5 Bespoke Creatives in 72h',
    },
    {
      icon: CreditCard,
      titleBn: 'বিকাশ ও নগদ সাপোর্ট',
      titleEn: 'bKash & Nagad Accepted',
      subBn: 'ডলার কার্ড ছাড়াই সহজ পেমেন্ট',
      subEn: 'No international card needed',
    },
    {
      icon: MessageCircle,
      titleBn: 'সরাসরি হোয়াটসঅ্যাপ',
      titleEn: 'Direct WhatsApp',
      subBn: 'কোনো লম্বা মিটিং নেই, সরাসরি চ্যাট',
      subEn: 'Zero boring meetings. Instant chat',
    },
    {
      icon: ShieldCheck,
      titleBn: 'ফ্রি রিভিশন গ্যারান্টি',
      titleEn: 'Free Revision Guarantee',
      subBn: 'মনমতো না হওয়া পর্যন্ত ঠিক করে দেব',
      subEn: 'We adjust until you are happy',
    },
  ];

  return (
    <section className="relative z-20 py-4 sm:py-5 md:py-8 bg-[#1e3a8a] text-[#f9fafb] border-y border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-14">
        <MotionReveal>
          {/* Mobile: 2-column luxury breathing grid with zero truncation; Desktop: 4-col hairline grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-8 items-stretch py-0.5 md:divide-x divide-white/10">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={i} 
                  className={`flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-2.5 bg-white/[0.05] hover:bg-white/[0.08] md:bg-transparent p-3 sm:p-3.5 md:p-0 rounded-2xl md:rounded-none border border-white/12 md:border-none transition-colors duration-300 ${
                    i > 0 ? 'md:pl-6' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 
                      className="font-bold text-[11.5px] sm:text-xs md:text-sm text-white tracking-tight leading-snug"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? pillar.titleBn : pillar.titleEn}
                    </h3>
                    <p 
                      className="text-[10px] sm:text-[10.5px] md:text-xs text-white/70 font-sans leading-snug mt-0.5"
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
