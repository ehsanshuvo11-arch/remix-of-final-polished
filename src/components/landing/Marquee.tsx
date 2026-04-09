interface MarqueeProps {
  items: string[];
}

export default function Marquee({ items }: MarqueeProps) {
  const defaultItems = [
    'Precision Aesthetics',
    'Skincare Visual Systems',
    'Bangla Typography',
    'Premium Positioning',
    'Social Media Design',
  ];
  const displayItems = items.length > 0 ? items : defaultItems;

  const trackContent = displayItems.map((item, i) => (
    <span key={i}>
      <span className="font-heading text-[15px] font-medium tracking-[3px] uppercase text-accent-foreground px-10">
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
