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

const CATEGORIES = [
  { id: 'all', labelEn: 'All Works', labelBn: 'সব কাজ' },
  { id: 'skincare', labelEn: 'Skincare & D2C', labelBn: 'স্কিনকেয়ার ও ডি২সি' },
  { id: 'ads', labelEn: 'Meta Performance Ads', labelBn: 'মেটা অ্যাড ক্রিয়েটিভ' },
  { id: 'perfume', labelEn: 'Luxury Fragrance', labelBn: 'লাক্সারি পারফিউম' },
  { id: 'branding', labelEn: 'Packaging & Identity', labelBn: 'প্যাকেজিং ও ব্র্যান্ডিং' },
] as const;

function matchesCategory(project: PortfolioProject, catId: string): boolean {
  if (catId === 'all') return true;
  const en = (project.category_en || '').toLowerCase();
  const bn = (project.category_bn || '').toLowerCase();
  const title = (project.title_en || '').toLowerCase();
  
  if (catId === 'skincare') {
    return en.includes('skincare') || bn.includes('স্কিনকেয়ার') || en.includes('serum') || en.includes('elixir') || en.includes('masque') || en.includes('glow') || title.includes('lumin') || title.includes('aurora') || title.includes('cleanser') || en.includes('d2c') || bn.includes('ডি২সি');
  }
  if (catId === 'ads') {
    return en.includes('ad') || en.includes('performance') || en.includes('campaign') || bn.includes('অ্যাড') || en.includes('sprint') || en.includes('funnel') || en.includes('creative');
  }
  if (catId === 'perfume') {
    return en.includes('perfume') || en.includes('parfum') || bn.includes('পারফিউম') || en.includes('fragrance') || en.includes('scent') || bn.includes('সুগন্ধি');
  }
  if (catId === 'branding') {
    return en.includes('packaging') || en.includes('identity') || bn.includes('প্যাকেজিং') || bn.includes('ব্র্যান্ডিং') || en.includes('brand') || en.includes('design') || bn.includes('ডিজাইন');
  }
  return true;
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

  // Filter matching projects
  const filteredProjects = useMemo(() => {
    return displayProjects.filter((p) => matchesCategory(p, selectedCategory));
  }, [displayProjects, selectedCategory]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = visibleCount < filteredProjects.length;
  const remainingCount = filteredProjects.length - visibleCount;

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(4); // Reset visible count on filter change
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
              lang={isBn ? 'bn' : 'en'} 
              className={`text-accent mb-3 font-medium uppercase tracking-[2.5px] ${isBn ? 'text-[13px] tracking-normal font-semibold' : 'text-[11px]'}`} 
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
            >
              {isBn ? 'কৌশলগত রিডিজাইন ও কনসেপ্ট কেস স্টাডি' : (content?.labelEn ?? 'Strategic Concept Sprints & Redesigns')}
            </p>
            <h2 
              lang={isBn ? 'bn' : 'en'} 
              className={`font-heading font-normal text-primary leading-[1.15] ${
                isBn ? 'text-[clamp(24px,6vw,34px)] md:text-[clamp(32px,4vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,56px)]'
              }`}
            >
              {isBn ? (
                <>বাস্তব ব্র্যান্ডের জন্য তৈরি <em className="italic text-accent">হাই-কনভার্শন আর্কিটেকচার।</em></>
              ) : (
                <>
                  <WordReveal delay={0.1}>Strategic Concept Sprints.</WordReveal>{' '}
                  <em className="italic text-accent">
                    <WordReveal delay={0.25}>Crafted For Conversion.</WordReveal>
                  </em>
                </>
              )}
            </h2>
          </div>

          {/* ── Badge: 100% Bespoke Craft ── */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.04] border border-primary/10 self-start md:self-end">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-primary" style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
              {isBn ? '১০০% কাস্টম পারফরম্যান্স আর্ট' : '100% Bespoke Performance Art'}
            </span>
          </div>
        </div>
      </MotionReveal>

      {/* ── Category Filter Pills Bar (Mobile Swipeable) ── */}
      <MotionReveal delay={0.15}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8 md:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? displayProjects.length 
              : displayProjects.filter((p) => matchesCategory(p, cat.id)).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none ${
                  active
                    ? 'bg-primary text-white font-semibold shadow-md'
                    : 'bg-white/80 text-primary/70 border border-primary/10 hover:border-primary/30 hover:bg-white'
                }`}
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  active ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </MotionReveal>

      {/* ── Projects Grid ── */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <PortfolioSkeleton />
        ) : (
          <div className="space-y-12 md:space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-stretch">
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
        )}
      </AnimatePresence>

      {/* ── Slide-up Case Study Bottom Sheet / Modal Drawer ── */}
      {selectedModalProject && (
        <CaseStudyDrawer
          project={selectedModalProject}
          isBn={isBn}
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

  const displayHook = useMemo(() => {
    if (hook && hook.trim()) return formatRichContent(hook);
    if (!caseStudy || !caseStudy.trim()) return '';
    const stripped = caseStudy.replace(/<[^>]*>?/gm, '').trim();
    if (!stripped) return '';
    return `<p>${stripped.slice(0, 150)}${stripped.length > 150 ? '...' : ''}</p>`;
  }, [hook, caseStudy]);

  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 * (index % 4) }}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-primary/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.08)] hover:border-primary/20 transition-all duration-500 overflow-hidden p-4 sm:p-5"
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
            fetchPriority={index < 2 ? 'high' : 'auto'}
            decoding="async"
          />

          {/* Quick Hover / Tap Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-primary text-xs font-semibold backdrop-blur-md shadow-md">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? 'কেস স্টাডি দেখতে ট্যাপ করুন' : 'View Full Case Study'}</span>
            </span>
          </div>
        </div>

        {/* Project Title */}
        <h3 
          onClick={onOpenCaseStudy}
          className="mt-4 font-heading text-lg sm:text-xl md:text-2xl text-primary font-normal leading-snug tracking-tight cursor-pointer hover:text-accent transition-colors"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h3>

        {/* Hook / Teaser text */}
        {displayHook && (
          <div
            className="mt-2 text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-2 prose prose-sm max-w-none [&_p]:my-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayHook) }}
          />
        )}
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

function CaseStudyDrawer({
  project,
  isBn: globalIsBn,
  onClose,
}: {
  project: PortfolioProject;
  isBn: boolean;
  onClose: () => void;
}) {
  const [localLang, setLocalLang] = useState<'bn' | 'en'>(globalIsBn ? 'bn' : 'en');
  useEffect(() => {
    setLocalLang(globalIsBn ? 'bn' : 'en');
  }, [globalIsBn]);
  const isBn = localLang === 'bn';

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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroImage = (typeof project.image_url === 'string' && project.image_url.trim())
    ? resolveStorageUrl(project.image_url)
    : (mockupUrls.length > 0)
      ? resolveStorageUrl(mockupUrls[0])
      : '/portfolio/lumin-botanical.jpg';

  // Inform mobile dock to tuck away while modal is active
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: true } }));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: false } }));
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keyboard escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const whatsappMessage = encodeURIComponent(
    `Hi POLISHED, I just reviewed your case study for "${project.title_en || project.title_bn}" and would love to achieve similar ROAS results for my brand.`
  );

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] flex flex-col justify-end md:justify-center md:items-center">
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        />

        {/* Drawer / Sheet Window */}
        <m.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full md:max-w-2xl lg:max-w-3xl max-h-[92vh] md:max-h-[88vh] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Mobile Drag Handle Bar */}
          <div className="md:hidden flex justify-center pt-2.5 pb-1">
            <span className="w-12 h-1 rounded-full bg-primary/20" />
          </div>

          {/* Sticky Header */}
          <div className="px-5 py-3.5 border-b border-primary/10 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md sticky top-0 z-30">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block truncate">
                {category}
              </span>
              <h2 
                className="text-base sm:text-lg font-bold text-primary truncate"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
              >
                {title}
              </h2>
            </div>

            {/* Language switch + Close Button */}
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
                className="w-9 h-9 rounded-full bg-primary/5 hover:bg-primary/15 text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Featured Image — 1:1 Ratio */}
            <div className="relative w-full aspect-square max-h-[60vh] rounded-2xl overflow-hidden bg-primary/5 shadow-md flex items-center justify-center">
              <img
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Strategic Concept Sprint Spec Ribbon */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#1e3a8a] text-white text-center">
              <div className="p-1">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'টাইপ' : 'Type'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-accent font-mono mt-0.5 block">
                  {isBn ? 'কনসেপ্ট স্প্রিন্ট' : 'Concept Sprint'}
                </span>
              </div>
              <div className="p-1 border-x border-white/10">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'ডেলিভারি' : 'Delivery'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 block">
                  {project.turnaround || (isBn ? '৪৮ ঘণ্টা' : '48 Hours')}
                </span>
              </div>
              <div className="p-1">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'আর্টওয়ার্ক' : 'Craft'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-300 font-mono mt-0.5 block">
                  {isBn ? '১০০% কাস্টম' : '100% Bespoke'}
                </span>
              </div>
            </div>

            {/* Strategic Hook */}
            {hook && (
              <div className="p-4 rounded-xl bg-accent/10 border-l-4 border-accent text-primary">
                <div 
                  className="text-xs sm:text-sm font-medium leading-relaxed prose prose-sm max-w-none text-primary [&_p]:my-1"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatRichContent(hook)) }}
                />
              </div>
            )}

            {/* Detailed Case Study Narrative */}
            {caseStudy && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    {isBn ? 'কেস স্টাডি বিশ্লেষণ ও ফলাফল' : 'Detailed Case Breakdown'}
                  </h4>
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-[11px] font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                    </a>
                  )}
                </div>

                <div 
                  className="prose prose-sm sm:prose-base max-w-none text-foreground/90 leading-relaxed font-sans dark:prose-invert
                    [&_h1]:text-xl sm:[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:tracking-tight
                    [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:tracking-tight
                    [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:tracking-tight
                    [&_p]:my-3.5 [&_p]:leading-relaxed [&_p]:text-foreground/85
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3.5 [&_ul]:space-y-1.5 [&_ul]:text-foreground/85
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3.5 [&_ol]:space-y-1.5 [&_ol]:text-foreground/85
                    [&_li]:pl-1 [&_li]:leading-relaxed
                    [&_strong]:font-bold [&_strong]:text-primary
                    [&_b]:font-bold [&_b]:text-primary
                    [&_em]:italic
                    [&_u]:underline [&_u]:underline-offset-2
                    [&_s]:line-through [&_s]:opacity-60
                    [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:py-1.5 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_blockquote]:bg-primary/[0.02] [&_blockquote]:rounded-r-lg
                    [&_a]:text-accent [&_a]:underline [&_a]:font-medium hover:[&_a]:text-accent/80"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.85 } : { lineHeight: 1.75 }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(formatRichContent(caseStudy), {
                      ADD_ATTR: ['target', 'rel'],
                      ADD_TAGS: ['hr', 'br', 'iframe'],
                    }),
                  }}
                />
              </div>
            )}

            {/* Official PDF Document Card */}
            {pdfUrl && (
              <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-primary">
                      {isBn ? 'কেস স্টাডি অফিসিয়াল ডকুমেন্ট (PDF)' : 'Official Case Study Document (PDF)'}
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      {isBn ? 'সম্পূর্ণ ডেটা ও স্ট্র্যাটেজি এক নজরে পড়তে ডাউনলোড করুন' : 'Download full strategic breakdown and metrics report'}
                    </p>
                  </div>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2 shrink-0 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                </a>
              </div>
            )}

            {/* Project Deliverables / Mockup Gallery */}
            {mockupUrls.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-primary/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    {isBn ? `প্রজেক্ট গ্যালারি ও মকআপ (${mockupUrls.length})` : `Deliverables & Mockups (${mockupUrls.length})`}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    {isBn ? 'বড় করে দেখতে ট্যাপ করুন' : 'Tap to expand'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {mockupUrls.map((url, mi) => (
                    <div
                      key={mi}
                      onClick={() => {
                        setLightboxIndex(mi);
                        setLightboxOpen(true);
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-primary/5 border border-primary/10 cursor-pointer hover:border-accent transition-all"
                    >
                      <img
                        src={resolveStorageUrl(url)}
                        alt={`${title} mockup ${mi + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Direct Conversion Bar */}
          <div className="p-4 border-t border-primary/10 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2.5">
            <a
              href={`https://wa.me/8801346288210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isBn ? 'এই প্রজেক্ট নিয়ে কথা বলুন' : 'Chat About This Work'}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                openQuickBookingModal({
                  tierId: 'trial-pack',
                  tierTitle: 'No-Risk Test Drive Sprint',
                  tierTitleBn: 'নো-রিস্ক টেস্ট ড্রাইভ স্প্রিন্ট',
                  price: '৳3,999',
                  priceBn: '৳৩,৯৯৯',
                  source: `Case Study: ${project.title_en || project.title_bn}`,
                });
              }}
              className="w-full sm:flex-1 h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>{isBn ? '৳৩,৯৯৯ স্প্রিন্ট বুক করুন' : 'Book ৳3,999 Sprint'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </m.div>

        {/* Mockup Lightbox Portal inside Drawer */}
        {lightboxOpen && (
          <MockupLightbox
            urls={mockupUrls}
            initialIndex={lightboxIndex}
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
