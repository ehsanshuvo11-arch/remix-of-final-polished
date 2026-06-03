import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  splitBy?: 'line' | 'word';
  as?: keyof JSX.IntrinsicElements;
}

const LUXURY_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Cinematic Scroll Masking — Quiet Luxury
 * Splits text into lines/words, masks each with overflow:hidden,
 * and slides inner block from y:100% to y:0% on scroll-into-view.
 * No bounce, no spring — only deliberate cubic-bezier easing.
 */
export default function RevealText({
  children,
  className = '',
  delay = 0,
  duration = 1.3,
  stagger = 0.1,
  splitBy = 'word',
  as: Tag = 'span',
}: RevealTextProps) {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const parts = splitBy === 'line'
    ? text.split('\n')
    : text.split(' ');

  const Wrapper = Tag as any;
  const isMobile = useIsMobileDevice();

  if (isMobile) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  return (
    <Wrapper className={className}>
      {parts.map((part, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{
            marginRight: splitBy === 'word' ? '0.28em' : 0,
            // Italic glyphs (esp. trailing punctuation like "!") lean right and get
            // clipped by overflow:hidden. Pad the mask and offset to keep layout stable.
            paddingRight: '0.15em',
            marginLeft: '-0.05em',
            paddingBottom: '0.15em',
          }}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: LUXURY_EASE as any,
            }}
          >
            {part}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}
