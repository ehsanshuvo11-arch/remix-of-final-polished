import { ReactNode } from 'react';
import { m } from 'framer-motion';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  splitBy?: 'line' | 'word';
  as?: keyof JSX.IntrinsicElements;
  /** Animate as soon as it mounts instead of waiting for an intersection hit.
   *  Use for above-the-fold copy so it can never stay stuck hidden. */
  triggerOnMount?: boolean;
}


const LUXURY_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Cinematic Scroll Masking — Quiet Luxury
 * Splits text into lines/words, masks each with overflow:hidden,
 * and slides inner block from y:100% to y:0% on scroll-into-view.
 * No bounce, no spring — only deliberate cubic-bezier easing.
 * Mobile runs the exact same reveal, with a tighter stagger so the
 * browser never has a large backlog of concurrent animations.
 */
export default function RevealText({
  children,
  className = '',
  delay = 0,
  duration = 1.3,
  stagger = 0.1,
  splitBy = 'word',
  as: Tag = 'span',
  triggerOnMount = false,
}: RevealTextProps) {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const parts = splitBy === 'line'
    ? text.split('\n')
    : text.split(' ');

  const Wrapper = Tag as any;
  const isMobile = useIsMobileDevice();
  const step = isMobile ? Math.min(stagger, 0.05) : stagger;
  const dur = isMobile ? Math.min(duration, 0.5) : duration;

  const rest = { y: '0%', opacity: 1 } as const;

  const maskStyle = {
    marginRight: splitBy === 'word' ? '0.28em' : 0,
    // Italic glyphs (esp. trailing punctuation like "!") lean right and get
    // clipped by overflow:hidden. Pad the mask and offset to keep layout stable.
    paddingRight: '0.15em',
    marginLeft: '-0.05em',
    paddingBottom: '0.15em',
  } as const;

  // Mount-triggered reveals run on pure CSS so above-the-fold copy can never
  // stay hidden if framer-motion's feature bundle loads late on a cold visit.
  if (triggerOnMount) {
    return (
      <Wrapper className={className}>
        {parts.map((part, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom" style={maskStyle}>
            <span
              className="reveal-mask-up transform-gpu"
              style={{
                ['--reveal-dur' as string]: `${dur}s`,
                ['--reveal-delay' as string]: `${delay + 0.15 + i * step}s`,
              }}
            >
              {part}
            </span>
          </span>
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      {parts.map((part, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={maskStyle}>
          <m.span
            className="inline-block transform-gpu will-change-transform"
            style={{ transform: 'translate3d(0, 100%, 0)', backfaceVisibility: 'hidden' }}
            initial={{ y: '100%', opacity: 0 }}
            whileInView={rest}
            viewport={{ once: true, margin: '50px' }}
            transition={{
              duration: dur,
              delay: delay + 0.15 + i * step,
              ease: LUXURY_EASE as any,
              opacity: { duration: dur * 0.5, delay: delay + 0.15 + i * step, ease: 'linear' },
            }}
          >
            {part}
          </m.span>
        </span>
      ))}

    </Wrapper>
  );
}
