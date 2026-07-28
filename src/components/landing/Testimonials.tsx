import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'POLISHED transformed our entire visual identity. The packaging now feels like a luxury object before anyone even opens the box. Our repeat purchase rate climbed within weeks.',
    name: 'Aisha Rahman',
    role: 'Founder, Organic Skincare',
  },
  {
    id: 2,
    quote:
      'They understood the soul of our brand instantly. Every touchpoint — from the site to the unboxing — now whispers premium. It is the best investment we have made.',
    name: 'Leila Noor',
    role: 'Founder, Glow Essentials',
  },
  {
    id: 3,
    quote:
      'The new identity commands attention on shelf and screen. Customers constantly tell us our brand looks expensive, trustworthy, and unforgettable.',
    name: 'Sarah Hossain',
    role: 'Founder, Pure Radiance Co.',
  },
];

const LUXE = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const count = testimonials.length;

  const next = () => setActive((prev) => (prev + 1) % count);
  const prev = () => setActive((prev) => (prev - 1 + count) % count);
  const goTo = (i: number) => setActive(i);

  // Position offset relative to active index, wrapping to shortest path.
  const getOffset = (i: number) => {
    let diff = i - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  // Responsive center-to-center spacing: keep side cards visible but not overlapping the center card.
  const spacing = isMobile ? 70 : 75;

  return (
    <section
      id="testimonials"
      className="relative bg-[#0f1e4a] text-primary-foreground overflow-hidden py-24 md:py-32 px-6 md:px-14"
    >
      <div className="relative max-w-[1200px] mx-auto">
        <MotionReveal>
          <p
            lang="en"
            className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium"
          >
            Testimonials
          </p>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <h2 className="font-heading font-normal text-primary-foreground mb-5 text-[clamp(36px,5vw,60px)] leading-[1.1]">
            <WordReveal delay={0.1}>What founders say.</WordReveal>
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p className="font-heading italic text-primary-foreground/60 text-[clamp(16px,1.6vw,20px)] max-w-xl mb-16">
            Words from the visionaries behind premium e-commerce skincare brands.
          </p>
        </MotionReveal>

        {/* Carousel */}
        <div className="relative h-[380px] md:h-[340px] flex items-center justify-center overflow-visible">
          {testimonials.map((t, i) => {
            const offset = getOffset(i);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            return (
              <motion.div
                key={t.id}
                initial={false}
                animate={{
                  x: `calc(-50% + ${offset * spacing}%)`,
                  y: '-50%',
                  scale: isActive ? 1 : 0.85,
                  opacity: isVisible ? (isActive ? 1 : 0.5) : 0,
                  zIndex: isActive ? 10 : 1,
                }}
                transition={{
                  x: { duration: 0.8, ease: LUXE },
                  y: { duration: 0 },
                  scale: { duration: 0.8, ease: LUXE },
                  opacity: { duration: 0.6, ease: LUXE },
                  zIndex: { duration: 0 },
                }}
                style={{ willChange: 'transform, opacity', top: '50%', left: '50%' }}
                className="absolute w-full max-w-[520px]"
              >
                <TestimonialCard testimonial={t} dimmed={!isActive} />
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mt-12">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="group w-12 h-12 rounded-full border border-primary-foreground/40 bg-primary-foreground/5 flex items-center justify-center text-primary-foreground hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
          </button>

          <div className="flex items-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === active ? 'bg-accent w-8' : 'w-2.5 bg-primary-foreground/40 hover:bg-primary-foreground/70'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="group w-12 h-12 rounded-full border border-primary-foreground/40 bg-primary-foreground/5 flex items-center justify-center text-primary-foreground hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
          >
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  dimmed = false,
}: {
  testimonial: Testimonial;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between p-7 md:p-8 rounded-sm border backdrop-blur-md min-h-[260px] ${
        dimmed
          ? 'bg-primary-foreground/[0.03] border-primary-foreground/10'
          : 'bg-[#0f1e4a] border-primary-foreground/15 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]'
      }`}
    >
      <div className="flex items-center gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className="text-accent fill-accent" />
        ))}
      </div>

      <blockquote
        lang="en"
        className="font-heading italic text-primary-foreground text-[clamp(16px,1.5vw,20px)] leading-[1.5] mb-6"
      >
        “{testimonial.quote}”
      </blockquote>

      <div className="mt-auto">
        <p lang="en" className="font-heading text-primary-foreground text-[14px] tracking-wide">
          {testimonial.name}
        </p>
        <p lang="en" className="text-accent text-[11px] tracking-[1.5px] uppercase mt-1">
          {testimonial.role}
        </p>
      </div>
    </div>
  );
}
