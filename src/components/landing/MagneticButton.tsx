import { useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  strength?: number;
  textStrength?: number;
}

function useIsTouch() {
  return useMemo(() => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0), []);
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  as = 'button',
  href,
  target,
  rel,
  strength = 0.35,
  textStrength = 0.15,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouch();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.3 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);
  const stx = useSpring(textX, { stiffness: 200, damping: 25, mass: 0.2 });
  const sty = useSpring(textY, { stiffness: 200, damping: 25, mass: 0.2 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    x.set(dx * strength);
    y.set(dy * strength);
    textX.set(dx * textStrength);
    textY.set(dy * textStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    textX.set(0);
    textY.set(0);
    setHovered(false);
  };

  const Tag = as === 'a' ? motion.a : motion.button;

  return (
    <div ref={ref} className="inline-block min-h-[44px] min-w-[44px]">
      <Tag
        href={as === 'a' ? href : undefined}
        target={as === 'a' ? target : undefined}
        rel={as === 'a' ? rel : undefined}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.96, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } }}
        style={isTouch ? undefined : { x: sx, y: sy }}
        className={`${className} min-h-[44px]`}
      >
        <motion.span
          style={isTouch ? { display: 'inline-block' } : { x: stx, y: sty, display: 'inline-block' }}
          className="relative z-10 text-white"
        >
          {children}
        </motion.span>
      </Tag>
    </div>
  );
}
