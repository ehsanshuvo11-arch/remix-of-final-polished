import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import type { Service, ServicesMetaContent } from '@/types/database';

interface ServicesProps {
  services: Service[];
  content?: ServicesMetaContent | null;
}

export default function Services({ services, content }: ServicesProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';

  const defaultServices: Service[] = [
    { id: '1', sort_order: 1, name_en: 'Social Media Design', name_bn: 'সোশ্যাল মিডিয়া ডিজাইন', desc_en: 'Feed posts, stories, reels covers, and carousels — all crafted with visual consistency and scroll-stopping clarity. Built for Instagram skincare brands that want to look premium, not templated.', desc_bn: 'ফিড পোস্ট, স্টোরি, রিলস কভার এবং ক্যারোসেল — সবকিছু তৈরি হয় ভিজ্যুয়াল সামঞ্জস্য রেখে।' },
    { id: '2', sort_order: 2, name_en: 'Bangla Visual Design', name_bn: 'বাংলা ভিজ্যুয়াল ডিজাইন', desc_en: 'Professional, aesthetically refined Bangla typography and layout — a rare skill. If your brand speaks to Bangladesh, your visuals should feel premium in Bangla too.', desc_bn: 'পেশাদার ও নান্দনিক বাংলা টাইপোগ্রাফি — যা বাংলাদেশে বিরল।' },
    { id: '3', sort_order: 3, name_en: 'White-Label Agency Partnership', name_bn: 'হোয়াইট-লেবেল এজেন্সি পার্টনারশিপ', desc_en: "Acting as the creative backend for marketting agencies, delivering high-converting 'Premium Bengali' visuals to lower CAC and maximize ROAS for your clients.", desc_bn: "মার্কেটিং এজেন্সিগুলোর ক্রিয়েটিভ ব্যাকএন্ড হিসেবে কাজ করে, আমরা তৈরি করি হাই-কনভার্টিং 'প্রিমিয়াম বাংলা' ভিজ্যুয়াল—যা আপনার ক্লায়েন্টদের CAC কমায় এবং ROAS বহুগুণ বাড়িয়ে দেয়।" },
    { id: '4', sort_order: 4, name_en: 'E-commerce Visual Strategy', name_bn: 'ই-কমার্স ভিজ্যুয়াল স্ট্র্যাটেজি', desc_en: 'Crafting trust-building assets for storefronts, ensuring your brand looks expensive, authoritative, and perfectly optimized for high-conversion sales.', desc_bn: 'ই-কমার্স স্টোরফ্রন্টের জন্য ট্রাস্ট-বিল্ডিং ভিজ্যুয়াল তৈরি করা, যা আপনার ব্র্যান্ডকে প্রিমিয়াম লুক দেওয়ার পাশাপাশি কনভার্শন রেট বাড়াতে সাহায্য করে।' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  // Services headings/labels locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = content?.titleLine1En ?? 'Services built for premium brands';
  const line2 = content?.titleLine2En ?? 'and marketing agencies.';

  return (
    <div id="services" className="bg-primary">
      <div className="py-24 md:py-32 px-6 md:px-14 max-w-[1200px] mx-auto">
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

        <div className="flex items-stretch w-full max-w-full gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide -mx-6 px-6 pb-6 mt-10 md:mx-0 md:px-0 md:pb-0 md:mt-14 md:grid md:grid-cols-2 md:gap-px md:bg-primary-foreground/8 md:border md:border-primary-foreground/8 md:overflow-visible md:max-w-none">
          {displayServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { t, lang } = useLanguage();
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
        className="service-card h-full bg-primary border border-primary-foreground/10 md:border-0 p-7 md:p-12 relative overflow-hidden transition-all duration-700 ease-out group hover:bg-[#152f78] hover:-translate-y-1 md:hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-accent/[0.09] after:to-transparent after:opacity-0 after:transition-opacity after:duration-700 hover:after:opacity-100"
        style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), background-color 0.7s ease-out, box-shadow 0.7s ease-out' }}
      >
        <div className="font-heading text-5xl font-light text-primary-foreground/[0.06] leading-none mb-7 transition-all duration-700 group-hover:text-accent/15 group-hover:scale-110 group-hover:translate-x-1">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div lang={isBn ? 'bn' : 'en'} className="font-heading text-xl font-normal text-primary-foreground mb-3.5 leading-tight">
          {isBn
            ? (index === 0 ? 'সোশ্যাল মিডিয়া ডিজাইন' : index === 1 ? 'প্রিমিয়াম বাংলা ভিজ্যুয়াল ডিজাইন' : service.name_bn || service.name_en)
            : service.name_en}
        </div>
        <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }} className="text-[13px] leading-[1.75] text-primary-foreground/50 relative z-10">
          {isBn ? (service.desc_bn || service.desc_en) : service.desc_en}
        </p>
        <div className="absolute bottom-0 left-9 right-9 h-px bg-gradient-to-r from-accent to-transparent scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100" />
      </div>
    </MotionReveal>
  );
}
