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
  const isInView = useInView(ref, { once: true, margin: '150px 0px 50px 0px' });
  const isMobile = useIsMobileDevice();

  const words = children.split(' ');
  const step = isMobile ? 0.012 : 0.02;

  return (
    <Tag ref={ref as any} className={`inline-block overflow-visible ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-visible"
          style={{
            marginRight: '0.24em',
            paddingTop: '0.1em',
            paddingBottom: '0.16em',
          }}
        >
          <m.span
            className="inline-block transform-gpu overflow-visible"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
            initial={{ y: 6, opacity: 0.85 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 6, opacity: 0.85 }}
            transition={{
              duration: isMobile ? 0.25 : 0.35,
              delay: delay + i * step,
              ease: LUXURY_EASE as any,
              opacity: { duration: 0.2, ease: 'easeOut' },
            }}
          >
            {word}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
