import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Dot follows instantly
  const dotX = useSpring(cursorX, { damping: 40, stiffness: 800, mass: 0.2 });
  const dotY = useSpring(cursorY, { damping: 40, stiffness: 800, mass: 0.2 });

  // Ring follows with elegant lag
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 180, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 180, mass: 0.5 });

  useEffect(() => {
    if ('ontouchstart' in window) return;

    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const selector = 'a,button,.service-card,.work-card,.stat-box,.play-btn,[role="button"]';

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    const attachListeners = () => {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    attachListeners();

    const observer = new MutationObserver(() => {
      document.querySelectorAll(selector).forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.querySelectorAll(selector).forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'hsl(28 96% 61%)',
        }}
        animate={{
          width: hovered ? 20 : 10,
          height: hovered ? 20 : 10,
          opacity: hovered ? 0.9 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid hsl(28 96% 61%)',
        }}
        animate={{
          width: hovered ? 60 : 40,
          height: hovered ? 60 : 40,
          opacity: hovered ? 0.25 : 0.45,
        }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      />
    </>
  );
}
