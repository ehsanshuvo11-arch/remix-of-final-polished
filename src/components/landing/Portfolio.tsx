import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import type { PortfolioMetaContent, PortfolioProject } from '@/types/database';

interface PortfolioProps {
  projects: PortfolioProject[];
  content?: PortfolioMetaContent | null;
}

export default function Portfolio({ projects, content }: PortfolioProps) {
  const { t } = useLanguage();
  const labelRef = useScrollReveal();
  const titleRef = useScrollReveal(0.1);

  const defaultProjects: PortfolioProject[] = [
    { id: '1', sort_order: 1, title_en: 'Add Your Featured Project', title_bn: 'ফিচার্ড প্রজেক্ট যোগ করুন', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '2', sort_order: 2, title_en: 'Project 02', title_bn: 'প্রজেক্ট ০২', category_en: 'Brand Identity', category_bn: 'ব্র্যান্ড আইডেন্টিটি', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
    { id: '3', sort_order: 3, title_en: 'Project 03', title_bn: 'প্রজেক্ট ০৩', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '' },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="work" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
      <p ref={labelRef} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
        {t(content?.labelEn ?? 'Selected Work', content?.labelBn ?? 'বাছাই করা কাজ')}
      </p>
      <h2 ref={titleRef} className="font-heading font-normal text-primary mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
        {t(content?.titleLine1En ?? 'Recent', content?.titleLine1Bn ?? 'সাম্প্রতিক')} <em className="italic">{t(content?.titleLine2En ?? 'projects.', content?.titleLine2Bn ?? 'প্রজেক্ট।')}</em>
      </h2>

      <div className="flex flex-col gap-10 mt-14">
        {displayProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const { t, lang } = useLanguage();
  const ref = useScrollReveal(0.1 * index);
  const cardRef = useRef<HTMLDivElement>(null);

  const [imageExpanded, setImageExpanded] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);

  const caseStudy = t(project.case_study_en ?? '', project.case_study_bn ?? '');
  const hook = t(project.hook_en ?? '', project.hook_bn ?? '');
  const pdfUrl = lang === 'bn' ? (project.pdf_url_bn || project.pdf_url_en) : project.pdf_url_en;

  const toggleImageExpand = useCallback(() => {
    setImageExpanded((prev) => !prev);
  }, []);

  const toggleCaseStudy = useCallback(() => {
    setCaseStudyOpen((prev) => !prev);
  }, []);

  // Tilt effect for collapsed state (same as Services/What We Do section)
  const handleTilt = useCallback((e: React.MouseEvent) => {
    if (imageExpanded) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = ((midY - y) / midY) * 6;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, [imageExpanded]);

  const handleTiltLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = '';
  }, []);

  return (
    <div
      ref={ref}
    >
      {/* Image container with tilt in collapsed state */}
      <div
        ref={cardRef}
        onMouseMove={handleTilt}
        onMouseLeave={handleTiltLeave}
        style={{ transition: 'transform 0.15s ease-out' }}
      >
        <div
          className={`relative cursor-pointer ${
            !imageExpanded
              ? 'group after:content-[\'\'] after:absolute after:inset-0 after:bg-gradient-to-br after:from-accent/[0.09] after:to-transparent after:opacity-0 after:transition-opacity after:duration-400 hover:after:opacity-100'
              : ''
          }`}
          onClick={toggleImageExpand}
          style={{
            overflow: 'hidden',
            maxHeight: imageExpanded ? '85vh' : '240px',
            transition: 'max-height 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title_en}
              className={`w-full ${
                imageExpanded
                  ? 'object-contain h-full'
                  : 'object-cover h-[240px] group-hover:brightness-[0.92] transition-[filter] duration-300'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-[240px] flex flex-col items-center justify-center bg-secondary gap-2 transition-colors duration-300 group-hover:bg-muted">
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

          {/* Hover overlay — collapsed state only */}
          {!imageExpanded && (
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 flex items-end p-8 z-10">
              <div className="text-primary-foreground translate-y-4 transition-transform duration-400 group-hover:translate-y-0">
                <h3 className="font-heading text-2xl font-normal mb-1.5">{t(project.title_en, project.title_bn)}</h3>
                <span className="text-[11px] tracking-[2px] uppercase text-accent">{t(project.category_en, project.category_bn)}</span>
              </div>
            </div>
          )}

          {/* Bottom accent line on hover — collapsed only */}
          {!imageExpanded && (
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-accent to-transparent scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 z-10" />
          )}
        </div>
      </div>

      {/* Controls — ALWAYS visible */}
      <div className="mt-3 px-1 flex flex-wrap items-center gap-4">
        <button
          onClick={toggleImageExpand}
          className="text-accent text-[11px] tracking-[2px] uppercase font-medium transition-all duration-300 hover:text-accent/70 active:scale-[0.96]"
        >
          {imageExpanded
            ? t('Click to collapse', 'সংকুচিত করতে ক্লিক করুন')
            : t('Click image for full view', 'সম্পূর্ণ দেখতে ছবিতে ক্লিক করুন')}
        </button>

        <button
          onClick={toggleCaseStudy}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase font-medium rounded-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,146,60,0.35)] active:scale-[0.96] before:content-[''] before:absolute before:inset-0 before:bg-primary-foreground/15 before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100"
        >
          <span className="relative z-10">
            {caseStudyOpen
              ? t('Hide case study', 'কেস স্টাডি লুকান')
              : t('View full case study', 'সম্পূর্ণ কেস স্টাডি দেখুন')}
          </span>
        </button>
      </div>

      {/* Case study content */}
      <AnimatePresence>
        {caseStudyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border px-1">
              <p className="text-[11px] tracking-[2px] uppercase text-accent mb-3 font-medium">
                {t('Case Study', 'কেস স্টাডি')}
              </p>
              {caseStudy && (
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{caseStudy}</p>
              )}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-accent/10 text-accent text-[11px] tracking-[2px] uppercase font-medium rounded-sm transition-all duration-300 hover:bg-accent/20 active:scale-[0.96]"
                >
                  📄 {t('Download PDF', 'পিডিএফ ডাউনলোড')}
                </a>
              )}
              <div className="mt-5">
                <button
                  onClick={() => setCaseStudyOpen(false)}
                  className="text-accent text-[11px] tracking-[2px] uppercase font-medium transition-colors duration-200 hover:text-accent/70 active:scale-[0.96]"
                >
                  {t('Show less', 'সংক্ষেপে দেখুন')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
