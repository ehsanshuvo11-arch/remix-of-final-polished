import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Dot: near-instant 1:1 tracking — precision first
  const dotX = useSpring(cursorX, { stiffness: 800, damping: 50, mass: 0.1 });
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 50, mass: 0.1 });

  // Ring: subtle luxury trail — tight enough for usability
  const ringX = useSpring(cursorX, { stiffness: 350, damping: 35, mass: 0.15 });
  const ringY = useSpring(cursorY, { stiffness: 350, damping: 35, mass: 0.15 });

  useEffect(() => {
    if ('ontouchstart' in window) return;

    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const selector = 'a,button,.service-card,.work-card,.stat-box,.play-btn,[role="button"],input,textarea';

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    const attach = () => {
      document.querySelectorAll(selector).forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    attach();

    const observer = new MutationObserver(attach);
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

  if (typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768)) return null;

  return (
    <div className="hidden md:block">
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
          width: hovered ? 18 : 10,
          height: hovered ? 18 : 10,
          opacity: hovered ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.3 }}
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
          width: hovered ? 56 : 40,
          height: hovered ? 56 : 40,
          opacity: hovered ? 0.2 : 0.4,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.4 }}
      />
    </div>
  );
}
