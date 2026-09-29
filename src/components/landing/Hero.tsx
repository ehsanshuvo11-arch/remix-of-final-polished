import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MagneticButton from '@/components/landing/MagneticButton';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { HeroContent } from '@/types/database';
import RevealText from '@/components/landing/RevealText';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  content: HeroContent | null;
  logoUrl: string;
}

export default function Hero({ content, logoUrl }: HeroProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const isMobile = useIsMobileDevice();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const hero = content ?? {
    titleEn: 'Make Your Collection',
    title2En: '*Unmissable!*',
    titleBn: 'আপনার কালেকশন হোক',
    title2Bn: '*অনবদ্য!*',
    eyebrowEn: 'Performance & Meta Ad Creative Agency · Bangladesh',
    eyebrowBn: 'পার্ফরম্যান্স ও মেটা অ্যাড ক্রিয়েটিভ এজেন্সি · বাংলাদেশ',
    subEn: "We don't just design aesthetic banners. We build high-converting Meta Ad creatives that slash your CPR and eliminate COD return risks for your skincare brand.",
    subBn: "সুন্দর ডিজাইন অনেকেই দেয়, কিন্তু সেলস আনা সহজ নয়। আমাদের ডেটা-ড্রিভেন ডিজাইন আপনার মেটা অ্যাডের খরচ কমাবে এবং ক্যাশ-অন-ডেলিভারি (COD) রিটার্ন ঝুঁকি জিরো করবে।",
  };

  // Parallax on orbs — scroll + pointer drift with viewport-culled RAF
  useEffect(() => {
    if (isMobile) return;

    let scrollY = 0;
    let px = 0;
    let py = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;
    let isVisible = true;

    const apply = () => {
      if (!isVisible) return;
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${px}px, ${scrollY * 0.25 + py}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${px * -0.7}px, ${scrollY * -0.15 + py * -0.7}px, 0)`;
      }
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      isVisible = scrollY < window.innerHeight * 1.2;
      if (isVisible) apply();
    };

    const tick = () => {
      if (isVisible) {
        const dx = targetX - px;
        const dy = targetY - py;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          px += dx * 0.05;
          py += dy * 0.05;
          apply();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isVisible) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 26;
      targetY = (e.clientY / window.innerHeight - 0.5) * 18;
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    window.addEventListener('scroll', onScroll, { passive: true });
    if (!reduced && fine) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  return (
    <section
      className="min-h-[100svh] py-14 px-5 flex flex-col justify-center items-center relative overflow-hidden sm:px-8 md:h-auto md:min-h-screen md:px-14 md:pt-20 md:pb-36 lg:pb-40 bg-primary"
    >
      {/* Subtle luxury static grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Orbs — scroll + pointer parallax (transform driven from JS) */}
      <div ref={orb1Ref} className="absolute w-[800px] h-[800px] rounded-full pointer-events-none will-change-transform" style={{ top: '-200px', right: '-200px', background: 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, rgba(251,146,60,0.025) 35%, rgba(251,146,60,0) 70%)' }} />
      <div ref={orb2Ref} className="absolute w-[600px] h-[600px] rounded-full pointer-events-none will-change-transform" style={{ bottom: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(30,58,138,0.25) 0%, rgba(30,58,138,0.08) 40%, rgba(30,58,138,0) 70%)' }} />

      <div className="max-w-[900px] text-center relative z-10">
        <img
          src="/logo.svg"
          alt="POLISHED Logo"
          width={100}
          height={100}
          loading="eager"
          decoding="sync"
          className="hero-logo-breath w-12 h-12 mb-4 md:w-[100px] md:h-[100px] md:mb-9 mx-auto"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(251,146,60,0.3))',
            animation:
              'logoReveal 1s cubic-bezier(0.22,1,0.36,1) both, heroLogoBreath 9s ease-in-out 1.4s infinite',
          }}
        />
        <div className="w-full flex flex-col items-center justify-center mt-3 mb-6 md:mt-0 md:mb-5 gap-2.5">
          {/* Subtle live availability pill */}
          <div
            className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-white/[0.06] border border-white/12 text-[10px] md:text-[11px] tracking-[1.5px] uppercase text-primary-foreground/90 font-medium"
            style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both' }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>
              {isBn ? '৩টি পার্টনার স্লট বাকি • মার্চ স্প্রিন্ট' : '3 Partner Slots Remaining • March Sprint'}
            </span>
          </div>

          <p
            lang="en"
            className="font-sans-eyebrow text-[9px] tracking-[0.3em] -mr-[0.3em] text-accent md:text-[11px] md:tracking-[4px] md:-mr-[4px] uppercase font-semibold"
            style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both', fontFamily: '"Inter", sans-serif' }}
          >
            {hero.eyebrowEn}
          </p>
        </div>
        {(() => {
          const BASE = 0.4;
          const STAGGER = 0.15;
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

        <p
          lang={isBn ? 'bn' : 'en'}
          className="block font-sans-body text-primary-foreground/75 leading-[1.65] md:leading-[1.7] tracking-[0.3px] max-w-[340px] md:max-w-[580px] mx-auto mb-8 md:mb-8 text-[13px] md:text-[15px] px-1 md:px-0"
          style={{
            fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
            animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.05s both',
          }}
        >
          {isBn ? hero.subBn : hero.subEn}
        </p>

        <div className="flex flex-col w-full max-w-[340px] md:max-w-none mx-auto gap-3 md:flex-row md:gap-4 md:mt-8 md:mb-0 justify-center items-center" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.25s both' }}>
          <MagneticButton
            as="a"
            href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20start%20the%20%E0%A7%B33999%20Skincare%20Trial%20Pack!"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3.5 text-xs tracking-[1.5px] uppercase flex justify-center items-center bg-accent text-accent-foreground border border-accent md:inline-flex md:w-auto md:px-10 md:py-4 md:min-w-[240px] ${isBn ? 'md:text-[16px] md:tracking-[1px] leading-[1.3]' : 'md:text-[12px] md:tracking-[2px] uppercase'} font-bold rounded-full relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(251,146,60,0.5)] active:scale-[0.97] h-[48px] md:h-[52px] cursor-pointer btn-shimmer pulse-glow-accent shadow-[0_4px_20px_rgba(251,146,60,0.35)]`}
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? '৳৩,৯৯৯ ট্রায়াল শুরু করুন' : 'Start ৳3,999 Trial'}
            </span>
          </MagneticButton>

          <MagneticButton
            as="a"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('work');
              if (el) {
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
                else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`w-full py-3.5 text-xs tracking-[1.5px] uppercase flex justify-center items-center bg-white/5 backdrop-blur-sm border border-white/20 text-white/90 hover:border-accent hover:text-accent hover:bg-accent/10 md:inline-flex md:w-auto md:px-9 md:py-4 md:min-w-[200px] ${isBn ? 'md:text-[16px] md:tracking-[1px] leading-[1.3]' : 'md:text-[12px] md:tracking-[2px] uppercase'} font-semibold rounded-full relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 active:scale-[0.97] h-[48px] md:h-[52px]`}
          >
            <span lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? 'অ্যাড প্রোটোটাইপ দেখুন' : 'View Ad Prototypes'}
            </span>
          </MagneticButton>
        </div>

        {/* Social Proof & Metrics Strip */}
        <div
          className="w-full max-w-[700px] mx-auto mt-7 md:mt-9 pt-5 border-t border-primary-foreground/10 text-primary-foreground/75"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.35s both' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] md:text-xs">
            <span className="flex items-center gap-1.5 font-medium text-primary-foreground/90">
              <span className="text-accent font-bold">★</span>
              <span>{isBn ? 'গড় ৩.২x ROAS বৃদ্ধি' : '3.2x Avg. ROAS Lift'}</span>
            </span>
            <span className="text-primary-foreground/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 font-medium text-primary-foreground/90">
              <span className="text-accent font-bold">✦</span>
              <span>{isBn ? '৩০+ প্রিমিয়াম D2C ব্র্যান্ড' : '30+ Premium Brands Scaled'}</span>
            </span>
            <span className="text-primary-foreground/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 font-medium text-primary-foreground/90">
              <span className="text-accent font-bold">⚡</span>
              <span>{isBn ? '৭ দিনে স্প্রিন্ট ডেলিভারি' : '7-Day Sprint Delivery'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-9 left-1/2 -translate-x-1/2 flex md:hidden md:[@media(min-height:720px)]:flex flex-col items-center gap-2 text-primary-foreground/40 md:text-primary-foreground/30 text-[9px] md:text-[10px] tracking-[3px] uppercase transform-gpu will-change-transform" style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 1.45s both' }}>
        {hero.scrollEn ?? 'Scroll'}
        <span className="w-px bg-primary-foreground/20" style={{ animation: 'lineGrow 1.5s cubic-bezier(0.22,1,0.36,1) 1.7s both' }} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-accent/40" />
    </section>
  );
}
