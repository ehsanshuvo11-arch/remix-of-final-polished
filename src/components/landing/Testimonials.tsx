import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';

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
  const count = testimonials.length;

  const next = () => setActive((prev) => (prev + 1) % count);
  const prev = () => setActive((prev) => (prev - 1 + count) % count);

  const prevIndex = (active - 1 + count) % count;
  const nextIndex = (active + 1) % count;

  return (
    <section
      id="testimonials"
      data-theme="navy"
      className="relative bg-primary text-primary-foreground overflow-hidden py-[110px] px-6 md:px-14"
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
        <div className="relative h-[360px] md:h-[320px] flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Previous card */}
            <motion.div
              key={`prev-${prevIndex}`}
              initial={{ x: '-130%', scale: 0.85, opacity: 0 }}
              animate={{ x: '-112%', scale: 0.9, opacity: 0.5 }}
              exit={{ x: '-160%', scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.7, ease: LUXE }}
              className="hidden md:flex absolute top-1/2 left-1/2 -translate-y-1/2 w-full max-w-[420px] min-h-[260px] pointer-events-none"
            >
              <TestimonialCard testimonial={testimonials[prevIndex]} dimmed />
            </motion.div>

            {/* Active card */}
            <motion.div
              key={`active-${active}`}
              initial={{ x: '60%', scale: 0.92, opacity: 0 }}
              animate={{ x: '-50%', scale: 1, opacity: 1 }}
              exit={{ x: '-60%', scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.7, ease: LUXE }}
              className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full max-w-[520px] min-h-[280px] z-10"
            >
              <TestimonialCard testimonial={testimonials[active]} />
            </motion.div>

            {/* Next card */}
            <motion.div
              key={`next-${nextIndex}`}
              initial={{ x: '70%', scale: 0.85, opacity: 0 }}
              animate={{ x: '12%', scale: 0.9, opacity: 0.5 }}
              exit={{ x: '60%', scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.7, ease: LUXE }}
              className="hidden md:flex absolute top-1/2 left-1/2 -translate-y-1/2 w-full max-w-[420px] min-h-[260px] pointer-events-none"
            >
              <TestimonialCard testimonial={testimonials[nextIndex]} dimmed />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mt-10">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="group w-11 h-11 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:border-accent hover:bg-accent/10 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform duration-300"
            />
          </button>

          <div className="flex items-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === active
                    ? 'bg-accent w-6'
                    : 'bg-primary-foreground/25 hover:bg-primary-foreground/50'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="group w-11 h-11 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:border-accent hover:bg-accent/10 transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
          >
            <ChevronRight
              size={18}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            />
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
      className={`relative h-full flex flex-col justify-between p-8 md:p-10 rounded-sm border backdrop-blur-md transition-shadow duration-500 ${
        dimmed
          ? 'bg-primary-foreground/[0.03] border-primary-foreground/10'
          : 'bg-primary-foreground/[0.06] border-primary-foreground/15 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]'
      }`}
    >
      {/* Stars */}
      <div className="flex items-center gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="text-accent fill-accent"
          />
        ))}
      </div>

      <blockquote
        lang="en"
        className="font-heading italic text-primary-foreground text-[clamp(17px,1.7vw,22px)] leading-[1.55] mb-8"
      >
        “{testimonial.quote}”
      </blockquote>

      <div className="mt-auto">
        <p lang="en" className="font-heading text-primary-foreground text-[15px] tracking-wide">
          {testimonial.name}
        </p>
        <p lang="en" className="text-accent text-[12px] tracking-[1.5px] uppercase mt-1">
          {testimonial.role}
        </p>
      </div>
    </div>
  );
}
