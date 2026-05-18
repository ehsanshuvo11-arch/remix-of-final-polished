import MotionReveal from '@/components/landing/MotionReveal';

interface Tier {
  title: string;
  subtitle: string;
  price: string;
  highlight?: boolean;
}

const tiers: Tier[] = [
  { title: 'The Conversion Starter', subtitle: 'Foot-in-the-door', price: '$2,000' },
  { title: 'The Visual Retainer', subtitle: 'Monthly Core Service', price: '$5,000', highlight: true },
  { title: 'The Storefront Upgrade', subtitle: 'High-Ticket', price: '$8,000' },
];

export default function Pricing() {
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;

  return (
    <section id="pricing" className="bg-background">
      <div className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium text-center">
            Investment
          </p>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <h2 lang="en" className="font-heading font-normal text-foreground mb-4 leading-[1.1] text-center text-[clamp(32px,5vw,56px)]">
            Pricing built for <em className="italic text-accent">serious brands.</em>
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.15}>
          <p style={enFont} className="text-[13px] md:text-[14px] text-foreground/60 leading-[1.75] text-center max-w-[560px] mx-auto mb-16">
            Three transparent tiers. Built to scale with your brand — from first impression to full storefront overhaul.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 max-w-full">
          {tiers.map((tier, i) => (
            <MotionReveal key={tier.title} delay={0.1 * (i + 1)}>
              <PricingCard tier={tier} />
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: Tier }) {
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const highlight = tier.highlight;

  return (
    <div
      className={`relative flex flex-col items-center text-center p-8 md:p-10 h-full min-h-[380px] transition-all duration-700 ease-out ${
        highlight
          ? 'bg-primary text-primary-foreground border border-accent/40 shadow-[0_20px_60px_-20px_rgba(30,58,138,0.45)] md:-translate-y-2'
          : 'bg-background text-foreground border border-foreground/10 hover:-translate-y-1 hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.12)]'
      }`}
      style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.7s ease-out' }}
    >
      {highlight && (
        <span
          style={enFont}
          className="absolute top-4 right-4 text-[9px] tracking-[2.5px] uppercase text-accent font-medium"
        >
          Most Chosen
        </span>
      )}

      <p
        style={enFont}
        className={`text-[10px] tracking-[3.5px] uppercase font-medium mb-5 ${highlight ? 'text-accent' : 'text-accent'}`}
      >
        {tier.subtitle}
      </p>

      <h3 className={`font-heading font-normal leading-[1.15] text-[26px] md:text-[28px] mb-6 break-words max-w-full ${highlight ? 'text-primary-foreground' : 'text-foreground'}`}>
        {tier.title}
      </h3>

      <div className={`h-px w-10 mb-6 ${highlight ? 'bg-accent/50' : 'bg-foreground/15'}`} />

      <div className="flex-1 flex flex-col items-center justify-center mb-8">
        <span className={`font-heading font-normal text-[clamp(40px,7vw,56px)] leading-none ${highlight ? 'text-primary-foreground' : 'text-foreground'}`}>
          {tier.price}
        </span>
        <span style={enFont} className={`mt-3 text-[11px] tracking-[1.5px] uppercase ${highlight ? 'text-primary-foreground/55' : 'text-foreground/45'}`}>
          One-time engagement
        </span>
      </div>

      <a
        href="#contact"
        style={enFont}
        className={`inline-flex items-center justify-center w-full px-6 py-3.5 text-[11px] tracking-[2.5px] uppercase font-medium transition-all duration-500 ${
          highlight
            ? 'bg-accent text-primary hover:bg-accent/90'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        Start A Project
      </a>
    </div>
  );
}
