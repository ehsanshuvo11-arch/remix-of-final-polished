import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MagneticButton from '@/components/landing/MagneticButton';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { HeroContent } from '@/types/database';
import RevealText from '@/components/landing/RevealText';

interface HeroProps {
  content: HeroContent | null;
  logoUrl: string;
}


function parseItalic(text: string) {
  const parts = text.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i} className="italic text-accent">{part}</em> : part
  );
}

export default function Hero({ content, logoUrl }: HeroProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const hero = content ?? {
    titleEn: 'Make Your Collection',
    title2En: '*Unmissable!*',
    titleBn: 'আপনার কালেকশন হোক',
    title2Bn: '*অনবদ্য!*',
    eyebrowEn: 'Graphics Design Agency · Bangladesh',
    eyebrowBn: 'গ্রাফিক্স ডিজাইন এজেন্সি · বাংলাদেশ',
    subEn: 'We craft refined, trust-driven visual identities for skincare & self-care brands that deserve to be seen — and remembered.',
    subBn: 'আমরা প্রিমিয়াম স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ডের জন্য পরিশীলিত, বিশ্বাসযোগ্য ভিজ্যুয়াল আইডেন্টিটি তৈরি করি — যা দেখা এবং মনে রাখার যোগ্য।',
  };

  // Parallax on orbs — scroll + a whisper of pointer drift (desktop only)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Touch scrolling must stay entirely on the browser compositor. Attaching a
    // scroll listener here made the two oversized ambient layers repaint on
    // every finger movement, which was the main source of mobile judder.
    if (!fine || reduced) return;

    let scrollY = 0;
    let px = 0;
    let py = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;

    const apply = () => {
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${px}px, ${scrollY * 0.3 + py}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${px * -0.7}px, ${scrollY * -0.2 + py * -0.7}px, 0)`;
      }
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      apply();
    };

    const tick = () => {
      px += (targetX - px) * 0.045;
      py += (targetY - py) * 0.045;
      apply();
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 26;
      targetY = (e.clientY / window.innerHeight - 0.5) * 18;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="h-[100svh] min-h-[100svh] flex items-center justify-center relative overflow-hidden px-6 pt-0 pb-0 sm:px-8 md:h-auto md:min-h-screen md:px-14 md:pt-20 md:pb-36 lg:pb-40 bg-primary"
    >
      {/* Animated grid */}
      <div
        className="hero-grid absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Orbs — scroll + pointer parallax (transform driven from JS) */}
      <div ref={orb1Ref} className="hero-orb absolute w-[800px] h-[800px] rounded-full pointer-events-none will-change-transform" style={{ top: '-200px', right: '-200px', background: 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, rgba(251,146,60,0.025) 35%, rgba(251,146,60,0) 70%)' }} />
      <div ref={orb2Ref} className="hero-orb absolute w-[600px] h-[600px] rounded-full pointer-events-none will-change-transform" style={{ bottom: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(99,102,241,0.02) 40%, rgba(99,102,241,0) 70%)' }} />

      <div className="max-w-[900px] text-center relative z-10">
        {/* ── Unified hero welcome choreography ──
            One timeline, every element in sync with the headline:
            logo 0s → eyebrow 0.25s → headline 0.4s (0.15s stagger)
            → subheadline 1.05s → CTAs 1.25s → scroll cue 1.45s        */}
        {/* Logo badge */}
        <img
          src="/logo.svg"
          alt="POLISHED Logo"
          width={100}
          height={100}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="hero-logo-breath w-12 h-12 mb-4 md:w-[100px] md:h-[100px] md:mb-9 mx-auto"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(251,146,60,0.3))',
            animation:
              'logoReveal 1s cubic-bezier(0.22,1,0.36,1) both, heroLogoBreath 9s ease-in-out 1.4s infinite',
          }}
        />


        {/* Eyebrow locked to English in both locales — identical typography & layout */}
        <p
          lang="en"
          className="font-sans-eyebrow text-[8px] tracking-[0.35em] text-accent mt-4 mb-8 md:mt-0 md:text-[11px] md:tracking-[4px] md:mb-5 uppercase font-normal"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both', fontFamily: "'Inter', sans-serif" }}
        >
          {hero.eyebrowEn}
        </p>


        {(() => {
          // Zero-shift headline: identical DOM, classes, fonts, sizes, and animation
          // timings for EN and BN. Only the raw text strings differ.
          const BASE = 0.4;
          const STAGGER = 0.15;
          // Headline is locked to English in both locales to guarantee zero layout shift
          // and identical typography (font, weight, size, spacing) across language toggles.
          const line2Delay = BASE + 3 * STAGGER;
          return (
            <h1
              lang="en"
              className="hero-headline font-heading font-light text-primary-foreground text-[36px] tracking-tight leading-[1.15] mx-auto mb-2 md:max-w-none md:tracking-normal md:leading-[1.08] md:mb-6 md:text-[clamp(48px,8vw,96px)] md:whitespace-nowrap text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '0',
                wordSpacing: 'normal',
                fontWeight: 400,
              }}
            >
              <RevealText
                as="span"
                delay={BASE}
                className="block md:inline whitespace-nowrap"
                stagger={STAGGER}
              >
                Make
              </RevealText>
              <RevealText
                as="span"
                delay={BASE + STAGGER}
                className="block md:inline whitespace-nowrap"
                stagger={STAGGER}
              >
                Your Collection
              </RevealText>
              <RevealText
                as="span"
                delay={line2Delay}
                className="hero-accent-line block text-[32px] leading-tight mt-1 mb-4 md:mt-0 md:mb-0 md:pt-4 md:text-[clamp(42px,7vw,84px)] md:leading-[1.08] italic text-accent md:whitespace-nowrap [word-spacing:normal]"
                stagger={STAGGER}
              >
                Unmissable!
              </RevealText>
            </h1>
          );
        })()}

        {/* Static, always-rendered subheadline — enters right as the headline settles. */}
        <p
          lang={isBn ? 'bn' : 'en'}
          className="block font-sans-body text-primary-foreground/55 leading-[1.65] md:leading-[1.7] tracking-[0.3px] max-w-[310px] md:max-w-[520px] mx-auto mb-8 md:mb-8 text-[13px] md:text-[15px] px-1 md:px-0"
          style={{
            fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
            animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.05s both',
          }}
        >

          {isBn
            ? (hero.subBn ||
              'আমরা প্রিমিয়াম স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ডের জন্য পরিশীলিত, বিশ্বাসযোগ্য ভিজ্যুয়াল আইডেন্টিটি তৈরি করি — যা আলাদাভাবে নজর কাড়ে এবং মানুষের মনে গেঁথে থাকে।')
            : (hero.subEn ||
              'We craft refined, trust-driven visual identities for skincare & self-care brands that deserve to be seen — and remembered.')}
        </p>



        {/* CTA buttons — Magnetic.
            Mobile order: Start a Project (primary, filled) → View Our Work (secondary, outlined).
            Desktop order preserved: View Our Work (primary) → Start a Project (secondary). */}
        <div className="flex flex-col-reverse w-full max-w-[300px] mx-auto gap-2.5 mt-0 mb-2 [&>div]:w-full md:[&>div]:w-auto md:flex-row md:w-auto md:max-w-none md:gap-4 md:mt-8 md:mb-0 justify-center items-center" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.25s both' }}>
          <MagneticButton
            as="a"
            href="#work"
            onClick={() => {
              const el = document.getElementById('work');
              if (el) {
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
                else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`w-full py-2.5 text-[11px] tracking-widest uppercase flex justify-center items-center bg-transparent border-[1.5px] border-accent/50 text-accent md:text-xs md:tracking-[0.1em] md:py-4 md:bg-accent md:border-0 md:text-primary md:inline-flex md:w-auto md:px-11 md:py-4 md:min-w-[220px] ${isBn ? 'md:text-[17px] md:tracking-[1.5px] uppercase leading-[1.3]' : 'md:text-[13px] md:tracking-[2.5px] uppercase'} font-medium rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 md:hover:shadow-[0_12px_32px_rgba(251,146,60,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-[0.97] md:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'এক্সপ্লোর করুন' : (hero.viewWorkEn ?? 'View Our Work')}
            </span>
          </MagneticButton>

          <MagneticButton
            as="a"
            href="#contact"
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) {
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
                else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`w-full py-2.5 text-[11px] tracking-widest uppercase flex justify-center items-center bg-accent text-primary border-0 md:text-xs md:tracking-[0.1em] md:py-4 md:bg-transparent md:text-accent md:border-[1.5px] md:border-accent/50 md:inline-flex md:w-auto md:px-11 md:py-4 md:min-w-[220px] ${isBn ? 'md:text-[17px] md:tracking-[1.5px] uppercase font-medium leading-[1.3]' : 'md:text-[13px] md:tracking-[2.5px] uppercase font-normal'} rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 md:hover:text-primary-foreground md:hover:border-accent md:hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] md:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 md:before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'প্রজেক্ট শুরু করুন' : (hero.startProjectEn ?? 'Start a Project')}
            </span>
          </MagneticButton>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 md:bottom-9 left-1/2 -translate-x-1/2 flex md:hidden md:[@media(min-height:720px)]:flex flex-col items-center gap-2 text-primary-foreground/40 md:text-primary-foreground/30 text-[9px] md:text-[10px] tracking-[3px] uppercase transform-gpu will-change-transform" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.45s both' }}>
        {hero.scrollEn ?? 'Scroll'}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.7s both' }} />

      </div>

      {/* Hairline accent at bottom — no glow bleed */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-accent/40" />
    </section>
  );
}
