import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Zap, CreditCard, MessageCircle } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';

export default function AccessibleTrustBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const pillars = [
    {
      icon: Zap,
      titleBn: 'নো-রিস্ক টেস্ট ড্রাইভ (৳৩,৯৯৯)',
      titleEn: 'No-Risk Test Drive (৳3,999)',
      descBn: 'কোনো দীর্ঘমেয়াদী চুক্তি নেই। মাত্র ৪৮ ঘণ্টায় ৫টি হাই-কনভার্টিং মেটা অ্যাড টেস্ট করুন।',
      descEn: 'Zero contract lock-in. Test 5 high-converting Meta Ads in just 48 hours.',
      highlight: true,
    },
    {
      icon: CreditCard,
      titleBn: 'বিকাশ ও নগদ পেমেন্ট',
      titleEn: 'bKash & Nagad Payments',
      descBn: 'ডলার কার্ড লাগবে না। বিকাশ, নগদ বা যেকোনো লোকাল ব্যাংক অ্যাকাউন্টে সহজ ইনভয়েসিং।',
      descEn: 'No international cards needed. Pay easily via bKash, Nagad, or local bank transfer.',
      highlight: false,
    },
    {
      icon: MessageCircle,
      titleBn: 'সরাসরি হোয়াটসঅ্যাপ সাপোর্ট',
      titleEn: 'Direct WhatsApp Support',
      descBn: 'কোনো জটিল মিটিং বা ফর্ম নয়। ১-অন-১ হোয়াটসঅ্যাপ চ্যাটে সার্বক্ষণিক আপডেট ও ব্রিফ।',
      descEn: 'No tedious forms or meetings. 1-on-1 direct WhatsApp updates with your designer.',
      highlight: false,
    },
    {
      icon: ShieldCheck,
      titleBn: '১০০% রিভিশন নিশ্চয়তা',
      titleEn: '100% Free Revisions',
      descBn: 'ডিজাইন শতভাগ পছন্দ না হওয়া পর্যন্ত বিনামূল্যে পরিবর্তন। আপনার সন্তুষ্টিই অগ্রাধিকার।',
      descEn: 'Unlimited fine-tuning until you are completely satisfied. Your peace of mind guaranteed.',
      highlight: false,
    },
  ];

  return (
    <section className="relative z-20 py-10 md:py-14 bg-gradient-to-b from-[#1e3a8a] via-[#1a3275] to-[#f9fafb] text-primary-foreground border-b border-primary/10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-14">
        <MotionReveal>
          <div className="text-center mb-8">
            <span 
              className="inline-block text-[11px] md:text-xs font-semibold tracking-[2px] uppercase text-accent bg-accent/10 border border-accent/25 px-3 py-1 rounded-full mb-3"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: '1px' } : undefined}
            >
              {isBn ? 'স্বচ্ছ ও সহজলভ্য সার্ভিস' : 'Transparent & Accessible Workflow'}
            </span>
            <h2 
              className="text-xl md:text-3xl font-heading font-medium text-white tracking-normal"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn ? 'কেন বাংলাদেশি উদ্যোক্তারা দ্বিধাহীনভাবে আমাদের বেছে নিচ্ছেন?' : 'Engineered for Real Growth. Accessible for Ambitious Brands.'}
            </h2>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <MotionReveal key={i} delay={0.08 * i}>
                <div className={`h-full p-5 md:p-6 rounded-2xl transition-all duration-300 border ${
                  pillar.highlight 
                    ? 'bg-accent/15 border-accent/40 shadow-[0_8px_24px_rgba(251,146,60,0.15)]' 
                    : 'bg-white/[0.06] border-white/12 hover:border-accent/30 hover:bg-white/[0.08]'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      pillar.highlight ? 'bg-accent text-accent-foreground' : 'bg-white/10 text-accent'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 
                      className="font-bold text-sm md:text-[15px] text-white leading-snug"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? pillar.titleBn : pillar.titleEn}
                    </h3>
                  </div>
                  <p 
                    className="text-xs md:text-[13px] text-white/80 leading-relaxed font-sans"
                    style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                  >
                    {isBn ? pillar.descBn : pillar.descEn}
                  </p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
