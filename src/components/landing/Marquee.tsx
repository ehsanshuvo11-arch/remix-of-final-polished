import { useLanguage } from '@/contexts/LanguageContext';

interface MarqueeProps {
  items: string[];
}

// Bengali transcreations keyed by the canonical English source string (lowercased).
const bnMap: Record<string, string> = {
  'precision aesthetics': 'নিখুঁত এস্থেটিক্স',
  'skincare visual systems': 'স্কিনকেয়ার ভিজ্যুয়াল সিস্টেম',
  'bangla typography': 'সিগনেচার বাংলা টাইপোগ্রাফি',
  'premium positioning': 'এক্সক্লুসিভ পজিশনিং',
  'social media design': 'কনভার্শন-ফোকাসড ডিজাইন',
};

export default function Marquee({ items }: MarqueeProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const defaultItems = [
    'Precision Aesthetics',
    'Skincare Visual Systems',
    'Bangla Typography',
    'Premium Positioning',
    'Social Media Design',
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
