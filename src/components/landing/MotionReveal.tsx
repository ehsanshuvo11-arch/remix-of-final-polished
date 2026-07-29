import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

export default function MotionReveal({
  children,
  delay = 0,
  duration = 1.1,
  direction = 'up',
  distance,
  className,
  once = true,
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -40px 0px', amount: 0.08 });
  const isMobile = useIsMobileDevice();

  const offset = directionMap[direction];
  const initial = isMobile
    ? { opacity: 1, x: 0, y: 0 }
    : {
        opacity: 0,
        x: distance !== undefined && direction !== 'up' ? (direction === 'left' ? -distance : distance) : (offset.x ?? 0),
        y: distance !== undefined && direction === 'up' ? distance : (offset.y ?? 0),
      };

  return (
    <motion.div
      ref={ref}
      // Hardcode the pre-animation state inline so the element never flashes
      // in its final position before Framer Motion hydrates (FOUC/jank fix).
      style={{
        opacity: initial.opacity,
        transform: `translate3d(${initial.x ?? 0}px, ${initial.y ?? 0}px, 0)`,
        willChange: 'transform, opacity',
      }}
      initial={initial}
      animate={isMobile ? { opacity: 1, x: 0, y: 0 } : (isInView ? { opacity: 1, x: 0, y: 0 } : initial)}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Luxury slow ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
