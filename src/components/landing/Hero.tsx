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
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24 sm:px-8 md:px-14 md:py-20 bg-primary"
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
          className="w-16 h-16 md:w-[100px] md:h-[100px] mx-auto mb-8 md:mb-9"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(251,146,60,0.3))',
            animation: 'logoReveal 1s cubic-bezier(0.22,1,0.36,1) both',
          }}
        />

        {/* Eyebrow locked to English in both locales — identical typography & layout */}
        <p
          lang="en"
          className="font-sans-eyebrow text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[4px] uppercase text-accent/70 md:text-accent mb-8 md:mb-5 font-normal"
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
              className="hero-headline font-heading font-light text-primary-foreground mb-6 md:mb-6 text-[clamp(40px,10.5vw,120px)] md:text-[clamp(32px,8vw,96px)] leading-[1.02] md:leading-[1.08] [text-wrap:balance] text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                lineHeight: 1.08,
                letterSpacing: '0',
                wordSpacing: 'normal',
                fontWeight: 400,
              }}
            >
              <RevealText
                as="span"
                delay={BASE}
                className="block pt-4 md:whitespace-nowrap"
                stagger={STAGGER}
              >
                {line1}
              </RevealText>
              <RevealText
                as="span"
                delay={line2Delay}
                className="hero-accent-line block pt-4 text-[clamp(44px,11.5vw,108px)] md:text-[clamp(32px,7vw,84px)] text-accent italic [word-spacing:normal]"
                stagger={STAGGER}
              >
                {line2}
              </RevealText>
            </h1>
          );
        })()}

        <p lang="en" className="font-sans-body text-primary-foreground/55 leading-[1.6] md:leading-[1.7] tracking-[0.3px] max-w-[340px] md:max-w-[520px] mx-auto mb-8 md:mb-8 text-[12px] md:text-[15px] px-2 md:px-0" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.9s forwards', opacity: 0, fontFamily: "'DM Sans', sans-serif" }}>
          {hero.subEn}
        </p>

        {/* Play button — Magnetic */}
        <div className="mb-10 md:mb-8" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1s forwards', opacity: 0 }}>
          <MagneticButton
            onClick={onPuzzleOpen}
            className={`play-btn group inline-flex items-center justify-center gap-3 px-5 sm:px-10 py-2 sm:py-4.5 min-w-[240px] sm:min-w-[320px] bg-transparent border-[1.5px] border-accent/50 text-accent ${isBn ? 'text-[14px] sm:text-[18px] tracking-[0.5px] normal-case font-medium leading-[1.3]' : 'text-[10px] sm:text-[13px] tracking-[2.5px] sm:tracking-[2.5px] uppercase font-normal'} rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:text-primary-foreground hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] h-[42px] sm:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
           
          >
            <span className="w-2 h-2 bg-accent rounded-full group-hover:bg-primary-foreground" style={{ animation: 'pulseDot 1.5s infinite' }} />
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'এক্সক্লুসিভ বোনাস আনলক করুন' : (hero.playCtaEn ?? 'Play & Unlock a Bonus')}
            </span>
          </MagneticButton>
        </div>

        {/* CTA buttons — Magnetic */}
        <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center flex-wrap" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s forwards', opacity: 0 }}>
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
            className={`inline-flex items-center justify-center px-4 sm:px-11 py-2 sm:py-4 min-w-[140px] sm:min-w-[220px] ${isBn ? 'text-[13px] sm:text-[18px] tracking-[0.5px] normal-case leading-[1.3]' : 'text-[10px] sm:text-[13px] tracking-[2px] sm:tracking-[2.5px] uppercase'} font-medium rounded-sm bg-accent text-primary relative overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(251,146,60,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-[0.97] h-[40px] sm:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
           
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
            className={`inline-flex items-center justify-center px-4 sm:px-11 py-2 sm:py-4 min-w-[140px] sm:min-w-[220px] ${isBn ? 'text-[13px] sm:text-[18px] tracking-[0.5px] normal-case font-medium leading-[1.3]' : 'text-[10px] sm:text-[13px] tracking-[2px] sm:tracking-[2.5px] uppercase font-normal'} rounded-sm border-[1.5px] border-accent/50 text-accent relative overflow-hidden transition-all duration-700 ease-out hover:text-primary-foreground hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] h-[40px] sm:h-[52px] before:content-[''] before:absolute before:inset-0 before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100`}
           
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
