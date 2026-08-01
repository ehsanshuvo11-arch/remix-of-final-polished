import { useEffect, useState, type RefObject } from 'react';

interface SwipeProgressProps {
  /** The horizontally scrolling container to track. */
  containerRef: RefObject<HTMLElement>;
  /** Number of slides / dots. */
  count: number;
  /** Optional hint label shown alongside the dots on first render. */
  label?: string;
  /** 'dark' = for light backgrounds, 'light' = for dark backgrounds. */
  tone?: 'dark' | 'light';
}

/**
 * Mobile-only swipe affordance for the horizontal snap carousels.
 * Renders a minimal progress rail (not chunky dots) to stay in the
 * "quiet luxury" register, and hides itself entirely on desktop.
 */
export default function SwipeProgress({
  containerRef,
  count,
  label = 'Swipe',
  tone = 'dark',
}: SwipeProgressProps) {
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || count < 2) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 0) return;
        const ratio = el.scrollLeft / max;
        setActive(Math.round(ratio * (count - 1)));
        if (el.scrollLeft > 8) setMoved(true);
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [containerRef, count]);

  if (count < 2) return null;

  const base = tone === 'light' ? 'bg-primary-foreground' : 'bg-primary';
  const textTone = tone === 'light' ? 'text-primary-foreground/40' : 'text-primary/40';

  return (
    <div className="flex md:hidden items-center gap-4 mt-2">
      <div className="flex items-center gap-1.5" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={`h-px transition-all duration-500 ease-out ${base} ${
              i === active ? 'w-7 opacity-70' : 'w-3 opacity-20'
            }`}
          />
        ))}
      </div>
      <span
        className={`text-[9px] tracking-[3px] uppercase transition-opacity duration-700 ${textTone} ${
          moved ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}
