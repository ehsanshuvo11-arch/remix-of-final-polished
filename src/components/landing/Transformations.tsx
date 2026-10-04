import { useRef, useState, useCallback, useEffect } from 'react';
import { m, useMotionValue, useTransform, animate } from 'framer-motion';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { buildSrcSet } from '@/lib/image';
import type { Transformation, TransformationsMetaContent } from '@/types/database';

interface TransformationsProps {
  items: Transformation[];
  content?: TransformationsMetaContent | null;
}

export default function Transformations({ items, content }: TransformationsProps) {
  // CRITICAL: hide entirely if no active items
  const active = items?.filter((i) => i.is_active && i.before_image_url && i.after_image_url) ?? [];
  if (active.length === 0) return null;

  return (
    <section
      id="transformations"
      className="py-14 md:py-[110px] px-4 sm:px-6 md:px-14 max-w-[1200px] mx-auto"
    >
      <MotionReveal>
        <p lang="en" className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
          {content?.labelEn ?? 'Transformations'}
        </p>
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <h2 lang="en" className="font-heading font-normal text-primary mb-8 md:mb-12 text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)] leading-[1.1]">
          <WordReveal delay={0.1}>
            {content?.titleLine1En ?? 'Before'}
          </WordReveal>{' '}
          <em className="italic">
            <WordReveal delay={0.25}>
              {content?.titleLine2En ?? '& after.'}
            </WordReveal>
          </em>
        </h2>
      </MotionReveal>

      <div className="flex flex-col gap-20 mt-14">
        {active.map((item, i) => (
          <MotionReveal key={item.id} delay={0.05 * i}>
            <TransformationCard item={item} content={content ?? null} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function TransformationCard({
  item,
  content,
}: {
  item: Transformation;
  content: TransformationsMetaContent | null;
}) {
  const beforeLabel = content?.beforeLabelEn ?? 'Before';
  const afterLabel = content?.afterLabelEn ?? 'After';

  return (
    <div>
      {item.project_name && (
        <p className="text-[11px] tracking-[3px] uppercase text-primary/50 mb-4 font-medium">
          {item.project_name}
        </p>
      )}
      <BeforeAfterSlider
        before={item.before_image_url}
        after={item.after_image_url}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />
    </div>
  );
}

interface SliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}

const SLIDER_SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.7 } as const;

export function BeforeAfterSlider({ before, after, beforeLabel, afterLabel }: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50); // percentage 0-100
  const clipPath = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);
  const handleLeft = useTransform(x, (v) => `${v}%`);
  const [dragging, setDragging] = useState(false);
  const [currentPct, setCurrentPct] = useState(50);

  // Sync state for button highlight
  useEffect(() => {
    const unsub = x.on('change', (v) => {
      setCurrentPct(Math.round(v));
    });
    return unsub;
  }, [x]);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    x.set(Math.max(0, Math.min(100, pct)));
  }, [x]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setDragging(false);
  };

  const animateTo = (val: number) => {
    animate(x, val, SLIDER_SPRING);
  };

  // Subtle entrance teaser: animate from 62 -> 50 once visible
  useEffect(() => {
    const controls = animate(x, 50, { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 });
    x.set(62);
    return controls.stop;
  }, [x]);

  return (
    <div className="flex flex-col gap-3">
      <m.div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
        className="relative w-full overflow-hidden rounded-2xl md:rounded-sm border border-primary/10 select-none touch-pan-y aspect-[4/3] sm:aspect-[16/10] cursor-ew-resize bg-primary/5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '50px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* AFTER (base) */}
        <img
          src={after}
          srcSet={buildSrcSet(after)}
          sizes="(max-width: 767px) 92vw, 1100px"
          alt={`${afterLabel} — POLISHED premium brand transformation (after)`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* BEFORE (clipped overlay) */}
        <m.div
          style={{ clipPath }}
          className="absolute inset-0"
        >
          <img
            src={before}
            srcSet={buildSrcSet(before)}
            sizes="(max-width: 767px) 92vw, 1100px"
            alt={`${beforeLabel} — original brand visual before POLISHED transformation`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        </m.div>

        {/* Labels */}
        <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] tracking-[2px] uppercase font-heading italic bg-primary/85 text-primary-foreground backdrop-blur-md rounded-full md:rounded-sm shadow-md">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 px-3 py-1.5 text-[10px] tracking-[2px] uppercase font-heading italic bg-accent/90 text-accent-foreground backdrop-blur-md rounded-full md:rounded-sm shadow-md">
          {afterLabel}
        </span>

        {/* Drag handle */}
        <m.div
          style={{ left: handleLeft }}
          className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground pointer-events-none -translate-x-1/2 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        >
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-primary-foreground/95 border border-primary/20 shadow-2xl flex items-center justify-center transition-transform duration-300 ${
              dragging ? 'scale-115 shadow-[0_0_25px_rgba(251,146,60,0.5)]' : 'scale-100'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </m.div>
      </m.div>

      {/* Segmented Quick Comparison Switcher for Mobile */}
      <div className="flex md:hidden items-center justify-between gap-2 p-1.5 rounded-full bg-primary/5 border border-primary/10 self-center mt-1">
        <button
          type="button"
          onClick={() => animateTo(0)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            currentPct <= 10
              ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {beforeLabel}
        </button>
        <button
          type="button"
          onClick={() => animateTo(50)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            currentPct > 35 && currentPct < 65
              ? 'bg-accent text-accent-foreground font-semibold shadow-[0_2px_10px_rgba(251,146,60,0.3)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => animateTo(100)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            currentPct >= 90
              ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {afterLabel}
        </button>
      </div>
    </div>
  );
}
