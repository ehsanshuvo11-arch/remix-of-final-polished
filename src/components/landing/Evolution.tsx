import { useRef, useState, useCallback, useEffect } from 'react';
import { m, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';

import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSetting } from '@/hooks/use-site-content';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';
import type { EvolutionContent } from '@/types/database';
import beforeImg from '@/assets/evolution-before.jpg';
import afterImg from '@/assets/evolution-after.jpg';

export default function Evolution() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const { data } = useSiteSetting<EvolutionContent>('evolution');

  const title = isBn
    ? (data?.title_bn || 'দ্য ইভোলিউশন')
    : (data?.title_en || 'The Evolution');
  const subtitle = isBn
    ? (data?.subtitle_bn || 'একটি প্রিমিয়াম আইডেন্টিটি কীভাবে ব্র্যান্ডের রূপ বদলে দেয়, তা নিজেই দেখুন।')
    : (data?.subtitle_en || 'See the impact of a premium visual identity.');
  const label = isBn ? 'বিবর্তন' : 'Evolution';
  const beforeLabel = isBn
    ? (data?.before_label_bn || 'পুরনো ধারণা')
    : (data?.before_label_en || 'Old Concept');
  const afterLabel = isBn
    ? (data?.after_label_bn || 'POLISHED মান')
    : (data?.after_label_en || 'POLISHED Standard');
  const hint = isBn ? 'তুলনা করতে টানুন' : 'Drag or tap to compare';

  const beforeSrc = data?.before_image_url || beforeImg;
  const afterSrc = data?.after_image_url || afterImg;

  return (
    <section id="evolution" className="py-16 md:py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
      <MotionReveal>
        {isBn ? (
          <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            {label}
          </p>
        ) : (
          <p lang="en" className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
            {label}
          </p>
        )}
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary mb-5 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
          <WordReveal delay={0.1}>{title}</WordReveal>
        </h2>
      </MotionReveal>
      <MotionReveal delay={0.2}>
        <p className="font-heading italic text-primary/60 text-[clamp(16px,1.6vw,20px)] max-w-xl mb-10 md:mb-12">
          {subtitle}
        </p>
      </MotionReveal>

      <MotionReveal delay={0.15}>
        <div className="mx-auto w-full max-w-[640px]">
          <EvolutionSlider
            before={beforeSrc}
            after={afterSrc}
            beforeLabel={beforeLabel}
            afterLabel={afterLabel}
            hint={hint}
          />
        </div>
      </MotionReveal>
    </section>
  );
}

interface SliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  hint: string;
}

function EvolutionSlider({ before, after, beforeLabel, afterLabel, hint }: SliderProps) {
  const isMobile = useIsMobileDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const clipPath = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);
  const handleLeft = useTransform(x, (v) => `${v}%`);
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [pct, setPct] = useState(50);
  // Left tag sits on the BEFORE side (visible while the handle is to the right of it)
  const leftTagOpacity = useTransform(x, [8, 28], [0, 1]);
  // Right tag sits on the AFTER side (visible while the handle is to the left of it)
  const rightTagOpacity = useTransform(x, [72, 92], [1, 0]);

  useEffect(() => {
    const unsub = x.on('change', (v) => setPct(Math.round(v)));
    return unsub;
  }, [x]);

  const setFromClientX = useCallback((clientX: number, animateTo = false) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, p));
    if (animateTo) {
      animate(x, clamped, { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 });
    } else {
      // Smooth drag with tiny spring for tactile feel
      animate(x, clamped, { type: 'spring', stiffness: 500, damping: 40, mass: 0.4 });
    }
  }, [x]);

  const startDrag = useCallback((clientX: number) => {
    setDragging(true);
    setHasInteracted(true);
    setFromClientX(clientX);
  }, [setFromClientX]);

  const handleClick = useCallback((clientX: number) => {
    setHasInteracted(true);
    setFromClientX(clientX, true);
  }, [setFromClientX]);


  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (typeof cx === 'number') setFromClientX(cx);
    };
    const onUp = () => setDragging(false);
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
  }, [dragging, setFromClientX]);

  // Entrance teaser: sweep from 65 -> 50 with soft spring settle
  useEffect(() => {
    x.set(65);
    const controls = animate(x, 50, { type: 'spring', stiffness: 60, damping: 18, mass: 1, delay: 0.3 });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const springTo = useCallback((target: number) => {
    setHasInteracted(true);
    animate(x, target, { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 });
  }, [x]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      springTo(Math.max(0, x.get() - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      springTo(Math.min(100, x.get() + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      springTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      springTo(100);
    }
  };


  return (
    <div className="space-y-4">
      <m.div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={`${beforeLabel} vs ${afterLabel} comparison`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        onKeyDown={onKeyDown}
        style={{ touchAction: 'pan-y' }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onClick={(e) => {
          // Only treat as click when not dragging (mousedown already positioned it)
          if (!dragging) handleClick(e.clientX);
        }}
        className={`group relative w-full overflow-hidden select-none aspect-[4/5] md:aspect-square bg-primary/5 rounded-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '50px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={after}
          alt={`${afterLabel} — POLISHED premium skincare brand redesign (after)`}
          loading="lazy" decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        <m.div style={{ clipPath }} className="absolute inset-0">
          <img
            src={before}
            alt={`${beforeLabel} — original skincare brand visual before POLISHED redesign`}
            loading="lazy" decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </m.div>

        {/* Floating labels — fade as the corresponding side disappears */}
        <m.span style={{ opacity: leftTagOpacity }} className="absolute top-3 left-3 md:top-5 md:left-5 px-2 py-1 md:px-3 md:py-1.5 text-[8px] md:text-[9px] tracking-[3px] uppercase font-heading italic text-primary-foreground bg-primary/95 md:bg-primary/60 md:backdrop-blur-md border border-primary-foreground/15 rounded-sm pointer-events-none">
          {beforeLabel}
        </m.span>
        <m.span style={{ opacity: rightTagOpacity }} className="absolute top-3 right-3 md:top-5 md:right-5 px-2 py-1 md:px-3 md:py-1.5 text-[8px] md:text-[9px] tracking-[3px] uppercase font-heading italic text-primary-foreground bg-accent/95 md:bg-accent/85 md:backdrop-blur-md border border-accent/40 rounded-sm pointer-events-none">
          {afterLabel}
        </m.span>

        {/* First-time hint pill — gentle pulse, fades out on first interaction */}
        <AnimatePresence>
          {!hasInteracted && (
            <m.div
              key="hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.5, ease: 'easeOut' } }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <m.div
                animate={isMobile ? { opacity: [0.8, 1, 0.8] } : { opacity: [0.75, 1, 0.75], scale: [1, 1.04, 1] }}
                transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
                className="px-3.5 py-1.5 text-[10px] tracking-[2px] uppercase text-primary-foreground bg-primary/95 md:bg-primary/60 md:backdrop-blur-md rounded-full border border-primary-foreground/15 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.25)] will-change-[opacity]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                </svg>
                {hint}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Divider + handle — crisp 1px off-white with blurred edge */}
        <m.div
          style={{ left: handleLeft }}
          className="absolute top-0 bottom-0 w-px bg-[#f9fafb] pointer-events-none -translate-x-1/2 md:backdrop-blur-[2px] shadow-[0_0_24px_rgba(249,250,251,0.55)]"
        >
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-accent flex items-center justify-center transition-all duration-300 ease-out ${
              dragging
                ? 'scale-110 shadow-[0_0_32px_rgba(251,146,60,0.75),0_10px_30px_rgba(251,146,60,0.35)]'
                : 'scale-100 shadow-[0_8px_24px_rgba(251,146,60,0.45)] group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(251,146,60,0.65),0_10px_28px_rgba(251,146,60,0.35)]'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </m.div>
      </m.div>

      {/* Status indicator — center comparison */}
      <div className="flex items-center justify-center">
        <m.button
          type="button"
          onClick={() => springTo(50)}
          aria-label="Reset comparison to 50 / 50"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="group/reset inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/40 text-accent text-[11px] tracking-[2px] uppercase font-medium cursor-pointer shadow-[0_2px_10px_-4px_hsl(var(--accent)/0.5)] hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors duration-300"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover/reset:-rotate-180">
            <path d="M3 12a9 9 0 1 1 3 6.7" />
            <path d="M3 21v-6h6" />
          </svg>
          Reset 50/50
        </m.button>
      </div>

    </div>
  );
}
