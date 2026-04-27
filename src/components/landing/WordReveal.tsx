import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

  return (
    <Tag ref={ref as any} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={isMobile ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            animate={isMobile ? { y: '0%', opacity: 1 } : (isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 })}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.04,
              ease: LUXURY_EASE as any,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
