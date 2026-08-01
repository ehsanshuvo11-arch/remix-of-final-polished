import { useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';

type Direction = 'up' | 'left' | 'right';

interface MotionRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  className?: string;
  once?: boolean;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  left: { x: -40 },
  right: { x: 40 },
};

// Quiet-luxury easing: long, decelerating settle with zero overshoot.
const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;
// Mobile keeps a luxury curve but resolves faster so it feels thumb-responsive.
const MOBILE_EASE = [0.22, 1, 0.36, 1] as const;

export default function MotionReveal({
  children,
  delay = 0,
  duration = 1.15,
  direction = 'up',
  distance,
  className,
  once = true,
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -60px 0px', amount: 0.08 });
  const isMobile = useIsMobileDevice();
  // Once the reveal has settled we release the GPU layer hint — a permanent
  // will-change keeps a compositor layer alive per element and is the single
  // biggest cause of scroll jank on mobile once dozens of them exist.
  const [settled, setSettled] = useState(false);

  const offset = directionMap[direction];
  // On mobile we animate transform + opacity ONLY (both composited on the GPU).
  // The blur filter is a non-composited CPU paint and is dropped entirely.
  const rest = { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' };
  const initial = {
    opacity: 0,
    x: distance !== undefined && direction !== 'up' ? (direction === 'left' ? -distance : distance) : (offset.x ?? 0),
    y: distance !== undefined && direction === 'up' ? distance : (offset.y ?? 0),
    // A whisper of scale makes the settle feel optical rather than mechanical.
    scale: isMobile ? 1 : 0.985,
    filter: isMobile ? 'blur(0px)' : 'blur(6px)',
  };

  const dur = isMobile ? Math.min(duration, 0.5) : duration;
  const ease = isMobile ? MOBILE_EASE : LUXURY_EASE;
  const delayed = isMobile ? Math.min(delay * 0.6, 0.24) : delay;

  return (
    <m.div
      ref={ref}
      // Hardcode the pre-animation state inline so the element never flashes
      // in its final position before Framer Motion hydrates (FOUC/jank fix).
      // translate3d forces the element onto its own GPU layer.
      style={{
        opacity: initial.opacity,
        transform: `translate3d(${initial.x ?? 0}px, ${initial.y ?? 0}px, 0) scale(${initial.scale ?? 1})`,
        filter: initial.filter,
        willChange: settled ? 'auto' : 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
      initial={initial}
      animate={isInView ? rest : initial}
      onAnimationComplete={() => isInView && setSettled(true)}
      transition={
        isMobile
          ? {
              duration: dur,
              delay: delayed,
              ease,
              opacity: { duration: dur * 0.8, delay: delayed, ease: 'linear' },
            }
          : {
              duration: dur,
              delay: delayed,
              ease,
              opacity: { duration: dur * 0.8, delay: delayed, ease: 'linear' },
              filter: { duration: dur * 0.7, delay: delayed, ease },
            }
      }
      className={`transform-gpu ${className ?? ''}`}
    >
      {children}
    </m.div>
  );
}
