import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import SwipeProgress from '@/components/landing/SwipeProgress';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import type { Service, ServicesMetaContent } from '@/types/database';


interface ServicesProps {
  services: Service[];
  content?: ServicesMetaContent | null;
}

export default function Services({ services, content }: ServicesProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const trackRef = useRef<HTMLDivElement>(null);
  useDragScroll(trackRef);


  const coreServices: Service[] = [
    { id: 'meta-ad-fatigue-rescue', sort_order: 1, name_en: 'Meta Ad Fatigue Rescue (Sprint)', name_bn: 'মেটা অ্যাড ফ্যাটিগ রেসকিউ (স্প্রিন্ট)', desc_en: 'Refresh your underperforming ads with 4 new psychological hook variations. We lower your Cost Per Result (CPR) and rescue your ad spend from creative fatigue.', desc_bn: '৪টি নতুন সাইকোলজিক্যাল হুক ভ্যারিয়েশন দিয়ে আপনার কম পারফর্ম করা বিজ্ঞাপনগুলোকে নতুন করে সাজাই। আমরা আপনার Cost Per Result (CPR) কমিয়ে ক্রিয়েটিভ ফ্যাটিগ থেকে বিজ্ঞাপনের বাজেট রক্ষা করি।' },
    { id: 'educational-combo-carousels', sort_order: 2, name_en: 'Educational Combo Carousels', name_bn: 'এডুকেশনাল কম্বো ক্যারোসেল', desc_en: '5-7 slide swipeable carousels focusing on problem → ingredient → usage → combo offer. Proven to increase basket size and Average Order Value (AOV) by 50%.', desc_bn: 'সমস্যা → উপাদান → ব্যবহার → কম্বো অফার—এই ধারায় ৫–৭ স্লাইডের সোয়াইপযোগ্য ক্যারোসেল। বাস্কেট সাইজ এবং Average Order Value (AOV) ৫০% পর্যন্ত বাড়াতে কার্যকর।' },
    { id: 'meta-policy-safe-creatives', sort_order: 3, name_en: 'Meta Policy-Safe Creatives', name_bn: 'মেটা পলিসি-সেফ ক্রিয়েটিভ', desc_en: "Stop worrying about ad account bans. We design 100% Meta-compliant creatives without risky 'zoom-in' Before-After shots, ensuring your campaigns run smoothly.", desc_bn: 'অ্যাড অ্যাকাউন্ট ব্যান হওয়ার দুশ্চিন্তা বাদ দিন। ঝুঁকিপূর্ণ “জুম-ইন” Before-After শট ছাড়াই আমরা ১০০% Meta-compliant ক্রিয়েটিভ তৈরি করি, যাতে আপনার ক্যাম্পেইন নির্বিঘ্নে চলে।' },
  ];

  const legacyServiceNames = [
    'social media design',
    'high-conversion social media design',
    'bangla visual design',
    'bangla visual identity',
    'white-label agency partnership',
    'white-label agency',
    'e-commerce visual strategy',
    'e-commerce strategy',
  ];
  const hasLegacyServices = services.some((service) =>
    legacyServiceNames.includes(service.name_en.trim().toLowerCase()),
  );
  const displayServices = services.length > 0 && !hasLegacyServices ? services : coreServices;

  // Services headings/labels locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = content?.titleLine1En ?? 'Services built for premium brands';
  const line2 = content?.titleLine2En ?? 'and marketing agencies.';

  return (
    <div id="services" className="bg-primary">
      <div className="py-20 md:py-32 px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          {isBn ? (
            <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              আমাদের এক্সপার্টিজ
            </p>
          ) : (
            <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
              {content?.labelEn ?? 'What We Do'}
            </p>
          )}
        </MotionReveal>
        <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary-foreground mb-7 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
          {isBn ? (
            <>
              <WordReveal delay={0.1}>প্রিমিয়াম ব্র্যান্ড এবং মার্কেটিং এজেন্সিগুলোর</WordReveal>
              <br />
              <em className="italic text-accent">
                <WordReveal delay={0.25}>জন্য তৈরি আমাদের সার্ভিসসমূহ।</WordReveal>
              </em>
            </>
          ) : (
            <>
              <WordReveal delay={0.1}>{line1}</WordReveal>
              <br />
              <em className="italic">
                <WordReveal delay={0.25}>{line2}</WordReveal>
              </em>
            </>
          )}
        </h2>

        <div ref={trackRef} className="flex items-stretch w-full max-w-full gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide cursor-grab touch-auto -mx-6 px-6 pb-6 mt-10 md:mx-0 md:px-0 md:pb-0 md:mt-14 md:grid md:grid-cols-3 md:gap-px md:bg-primary-foreground/8 md:border md:border-primary-foreground/8 md:overflow-visible md:max-w-none">
          {displayServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
        <SwipeProgress containerRef={trackRef} count={displayServices.length} tone="light" />

      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTilt = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = ((midY - y) / midY) * 6;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  };

  const handleTiltLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <MotionReveal delay={0.12 * (index + 1)} className="min-w-[85vw] max-w-[85vw] shrink-0 snap-center md:min-w-0 md:max-w-none md:shrink md:snap-align-none">
      <div
        ref={cardRef}
        onMouseMove={handleTilt}
        onMouseLeave={handleTiltLeave}
        className="service-card h-full bg-primary border border-primary-foreground/10 md:border-0 p-6 md:p-12 relative overflow-hidden transition-all duration-700 ease-out group hover:bg-[#152f78] hover:-translate-y-1 md:hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-accent/[0.09] after:to-transparent after:opacity-0 after:transition-opacity after:duration-700 hover:after:opacity-100"
        style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), background-color 0.7s ease-out, box-shadow 0.7s ease-out' }}
      >
        <div className="font-heading text-[38px] md:text-5xl font-light text-primary-foreground/[0.06] leading-none mb-5 md:mb-7 transition-all duration-700 group-hover:text-accent/15 group-hover:scale-110 group-hover:translate-x-1">

          {String(index + 1).padStart(2, '0')}
        </div>
        <div lang={isBn ? 'bn' : 'en'} className="font-heading text-xl font-normal text-primary-foreground mb-3.5 leading-tight">
          {isBn ? (service.name_bn || service.name_en) : service.name_en}
        </div>
        <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }} className="text-[13px] leading-[1.75] text-primary-foreground/50 relative z-10">
          {isBn ? (service.desc_bn || service.desc_en) : service.desc_en}
        </p>
        <div className="absolute bottom-0 left-9 right-9 h-px bg-gradient-to-r from-accent to-transparent scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100" />
      </div>
    </MotionReveal>
  );
}
