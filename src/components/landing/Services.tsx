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
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  // Services headings/labels locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = content?.titleLine1En ?? 'Services built for';
  const line2 = content?.titleLine2En ?? 'ecommerce-based skincare brands.';

  return (
    <div id="services" className="bg-primary">
      <div className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
            {content?.labelEn ?? 'What We Do'}
          </p>
        </MotionReveal>
        <h2 lang={isBn ? 'bn' : 'en'} className="font-heading font-normal text-primary-foreground mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
          {isBn ? (
            <WordReveal delay={0.1}>স্কিনকেয়ার ব্র্যান্ডের জন্য এক্সক্লুসিভ ভিজ্যুয়াল আইডেন্টিটি।</WordReveal>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary-foreground/8 border border-primary-foreground/8 mt-14">
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
    <MotionReveal delay={0.12 * (index + 1)}>
      <div
        ref={cardRef}
        onMouseMove={handleTilt}
        onMouseLeave={handleTiltLeave}
        className="service-card bg-primary p-10 md:p-12 relative overflow-hidden transition-all duration-700 ease-out group hover:bg-[#152f78] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-accent/[0.09] after:to-transparent after:opacity-0 after:transition-opacity after:duration-700 hover:after:opacity-100"
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
