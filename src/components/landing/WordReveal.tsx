import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';

interface WordRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  renderWord?: (word: string, index: number) => React.ReactNode;
}

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export default function WordReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: WordRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px', amount: 0.2 });
  const isMobile = useIsMobileDevice();

  const words = children.split(' ');
  // Same reveal on mobile, marginally tighter stagger to avoid frame backlog.
  const step = isMobile ? 0.03 : 0.04;

  return (
    <Tag ref={ref as any} className={className}>
      {words.map((word, i) => (
        // The mask needs overflow:hidden for the slide-up, which would otherwise
        // clip descenders (g, y, p) and italic tails. Pad the mask and pull the
        // extra space back with negative margins so layout stays identical.
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{
            paddingBottom: '0.18em',
            marginBottom: '-0.18em',
            paddingRight: '0.12em',
            marginRight: '0.18em',
          }}
        >
          <m.span
            className="inline-block transform-gpu will-change-transform"
            style={{ backfaceVisibility: 'hidden' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * step,
              ease: LUXURY_EASE as any,
            }}
          >
            {word}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
