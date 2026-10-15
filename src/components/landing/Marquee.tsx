import { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MarqueeProps {
  items: string[];
}

// Bengali transcreations keyed by the canonical English source string (lowercased).
const bnMap: Record<string, string> = {
  'e-commerce visual systems': 'ই-কমার্স ভিজ্যুয়াল সিস্টেম',
  'brand identity systems': 'ব্র্যান্ড আইডেন্টিটি সিস্টেম',
};

function Marquee({ items }: MarqueeProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const defaultItemsBn = [
    'প্রথম ১ সেকেন্ডে আঙুল থামানো ভিডিও',
    'নকলের ভয় দূর করা ছবির পোস্ট',
    'মন ছুঁয়ে যাওয়া বাংলা ক্যাপশন',
    'কম্বো সেট ডিজাইন',
  ];
  const defaultItemsEn = [
    'Scroll-Stopping Video Reels',
    'High-Trust Image Posts',
    'Persuasive Sales Copy',
    'High-Converting Combo Designs',
  ];
  const displayItems = isBn ? defaultItemsBn : defaultItemsEn;

  const trackContent = displayItems.map((item, i) => (
    <span key={i} lang={isBn ? 'bn' : 'en'}>
      <span
        className={`${isBn ? 'text-[14px] sm:text-[15px] tracking-normal font-medium' : 'font-heading text-[13px] sm:text-[14px] font-semibold tracking-[2.5px] uppercase'} text-[#1e3a8a] px-8 sm:px-10`}
        style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
      >
        {item}
      </span>
      <span className="text-[#1e3a8a]/40 text-[8px] align-middle px-1">●</span>
    </span>
  ));

  return (
    <div className="bg-accent overflow-hidden py-3.5">
      <div 
        className="flex whitespace-nowrap" 
        style={{ 
          animation: 'marquee 22s linear infinite',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform'
        }}
      >
        {trackContent}
        {trackContent}
      </div>
    </div>
  );
}

// Static/decorative — memoized so scroll & state churn never re-renders it.
export default memo(Marquee);
