import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSetting } from '@/hooks/use-site-content';
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

  const beforeSrc = data?.before_image_url || beforeImg;
  const afterSrc = data?.after_image_url || afterImg;

  return (
    <section id="evolution" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
      <MotionReveal>
        <p className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
          {label}
        </p>
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <h2 className="font-heading font-normal text-primary mb-5 text-[clamp(36px,5vw,60px)] leading-[1.1]">
          <WordReveal delay={0.1}>{title}</WordReveal>
        </h2>
      </MotionReveal>
      <MotionReveal delay={0.2}>
        <p className="font-heading italic text-primary/60 text-[clamp(16px,1.6vw,20px)] max-w-xl mb-12">
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
}

function EvolutionSlider({ before, after, beforeLabel, afterLabel }: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
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

  useEffect(() => {
    const controls = animate(x, 50, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 });
    x.set(65);
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      className="relative w-full overflow-hidden select-none aspect-square cursor-ew-resize bg-primary/5 rounded-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <img
        src={after}
        alt={afterLabel}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <img
          src={before}
          alt={beforeLabel}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
      </motion.div>

      {/* Floating labels */}
      <span className="absolute top-5 left-5 px-3 py-1.5 text-[9px] tracking-[3px] uppercase font-heading italic text-primary-foreground/95 bg-primary/40 backdrop-blur-md border border-primary-foreground/15 rounded-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-5 right-5 px-3 py-1.5 text-[9px] tracking-[3px] uppercase font-heading italic text-primary-foreground/95 bg-primary/40 backdrop-blur-md border border-accent/40 rounded-sm">
        {afterLabel}
      </span>

      {/* Elegant thin divider with orange handle */}
      <motion.div
        style={{ left: handleLeft }}
        className="absolute top-0 bottom-0 w-px bg-primary-foreground/80 pointer-events-none -translate-x-1/2"
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent shadow-[0_8px_30px_rgba(251,146,60,0.45)] flex items-center justify-center transition-transform duration-300 ${
            dragging ? 'scale-110' : 'scale-100'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
