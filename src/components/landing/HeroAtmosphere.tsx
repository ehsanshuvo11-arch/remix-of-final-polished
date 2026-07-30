import { memo, useEffect, useRef } from 'react';

/**
 * Ambient hero atmosphere: a cursor-following light spotlight, a slow aurora
 * sweep and drifting dust motes. Purely decorative, GPU-friendly (transform /
 * opacity only) and disabled for reduced-motion users.
 */
const MOTES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 1 + ((i * 7) % 3),
  delay: (i * 0.9) % 12,
  duration: 14 + ((i * 3) % 12),
  opacity: 0.12 + ((i % 4) * 0.06),
}));

function HeroAtmosphere() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const onMove = (e: PointerEvent) => {
      const el = spotRef.current;
      if (!el) return;
      const rect = el.parentElement!.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (!active) {
        cx = tx;
        cy = ty;
        active = true;
        el.style.opacity = '1';
      }
    };

    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Aurora sweep */}
      <div
        className="absolute -inset-x-1/2 top-[-30%] h-[160%] opacity-70 motion-reduce:hidden"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(251,146,60,0) 0deg, rgba(251,146,60,0.07) 60deg, rgba(255,255,255,0.035) 130deg, rgba(99,102,241,0.06) 210deg, rgba(251,146,60,0) 320deg)',
          filter: 'blur(70px)',
          animation: 'auroraSpin 38s linear infinite',
        }}
      />

      {/* Cursor spotlight */}
      <div
        ref={spotRef}
        className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full opacity-0 transition-opacity duration-700 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(circle, rgba(251,146,60,0.10) 0%, rgba(251,146,60,0.04) 40%, rgba(251,146,60,0) 70%)',
          willChange: 'transform',
        }}
      />

      {/* Drifting dust motes */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent motion-reduce:hidden"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            animation: `moteDrift ${m.duration}s ease-in-out ${m.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

export default memo(HeroAtmosphere);
