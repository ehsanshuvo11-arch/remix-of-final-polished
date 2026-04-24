import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import MagneticButton from '@/components/landing/MagneticButton';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { HeroContent } from '@/types/database';
import logoSvg from '@/assets/logo.svg';

interface HeroProps {
  content: HeroContent | null;
  logoUrl: string;
  onPuzzleOpen: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function parseItalic(text: string) {
  const parts = text.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em
        key={i}
        className="italic font-light bg-gradient-to-r from-[#E8C9A0] via-[#F5E1B8] to-[#C9A876] bg-clip-text text-transparent"
      >
        {part}
      </em>
    ) : (
      part
    )
  );
}

/** Sophisticated line-by-line word reveal */
function RevealLine({
  text,
  delay = 0,
  className = '',
}: {
  text: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.12em] ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function Hero({ content, onPuzzleOpen }: HeroProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const sectionRef = useRef<HTMLElement>(null);

  // Soft cursor-driven parallax for the mesh orbs (luxurious, not jumpy)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 40, damping: 20, mass: 0.6 });
  const orbAX = useTransform(sx, (v) => v * 30);
  const orbAY = useTransform(sy, (v) => v * 30);
  const orbBX = useTransform(sx, (v) => v * -22);
  const orbBY = useTransform(sy, (v) => v * -22);
  const orbCX = useTransform(sx, (v) => v * 14);
  const orbCY = useTransform(sy, (v) => v * 18);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // Default "old money" copy — overridden if content is provided
  const headlineEn = content?.titleEn ?? 'Elevating E-commerce Skincare';
  const headline2En = content?.title2En ?? 'into *Refined Brand Identities.*';
  const headlineBn = content?.titleBn ?? 'ই-কমার্স স্কিনকেয়ারকে রূপান্তর';
  const headline2Bn = (content as any)?.title2Bn ?? 'করি *পরিশীলিত ব্র্যান্ড পরিচয়ে।*';

  const eyebrowEn = content?.eyebrowEn ?? 'A Branding House · Est. Bangladesh';
  const eyebrowBn = content?.eyebrowBn ?? 'একটি ব্র্যান্ডিং হাউস · বাংলাদেশ';

  const subEn =
    content?.subEn ??
    'We craft premium, high-converting branding systems for skincare stores that demand to be remembered.';
  const subBn =
    content?.subBn ??
    'আমরা স্কিনকেয়ার স্টোরের জন্য প্রিমিয়াম, উচ্চ-রূপান্তরকারী ব্র্যান্ডিং সিস্টেম তৈরি করি — যা মনে রাখার যোগ্য।';

  const ctaPrimaryEn = content?.viewWorkEn ?? 'Request a Consultation';
  const ctaPrimaryBn = content?.viewWorkBn ?? 'কনসালটেশন বুক করুন';
  const ctaSecondaryEn = content?.startProjectEn ?? 'View the Portfolio';
  const ctaSecondaryBn = content?.startProjectBn ?? 'পোর্টফোলিও দেখুন';

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-6 sm:px-10 md:px-16 py-28 md:py-32"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #1a2547 0%, #0e1730 45%, #080d1f 100%)',
      }}
    >
      {/* === Mesh gradient depth layer === */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] -right-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full"
        style={{
          x: orbAX,
          y: orbAY,
          background:
            'radial-gradient(circle at 30% 30%, rgba(232,201,160,0.22), rgba(201,168,118,0.08) 45%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-[25%] -left-[15%] w-[75vw] h-[75vw] max-w-[1000px] max-h-[1000px] rounded-full"
        style={{
          x: orbBX,
          y: orbBY,
          background:
            'radial-gradient(circle at 50% 50%, rgba(56,89,165,0.35), rgba(34,52,110,0.12) 50%, transparent 75%)',
          filter: 'blur(110px)',
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[30%] left-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          x: orbCX,
          y: orbCY,
          background:
            'radial-gradient(circle, rgba(245,225,184,0.10), transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* === Refined noise / grain texture === */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
        }}
      />

      {/* === Subtle vertical light shaft === */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px]"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(232,201,160,0.18) 30%, rgba(232,201,160,0.18) 70%, transparent)',
        }}
      />

      {/* === Glassmorphism floating monogram (top right) === */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.6, ease: EASE }}
        className="hidden md:flex absolute top-8 right-8 items-center gap-3 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl bg-white/[0.03]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8C9A0]" />
        <span className="text-[10px] tracking-[3px] uppercase text-white/60 font-light">
          {t('Available · MMXXV', 'উপলব্ধ · ২০২৫')}
        </span>
      </motion.div>

      {/* === Content === */}
      <div className="relative z-10 max-w-[1100px] w-full mx-auto text-center">
        {/* Logo crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mb-10 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-[#E8C9A0]/20 rounded-full" />
            <img
              src={logoSvg}
              alt="POLISHED — Skincare Branding Agency"
              className="relative w-[72px] h-[72px] md:w-[84px] md:h-[84px]"
            />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="hidden sm:block w-10 h-px bg-gradient-to-r from-transparent to-[#E8C9A0]/60" />
          <p className="text-[10px] sm:text-[11px] tracking-[5px] uppercase text-[#E8C9A0]/85 font-light">
            {t(eyebrowEn, eyebrowBn)}
          </p>
          <span className="hidden sm:block w-10 h-px bg-gradient-to-l from-transparent to-[#E8C9A0]/60" />
        </motion.div>

        {/* Headline — refined line-by-line reveal */}
        <h1
          className={`font-heading font-extralight text-white tracking-[-0.015em] mb-10 ${
            isBn
              ? 'text-[clamp(32px,6.5vw,76px)] leading-[1.18]'
              : 'text-[clamp(34px,7vw,86px)] leading-[1.05]'
          }`}
        >
          <RevealLine text={parseItalic(t(headlineEn, headlineBn))} delay={0.55} />
          <RevealLine
            text={parseItalic(t(headline2En, headline2Bn))}
            delay={0.8}
          />
        </h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.15, ease: EASE }}
          className="max-w-[580px] mx-auto text-white/55 text-[15px] md:text-[16px] leading-[1.75] tracking-[0.2px] font-light mb-12"
        >
          {t(subEn, subBn)}
        </motion.p>

        {/* CTA cluster */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.4, ease: EASE }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5"
        >
          {/* Primary — magnetic, expensive underline-fill */}
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
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-[18px] min-h-[52px] rounded-sm overflow-hidden bg-gradient-to-b from-[#E8C9A0] to-[#C9A876] text-[#0e1730] text-[11px] sm:text-[12px] tracking-[3px] uppercase font-medium transition-all duration-700 ease-out hover:-translate-y-[2px] hover:shadow-[0_18px_50px_-12px_rgba(232,201,160,0.45),inset_0_1px_0_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10">{t(ctaPrimaryEn, ctaPrimaryBn)}</span>
            <svg
              className="relative z-10 w-3.5 h-3.5 transition-transform duration-700 ease-out group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>

          {/* Secondary — ghost with refined underline-fill */}
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
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-[18px] min-h-[52px] rounded-sm border border-white/15 text-white/85 text-[11px] sm:text-[12px] tracking-[3px] uppercase font-light backdrop-blur-md bg-white/[0.02] transition-all duration-700 ease-out hover:text-white hover:border-white/30 hover:-translate-y-[2px]"
          >
            <span className="relative z-10 inline-block">
              {t(ctaSecondaryEn, ctaSecondaryBn)}
              <span className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#E8C9A0] transition-transform duration-700 ease-out group-hover:scale-x-100" />
            </span>
          </MagneticButton>
        </motion.div>

        {/* Tertiary — quiet "Play & Unlock a Bonus" link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.7, ease: EASE }}
          onClick={onPuzzleOpen}
          className="mt-10 group inline-flex items-center gap-2.5 text-[10px] tracking-[3px] uppercase text-white/40 hover:text-[#E8C9A0] transition-colors duration-500"
        >
          <span className="w-1 h-1 rounded-full bg-[#E8C9A0]/80 animate-pulse" />
          {t(content?.playCtaEn ?? 'Play & Unlock a Bonus', content?.playCtaBn ?? 'খেলুন ও বোনাস পান')}
          <span className="w-6 h-px bg-white/20 group-hover:bg-[#E8C9A0]/60 transition-colors duration-500" />
        </motion.button>
      </div>

      {/* === Bottom-corner refinements === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2, ease: EASE }}
        className="absolute bottom-8 left-8 hidden md:flex items-center gap-3"
      >
        <span className="w-8 h-px bg-white/20" />
        <span className="text-[10px] tracking-[3px] uppercase text-white/40 font-light">
          {t('Skincare × Branding', 'স্কিনকেয়ার × ব্র্যান্ডিং')}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 2, ease: EASE }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/35"
      >
        <span className="text-[9px] tracking-[4px] uppercase font-light">
          {t(content?.scrollEn ?? 'Scroll', content?.scrollBn ?? 'স্ক্রল')}
        </span>
        <motion.span
          className="w-px h-10 bg-gradient-to-b from-[#E8C9A0]/60 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2, ease: EASE }}
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-3"
      >
        <span className="text-[10px] tracking-[3px] uppercase text-white/40 font-light">
          {t('Bangladesh · Worldwide', 'বাংলাদেশ · বিশ্বব্যাপী')}
        </span>
        <span className="w-8 h-px bg-white/20" />
      </motion.div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8C9A0]/30 to-transparent" />
    </section>
  );
}
