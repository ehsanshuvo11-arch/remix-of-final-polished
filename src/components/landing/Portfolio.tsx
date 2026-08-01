import { useState, useCallback, useRef, useEffect } from 'react';
import { m, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, useVelocity } from 'framer-motion';
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';
import { createPortal } from 'react-dom';
import DOMPurify from 'dompurify';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import MagneticButton from '@/components/landing/MagneticButton';
import PremiumImage from '@/components/landing/PremiumImage';
import SwipeProgress from '@/components/landing/SwipeProgress';
import PremiumSkeleton from '@/components/landing/Skeleton';



import type { PortfolioMetaContent, PortfolioProject } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUILabels } from '@/hooks/use-site-content';
import { PortfolioSkeleton } from '@/components/landing/Skeleton';

interface PortfolioProps {
  projects: PortfolioProject[];
  content?: PortfolioMetaContent | null;
  isLoading?: boolean;
}

export default function Portfolio({ projects, content, isLoading = false }: PortfolioProps) {

  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const trackRef = useRef<HTMLDivElement>(null);

  const defaultProjects: PortfolioProject[] = [
    { id: '1', sort_order: 1, title_en: 'Add Your Featured Project', title_bn: 'ফিচার্ড প্রজেক্ট যোগ করুন', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '2', sort_order: 2, title_en: 'Project 02', title_bn: 'প্রজেক্ট ০২', category_en: 'Brand Identity', category_bn: 'ব্র্যান্ড আইডেন্টিটি', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '3', sort_order: 3, title_en: 'Project 03', title_bn: 'প্রজেক্ট ০৩', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '4', sort_order: 4, title_en: 'Premium Perfume Campaign', title_bn: 'প্রিমিয়াম পারফিউম ক্যাম্পেইন', category_en: 'Self-Care & Luxury', category_bn: 'সেলফ-কেয়ার ও লাক্সারি', image_url: '', case_study_en: '', case_study_bn: '', hook_en: 'A refined luxury aesthetic designed to evoke sensory indulgence — positioning the fragrance as an everyday self-care ritual.', hook_bn: 'একটি পরিমার্জিত লাক্সারি নান্দনিকতা — সুগন্ধিকে দৈনন্দিন সেলফ-কেয়ার রিচুয়াল হিসেবে উপস্থাপন করে।', pdf_url_en: '', pdf_url_bn: '' },
    { id: '5', sort_order: 5, title_en: 'Organic Hair Oil', title_bn: 'অর্গানিক হেয়ার অয়েল', category_en: 'D2C Skincare', category_bn: 'ডি২সি স্কিনকেয়ার', image_url: '', case_study_en: '', case_study_bn: '', hook_en: 'Earthy, trust-forward visuals that communicate purity and heritage — engineered to drive conversions for an organic-first audience.', hook_bn: 'মাটির ঘেঁষা, বিশ্বাসযোগ্য ভিজ্যুয়াল — বিশুদ্ধতা ও ঐতিহ্য তুলে ধরে কনভার্শন বাড়াতে ডিজাইন করা।', pdf_url_en: '', pdf_url_bn: '' },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-14 max-w-[1200px] mx-auto">
      <MotionReveal>
        {isBn ? (
          <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            আমাদের সিগনেচার কাজ
          </p>
        ) : (
          <p lang="en" style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
            {content?.labelEn ?? 'Selected Work'}
          </p>
        )}
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary mb-7 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
          {isBn ? (
            <WordReveal delay={0.1}>আমাদের সিগনেচার প্রজেক্টসমূহ।</WordReveal>
          ) : (
            <>
              <WordReveal delay={0.1}>{content?.titleLine1En ?? 'Recent'}</WordReveal>{' '}
              <em className="italic">
                <WordReveal delay={0.25}>{content?.titleLine2En ?? 'projects.'}</WordReveal>
              </em>
            </>
          )}
        </h2>
      </MotionReveal>

      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <m.div
            key="portfolio-skeleton"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <PortfolioSkeleton />
          </m.div>
        ) : (
          <m.div
            key={`portfolio-list-${isBn ? 'bn' : 'en'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            ref={trackRef}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex items-start w-full max-w-full gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide -mx-6 px-6 pb-6 mt-10 md:mx-0 md:px-0 md:pb-0 md:flex-col md:items-stretch md:gap-24 md:mt-14 md:overflow-visible"
          >
            {displayProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} isBn={isBn} />
            ))}
          </m.div>
        )}
      </AnimatePresence>
      {!isLoading && <SwipeProgress containerRef={trackRef} count={displayProjects.length} />}


    </section>
  );
}

function ProjectCard({ project, index, isBn }: { project: PortfolioProject; index: number; isBn: boolean }) {
  const { data: labels } = useUILabels();
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirst = index === 0;

  const [imageExpanded, setImageExpanded] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Per-case-study local language override. Initializes from the global locale
  // but can be toggled independently — only this card's content switches.
  const [caseStudyLang, setCaseStudyLang] = useState<'en' | 'bn'>(isBn ? 'bn' : 'en');
  const csIsBn = caseStudyLang === 'bn';

  const mockupUrls = project.mockup_urls?.length ? project.mockup_urls : (project.mockup_url ? [project.mockup_url] : []);
  const hasMockups = mockupUrls.length > 0;

  // Locale-aware field mapping with English fallback when BN translation missing.
  // Card chrome (title, category, hook) follows the global locale; the case
  // study body + PDF follow the local micro-toggle.
  const pick = (bn: string | null | undefined, en: string | null | undefined) =>
    isBn ? ((bn && bn.trim()) ? bn : (en ?? '')) : (en ?? '');
  const pickCs = (bn: string | null | undefined, en: string | null | undefined) =>
    csIsBn ? ((bn && bn.trim()) ? bn : (en ?? '')) : (en ?? '');
  const title = pick(project.title_bn, project.title_en);
  const category = pick(project.category_bn, project.category_en);
  const caseStudy = pickCs(project.case_study_bn, project.case_study_en);
  const hook = pick(project.hook_bn, project.hook_en);
  const pdfUrl = csIsBn ? (project.pdf_url_bn || project.pdf_url_en) : project.pdf_url_en;

  const toggleImageExpand = useCallback(() => {
    setImageExpanded((prev) => !prev);
  }, []);

  const toggleCaseStudy = useCallback(() => {
    setCaseStudyOpen((prev) => !prev);
  }, []);

  const openLightbox = useCallback(() => {
    setLightboxIndex(0);
    setLightboxOpen(true);
  }, []);

  return (
    <MotionReveal delay={0.12 * index} className={`min-w-[95vw] max-w-[95vw] shrink-0 snap-center md:min-w-0 md:max-w-none md:shrink md:snap-align-none ${imageExpanded ? 'overflow-visible' : ''}`}>
    <div
      data-project-card={isFirst ? '' : undefined}
      className={imageExpanded ? 'relative overflow-visible' : 'relative'}
    >
      {/* Aspect-ratio lock: the collapsed card reserves its exact box before the
          mockup arrives, so the grid never shifts or jumps while loading. */}
      <div
        ref={cardRef}
        className={`relative cursor-pointer bg-transparent transition-all duration-700 overflow-visible ${
          imageExpanded ? 'h-auto' : 'aspect-[16/9] sm:aspect-[21/9] w-full h-auto md:h-[260px]'
        }`}

        onClick={() => {
          toggleImageExpand();
          if (!imageExpanded && cardRef.current) {
            setTimeout(() => {
              cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }}
      >
        {project.image_url ? (
          imageExpanded ? (
            <div className="group relative z-[60] flex items-center justify-center w-full py-12 overflow-visible isolate">
              {/* Premium subtle orange aura — ultra-soft breathing glow on white */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#fb923c]/[0.06] blur-[90px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
              <PremiumImage
                src={project.image_url}
                alt={`${title} — ${category} — Premium skincare brand identity and UI design by POLISHED`}
                containerClassName="relative z-[60] aspect-square w-full max-w-[80vh]"
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                fadeDuration={0.8}
                loading="eager"
                fetchPriority="high"
                imgStyle={{ background: 'transparent', boxShadow: 'none', border: 'none' }}
              />

            </div>
          ) : (
            <TiltImage
              src={project.image_url}
              alt={`${title} — ${category} — Premium skincare brand identity and UI design by POLISHED`}
              /* Only the first two cards sit near the fold — eager + high priority.
                 Everything below stays lazy to protect first-load bandwidth. */
              priority={index < 2}
            />
          )

        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 bg-transparent">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="4" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
              <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
              <path d="M4 26l10-8 8 6 6-5 8 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-primary" />
            </svg>
            <span className="text-xs tracking-[2px] uppercase text-muted-foreground">
              {title}
            </span>
          </div>
        )}
      </div>

      {/* Hook text — displayed between image and buttons */}
      {hook && (
        <div
          className="mt-4 px-1 font-sans text-base font-medium text-foreground/90 leading-relaxed antialiased [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
          style={{ fontFamily: 'Arial, Helvetica, "Noto Serif Bengali", sans-serif' }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(hook) }}
        />
      )}

      {/* Controls — ALWAYS visible */}
      <div className="mt-3 px-1 flex flex-wrap items-center gap-4">
        <button
          onClick={toggleImageExpand}
          lang={isBn ? 'bn' : 'en'}
          className={`text-accent text-[11px] font-medium transition-all duration-500 ease-out hover:text-accent/70 active:scale-[0.97] ${isBn ? 'tracking-normal' : 'tracking-[2px] uppercase'}`}
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: '0' } : undefined}
        >
          {imageExpanded
            ? (isBn ? (labels?.portfolioClickCollapseBn ?? 'সংকুচিত করতে ক্লিক করুন') : (labels?.portfolioClickCollapseEn ?? 'Click to collapse'))
            : (isBn ? (labels?.portfolioClickExpandBn ?? 'ফুল ভিউ দেখতে ছবিতে ক্লিক করুন') : (labels?.portfolioClickExpandEn ?? 'Click image for full view'))}
        </button>

        <button
          onClick={toggleCaseStudy}
          lang={isBn ? 'bn' : 'en'}
          className={`inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-sm relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,146,60,0.35)] active:scale-[0.97] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100 ${isBn ? 'text-[14px] tracking-normal' : 'text-[11px] tracking-[2px] uppercase'}`}
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: '0' } : undefined}
        >
          <span className="relative z-10 text-primary-foreground">
            {caseStudyOpen
              ? (isBn ? (labels?.portfolioHideCaseStudyBn ?? 'কেস স্টাডি লুকান') : (labels?.portfolioHideCaseStudyEn ?? 'Hide case study'))
              : (isBn ? (labels?.portfolioViewCaseStudyBn ?? 'সম্পূর্ণ কেস স্টাডি দেখুন') : (labels?.portfolioViewCaseStudyEn ?? 'View full case study'))}
          </span>
        </button>

        {hasMockups && (
          <button
            onClick={openLightbox}
            lang={isBn ? 'bn' : 'en'}
            className={`inline-flex items-center gap-2 px-5 py-2.5 border border-accent/40 text-accent text-[11px] font-medium rounded-sm transition-all duration-500 ease-out hover:border-accent hover:bg-accent/10 hover:-translate-y-0.5 active:scale-[0.97] ${isBn ? 'tracking-normal' : 'tracking-[2px] uppercase'}`}
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: '0' } : undefined}
          >
            <span>{isBn ? (labels?.portfolioViewMockupsBn ?? 'প্রোজেক্ট মকআপ দেখুন') : (labels?.portfolioViewMockupsEn ?? 'View project mockups')}</span>
          </button>
        )}
      </div>

      {/* Case study content */}
      <AnimatePresence>
        {caseStudyOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border px-1">
              <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-[11px] tracking-[2px] uppercase text-accent font-medium">
                  Case Study
                </p>
                {/* Premium segmented pill toggle — quiet luxury */}
                <div
                  role="group"
                  aria-label="Case study language"
                  className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5 md:backdrop-blur-sm md:shadow-sm select-none"
                >
                  <button
                    type="button"
                    onClick={() => setCaseStudyLang('en')}
                    aria-pressed={!csIsBn}
                    className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 ease-out ${
                      !csIsBn
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-muted-foreground/70 hover:text-foreground'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseStudyLang('bn')}
                    aria-pressed={csIsBn}
                    lang="bn"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                    className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 ease-out ${
                      csIsBn
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-muted-foreground/70 hover:text-foreground'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>
              {caseStudy && (
                <div
                  lang={csIsBn ? 'bn' : 'en'}
                  className="prose prose-lg prose-invert max-w-none
                    font-sans tracking-normal antialiased
                    text-foreground font-medium leading-loose

                    [&_strong]:font-bold [&_strong]:text-foreground
                    [&_em]:italic [&_em]:text-foreground/90

                    prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-normal prose-headings:text-primary
                    prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:border-b prose-h2:border-accent/20 prose-h2:pb-3
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-foreground/90

                    [&>p]:mb-6 [&>p]:leading-loose [&_p]:leading-loose
                    [&>p:first-child]:mt-0 [&>p:last-child]:mb-0

                    [&>ul]:my-6 [&>ul]:pl-8 [&>ul]:list-disc [&>ul]:space-y-3
                    [&_ul]:my-4 [&_ul]:pl-8 [&_ul]:list-disc [&_ul]:space-y-3
                    [&>ol]:my-6 [&>ol]:pl-8 [&>ol]:list-decimal [&>ol]:space-y-3
                    [&_ol]:my-4 [&_ol]:pl-8 [&_ol]:list-decimal [&_ol]:space-y-3
                    [&_li]:text-foreground [&_li]:leading-relaxed [&_li]:pl-2 [&_li]:font-medium
                    [&_li_p]:mb-2

                    prose-a:text-accent prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-accent/80
                    prose-blockquote:border-l-2 prose-blockquote:border-accent/40 prose-blockquote:pl-6 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:my-8
                  "
                  style={{ fontFamily: csIsBn ? "'Noto Serif Bengali', serif" : 'Arial, Helvetica, sans-serif' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(caseStudy) }} />
                </div>
              )}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-accent/10 text-accent text-[11px] tracking-[2px] uppercase font-medium rounded-sm transition-all duration-500 ease-out hover:bg-accent/20 active:scale-[0.97]"
                >
                  📄 Download PDF
                </a>
              )}
              <div className="mt-5">
                <button
                  onClick={() => setCaseStudyOpen(false)}
                  className="text-accent text-[11px] tracking-[2px] uppercase font-medium transition-all duration-500 ease-out hover:text-accent/70 active:scale-[0.97]"
                >
                  Show less
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Premium Swipeable Lightbox Gallery */}
      {hasMockups && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <MockupLightbox
              urls={mockupUrls}
              initialIndex={lightboxIndex}
              title={title}
              onClose={() => setLightboxOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
    </MotionReveal>
  );
}

/* ── Tilt Image (matches Services "What We Do" card animation) ── */
/*
  ASSET HINT: portfolio mockups should be exported as .webp (or .avif with a
  .webp fallback) at ~1600px on the long edge and quality ~78. These PNG/JPG
  mockups are the heaviest payload on the page — converting them typically cuts
  60-80% of the bytes with no visible quality loss on retina screens.
*/

function TiltImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMobile = useIsMobileDevice();


  // ── Velocity-based subtle scale (desktop only) ──
  // Map page scroll velocity → tiny scaleY 1.0 → 1.015 max.
  // Spring-back snaps it cleanly to rest. Image-only, never the container,
  // so click targets, hook text and case-study layout are not affected.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 400, damping: 30, mass: 0.4 });
  // Clamp to a sliver — the "quiet luxury" tell is what you almost don't see.
  const velocityScaleY = useTransform(smoothVelocity, [-3000, 0, 3000], [1.015, 1, 1.015]);

  const handleTilt = (e: React.MouseEvent) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = ((midY - y) / midY) * 6;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateY(-4px)`;
  };

  const handleTiltLeave = () => {
    if (wrapperRef.current) wrapperRef.current.style.transform = '';
  };

  return (
    <div className="group relative z-[60] w-full h-full overflow-visible isolate">
      {/* Premium subtle orange aura — ultra-soft breathing glow on white */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#fb923c]/[0.06] blur-[90px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

      <m.div
        ref={wrapperRef}
        onMouseMove={handleTilt}
        onMouseLeave={handleTiltLeave}
        className="relative z-[60] w-full h-full overflow-hidden isolate"
        style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
        initial={false}
        animate={{ scale: imageLoaded ? 1.0 : 1.02 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <PremiumImage
          src={src}
          alt={alt}
          containerClassName="w-full h-full"
          className="object-cover object-center cursor-pointer will-change-[opacity,transform]"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          fadeDuration={0.8}

          onLoad={() => setImageLoaded(true)}
          imgStyle={isMobile ? undefined : { scaleY: velocityScaleY, transformOrigin: '50% 50%' } as any}
        />
      </m.div>
    </div>
  );
}


/* ── Premium Swipeable Lightbox ── */

function MockupLightbox({ urls, initialIndex, title, onClose }: {
  urls: string[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [loadedIndex, setLoadedIndex] = useState(-1);

  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const total = urls.length;

  // 3D tilt removed for a calm, distortion-free viewing experience.


  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 50) goPrev();
    else if (touchDeltaX.current < -50) goNext();
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 cursor-pointer select-none bg-black/90"
      style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Invisible Story-style tap zones */}
      <button
        type="button"
        aria-label="Previous mockup"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        disabled={total <= 1 || current === 0}
        className="absolute left-0 top-0 h-full w-[30%] z-40 bg-transparent border-0 outline-none cursor-w-resize disabled:cursor-default disabled:pointer-events-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      />
      <button
        type="button"
        aria-label="Next mockup"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        disabled={total <= 1 || current === total - 1}
        className="absolute right-0 top-0 h-full w-[30%] z-40 bg-transparent border-0 outline-none cursor-e-resize disabled:cursor-default disabled:pointer-events-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      />

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-200 z-50"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image counter */}
      {total > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-primary-foreground/50 text-[11px] tracking-[3px] uppercase font-medium z-50">
          {current + 1} / {total}
        </div>
      )}

      {/* Prev arrow */}
      {total > 1 && current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 md:backdrop-blur-md text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 z-50 hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      )}

      {/* Next arrow */}
      {total > 1 && current < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 md:backdrop-blur-md text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 z-50 hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      )}

      {/* Main image — aspect-locked box with the brand shimmer behind it, so the
          lightbox never resizes while a heavy mockup downloads. */}
      <div className="relative flex items-center justify-center">
        <div className="relative aspect-square w-full max-w-[85vh] max-h-[85vh]">
          <m.div
            className="absolute inset-0 z-0 pointer-events-none"
            initial={false}
            animate={{ opacity: loadedIndex === current ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PremiumSkeleton tone="light" className="w-full h-full" rounded="rounded-none" />
          </m.div>
          <AnimatePresence mode="wait">
            <m.img
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: loadedIndex === current ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              src={urls[current]}
              alt={`${title} mockup ${current + 1}`}
              onLoad={() => setLoadedIndex(current)}
              onError={() => setLoadedIndex(current)}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="relative z-10 w-full h-full object-contain cursor-grab active:cursor-grabbing will-change-transform"
              style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                filter: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80 && current < total - 1) goNext();
                else if (info.offset.x > 80 && current > 0) goPrev();
              }}
            />
          </AnimatePresence>
        </div>
      </div>


      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-accent w-6' : 'bg-primary-foreground/30 hover:bg-primary-foreground/50'
              }`}
              aria-label={`Go to mockup ${i + 1}`}
            />
          ))}
        </div>
      )}
    </m.div>
  );
}// Clean UI deployed
