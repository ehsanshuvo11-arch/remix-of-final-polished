import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import type { ProcessMetaContent, ProcessStep } from '@/types/database';

interface ProcessProps {
  steps: ProcessStep[];
  content?: ProcessMetaContent | null;
}

export default function Process({ steps, content }: ProcessProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const defaultSteps: ProcessStep[] = [
    { 
      id: '1', 
      sort_order: 1, 
      title_en: '01. WhatsApp & Payment', 
      title_bn: '01. WhatsApp & Payment', 
      desc_en: 'Send product photos and confirm payment via bKash or Nagad.', 
      desc_bn: 'প্রোডাক্টের ছবি পাঠিয়ে বিকাশ বা নগদে পেমেন্ট কনফার্ম করুন।' 
    },
    { 
      id: '2', 
      sort_order: 2, 
      title_en: '02. Visual & Copy Craft', 
      title_bn: '02. Visual & Copy Craft', 
      desc_en: 'We craft 1 video reel, 2 images, and Bengali copy.', 
      desc_bn: 'আমরা ১টি ভিডিও রিল, ২টি ছবি ও বাংলা ক্যাপশন সাজাই।' 
    },
    { 
      id: '3', 
      sort_order: 3, 
      title_en: '03. 48–72h Delivery', 
      title_bn: '03. 48–72h Delivery', 
      desc_en: 'Receive all campaign files directly on WhatsApp within 3 days.', 
      desc_bn: '৩ দিনের মধ্যে সব ফাইল সরাসরি হোয়াটসঅ্যাপে ডেলিভারি পাবেন।' 
    },
    { 
      id: '4', 
      sort_order: 4, 
      title_en: '04. Launch & Scale', 
      title_bn: '04. Launch & Scale', 
      desc_en: 'Refine with 2 free revisions and launch your ads.', 
      desc_bn: 'প্রয়োজনে ২ বার ছোটখাটো পরিবর্তন করে অ্যাড চালু করুন।' 
    },
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;
  if (!displaySteps || displaySteps.length === 0) return null;

  // Process headings/labels
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;

  return (
    <div className="bg-secondary">
      <section id="process" className="py-20 md:py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          <p className="eyebrow-pill-kicker text-accent mb-4 font-semibold" style={enFont}>
            SIMPLE PROCESS
          </p>
        </MotionReveal>
        <h2 lang="en" className="section-heading-h2 font-heading font-normal text-primary mb-7 leading-[1.2]">
          Fresh Creatives in <span className="italic text-accent">72 Hours.</span>
        </h2>

        {/* Mobile Vertical Connected Timeline (100% Frictionless & Minimalist) */}
        <div className="flex md:hidden flex-col gap-8 relative pl-6 border-l-2 border-primary/20 ml-3 my-8">
          {displaySteps.map((step, i) => (
            <MobileTimelineStep
              key={step.id}
              step={step}
              index={i}
              total={displaySteps.length}
            />
          ))}
        </div>

        {/* Desktop 4-column Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 md:gap-10 mt-10 md:mt-14">
          {displaySteps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MobileTimelineStep({ step, index, total }: { step: ProcessStep; index: number; total: number }) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const title = isBn ? (step.title_bn?.trim() || step.title_en) : step.title_en;
  const desc = isBn ? (step.desc_bn?.trim() || step.desc_en) : step.desc_en;

  return (
    <div className="relative group">
      {/* Node indicator sitting on the timeline */}
      <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full bg-primary border-2 border-accent text-accent text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">
        0{index + 1}
      </div>

      <div className="bg-white/80 rounded-xl p-5 border border-primary/10 shadow-sm transition-all duration-300">
        <h3
          className="card-title-h3 font-heading text-primary mb-2 leading-snug"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h3>
        <p
          className="card-body-text text-muted-foreground leading-relaxed"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: ProcessStep; index: number }) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const title = isBn ? (step.title_bn?.trim() || step.title_en) : step.title_en;
  const desc = isBn ? (step.desc_bn?.trim() || step.desc_en) : step.desc_en;

  return (
    <MotionReveal delay={0.12 * (index + 1)}>
      <div
        className="relative pt-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_10px_36px_rgba(0,0,0,0.05)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-border before:transition-colors before:duration-700 hover:before:bg-accent"
      >
        <div className="font-heading text-[32px] font-semibold text-accent mb-2">
          {String(index + 1).padStart(2, '0')}
        </div>
        <h3 
          className="card-title-h3 font-heading font-medium text-primary mb-2 leading-snug"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h3>
        <p 
          className="card-body-text text-muted-foreground leading-relaxed"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
        >
          {desc}
        </p>
      </div>
    </MotionReveal>
  );
}
