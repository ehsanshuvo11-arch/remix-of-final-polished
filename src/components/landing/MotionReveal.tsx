import { m } from 'framer-motion';
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
  up: { y: 20 },
  left: { x: -24 },
  right: { x: 24 },
};

// Luxury butter-smooth easing: gentle, responsive glide without lag
const BUTTER_EASE = [0.16, 1, 0.3, 1] as const;

export default function MotionReveal({
  children,
  delay = 0,
  duration = 0.45,
  direction = 'up',
  distance,
  className,
  once = true,
}: MotionRevealProps) {
  const isMobile = useIsMobileDevice();
  const offset = directionMap[direction];

  const dur = isMobile ? Math.min(duration, 0.32) : Math.min(duration, 0.44);
  const delayed = isMobile ? Math.min(delay * 0.4, 0.08) : Math.min(delay * 0.7, 0.15);

  const defaultY = isMobile ? 14 : (offset.y ?? 0);
  const defaultX = isMobile ? (offset.x ? (offset.x > 0 ? 16 : -16) : 0) : (offset.x ?? 0);

  const initialX = distance !== undefined && direction !== 'up' ? (direction === 'left' ? -distance : distance) : defaultX;
  const initialY = distance !== undefined && direction === 'up' ? distance : defaultY;

  return (
    <m.div
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: '0px 0px -10px 0px', amount: 0.04 }}
      transition={{
        duration: dur,
        delay: delayed,
        ease: BUTTER_EASE,
      }}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
      className={`transform-gpu ${className ?? ''}`}
    >
      {children}
    </m.div>
  );
}
