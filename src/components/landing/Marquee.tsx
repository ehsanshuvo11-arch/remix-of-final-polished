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

  const defaultItems = [
    'E-Commerce Visual Systems',
    'Brand Identity Systems',
  ];
  const sourceItems = items.length > 0 ? items : defaultItems;

  const displayItems = isBn
    ? sourceItems.map((item) => bnMap[item.trim().toLowerCase()] ?? item)
    : sourceItems;

  const trackContent = displayItems.map((item, i) => (
    <span key={i} lang={isBn ? 'bn' : 'en'}>
      <span
        className={`${isBn ? 'text-[15px] tracking-[1px] normal-case' : 'font-heading text-[15px] font-medium tracking-[3px] uppercase'} text-accent-foreground px-10`}
        style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", fontWeight: 200 } : undefined}
      >
        {item}
      </span>
      <span className="text-accent-foreground/50 text-[8px] align-middle px-1">●</span>
    </span>
  ));

  return (
    <div className="bg-accent overflow-hidden py-3.5">
      <div className="flex whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
        {trackContent}
        {trackContent}
      </div>
    </div>
  );
}

// Static/decorative — memoized so scroll & state churn never re-renders it.
export default memo(Marquee);
