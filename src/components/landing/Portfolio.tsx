import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import DOMPurify from 'dompurify';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Check, 
  Layers, 
  ChevronDown,
  MessageCircle,
  ExternalLink,
  FileText,
  Download
} from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import PremiumSkeleton, { PortfolioSkeleton } from '@/components/landing/Skeleton';
import PremiumImage from '@/components/landing/PremiumImage';
import { buildSrcSet, resolveStorageUrl } from '@/lib/image';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import type { PortfolioMetaContent, PortfolioProject } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUILabels } from '@/hooks/use-site-content';

interface PortfolioProps {
  projects: PortfolioProject[];
  content?: PortfolioMetaContent | null;
  isLoading?: boolean;
}


export default function Portfolio({ projects, content, isLoading = false }: PortfolioProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  // Filter out any empty projects without images or content to prevent broken skeleton cards
  const validProjects = (projects || []).filter((p) => {
    const hasImg = typeof p.image_url === 'string' && p.image_url.trim().length > 0;
    const hasMock = typeof p.mockup_url === 'string' && p.mockup_url.trim().length > 0;
    const hasMockList = Array.isArray(p.mockup_urls) && p.mockup_urls.length > 0;
    const hasContent = Boolean(
      (p.title_en && p.title_en.trim()) ||
      (p.title_bn && p.title_bn.trim()) ||
      (p.case_study_en && p.case_study_en.trim()) ||
      (p.case_study_bn && p.case_study_bn.trim()) ||
      (p.hook_en && p.hook_en.trim()) ||
      (p.hook_bn && p.hook_bn.trim())
    );
    return hasImg || hasMock || hasMockList || hasContent;
  });

  // Display ONLY live projects from the database
  const displayProjects = validProjects;

  // When section has 0 projects, don't show it (simply remove it)
  if (!isLoading && validProjects.length === 0) {
    return null;
  }

  // Active filters and views
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'visual' | 'impact'>('visual');
  const [visibleCount, setVisibleCount] = useState<number>(() => Math.max(8, validProjects.length || 8));
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedModalProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return displayProjects.find((p) => p.id === selectedProjectId) || null;
  }, [displayProjects, selectedProjectId]);

  // Auto-expand visible count when new projects are loaded/added from Admin
  useEffect(() => {
    if (validProjects.length > 0) {
      setVisibleCount((prev) => Math.max(prev, validProjects.length));
    }
  }, [validProjects.length]);

  // Curated live projects (all displayed with editorial elegance)
  const filteredProjects = displayProjects;

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = visibleCount < filteredProjects.length;
  const remainingCount = filteredProjects.length - visibleCount;

  // Mobile Peek Snap Carousel state & handlers
  const [mobileIdx, setMobileIdx] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  // High-performance RAF passive scroll tracking (eliminates unthrottled re-render jank)
  useEffect(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const { scrollLeft, offsetWidth } = el;
        const index = Math.round(scrollLeft / (offsetWidth * 0.86));
        if (index >= 0 && index < filteredProjects.length) {
          setMobileIdx((prev) => (prev === index ? prev : index));
        }
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [filteredProjects.length]);

  const scrollToMobileProject = (idx: number) => {
    if (!mobileCarouselRef.current) return;
    const cardEl = mobileCarouselRef.current.children[idx] as HTMLElement;
    if (cardEl) {
      const targetLeft = cardEl.offsetLeft - (mobileCarouselRef.current.offsetWidth - cardEl.offsetWidth) / 2;
      mobileCarouselRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setMobileIdx(idx);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredProjects.length));
  };

  return (
    <section id="work" className="py-14 md:py-28 px-4 sm:px-6 md:px-14 max-w-[1200px] mx-auto scroll-mt-14">
      {/* ── Section Header ── */}
      <MotionReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <p 
              className="eyebrow-pill-kicker text-accent mb-3 font-semibold" 
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              CURATED WORKS
            </p>
            <h2 
              lang="en" 
              className="section-heading-h2 font-heading font-normal text-primary mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Crafted For <span className="italic text-accent">Conversion.</span>
            </h2>
            <p 
              className="section-lead-subtitle text-primary/75"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.85 } : { fontFamily: "'DM Sans', sans-serif" }}
            >
              {isBn 
                ? 'মানুষ শুধু প্রোডাক্ট কেনে না—প্রোডাক্টটি মাখার পরের অনুভূতিটা কেনে।'
                : "Shoppers don't just buy a product—they buy the feeling of using it."}
            </p>
          </div>

          {/* ── Badge: 100% Bespoke Craft ── */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.04] border border-primary/10 self-start md:self-end">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-primary" style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? '১০০% কাস্টম ক্রাফট' : '100% Handcrafted'}
            </span>
          </div>
        </div>
      </MotionReveal>

      {/* ── Editorial Spec & Curation Strip (Replaces category pills row) ── */}
      <MotionReveal delay={0.12}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 sm:px-5 mb-8 md:mb-12 rounded-xl sm:rounded-2xl bg-white border border-primary/10 shadow-[0_2px_14px_rgba(30,58,138,0.03)] text-[12px] sm:text-[12.5px]">
          {/* Left: Curated Sprint Pillars */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-primary/75 font-medium">
            <span className="inline-flex items-center gap-1.5 text-accent font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {isBn ? 'সিলেক্টেড পারফরম্যান্স স্প্রিন্ট' : 'Selected Performance Sprints'}
            </span>
            <span className="hidden sm:inline text-primary/20">•</span>
            <span className="inline-flex items-center gap-1 text-primary/70">
              <Clock className="w-3.5 h-3.5 text-accent/80" />
              {isBn ? '৪৮ ঘণ্টা টার্নঅ্যারাউন্ড' : '48-Hour SLA Delivery'}
            </span>
            <span className="hidden sm:inline text-primary/20">•</span>
            <span className="inline-flex items-center gap-1 text-primary/70">
              <ShieldCheck className="w-3.5 h-3.5 text-accent/80" />
              {isBn ? '১০০% কাস্টম ক্রাফট ও কপি' : '100% Bespoke Craft & Copy'}
            </span>
          </div>

          {/* Right: Curated Case Studies Counter */}
          <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-primary/5 sm:border-none w-full sm:w-auto justify-between sm:justify-end">
            <span
              className="text-[11px] uppercase tracking-wider font-mono text-primary/50 font-semibold"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: 0 } : undefined}
            >
              {isBn ? 'প্রদর্শিত কাজ' : 'Curated Works'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary font-mono font-bold text-[11px] border border-primary/10">
              {isBn
                ? `${displayProjects.length.toLocaleString('bn-BD', { minimumIntegerDigits: 2 })}টি কেস স্টাডি`
                : `${String(displayProjects.length).padStart(2, '0')} Case Studies`}
            </span>
          </div>
        </div>
      </MotionReveal>

      {/* ── Projects Grid & Showcase ── */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <PortfolioSkeleton />
        ) : (
          <div className="space-y-12 md:space-y-20">
            {/* ── MOBILE: Peek Snap Carousel (Apple / Instagram Showcase Style) ── */}
            <div className="md:hidden">
              <div
                ref={mobileCarouselRef}
                className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory px-4 py-2 scrollbar-none -mx-4 overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing select-none"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-x pan-y',
                }}
              >
                {filteredProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="w-[84vw] max-w-[335px] snap-center shrink-0 transition-transform duration-300"
                  >
                    <ProjectCard
                      project={project}
                      index={idx}
                      isBn={isBn}
                      viewMode="visual"
                      onOpenCaseStudy={() => setSelectedProjectId(project.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Minimal Understated Slide Counter & Brand Orange Dots */}
              <div className="flex items-center justify-between px-1 mt-4">
                <span className="text-[11px] font-mono text-primary/60 font-semibold">
                  {isBn
                    ? `${(mobileIdx + 1).toLocaleString('bn-BD', { minimumIntegerDigits: 2 })} / ${filteredProjects.length.toLocaleString('bn-BD', { minimumIntegerDigits: 2 })}`
                    : `${String(mobileIdx + 1).padStart(2, '0')} / ${String(filteredProjects.length).padStart(2, '0')}`}
                </span>

                {/* Brand Orange Accent Dots matching pricing carousel */}
                <div className="flex items-center gap-1.5">
                  {filteredProjects.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToMobileProject(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        mobileIdx === idx ? 'w-3.5 bg-accent' : 'w-1 bg-accent/30 hover:bg-accent/50'
                      }`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Sleek Mini Nav Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollToMobileProject(Math.max(0, mobileIdx - 1))}
                    disabled={mobileIdx === 0}
                    className="w-7 h-7 rounded-full border border-primary/15 flex items-center justify-center text-primary/70 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToMobileProject(Math.min(filteredProjects.length - 1, mobileIdx + 1))}
                    disabled={mobileIdx === filteredProjects.length - 1}
                    className="w-7 h-7 rounded-full border border-primary/15 flex items-center justify-center text-primary/70 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── DESKTOP: 2-Column Balanced Editorial Grid ── */}
            <div className="hidden md:block space-y-12 md:space-y-20">
              <div className="grid grid-cols-2 gap-8 md:gap-14 items-stretch">
                {visibleProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    isBn={isBn}
                    viewMode="visual"
                    onOpenCaseStudy={() => setSelectedProjectId(project.id)}
                  />
                ))}
              </div>

              {/* ── Progressive "Load More" Button ── */}
              {hasMore ? (
                <div className="flex flex-col items-center justify-center pt-4 pb-2">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="group px-7 py-3.5 rounded-full bg-white border border-primary/20 text-primary hover:border-accent hover:text-accent font-semibold text-xs md:text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2.5 active:scale-95 cursor-pointer"
                    style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                  >
                    <Layers className="w-4 h-4 text-accent transition-transform duration-300 group-hover:rotate-12" />
                    <span>
                      {isBn
                        ? `আরও ${remainingCount}টি সিগনেচার প্রজেক্ট দেখুন`
                        : `Load ${remainingCount} More Featured Works`}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5" />
                  </button>
                  <p className="text-[11px] text-muted-foreground/70 mt-2.5 font-mono">
                    {isBn 
                      ? `(মোট ${filteredProjects.length}টির মধ্যে ${visibleProjects.length}টি প্রদর্শিত)` 
                      : `Showing ${visibleProjects.length} of ${filteredProjects.length} curated works`}
                  </p>
                </div>
              ) : filteredProjects.length > 4 ? (
                <div className="text-center pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/70">
                    <Check className="w-3.5 h-3.5 text-accent" />
                    {isBn ? 'এই ক্যাটাগরির সমস্ত কাজ প্রদর্শিত হয়েছে' : 'All works in this category displayed'}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Interactive Case Study Lightbox Modal ── */}
      {selectedModalProject && (
        <CaseStudyDrawer
          project={selectedModalProject}
          isBn={isBn}
          allProjects={filteredProjects}
          onSelectProject={(p) => setSelectedProjectId(p.id)}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Format Rich / Plain Text Content (Preserves HTML, Headings, Lists, Paragraphs)
───────────────────────────────────────────────────────────────────────────── */

function formatRichContent(content: unknown): string {
  if (!content) return '';
  const str = typeof content === 'string' ? content : String(content);
  const trimmed = str.replace(/\r\n/g, '\n').trim();
  if (!trimmed) return '';

  // Check if content already contains HTML tags (e.g. from TipTap rich editor, Google Docs paste)
  const hasHtml = /<\/?(p|div|h[1-6]|ul|ol|li|blockquote|strong|b|em|i|u|s|a|table|tr|td|br|span|hr)\b/i.test(trimmed);
  if (hasHtml) {
    return trimmed;
  }

  // If plain text with linebreaks, wrap double newlines into paragraphs, single into <br />
  return trimmed
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hybrid Bangla-English 3 Pillars for Curated Case Studies
───────────────────────────────────────────────────────────────────────────── */

const CASE_STUDY_PILLARS: Record<
  string,
  {
    pillarEn: string;
    pillarBn: string;
    descBn: string;
    descEn: string;
  }
> = {
  shopivo: {
    pillarEn: 'The Charm of Your Own Language',
    pillarBn: 'নিজের ভাষার মায়া',
    descBn:
      '"Skin Moisturizing" বললে শুধু মাথা বোঝে; আর "অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন" বললে মন ছুঁয়ে যায়।',
    descEn:
      'Saying "Skin Moisturizing" speaks only to the mind; "Soft to the touch, pure in care" touches the heart.',
  },
  glowcart: {
    pillarEn: 'The Courage to Stand Before the Mirror',
    pillarBn: 'আয়নার সামনে দাঁড়ানোর সাহস',
    descBn:
      'জটিল কেমিক্যালের নাম না শুনিয়ে আমরা ব্রণমুক্ত হয়ে মানুষের সামনে দাঁড়ানোর আত্মবিশ্বাসের কথা বলেছি।',
    descEn:
      'Instead of complex chemicals, we spoke about the confidence of stepping out with clear skin.',
  },
  skinology: {
    pillarEn: 'Not Fear of the Sun, but Joy of Stepping Out',
    pillarBn: 'রোদের ভয় নয়, বাইরে যাওয়ার আনন্দ',
    descBn:
      'ত্বক পুড়ে যাওয়ার ভয় না দেখিয়ে কড়া রোদেও নিশ্চিন্তে বাইরে যাওয়ার স্বাধীনতা তুলে ধরা হয়েছে।',
    descEn:
      'Instead of fear of sunburn, we highlighted the carefree freedom of stepping out into the sun.',
  },
};

function getPillarForProject(project: PortfolioProject) {
  const id = project.id || '';
  const text = `${project.title_en || ''} ${project.title_bn || ''} ${project.category_en || ''}`.toLowerCase();
  if (id === 'c7de48bc-236f-48f7-bd3f-051db4a23683' || text.includes('shopivo') || text.includes('nivea')) {
    return CASE_STUDY_PILLARS.shopivo;
  }
  if (id === 'f3076c97-2b28-4ee6-af1b-b78f43341b88' || text.includes('glow cart') || text.includes('cosprof')) {
    return CASE_STUDY_PILLARS.glowcart;
  }
  if (id === '825cc2b0-c8fb-4b79-a5b5-35de0dd99003' || text.includes('skinology') || text.includes('neutrogena')) {
    return CASE_STUDY_PILLARS.skinology;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Individual Project Card (Optimized for both Visual & Impact modes)
───────────────────────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  isBn,
  viewMode,
  onOpenCaseStudy,
}: {
  project: PortfolioProject;
  index: number;
  isBn: boolean;
  viewMode: 'visual' | 'impact';
  onOpenCaseStudy: () => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mockupUrls: unknown[] = project.mockup_url_data?.length
    ? project.mockup_url_data
    : project.mockup_urls?.length
      ? project.mockup_urls
      : (project.mockup_url ? [project.mockup_url] : []);
  const hasMockups = mockupUrls.length > 0;

  // Direct mapping to database rich text fields
  const rawBnCaseStudy = (typeof project.case_study_bn === 'string' && project.case_study_bn.trim())
    ? project.case_study_bn
    : (project as any).case_study || (project as any).description || '';

  const rawEnCaseStudy = (typeof project.case_study_en === 'string' && project.case_study_en.trim())
    ? project.case_study_en
    : (project as any).case_study || (project as any).description || '';

  const caseStudy = isBn
    ? (rawBnCaseStudy || rawEnCaseStudy)
    : (rawEnCaseStudy || rawBnCaseStudy);

  const rawBnHook = (typeof project.hook_bn === 'string' && project.hook_bn.trim())
    ? project.hook_bn
    : (project as any).hook || '';

  const rawEnHook = (typeof project.hook_en === 'string' && project.hook_en.trim())
    ? project.hook_en
    : (project as any).hook || '';

  const hook = isBn
    ? (rawBnHook || rawEnHook)
    : (rawEnHook || rawBnHook);

  const rawBnTitle = (typeof project.title_bn === 'string' && project.title_bn.trim())
    ? project.title_bn
    : (project as any).title || '';

  const rawEnTitle = (typeof project.title_en === 'string' && project.title_en.trim())
    ? project.title_en
    : (project as any).title || '';

  const title = isBn
    ? (rawBnTitle || rawEnTitle || 'কেস স্টাডি')
    : (rawEnTitle || rawBnTitle || 'Case Study');

  const category = (isBn ? (project.category_bn || project.category_en) : (project.category_en || project.category_bn)) || (isBn ? 'ডিজাইন' : 'Creative Design');
  const pdfUrl = isBn
    ? (project.pdf_url_bn || project.pdf_url_en)
    : (project.pdf_url_en || project.pdf_url_bn);
  const hasPdf = Boolean(pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim());

  const heroImage = (typeof project.image_url === 'string' && project.image_url.trim())
    ? resolveStorageUrl(project.image_url)
    : (typeof mockupUrls[0] === 'string' && (mockupUrls[0] as string).trim())
      ? resolveStorageUrl(mockupUrls[0] as string)
      : '/portfolio/lumin-botanical.jpg';

  const pillar = useMemo(() => getPillarForProject(project), [project]);

  const displayHook = useMemo(() => {
    if (pillar) {
      const pTitle = isBn ? pillar.pillarBn : pillar.pillarEn;
      const pDesc = isBn ? pillar.descBn : pillar.descEn;
      return `<p class="font-semibold text-accent text-[12px] mb-1">${pTitle}</p><p class="card-body-text text-foreground/80 text-[13.5px] leading-relaxed">${pDesc}</p>`;
    }
    if (hook && hook.trim()) return formatRichContent(hook);
    if (!caseStudy || !caseStudy.trim()) return '';
    const stripped = caseStudy.replace(/<[^>]*>?/gm, '').trim();
    if (!stripped) return '';
    return `<p class="card-body-text text-[13.5px]">${stripped.slice(0, 150)}${stripped.length > 150 ? '...' : ''}</p>`;
  }, [pillar, isBn, hook, caseStudy]);

  return (
    <m.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay: 0.05 * (index % 4), ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: 'translateZ(0)' }}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-primary/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.08)] hover:border-primary/20 transition-shadow duration-300 overflow-hidden p-4 sm:p-5"
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] uppercase font-semibold tracking-wider bg-primary/5 text-accent border border-primary/10 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {category}
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/60 shrink-0">
            0{index + 1}
          </span>
        </div>

        {/* Hero Image Container with 1:1 aspect ratio lock for Meta ad designs */}
        <div 
          onClick={onOpenCaseStudy}
          className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer bg-primary/5 transition-transform duration-500 group-hover:scale-[1.01]"
        >
          <PremiumImage
            src={heroImage}
            alt={`${title} — ${category}`}
            containerClassName="w-full h-full"
            className="object-cover object-center w-full h-full transform-gpu transition-transform duration-700 group-hover:scale-105"
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchpriority={index < 2 ? 'high' : 'auto'}
            decoding="async"
          />

          {/* Quick Hover / Tap Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-primary text-xs font-semibold shadow-md">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? 'কেস স্টাডি দেখতে ট্যাপ করুন' : 'View Full Case Study'}</span>
            </span>
          </div>
        </div>

        {/* Project Title */}
        <h3 
          onClick={onOpenCaseStudy}
          className="card-title-h3 mt-4 text-primary font-normal leading-snug tracking-tight cursor-pointer hover:text-accent transition-colors"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h3>

        {/* Emotional Pillar Subtitle & 1-Line Copy */}
        {pillar ? (
          <div className="mt-2 space-y-1">
            <span 
              className="text-[12px] font-semibold text-accent block tracking-wide"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              ✦ {isBn ? pillar.pillarBn : pillar.pillarEn}
            </span>
            <p 
              className="card-body-text text-foreground/80 leading-relaxed font-light"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.6 } : undefined}
            >
              {isBn ? pillar.descBn : pillar.descEn}
            </p>
          </div>
        ) : displayHook ? (
          <div
            className="mt-2 text-xs sm:text-[13.5px] text-foreground/75 leading-relaxed line-clamp-3 prose prose-sm max-w-none [&_p]:my-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayHook) }}
          />
        ) : null}
      </div>

      {/* Action Row */}
      <div className="mt-5 pt-3.5 border-t border-primary/10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenCaseStudy}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer group/btn"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
        >
          <span>{isBn ? 'সম্পূর্ণ কেস স্টাডি দেখুন' : 'Explore Case Study'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>

        <div className="flex items-center gap-2.5">
          {hasPdf && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-accent transition-colors"
              title={isBn ? 'কেস স্টাডি PDF ডাউনলোড করুন' : 'Download Case Study PDF'}
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>PDF</span>
            </a>
          )}

          {hasMockups && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-accent transition-colors cursor-pointer"
            >
              <span>{isBn ? 'মকআপ' : 'Mockups'}</span>
              <span className="text-[9.5px] font-mono opacity-70">({mockupUrls.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Mockup Lightbox Portal */}
      {lightboxOpen && (
        <MockupLightbox
          urls={mockupUrls}
          initialIndex={0}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </m.article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Slide-Up Mobile Bottom Sheet / Modal Drawer
───────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────────
   Fullscreen Interactive Case Study Lightbox Modal (Ultra-Smooth GPU Accelerated)
───────────────────────────────────────────────────────────────────────────── */

function CaseStudyDrawer({
  project,
  isBn: globalIsBn,
  allProjects,
  onSelectProject,
  onClose,
}: {
  project: PortfolioProject;
  isBn: boolean;
  allProjects?: PortfolioProject[];
  onSelectProject?: (p: PortfolioProject) => void;
  onClose: () => void;
}) {
  const [localLang, setLocalLang] = useState<'bn' | 'en'>(globalIsBn ? 'bn' : 'en');
  useEffect(() => {
    setLocalLang(globalIsBn ? 'bn' : 'en');
  }, [globalIsBn]);
  const isBn = localLang === 'bn';

  const projectsList = allProjects || [project];
  const currentIndex = projectsList.findIndex((p) => p.id === project.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < projectsList.length - 1 && currentIndex !== -1;

  const goPrev = () => {
    if (hasPrev && onSelectProject) {
      onSelectProject(projectsList[currentIndex - 1]);
    }
  };

  const goNext = () => {
    if (hasNext && onSelectProject) {
      onSelectProject(projectsList[currentIndex + 1]);
    }
  };

  // Direct mapping to database rich text HTML fields with fallbacks
  const rawBnCaseStudy = (typeof project.case_study_bn === 'string' && project.case_study_bn.trim())
    ? project.case_study_bn
    : (project as any).case_study || (project as any).description || '';

  const rawEnCaseStudy = (typeof project.case_study_en === 'string' && project.case_study_en.trim())
    ? project.case_study_en
    : (project as any).case_study || (project as any).description || '';

  const caseStudy = isBn
    ? (rawBnCaseStudy || rawEnCaseStudy)
    : (rawEnCaseStudy || rawBnCaseStudy);

  const rawBnHook = (typeof project.hook_bn === 'string' && project.hook_bn.trim())
    ? project.hook_bn
    : (project as any).hook || '';

  const rawEnHook = (typeof project.hook_en === 'string' && project.hook_en.trim())
    ? project.hook_en
    : (project as any).hook || '';

  const hook = isBn
    ? (rawBnHook || rawEnHook)
    : (rawEnHook || rawBnHook);

  const rawBnTitle = (typeof project.title_bn === 'string' && project.title_bn.trim())
    ? project.title_bn
    : (project as any).title || '';

  const rawEnTitle = (typeof project.title_en === 'string' && project.title_en.trim())
    ? project.title_en
    : (project as any).title || '';

  const title = isBn
    ? (rawBnTitle || rawEnTitle || 'কেস স্টাডি')
    : (rawEnTitle || rawBnTitle || 'Case Study');

  const category = (isBn ? (project.category_bn || project.category_en) : (project.category_en || project.category_bn)) || (isBn ? 'ডিজাইন' : 'Creative Design');
  const rawPdf = isBn
    ? (project.pdf_url_bn || project.pdf_url_en)
    : (project.pdf_url_en || project.pdf_url_bn);
  const pdfUrl = (rawPdf && typeof rawPdf === 'string' && rawPdf.trim()) ? rawPdf.trim() : '';

  const mockupUrls = useMemo(() => {
    const list: string[] = [];
    if (Array.isArray(project.mockup_urls)) {
      project.mockup_urls.forEach((item) => {
        if (typeof item === 'string' && item.trim()) list.push(item);
        else if (item && typeof item === 'object' && 'url' in (item as any)) list.push(String((item as any).url));
      });
    }
    if (project.mockup_url && !list.includes(project.mockup_url)) {
      list.push(project.mockup_url);
    }
    return list;
  }, [project.mockup_urls, project.mockup_url]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryImages = useMemo(() => {
    const images: string[] = [];
    if (typeof project.image_url === 'string' && project.image_url.trim()) {
      images.push(resolveStorageUrl(project.image_url));
    }
    mockupUrls.forEach((m) => {
      const resolved = resolveStorageUrl(m);
      if (!images.includes(resolved)) images.push(resolved);
    });
    if (images.length === 0) images.push('/portfolio/lumin-botanical.jpg');
    return images;
  }, [project.image_url, mockupUrls]);

  const currentHeroImg = galleryImages[activeImageIndex] || galleryImages[0];

  // Lock body scroll and notify mobile dock
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: true } }));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: false } }));
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keyboard navigation: Escape to close, Left/Right arrows to switch projects
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goPrev, goNext]);

  const pillar = useMemo(() => getPillarForProject(project), [project]);

  const whatsappMessage = encodeURIComponent(
    isBn
      ? `হ্যালো POLISHED, আমি "${project.title_bn || project.title_en}" কেস স্টাডি দেখে মেসেজ দিচ্ছি। আমার ব্র্যান্ডের জন্য ৳২,৫০০ টাকার 72h Test Drive প্যাক দিয়ে শুরু করতে চাই। আমার পেজের লিংক: `
      : `Hi POLISHED, I am reviewing your case study for "${project.title_en || project.title_bn}" and would like to start the ৳2,500 Test Drive for my brand. My page link: `
  );

  return createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden transform-gpu">
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
        />

        {/* Modal Main Frame */}
        <m.div
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl max-h-[94vh] bg-white rounded-2xl sm:rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.4)] border border-primary/10 flex flex-col overflow-hidden will-change-transform"
        >
          {/* Top Bar */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-primary/10 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              {/* Previous / Next buttons */}
              {projectsList.length > 1 && (
                <div className="flex items-center gap-1 shrink-0 bg-primary/5 p-1 rounded-full border border-primary/10">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!hasPrev}
                    title="Previous Project"
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1 font-semibold text-primary/70">
                    {currentIndex + 1}/{projectsList.length}
                  </span>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasNext}
                    title="Next Project"
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/10 text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block truncate">
                  {category}
                </span>
                <h2 
                  className="text-sm sm:text-base md:text-lg font-bold text-primary truncate leading-tight"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {title}
                </h2>
              </div>
            </div>

            {/* Language Switch + Close */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center p-0.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLocalLang('bn')}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    isBn ? 'bg-primary text-white' : 'text-primary/70 hover:text-primary'
                  }`}
                >
                  বাং
                </button>
                <button
                  type="button"
                  onClick={() => setLocalLang('en')}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    !isBn ? 'bg-primary text-white' : 'text-primary/70 hover:text-primary'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Case Study"
                className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-primary/5 hover:bg-primary/15 text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body: Responsive 2-Column Split */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-primary/10">
            {/* Left Column: Visual Showcase & Thumbnails */}
            <div className="lg:col-span-6 p-4 sm:p-6 bg-primary/[0.02] flex flex-col justify-between gap-4">
              <div 
                onClick={() => setLightboxOpen(true)}
                className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-primary/5 border border-primary/10 shadow-sm flex items-center justify-center cursor-zoom-in"
              >
                <img
                  src={currentHeroImg}
                  alt={title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium backdrop-blur-[2px]">
                  <Eye className="w-4 h-4" />
                  <span>{isBn ? 'ফুল-স্ক্রিন দেখতে ক্লিক করুন' : 'Click for full screen'}</span>
                </div>
              </div>

              {/* Thumbnails Gallery */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-accent shadow-md scale-105' : 'border-primary/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Strategic Concept Sprint Spec Ribbon */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#1e3a8a] text-white text-center shadow-inner">
                <div className="p-1">
                  <span className="text-[9px] uppercase font-mono text-white/70 block">
                    {isBn ? 'টাইপ' : 'Type'}
                  </span>
                  <span className="text-xs font-bold text-accent font-mono mt-0.5 block">
                    {isBn ? 'কনসেপ্ট স্প্রিন্ট' : 'Concept Sprint'}
                  </span>
                </div>
                <div className="p-1 border-x border-white/10">
                  <span className="text-[9px] uppercase font-mono text-white/70 block">
                    {isBn ? 'ডেলিভারি' : 'Delivery'}
                  </span>
                  <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                    {project.turnaround || (isBn ? '৪৮ ঘণ্টা' : '48 Hours')}
                  </span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] uppercase font-mono text-white/70 block">
                    {isBn ? 'আর্টওয়ার্ক' : 'Craft'}
                  </span>
                  <span className="text-xs font-bold text-emerald-300 font-mono mt-0.5 block">
                    {isBn ? '১০০% কাস্টম' : '100% Bespoke'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & Rich Content */}
            <div className="lg:col-span-6 p-5 sm:p-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Strategic Hook */}
                {(pillar || hook) && (
                  <div className="p-3.5 rounded-xl bg-accent/10 border-l-4 border-accent text-primary">
                    {pillar ? (
                      <div>
                        <p className="text-xs font-bold text-accent mb-1" style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
                          {isBn ? pillar.pillarBn : pillar.pillarEn}
                        </p>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed text-primary" style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
                          {isBn ? pillar.descBn : pillar.descEn}
                        </p>
                      </div>
                    ) : (
                      <div 
                        className="text-xs sm:text-sm font-medium leading-relaxed prose prose-sm max-w-none text-primary [&_p]:my-1"
                        style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatRichContent(hook)) }}
                      />
                    )}
                  </div>
                )}

                {/* Case Study Body */}
                {caseStudy ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                        {isBn ? 'কেস স্টাডি বিশ্লেষণ' : 'Strategic Case Breakdown'}
                      </h4>
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-[10px] font-semibold transition-colors"
                        >
                          <FileText className="w-3 h-3 text-accent" />
                          <span>PDF</span>
                        </a>
                      )}
                    </div>

                    <div 
                      className="prose prose-sm max-w-none text-foreground/85 leading-relaxed font-sans
                        [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mt-4 [&_h1]:mb-2
                        [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-4 [&_h2]:mb-2
                        [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-3 [&_h3]:mb-1.5
                        [&_p]:my-2.5 [&_p]:leading-relaxed
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2.5 [&_ul]:space-y-1
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2.5 [&_ol]:space-y-1
                        [&_strong]:font-bold [&_strong]:text-primary
                        [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:bg-primary/[0.02]"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.8 } : { lineHeight: 1.7 }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(formatRichContent(caseStudy), {
                          ADD_ATTR: ['target', 'rel'],
                          ADD_TAGS: ['hr', 'br', 'iframe'],
                        }),
                      }}
                    />
                  </div>
                ) : null}

                {/* PDF Document Attachment Card if available */}
                {pdfUrl && (
                  <div className="p-3.5 rounded-xl bg-primary/[0.03] border border-primary/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-primary truncate">
                          {isBn ? 'কেস স্টাডি PDF' : 'Official Case PDF'}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {isBn ? 'সম্পূর্ণ ডকুমেন্টেশন ডাউনলোড করুন' : 'Download complete design teardown'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-primary/10 flex flex-col sm:flex-row items-center gap-2.5">
                <a
                  href={`https://wa.me/8801346288210?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 h-10 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat On WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openQuickBookingModal({
                      tierId: 'test-drive',
                      tierTitle: 'The 72h Test Drive (টেস্ট প্যাক)',
                      tierTitleBn: '৭২ ঘণ্টা টেস্ট ড্রাইভ (টেস্ট প্যাক)',
                      price: '৳2,500',
                      priceBn: '৳২,৫০০',
                      source: `Case Study: ${project.title_en || project.title_bn}`,
                    });
                  }}
                  className="w-full sm:flex-1 h-10 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span>{isBn ? '৳২,৫০০ টেস্ট ড্রাইভ শুরু' : 'Book ৳2,500 Test Drive'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </m.div>

        {/* Fullscreen High-Res Lightbox */}
        {lightboxOpen && (
          <MockupLightbox
            urls={galleryImages}
            initialIndex={activeImageIndex}
            title={title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    </AnimatePresence>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mockup Lightbox (Swipeable, Esc to close)
───────────────────────────────────────────────────────────────────────────── */

function MockupLightbox({
  urls,
  initialIndex,
  title,
  onClose,
}: {
  urls: unknown[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const total = urls.length;

  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  return createPortal(
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[700] bg-black/90 flex flex-col justify-between p-4 md:p-8"
      onClick={onClose}
    >
      {/* Lightbox Header */}
      <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-mono uppercase tracking-wider text-white/70">
          {title} ({current + 1} / {total})
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div 
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {urls[current] ? (
          <img
            src={typeof urls[current] === 'string' ? (urls[current] as string) : resolveStorageUrl(String(urls[current]))}
            alt={`${title} mockup ${current + 1}`}
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        ) : null}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={current === 0}
              className="absolute left-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={current === total - 1}
              className="absolute right-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {total > 1 && (
        <div className="flex justify-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-accent' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </m.div>,
    document.body
  );
}
