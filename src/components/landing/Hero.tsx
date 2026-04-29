import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MagneticButton from '@/components/landing/MagneticButton';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { HeroContent } from '@/types/database';
import logoSvg from '@/assets/logo.svg';
import RevealText from '@/components/landing/RevealText';

interface HeroProps {
  content: HeroContent | null;
  logoUrl: string;
  onPuzzleOpen: () => void;
}

function parseItalic(text: string) {
  const parts = text.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i} className="italic text-accent">{part}</em> : part
  );
}

export default function Hero({ content, logoUrl, onPuzzleOpen }: HeroProps) {
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
    subEn: 'We craft refined, trust-driven visual identities for skincare brands that deserve to be seen — and remembered.',
    subBn: 'আমরা স্কিনকেয়ার ব্র্যান্ডের জন্য পরিশীলিত, বিশ্বাসযোগ্য ভিজ্যুয়াল আইডেন্টিটি তৈরি করি — যা দেখা এবং মনে রাখার যোগ্য।',
  };

  // Parallax on orbs
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${y * 0.3}px)`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${y * -0.2}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 pt-16 pb-24 sm:px-8 md:px-14 md:py-20 bg-primary"
    >
      {/* Animated grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Orbs with parallax — toned down for cleaner navy field */}
      <div ref={orb1Ref} className="absolute w-[800px] h-[800px] rounded-full pointer-events-none" style={{ top: '-200px', right: '-200px', background: 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, rgba(251,146,60,0.025) 35%, rgba(251,146,60,0) 70%)', animation: 'orbFloat 8s ease-in-out infinite' }} />
      <div ref={orb2Ref} className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ bottom: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(99,102,241,0.02) 40%, rgba(99,102,241,0) 70%)', animation: 'orbFloat 10s ease-in-out infinite reverse' }} />

      <div className="max-w-[900px] text-center relative z-10">
        {/* Logo badge */}
        <img
          src={logoSvg}
          alt="POLISHED Logo"
          className="w-14 h-14 mb-14 md:w-[100px] md:h-[100px] md:mb-9 mx-auto"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(251,146,60,0.3))',
            animation: 'logoReveal 1s cubic-bezier(0.22,1,0.36,1) both',
          }}
        />

        {/* Eyebrow locked to English in both locales — identical typography & layout */}
        <p
          lang="en"
          className="font-sans-eyebrow text-[10px] tracking-[0.2em] mt-4 mb-8 md:mt-0 md:text-[11px] md:tracking-[4px] md:mb-5 uppercase text-accent font-normal"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s forwards', opacity: 0, fontFamily: "'Inter', sans-serif" }}
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
          const line1 = 'Make Your Collection';
          const line2 = 'Unmissable!';
          // Fixed delay for line 2 — independent of locale/word count to guarantee
          // identical animation choreography across languages.
          const line2Delay = BASE + 3 * STAGGER;
          return (
            <h1
              lang="en"
              className="hero-headline font-heading font-light text-primary-foreground text-4xl tracking-[-0.01em] leading-tight mb-2 md:tracking-normal md:mb-6 md:text-[clamp(48px,8vw,96px)] md:leading-[1.08] whitespace-nowrap text-center"
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
                className="block whitespace-nowrap"
                stagger={STAGGER}
              >
                {line1}
              </RevealText>
              <RevealText
                as="span"
                delay={line2Delay}
                className="hero-accent-line block text-5xl italic mb-20 md:mb-0 md:pt-4 md:text-[clamp(42px,7vw,84px)] text-accent whitespace-nowrap [word-spacing:normal]"
                stagger={STAGGER}
              >
                {line2}
              </RevealText>
            </h1>
          );
        })()}

        <p lang="en" className="hidden md:block font-sans-body text-primary-foreground/55 leading-[1.6] md:leading-[1.7] tracking-[0.3px] max-w-[340px] md:max-w-[520px] mx-auto mb-8 md:mb-8 text-[12px] md:text-[15px] px-2 md:px-0" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.9s forwards', opacity: 0, fontFamily: "'DM Sans', sans-serif" }}>
          {hero.subEn}
        </p>

        {/* Mobile-only: Play link as subtle text CTA directly under tagline */}
        <button
          type="button"
          onClick={onPuzzleOpen}
          className="md:hidden group inline-flex items-center justify-center gap-2 mx-auto mb-2 text-accent/70 hover:text-accent transition-colors duration-500 text-[10px] tracking-[0.25em] uppercase font-normal"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1s forwards', opacity: 0, fontFamily: "'Inter', sans-serif" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
          <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
            {isBn ? 'এক্সক্লুসিভ বোনাস আনলক করুন' : (hero.playCtaEn ?? 'Play & Unlock a Bonus')}
          </span>
          <span className="ml-1 inline-block w-6 h-px bg-accent/40 group-hover:w-10 group-hover:bg-accent transition-all duration-500" />
        </button>

        {/* Desktop-only: Play button — Magnetic (preserve original desktop hierarchy) */}
        <div className="hidden md:contents" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1s forwards', opacity: 0 }}>
          <MagneticButton
            onClick={onPuzzleOpen}
            className={`play-btn group w-full py-3.5 text-xs tracking-[0.1em] flex justify-center items-center gap-2 md:gap-3 md:inline-flex md:w-auto md:px-10 md:py-4.5 md:min-w-[320px] bg-transparent border-[1.5px] border-accent/50 text-accent ${isBn ? 'md:text-[18px] md:tracking-[0.5px] normal-case font-medium leading-[1.3]' : 'md:text-[13px] md:tracking-[2.5px] uppercase font-normal'} rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:text-primary-foreground hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] md:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
          >
            <span className="w-2 h-2 bg-accent rounded-full group-hover:bg-primary-foreground" style={{ animation: 'pulseDot 1.5s infinite' }} />
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'এক্সক্লুসিভ বোনাস আনলক করুন' : (hero.playCtaEn ?? 'Play & Unlock a Bonus')}
            </span>
          </MagneticButton>
        </div>

        {/* CTA buttons — Magnetic.
            Mobile order: Start a Project (primary, filled) → View Our Work (secondary, outlined).
            Desktop order preserved: View Our Work (primary) → Start a Project (secondary). */}
        <div className="flex flex-col-reverse w-[70%] max-w-[280px] mx-auto gap-4 mt-10 mb-16 [&>div]:w-full md:[&>div]:w-auto md:flex-row md:w-auto md:max-w-none md:gap-4 md:mt-8 md:mb-0 justify-center items-center" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s forwards', opacity: 0 }}>
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
            className={`w-full py-3 text-xs tracking-widest uppercase flex justify-center items-center bg-transparent border-[1.5px] border-accent/50 text-accent md:text-xs md:tracking-[0.1em] md:py-4 md:bg-accent md:border-0 md:text-primary md:inline-flex md:w-auto md:px-11 md:py-4 md:min-w-[220px] ${isBn ? 'md:text-[18px] md:tracking-[0.5px] normal-case leading-[1.3]' : 'md:text-[13px] md:tracking-[2.5px] uppercase'} font-medium rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 md:hover:shadow-[0_12px_32px_rgba(251,146,60,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-[0.97] md:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
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
            className={`w-full py-3 text-xs tracking-widest uppercase flex justify-center items-center bg-accent text-primary border-0 md:text-xs md:tracking-[0.1em] md:py-4 md:bg-transparent md:text-accent md:border-[1.5px] md:border-accent/50 md:inline-flex md:w-auto md:px-11 md:py-4 md:min-w-[220px] ${isBn ? 'md:text-[18px] md:tracking-[0.5px] normal-case font-medium leading-[1.3]' : 'md:text-[13px] md:tracking-[2.5px] uppercase font-normal'} rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 md:hover:text-primary-foreground md:hover:border-accent md:hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] md:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 md:before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'প্রজেক্ট শুরু করুন' : (hero.startProjectEn ?? 'Start a Project')}
            </span>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/30 text-[10px] tracking-[3px] uppercase" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.4s both' }}>
        {hero.scrollEn ?? 'Scroll'}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.8s both' }} />
      </div>

      {/* Hairline accent at bottom — no glow bleed */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-accent/40" />
    </section>
  );
}
