import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  /** Maximum pixel displacement of the button toward the cursor. Keep subtle (15–20). */
  maxPull?: number;
  /** Maximum pixel displacement of the inner label (parallax). */
  maxTextPull?: number;
}

/**
 * Detect whether the device is a true desktop pointer (fine + hover capable)
 * AND the viewport is ≥ 768px. Touch / coarse-pointer / mobile devices get
 * a static button — no mouse tracking at all.
 */
function useDesktopPointer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return enabled;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  as = 'button',
  href,
  target,
  rel,
  maxPull = 18,
  maxTextPull = 6,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const magnetic = useDesktopPointer();

  // Raw target values (px). Springs interpolate toward them with heavy physics.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);

  // "Old money" physics: low stiffness + high damping + meaningful mass
  // → a slow, dense, deliberate pull. No bounce, no jitter.
  const buttonSpring = { stiffness: 90, damping: 22, mass: 0.9 };
  const textSpring = { stiffness: 120, damping: 24, mass: 0.6 };

  const sx = useSpring(x, buttonSpring);
  const sy = useSpring(y, buttonSpring);
  const stx = useSpring(textX, textSpring);
  const sty = useSpring(textY, textSpring);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // Distance from button center, normalized to -1..1 across each axis.
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // Clamp to [-1, 1] so cursor near the very edge can't overshoot maxPull.
    const cx = Math.max(-1, Math.min(1, nx));
    const cy = Math.max(-1, Math.min(1, ny));

    x.set(cx * maxPull);
    y.set(cy * maxPull);
    textX.set(cx * maxTextPull);
    textY.set(cy * maxTextPull);
  };

  const handleMouseLeave = () => {
    // Smoothly snap back to origin via the same heavy spring.
    x.set(0);
    y.set(0);
    textX.set(0);
    textY.set(0);
  };

  const Tag = as === 'a' ? motion.a : motion.button;

  // On non-desktop pointers, render a plain element — zero motion handlers,
  // no transform style, no listeners. Prevents touch-screen glitches.
  if (!magnetic) {
    return (
      <div ref={ref} className="inline-block">
        <Tag
          href={as === 'a' ? href : undefined}
          target={as === 'a' ? target : undefined}
          rel={as === 'a' ? rel : undefined}
          onClick={onClick}
          whileTap={{ scale: 0.97, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
          className={className}
        >
          <span className="relative z-10 inline-block">{children}</span>
        </Tag>
      </div>
    );
  }

  return (
    <div ref={ref} className="inline-block">
      <Tag
        href={as === 'a' ? href : undefined}
        target={as === 'a' ? target : undefined}
        rel={as === 'a' ? rel : undefined}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
        style={{ x: sx, y: sy }}
        className={className}
      >
        <motion.span
          style={{ x: stx, y: sty, display: 'inline-block' }}
          className="relative z-10"
        >
          {children}
        </motion.span>
      </Tag>
    </div>
  );
}
