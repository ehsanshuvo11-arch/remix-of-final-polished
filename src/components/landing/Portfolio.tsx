import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import DOMPurify from 'dompurify';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import MagneticButton from '@/components/landing/MagneticButton';
import type { PortfolioMetaContent, PortfolioProject } from '@/types/database';

interface PortfolioProps {
  projects: PortfolioProject[];
  content?: PortfolioMetaContent | null;
}

export default function Portfolio({ projects, content }: PortfolioProps) {
  const { t } = useLanguage();

  const defaultProjects: PortfolioProject[] = [
    { id: '1', sort_order: 1, title_en: 'Add Your Featured Project', title_bn: 'ফিচার্ড প্রজেক্ট যোগ করুন', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '2', sort_order: 2, title_en: 'Project 02', title_bn: 'প্রজেক্ট ০২', category_en: 'Brand Identity', category_bn: 'ব্র্যান্ড আইডেন্টিটি', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '3', sort_order: 3, title_en: 'Project 03', title_bn: 'প্রজেক্ট ০৩', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="work" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
      <MotionReveal>
        <p className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
          {t(content?.labelEn ?? 'Selected Work', content?.labelBn ?? 'বাছাই করা কাজ')}
        </p>
      </MotionReveal>
      <MotionReveal delay={0.1}>
        <h2 className="font-heading font-normal text-primary mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
          <WordReveal delay={0.1}>{t(content?.titleLine1En ?? 'Recent', content?.titleLine1Bn ?? 'সাম্প্রতিক')}</WordReveal>{' '}
          <em className="italic">
            <WordReveal delay={0.25}>{t(content?.titleLine2En ?? 'projects.', content?.titleLine2Bn ?? 'প্রজেক্ট।')}</WordReveal>
          </em>
        </h2>
      </MotionReveal>

      <div className="flex flex-col gap-16 md:gap-24 mt-14">
        {displayProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const { t, lang } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirst = index === 0;

  const [imageExpanded, setImageExpanded] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mockupUrls = project.mockup_urls?.length ? project.mockup_urls : (project.mockup_url ? [project.mockup_url] : []);
  const hasMockups = mockupUrls.length > 0;

  const caseStudy = t(project.case_study_en ?? '', project.case_study_bn ?? '');
  const hook = t(project.hook_en ?? '', project.hook_bn ?? '');
  const pdfUrl = lang === 'bn' ? (project.pdf_url_bn || project.pdf_url_en) : project.pdf_url_en;

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
    <MotionReveal delay={0.12 * index} className={imageExpanded ? 'overflow-visible' : undefined}>
    <div
      data-project-card={isFirst ? '' : undefined}
      className={imageExpanded ? 'relative overflow-visible' : 'relative'}
    >
      <div
        ref={cardRef}
        className={`relative cursor-pointer bg-transparent transition-all duration-700 overflow-visible ${
          imageExpanded ? 'h-auto' : 'h-[160px] sm:h-[260px] md:h-[260px]'
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
              <div className="relative z-[60] aspect-square w-full max-w-[80vh] overflow-hidden isolate">
                <motion.img
                  src={project.image_url}
                  alt={`${t(project.title_en, project.title_bn)} — ${t(project.category_en, project.category_bn)} — Premium skincare brand identity and UI design by POLISHED`}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}
                  draggable={false}
                />
              </div>
            </div>
          ) : (
            <TiltImage
              src={project.image_url}
              alt={`${t(project.title_en, project.title_bn)} — ${t(project.category_en, project.category_bn)} — Premium skincare brand identity and UI design by POLISHED`}
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
              {t(project.title_en, project.title_bn)}
            </span>
          </div>
        )}
      </div>

      {/* Hook text — displayed between image and buttons */}
      {hook && (
        <div
          className="mt-4 px-1 font-sans text-base font-medium text-foreground/90 leading-relaxed antialiased [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
          style={{ fontFamily: 'Arial, Helvetica, "Noto Sans Bengali", sans-serif' }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(hook) }}
        />
      )}

      {/* Dynamic description shown below the expanded image (independent of "View full case study") */}
      <AnimatePresence>
        {imageExpanded && caseStudy && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 px-1 text-muted-foreground leading-relaxed text-base font-sans antialiased [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3"
            style={{ fontFamily: 'Arial, Helvetica, "Noto Sans Bengali", sans-serif' }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(caseStudy) }}
          />
        )}
      </AnimatePresence>

      {/* Controls — ALWAYS visible */}
      <div className="mt-3 px-1 flex flex-wrap items-center gap-4">
        <button
          onClick={toggleImageExpand}
          className="text-accent text-[11px] tracking-[2px] uppercase font-medium transition-all duration-500 ease-out hover:text-accent/70 active:scale-[0.97]"
        >
          {imageExpanded
            ? t('Click to collapse', 'সংকুচিত করতে ক্লিক করুন')
            : t('Click image for full view', 'সম্পূর্ণ দেখতে ছবিতে ক্লিক করুন')}
        </button>

        <button
          onClick={toggleCaseStudy}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase font-medium rounded-sm relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,146,60,0.35)] active:scale-[0.97] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100"
        >
          <span className="relative z-10 text-primary-foreground">
            {caseStudyOpen
              ? t('Hide case study', 'কেস স্টাডি লুকান')
              : t('View full case study', 'সম্পূর্ণ কেস স্টাডি দেখুন')}
          </span>
        </button>

        {hasMockups && (
          <button
            onClick={openLightbox}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/40 text-accent text-[11px] tracking-[2px] uppercase font-medium rounded-sm transition-all duration-500 ease-out hover:border-accent hover:bg-accent/10 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span>{t('View project mockups', 'প্রজেক্ট মকআপ দেখুন')}</span>
          </button>
        )}
      </div>

      {/* Case study content */}
      <AnimatePresence>
        {caseStudyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border px-1">
              <p className="text-[11px] tracking-[2px] uppercase text-accent mb-3 font-medium">
                {t('Case Study', 'কেস স্টাডি')}
              </p>
              {caseStudy && (
                <div
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
                  style={{ fontFamily: 'Arial, Helvetica, "Noto Sans Bengali", sans-serif' }}
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
                  📄 {t('Download PDF', 'পিডিএফ ডাউনলোড')}
                </a>
              )}
              <div className="mt-5">
                <button
                  onClick={() => setCaseStudyOpen(false)}
                  className="text-accent text-[11px] tracking-[2px] uppercase font-medium transition-all duration-500 ease-out hover:text-accent/70 active:scale-[0.97]"
                >
                  {t('Show less', 'সংক্ষেপে দেখুন')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Swipeable Lightbox Gallery */}
      {hasMockups && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <MockupLightbox
              urls={mockupUrls}
              initialIndex={lightboxIndex}
              title={t(project.title_en, project.title_bn)}
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

function TiltImage({ src, alt }: { src: string; alt: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

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

      <motion.div
        ref={wrapperRef}
        onMouseMove={handleTilt}
        onMouseLeave={handleTiltLeave}
        className="relative z-[60] w-full h-full overflow-hidden isolate"
        style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
        initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, amount: 0.01 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="relative z-10 block w-full h-full object-cover object-center cursor-pointer will-change-transform"
          loading="lazy"
          draggable={false}
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 2.0, ease: [0.76, 0, 0.24, 1] }}
        />
      </motion.div>
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
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const total = urls.length;

  // 3D tilt motion values (smooth spring follow)
  const mvX = useMotionValue(0); // -0.5 .. 0.5
  const mvY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const sx = useSpring(mvX, springConfig);
  const sy = useSpring(mvY, springConfig);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]); // horizontal mouse → Y-axis tilt
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]); // vertical mouse → X-axis tilt (inverted)

  const handleImgMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mvX.set(px);
    mvY.set(py);
  };
  const handleImgMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

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
    <motion.div
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
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-md text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 z-50 hover:scale-110 active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      )}

      {/* Next arrow */}
      {total > 1 && current < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-md text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 z-50 hover:scale-110 active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      )}

      {/* Main image with animation + drag-to-swap + 3D tilt */}
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            src={urls[current]}
            alt={`${title} mockup ${current + 1}`}
            className="aspect-square w-full max-w-[85vh] max-h-[85vh] object-contain cursor-grab active:cursor-grabbing will-change-transform"
            style={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              filter: 'none',
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleImgMouseMove}
            onMouseLeave={handleImgMouseLeave}
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
    </motion.div>
  );
}// Clean UI deployed
