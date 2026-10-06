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

// Crisp modern easing: swift, responsive settle without lagging behind user scroll.
const SNAPPY_EASE = [0.22, 1, 0.36, 1] as const;

export default function MotionReveal({
  children,
  delay = 0,
  duration = 0.45,
  direction = 'up',
  distance,
  className,
  once = true,
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -40px 0px', amount: 0.05 });
  const isMobile = useIsMobileDevice();
  const [settled, setSettled] = useState(false);

  const offset = directionMap[direction];
  const rest = { opacity: 1, x: 0, y: 0, scale: 1 };
  const initial = {
    opacity: 0,
    x: distance !== undefined && direction !== 'up' ? (direction === 'left' ? -distance : distance) : (offset.x ?? 0),
    y: distance !== undefined && direction === 'up' ? distance : (offset.y ?? 0),
    scale: isMobile ? 1 : 0.99,
  };

  const dur = isMobile ? Math.min(duration, 0.35) : duration;
  const delayed = isMobile ? Math.min(delay * 0.5, 0.15) : Math.min(delay, 0.25);

  return (
    <m.div
      ref={ref}
      style={{
        willChange: settled ? 'auto' : 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
      initial={initial}
      animate={isInView ? rest : initial}
      onAnimationComplete={() => isInView && setSettled(true)}
      transition={{
        duration: dur,
        delay: delayed,
        ease: SNAPPY_EASE,
      }}
      className={`transform-gpu ${className ?? ''}`}
    >
      {children}
    </m.div>
  );
}
