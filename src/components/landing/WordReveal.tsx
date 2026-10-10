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

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export default function WordReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: WordRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px 30px 0px', amount: 'some' });
  const isMobile = useIsMobileDevice();

  const words = children.split(' ');
  const step = isMobile ? 0.012 : 0.018;

  return (
    <Tag ref={ref as any} className={className}>
      {words.map((word, i) => (
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
            className="inline-block transform-gpu"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: isMobile ? 0.28 : 0.36,
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
