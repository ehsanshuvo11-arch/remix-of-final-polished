import { useState, useRef } from 'react';
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
    { id: '1', sort_order: 1, title_en: 'Add Your Featured Project', title_bn: 'ফিচার্ড প্রজেক্ট যোগ করুন', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '' },
    { id: '2', sort_order: 2, title_en: 'Project 02', title_bn: 'প্রজেক্ট ০২', category_en: 'Brand Identity', category_bn: 'ব্র্যান্ড আইডেন্টিটি', image_url: '', case_study_en: '', case_study_bn: '' },
    { id: '3', sort_order: 3, title_en: 'Project 03', title_bn: 'প্রজেক্ট ০৩', category_en: 'Social Media Design', category_bn: 'সোশ্যাল মিডিয়া ডিজাইন', image_url: '', case_study_en: '', case_study_bn: '' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
        {displayProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} isFirst={i === 0} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, isFirst, index }: { project: PortfolioProject; isFirst: boolean; index: number }) {
  const { t } = useLanguage();
  const ref = useScrollReveal(0.1 * index);
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const caseStudy = t(project.case_study_en ?? '', project.case_study_bn ?? '');

  // Tilt effect matching Services cards
  const handleTilt = (e: React.MouseEvent) => {
    if (expanded) return;
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
  };

  const handleTiltLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  const collapsedAspect = isFirst ? 16 / 7 : 4 / 3;
  const expandedAspect = 1;

  return (
    <div ref={ref} className={`${isFirst ? 'md:col-span-2' : ''}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleTilt}
        onMouseLeave={handleTiltLeave}
        className="work-card relative overflow-hidden cursor-pointer group"
        style={{ transition: 'transform 0.15s ease-out', maxHeight: expanded ? '85vh' : undefined }}
        animate={{ aspectRatio: expanded ? expandedAspect : collapsedAspect }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={() => setExpanded(!expanded)}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title_en}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.85]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary gap-2 transition-colors duration-300 group-hover:bg-muted">
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

        {/* Hover overlay — same as before */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 flex items-end p-8">
          <div className="text-primary-foreground translate-y-4 transition-transform duration-400 group-hover:translate-y-0">
            <h3 className="font-heading text-2xl font-normal mb-1.5">{t(project.title_en, project.title_bn)}</h3>
            <span className="text-[11px] tracking-[2px] uppercase text-accent">{t(project.category_en, project.category_bn)}</span>
          </div>
        </div>

        {/* Post-expansion: Services-style accent line + gradient overlay */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Gradient overlay like Services hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.09] to-transparent" />
              {/* Bottom accent line like Services */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                className="absolute bottom-0 left-9 right-9 h-px bg-gradient-to-r from-accent to-transparent origin-left"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint text */}
      <p className="mt-2.5 text-[10px] tracking-[2px] uppercase text-accent font-medium">
        {expanded
          ? t('Click to collapse', 'সংকুচিত করতে ক্লিক করুন')
          : t('Click image for full view', 'সম্পূর্ণ ডিজাইন দেখতে ক্লিক করুন')
        }
      </p>

      {/* Case Study */}
      {caseStudy && (
        <div className="mt-4 px-1">
          <p className="text-[11px] tracking-[2px] uppercase text-accent mb-2 font-medium">Case Study</p>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{caseStudy}</p>
        </div>
      )}
    </div>
  );
}
