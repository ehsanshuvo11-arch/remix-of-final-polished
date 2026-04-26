import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MagneticButton from '@/components/landing/MagneticButton';
import { getLenis } from '@/components/landing/SmoothScroll';
import ClientOnly from '@/components/ClientOnly';
import { lazy } from 'react';

// Strictly client-only: the module is only ever fetched/evaluated inside
// <ClientOnly> after mount, so its `three` / R3F imports never enter the
// SSR module graph (defense in depth on top of the lazy() chain inside).
const SerumBottle3D = lazy(() => import('@/components/landing/SerumBottle3D'));
import type { HeroContent } from '@/types/database';
import logoSvg from '@/assets/logo.svg';

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
    titleBn: 'আপনার কালেকশনকে করুন',
    title2Bn: '*অবিস্মরণীয়!*',
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

      {/* Orbs with parallax */}
      <div ref={orb1Ref} className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ top: '-100px', right: '-100px', background: 'rgba(251,146,60,0.12)', filter: 'blur(80px)', animation: 'orbFloat 8s ease-in-out infinite' }} />
      <div ref={orb2Ref} className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ bottom: '-50px', left: '-50px', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', animation: 'orbFloat 10s ease-in-out infinite reverse' }} />

      {/* 3D serum bottle — strictly client-only. Server render + first hydration
          tick render NOTHING here; the R3F module chain is only fetched after
          useEffect fires inside <ClientOnly>. */}
      <ClientOnly>
        <SerumBottle3D
          className="hidden lg:block absolute right-[4%] top-1/2 -translate-y-1/2 w-[420px] h-[560px] xl:w-[480px] xl:h-[620px] z-[5] opacity-90"
        />
        {/* Mobile: small floating accent above headline */}
        <SerumBottle3D
          className="lg:hidden absolute right-4 top-20 w-[160px] h-[200px] z-[5] opacity-80"
        />
      </ClientOnly>

      <div className="max-w-[900px] text-center relative z-10">
        {/* Logo badge */}
        <img
          src={logoSvg}
          alt="POLISHED Logo"
          className="w-[100px] h-[100px] mx-auto mb-9"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(251,146,60,0.3))',
            animation: 'logoReveal 1s cubic-bezier(0.22,1,0.36,1) both',
          }}
        />

        <p
          className="text-[11px] tracking-[4px] uppercase text-accent mb-5 font-normal"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s forwards', opacity: 0 }}
        >
          {t(hero.eyebrowEn, hero.eyebrowBn)}
        </p>

        <h1
          className="font-heading font-light text-primary-foreground tracking-[-0.02em] mb-6 text-[clamp(32px,8vw,96px)] leading-[1.08] [text-wrap:balance]"
        >
         <span className="inline-block pt-4">
            <span className="inline-block" style={{ animation: 'wordReveal 1s cubic-bezier(0.22,1,0.36,1) 0.5s forwards', transform: 'translateY(110%)', clipPath: 'inset(-20% -10% 0 -10%)' }}>
              {parseItalic(t(hero.titleEn, hero.titleBn))}
            </span>
          </span>
          <br />
          <span className="inline-block pt-4 text-[clamp(28px,6.5vw,80px)]">
            <span className="inline-block" style={{ animation: 'wordReveal 1s cubic-bezier(0.22,1,0.36,1) 0.7s forwards', transform: 'translateY(110%)', clipPath: 'inset(-20% -10% 0 -10%)' }}>
              {parseItalic(t(hero.title2En, (hero as any).title2Bn || ''))}
            </span>
          </span>
        </h1>

        <p className="text-primary-foreground/55 leading-[1.7] tracking-[0.3px] max-w-[520px] mx-auto mb-8 text-[15px]" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.9s forwards', opacity: 0 }}>
          {t(hero.subEn, hero.subBn)}
        </p>

        {/* Play button — Magnetic */}
        <div className="mb-8" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1s forwards', opacity: 0 }}>
          <MagneticButton
            onClick={onPuzzleOpen}
            className="play-btn group inline-flex items-center justify-center gap-3 px-7 sm:px-10 py-4 sm:py-4.5 bg-transparent border-[1.5px] border-accent/50 text-accent text-[12px] sm:text-[13px] tracking-[2.5px] uppercase font-normal rounded-sm relative overflow-hidden transition-all duration-700 ease-out hover:text-primary-foreground hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] min-h-[48px] before:content-[''] before:absolute before:inset-0 before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100"
          >
            <span className="w-2 h-2 bg-accent rounded-full group-hover:bg-primary-foreground" style={{ animation: 'pulseDot 1.5s infinite' }} />
            {t(hero.playCtaEn ?? 'Play & Unlock a Bonus', hero.playCtaBn ?? 'খেলুন ও বোনাস পান')}
          </MagneticButton>
        </div>

        {/* CTA buttons — Magnetic */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center sm:flex-wrap" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s forwards', opacity: 0 }}>
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
            className="inline-flex items-center justify-center px-8 sm:px-11 py-4 text-[12px] sm:text-[13px] tracking-[2.5px] uppercase font-medium rounded-sm bg-accent text-primary relative overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(251,146,60,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-[0.97] min-h-[48px] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100"
          >
            {t(hero.viewWorkEn ?? 'View Our Work', hero.viewWorkBn ?? 'আমাদের কাজ দেখুন')}
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
            className="inline-flex items-center justify-center px-8 sm:px-11 py-4 text-[12px] sm:text-[13px] tracking-[2.5px] uppercase font-normal rounded-sm border-[1.5px] border-accent/50 text-accent relative overflow-hidden transition-all duration-700 ease-out hover:text-primary-foreground hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(251,146,60,0.3)] active:scale-[0.97] min-h-[48px] before:content-[''] before:absolute before:inset-0 before:bg-accent before:scale-x-0 before:origin-left before:transition-transform before:duration-700 hover:before:scale-x-100"
          >
            {t(hero.startProjectEn ?? 'Start a Project', hero.startProjectBn ?? 'প্রজেক্ট শুরু')}
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/30 text-[10px] tracking-[3px] uppercase" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.4s both' }}>
        {t(hero.scrollEn ?? 'Scroll', hero.scrollBn ?? 'স্ক্রল')}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.8s both' }} />
      </div>

      {/* Subtle orange glow at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent/60" />
      <div className="absolute bottom-0 left-0 w-full h-[12px] bg-gradient-to-t from-accent/25 to-transparent blur-[4px]" />
    </section>
  );
}
