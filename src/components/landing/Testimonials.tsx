import { useRef, useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSetting } from '@/hooks/use-site-content';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import type { TestimonialItem, TestimonialsContent } from '@/types/database';

interface DisplayTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  {
    id: '1',
    quote_en:
      'Before POLISHED, people commented "Price please?" and vanished. Now shoppers actually trust our skincare line and checkout at full price. Our ROAS tripled in the very first sprint.',
    quote_bn:
      'POLISHED-এর ক্রিয়েটিভ নেওয়ার পর ইনবক্সে "দাম কত" বলে উধাও হওয়া মানুষ কমে গেছে। কাস্টমাররা এখন পুরো দাম দিয়ে নিশ্চিন্তে অর্ডার করে। প্রথম মাসেই আমাদের ROAS ৩ গুণের বেশি বেড়েছে।',
    name: 'Aisha Rahman',
    role_en: 'Founder, Organic Skincare BD',
    role_bn: 'ফাউন্ডার, অর্গানিক স্কিনকেয়ার বিডি',
  },
  {
    id: '2',
    quote_en:
      'We used to cut prices by 30% just to get orders, which destroyed our margins after returns. Now we sell at full price with zero discounts. Best creative partner in Bangladesh.',
    quote_bn:
      'আগে সেলস পেতে ২০%-৩০% ডিসকাউন্ট দিতে হতো, দিনশেষে লস হতো। এখন কোনো ছাড় ছাড়াই পুরো দামে প্রোডাক্ট বিক্রি হচ্ছে। ডেলিভারি রিটার্ন রেটও অনেক কমে গেছে।',
    name: 'Leila Noor',
    role_en: 'Founder, Glow Essentials',
    role_bn: 'ফাউন্ডার, গ্লো এসেনশিয়ালস',
  },
  {
    id: '3',
    quote_en:
      'The difference between a 10-minute Canva flyer and POLISHED performance art is night and day. Cost per result dropped by 44% on our Meta campaigns within 3 weeks.',
    quote_bn:
      'ক্যানভা টেমপ্লেটের সস্তা অ্যাড আর POLISHED-এর পারফরম্যান্স ক্রিয়েটিভের তফাত আকাশ-পাতাল। আমাদের মেটা বিজ্ঞাপনে প্রতিটি অর্ডারের খরচ ৪৪% কমে গেছে।',
    name: 'Sarah Hossain',
    role_en: 'Founder, Pure Radiance Co.',
    role_bn: 'ফাউন্ডার, পিওর রেডিয়ান্স কোং',
  },
  {
    id: '4',
    quote_en:
      'Managing in-house designers for our marketing agency was an expensive headache. POLISHED handles our client creatives white-label in 48 hours. Client retention is at an all-time high.',
    quote_bn:
      'মার্কেটিং এজেন্সিতে ইন-হাউস ডিজাইনার রাখার খরচ ও প্যারা অনেক বেশি ছিল। POLISHED এখন আমাদের ক্লায়েন্টদের হোয়াইট-লেবেল ক্রিয়েটিভ ৪৮ ঘণ্টায় সাপ্লাই দেয়। ক্লায়েন্টরা অনেক খুশি।',
    name: 'Fahim Rahman',
    role_en: 'Managing Partner, Scale Media',
    role_bn: 'ম্যানেজিং পার্টনার, স্কেল মিডিয়া',
  },
];

const LUXE = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const { data: content } = useSiteSetting<TestimonialsContent>('testimonials');

  const sourceItems = content?.items?.length ? content.items : DEFAULT_ITEMS;
  const testimonials: DisplayTestimonial[] = sourceItems.map((it) => ({
    id: it.id,
    quote: isBn ? (it.quote_bn?.trim() || it.quote_en) : it.quote_en,
    name: it.name,
    role: isBn ? (it.role_bn?.trim() || it.role_en) : it.role_en,
  }));

  const label = isBn
    ? (content?.labelBn ?? 'বাস্তব প্রমাণ')
    : (content?.labelEn ?? 'Client Proof');
  const heading = isBn
    ? (content?.headingBn ?? 'বিজ্ঞাপনে লস বন্ধ করে যারা লাভ করছেন।')
    : (content?.headingEn ?? 'From Wasting Ad Budget to Real Profit.');
  const sub = isBn
    ? (content?.subBn ?? 'আমাদের পার্টনার ব্র্যান্ড ওনারদের বাস্তব অভিজ্ঞতা—যেখানে ক্যানভার চেনা লস থেকে বেরিয়ে সেলস বহুগুণ বেড়েছে।')
    : (content?.subEn ?? 'Real words from Bangladeshi brand founders who stopped losing money on cheap ads and scaled.');

  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const count = testimonials.length;
  const trackRef = useRef<HTMLDivElement>(null);

  // Mobile swipe track keeps its OWN index, fully isolated from the desktop
  // carousel index above (and from every other carousel on the page).
  const [mobileActive, setMobileActive] = useState(0);

  // Native (non-bubbling) scroll listener — React's synthetic onScroll bubbles,
  // which let sibling/parent scroll containers react to this track's scrolling.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const center = el.scrollLeft + el.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        Array.from(el.children).forEach((child, i) => {
          const c = child as HTMLElement;
          const mid = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(mid - center);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        setMobileActive((prev) => (prev === nearest ? prev : nearest));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Desktop: click-and-pull dragging + trackpad / wheel navigation.
  useDragScroll(trackRef);
  const stageRef = useRef<HTMLDivElement>(null);

  const next = () => setActive((prev) => (prev + 1) % count);
  const prev = () => setActive((prev) => (prev - 1 + count) % count);
  const goTo = (i: number) => setActive(i);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let lock = 0;
    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      // Only intercept clearly horizontal trackpad / shift-wheel gestures so
      // vertical page scrolling stays completely untouched.
      if (Math.abs(dx) <= Math.abs(dy) * 1.2) return;
      const now = performance.now();
      if (now - lock < 420 || Math.abs(dx) < 6) return;
      lock = now;
      setActive((p) => (dx > 0 ? (p + 1) % count : (p - 1 + count) % count));
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [count]);




  const getOffset = (i: number) => {
    let diff = i - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  const spacing = isMobile ? 90 : 95;

  if (count === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative bg-[#1e3a8a] text-primary-foreground overflow-x-clip py-24 md:py-32 px-6 md:px-14"
    >
      <div className="relative max-w-[1200px] mx-auto">
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
          <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary-foreground mb-5 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
            <WordReveal delay={0.1}>{heading}</WordReveal>
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p className="font-heading italic text-primary-foreground/60 text-[clamp(16px,1.6vw,20px)] max-w-xl mb-10 md:mb-16">
            {sub}
          </p>
        </MotionReveal>

        {/* ── MOBILE: native scroll-snap swipe track ── */}
        <div
          ref={trackRef}
          className="md:hidden -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab overscroll-x-contain touch-auto [scroll-padding-left:1.5rem]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {testimonials.map((t) => (
            <div key={t.id} className="snap-center shrink-0 w-[85vw] max-w-[420px]">
              <TestimonialCard testimonial={t} isBn={isBn} />
            </div>
          ))}
        </div>

        {/* Minimal mobile pagination dots */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-500 ${i === mobileActive ? 'bg-accent w-5' : 'w-1.5 bg-primary-foreground/30'
                }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            />
          ))}
        </div>

        {/* ── DESKTOP: original stacked carousel (unchanged) ── */}
        <m.div
          ref={stageRef}
          drag="x"
          dragDirectionLock={true}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 30 }}
          onDragEnd={(_, info) => {
            const power = info.offset.x + info.velocity.x * 0.14;
            if (power < -70) next();
            else if (power > 70) prev();
          }}
          whileTap={{ cursor: 'grabbing' }}
          style={{ touchAction: 'pan-y' }}
          className="hidden md:flex relative h-[340px] items-center justify-center overflow-visible cursor-grab active:cursor-grabbing select-none transform-gpu touch-pan-y">
          {testimonials.map((t, i) => {
            const offset = getOffset(i);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            return (
              <m.div
                key={t.id}
                initial={false}
                animate={{
                  x: `calc(-50% + ${offset * spacing}%)`,
                  y: '-50%',
                  scale: isActive ? 1 : 0.85,
                  opacity: isVisible ? (isActive ? 1 : 0.5) : 0,
                }}
                transition={{
                  x: { duration: 0.8, ease: LUXE },
                  y: { duration: 0 },
                  scale: { duration: 0.8, ease: LUXE },
                  opacity: { duration: 0.6, ease: LUXE },
                }}
                style={{ willChange: 'transform, opacity', top: '50%', left: '50%' }}
                className={`absolute w-full max-w-[520px] ${isActive ? 'z-10' : 'z-0'}`}
              >
                <TestimonialCard testimonial={t} dimmed={!isActive} isBn={isBn} />
              </m.div>
            );
          })}
        </m.div>

        <div className="hidden md:flex items-center justify-center gap-8 mt-12">
          <button
            type="button"
            onClick={prev}
            aria-label={isBn ? 'পূর্ববর্তী প্রশংসাপত্র' : 'Previous testimonial'}
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
                aria-label={isBn ? `প্রশংসাপত্র ${i + 1}-এ যান` : `Go to testimonial ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${i === active ? 'bg-accent w-8' : 'w-2.5 bg-primary-foreground/40 hover:bg-primary-foreground/70'
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label={isBn ? 'পরবর্তী প্রশংসাপত্র' : 'Next testimonial'}
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
  isBn = false,
}: {
  testimonial: DisplayTestimonial;
  dimmed?: boolean;
  isBn?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between p-7 md:p-8 rounded-sm border md:backdrop-blur-md min-h-[260px] ${dimmed
          ? 'bg-primary-foreground/[0.03] border-primary-foreground/10'
          : 'bg-[#1e3a8a] border-primary-foreground/15 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]'
        }`}
    >
      <div className="flex items-center gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className="text-accent fill-accent" />
        ))}
      </div>

      <blockquote
        lang={isBn ? 'bn' : 'en'}
        className="font-heading italic text-primary-foreground text-[clamp(16px,1.5vw,20px)] leading-[1.5] mb-6"
      >
        “{testimonial.quote}”
      </blockquote>

      <div className="mt-auto">
        <p className="font-heading text-primary-foreground text-[14px] tracking-wide">
          {testimonial.name}
        </p>
        <p lang={isBn ? 'bn' : 'en'} className="text-accent text-[11px] tracking-[1.5px] uppercase mt-1">
          {testimonial.role}
        </p>
      </div>
    </div>
  );
}
