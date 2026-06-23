import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
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
      className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto"
    >
      <MotionReveal>
        <p lang="en" className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
          {content?.labelEn ?? 'Transformations'}
        </p>
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <h2 lang="en" className="font-heading font-normal text-primary mb-12 text-[clamp(36px,5vw,60px)] leading-[1.1]">
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

export function BeforeAfterSlider({ before, after, beforeLabel, afterLabel }: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50); // percentage 0-100
  const clipPath = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);
  const handleLeft = useTransform(x, (v) => `${v}%`);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    x.set(Math.max(0, Math.min(100, pct)));
  }, [x]);

  const startDrag = useCallback((clientX: number) => {
    setDragging(true);
    setFromClientX(clientX);
  }, [setFromClientX]);

  const stopDrag = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (typeof cx === 'number') setFromClientX(cx);
    };
    const onUp = () => stopDrag();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, setFromClientX, stopDrag]);

  // Subtle entrance teaser: animate from 60 -> 50 once visible
  useEffect(() => {
    const controls = animate(x, 50, { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 });
    x.set(62);
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      className="relative w-full overflow-hidden rounded-sm border border-primary/10 select-none aspect-[16/10] cursor-ew-resize bg-primary/5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* AFTER (base) */}
      <img
        src={after}
        alt={`${afterLabel} — POLISHED premium brand transformation (after)`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* BEFORE (clipped overlay) */}
      <motion.div
        style={{ clipPath }}
        className="absolute inset-0"
      >
        <img
          src={before}
          alt={`${beforeLabel} — original brand visual before POLISHED transformation`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </motion.div>

      {/* Labels */}
      <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] tracking-[3px] uppercase font-heading italic bg-primary/80 text-primary-foreground backdrop-blur-sm rounded-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 px-3 py-1.5 text-[10px] tracking-[3px] uppercase font-heading italic bg-accent/90 text-accent-foreground backdrop-blur-sm rounded-sm">
        {afterLabel}
      </span>

      {/* Drag handle */}
      <motion.div
        style={{ left: handleLeft }}
        className="absolute top-0 bottom-0 w-px bg-primary-foreground/90 pointer-events-none -translate-x-1/2 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/95 border border-primary/20 shadow-xl flex items-center justify-center transition-transform duration-300 ${
            dragging ? 'scale-110' : 'scale-100'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
