import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { triggerInquiry } from '@/lib/inquiry-events';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import type { Service, ServicesMetaContent } from '@/types/database';

interface ServicesProps {
  services: Service[];
  content?: ServicesMetaContent | null;
}

export default function Services({ services, content }: ServicesProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const defaultServices: Service[] = [
    { id: '1', sort_order: 1, name_en: 'High-Conversion Social Media Design', name_bn: 'হাই-কনভার্শন সোশ্যাল মিডিয়া ডিজাইন', desc_en: "Feed posts, carousels, reels covers, and ad funnels using our signature 'Premium Bengali' approach. Engineered specifically to turn passive scrollers into high-value buyers.", desc_bn: "ফিড পোস্ট, ক্যারোসেল, রিলস কভার এবং অ্যাড ফানেল—আমাদের সিগনেচার 'প্রিমিয়াম বাংলা' মেথডে তৈরি, যা সাধারণ স্ক্রোলারদের ক্রেতায় রূপান্তর করে।" },
    { id: '2', sort_order: 2, name_en: 'Bangla Visual Identity & Typography', name_bn: 'বাংলা ভিজ্যুয়াল আইডেন্টিটি ও টাইপোগ্রাফি', desc_en: 'High-end, sophisticated Bengali copywriting paired with world-class visual design. Maximum relatability for the Bangladeshi market without ever compromising on luxury perception.', desc_bn: 'উচ্চমানের পরিশীলিত বাংলা কপিরাইটিং এবং আন্তর্জাতিক মানের ভিজ্যুয়াল ডিজাইন—যা লাক্সারি লুক অক্ষুণ্ণ রেখে স্থানীয় অডিয়েন্সের সাথে গভীর সংযোগ গড়ে তোলে।' },
    { id: '3', sort_order: 3, name_en: 'White-Label Agency Partnership', name_bn: 'হোয়াইট-লেবেল এজেন্সি পার্টনারশিপ', desc_en: "Acting as the invisible backend creative engine for marketing agencies. We deliver high-converting visual assets to lower CAC and maximize ROAS for your clients, without in-house bottlenecks.", desc_bn: "মার্কেটিং এজেন্সিগুলোর ব্যাকএন্ড ক্রিয়েটিভ পাওয়ারহাউস হিসেবে কাজ করে আমরা ক্লায়েন্টদের জন্য হাই-কনভার্টিং অ্যাসেট তৈরি করি—টিম হায়ারিংয়ের ঝামেলা ছাড়াই।" },
    { id: '4', sort_order: 4, name_en: 'E-commerce Visual Strategy & Storefronts', name_bn: 'ই-কমার্স ভিজ্যুয়াল স্ট্র্যাটেজি ও স্টোরফ্রন্ট', desc_en: 'Crafting trust-building assets for storefronts, product pages, and checkout flows. Ensuring your brand looks expensive, authoritative, and optimized for maximum AOV.', desc_bn: 'স্টোরফ্রন্ট ও প্রোডাক্ট পেজের জন্য ট্রাস্ট-বিল্ডিং ভিজ্যুয়াল যা ব্র্যান্ডকে প্রিমিয়াম ও বিশ্বাসযোগ্য করে তোলে এবং গড় অর্ডার ভ্যালু (AOV) বাড়ায়।' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

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

        {/* Responsive Grid: Vertical Stack on Mobile (effortless reading), 2x2 Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-px md:bg-primary-foreground/10 md:border md:border-primary-foreground/10 mt-8 md:mt-14">
          {displayServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

      </div>
    </div>
  );
}

const SERVICE_HIGHLIGHTS: Record<number, { en: string[]; bn: string[] }> = {
  0: {
    en: ['Turn Scrollers into Buyers', 'Meta / TikTok Ad Variations', 'Lower Cost Per Acquisition (CAC)'],
    bn: ['স্ক্রোলারদের ক্রেতায় রূপান্তর', 'মেটা ও টিকটক অ্যাড ভেরিয়েশন', 'কাস্টমার একুইজিশন খরচ হ্রাস']
  },
  1: {
    en: ['Noto Serif Bengali Typography', 'Sophisticated Brand Phrasing', 'Unquestionable Luxury Prestige'],
    bn: ['নান্দনিক বাংলা টাইপোগ্রাফি', 'উচ্চমানের ব্র্যান্ড ভাষা', 'অনবদ্য লাক্সারি সম্মান']
  },
  2: {
    en: ['Backend Creative Powerhouse', 'Strict 48-Hour Turnaround', 'Scale Without Hiring In-House'],
    bn: ['ইনভিজিবল ব্যাকএন্ড ক্রিয়েটিভ টিম', '৪৮ ঘণ্টার টার্নঅ্যারাউন্ড', 'টিম হায়ারিং ছাড়াই বিজনেস স্কেলিং']
  },
  3: {
    en: ['High-Trust Storefront UI', 'Product Page Visual Architectures', 'Increased Average Order Value'],
    bn: ['হাই-ট্রাস্ট স্টোরফ্রন্ট UI', 'প্রোডাক্ট পেজ ইনফোগ্রাফিক', 'গড় অর্ডার ভ্যালু (AOV) বৃদ্ধি']
  }
};

function ServiceCard({ service, index, isMobileDeck = false }: { service: Service; index: number; isMobileDeck?: boolean }) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTilt = (e: React.MouseEvent) => {
    if (isMobileDeck) return;
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

  const highlights = SERVICE_HIGHLIGHTS[index % 4] || SERVICE_HIGHLIGHTS[0];
  const items = isBn ? highlights.bn : highlights.en;

  const title = isBn
    ? (index === 0 ? 'হাই-কনভার্শন সোশ্যাল মিডিয়া ডিজাইন' : index === 1 ? 'বাংলা ভিজ্যুয়াল আইডেন্টিটি ও টাইপোগ্রাফি' : service.name_bn || service.name_en)
    : service.name_en;

  return (
    <MotionReveal delay={isMobileDeck ? 0.05 : 0.12 * (index + 1)} className="w-full shrink-0 md:min-w-0 md:max-w-none md:shrink h-full">
      <div
        ref={cardRef}
        onMouseMove={isMobileDeck ? undefined : handleTilt}
        onMouseLeave={isMobileDeck ? undefined : handleTiltLeave}
        className="service-card h-full bg-primary border border-primary-foreground/10 md:border-0 rounded-lg p-6 md:p-12 relative overflow-hidden transition-all duration-700 ease-out group hover:bg-primary/85 hover:-translate-y-1 md:hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col justify-between"
        style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), background-color 0.7s ease-out, box-shadow 0.7s ease-out' }}
      >
        <div>
          <div className="font-heading text-[38px] md:text-5xl font-light text-primary-foreground/[0.08] leading-none mb-5 md:mb-7 transition-all duration-700 group-hover:text-accent/20 group-hover:scale-110 group-hover:translate-x-1">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div lang={isBn ? 'bn' : 'en'} className="font-heading text-xl md:text-2xl font-normal text-primary-foreground mb-3.5 leading-snug">
            {title}
          </div>
          <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }} className="text-[13px] md:text-[14px] leading-[1.75] text-primary-foreground/60 mb-6 relative z-10">
            {isBn ? (service.desc_bn || service.desc_en) : service.desc_en}
          </p>

          {/* Value Highlights */}
          <ul className="space-y-2 mb-8">
            {items.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-[12px] md:text-[13px] text-primary-foreground/80 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conversion Action */}
        <div className="pt-6 border-t border-primary-foreground/10 flex items-center justify-between relative z-20">
          <button
            type="button"
            onClick={() => {
              triggerInquiry({ service: service.name_en, note: `Inquiry for ${service.name_en}` });
              openAuditModal({ service: service.name_en, source: `Service: ${service.name_en}` });
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[1.5px] font-semibold text-accent hover:text-white transition-colors group/btn cursor-pointer"
          >
            <span>{isBn ? 'প্রস্তাবনা ও ফ্রি অডিট চান' : 'Inquire & Claim Audit'}</span>
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-9 right-9 h-px bg-gradient-to-r from-accent to-transparent scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100" />
      </div>
    </MotionReveal>
  );
}
