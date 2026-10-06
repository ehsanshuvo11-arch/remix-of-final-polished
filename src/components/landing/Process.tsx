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
      title_en: '1. Audit & Angle Strategy', 
      title_bn: '১. অডিট ও হুক স্ট্র্যাটেজি', 
      desc_en: 'We diagnose past ad leaks and identify the psychological hooks needed to win local trust.', 
      desc_bn: 'আগের বিজ্ঞাপনে ক্রেতাদের যে দ্বিধা ছিল তা দূর করার কৌশল ও মনস্তাত্ত্বিক হুক নির্ধারণ করি।' 
    },
    { 
      id: '2', 
      sort_order: 2, 
      title_en: '2. Bespoke Copy & Visual Craft', 
      title_bn: '২. মার্জিত বাংলা কপি ও ক্রাফট', 
      desc_en: 'Zero recycled templates. High-status visual design paired with culturally sharp Bengali sales copy.', 
      desc_bn: 'জিরো টেমপ্লেট। সম্পূর্ণ কাস্টম ডিজাইন ও খাঁটি বাংলা কপি যা দেখে মানুষ বিশ্বাস পায়।' 
    },
    { 
      id: '3', 
      sort_order: 3, 
      title_en: '3. 48-Hour Rapid Delivery', 
      title_bn: '৩. ৪৮ ঘণ্টার দ্রুত ডেলিভারি', 
      desc_en: 'Strict SLA. Ready-to-launch 1:1 and 9:16 Meta creatives delivered straight to your WhatsApp or Drive.', 
      desc_bn: 'কঠোর ৪৮ ঘণ্টার মধ্যে মেটা ও টিকটক রেডি ফিড + স্টোরি সাইজের অ্যাসেট ডেলিভারি।' 
    },
    { 
      id: '4', 
      sort_order: 4, 
      title_en: '4. Launch, Cut CPR & Scale', 
      title_bn: '৪. লঞ্চ ও লাভজনক স্কেলিং', 
      desc_en: 'Launch with confidence. Scale winning creatives to drive full-price orders with lower acquisition costs.', 
      desc_bn: 'বিজ্ঞাপন লাইভ করে কম খরচে (CPR) নিশ্চিত ফুল-প্রাইস সেলস ও ব্র্যান্ড অথরিটি বৃদ্ধি।' 
    },
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;
  if (!displaySteps || displaySteps.length === 0) return null;

  // Process headings/labels
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = 'No endless meetings.';
  const line2 = 'Fresh creatives in 48 hours.';

  return (
    <div className="bg-secondary">
      <section id="process" className="py-20 md:py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          {isBn ? (
            <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              জিরো-প্যারা ডেলিভারি
            </p>
          ) : (
            <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
              {content?.labelEn ?? 'Zero-Friction Execution'}
            </p>
          )}
        </MotionReveal>
        <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary mb-7 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
          {isBn ? (
            <WordReveal delay={0.1}>কোনো লম্বা মিটিং নেই। ৪৮ ঘণ্টার স্প্রিন্ট।</WordReveal>
          ) : (
            <>
              <WordReveal delay={0.1}>{line1}</WordReveal>
              <br />
              <em className="italic">
                <WordReveal delay={0.25}>{line2}</WordReveal>
              </em>
            </>
          )}
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

  const phaseLabels = [
    { en: 'Phase 01 • Deep Audit & Analysis', bn: 'পর্যায় ০১ • অডিট ও হুক অ্যানালাইসিস' },
    { en: 'Phase 02 • Copy & Art Direction', bn: 'পর্যায় ০২ • বাংলা কপি ও আর্ট ডিরেকশন' },
    { en: 'Phase 03 • 48-Hour Rapid Sprint', bn: 'পর্যায় ০৩ • ৪৮ ঘণ্টার র্যাপিড স্প্রিন্ট' },
    { en: 'Phase 04 • Launch, Track & Scale', bn: 'পর্যায় ০৪ • মেটা অ্যাড লঞ্চ ও অপটিমাইজেশন' },
  ];
  const phase = phaseLabels[index] || { en: `Phase 0${index + 1}`, bn: `পর্যায় ০${index + 1}` };

  return (
    <div className="relative group">
      {/* Node indicator sitting on the timeline */}
      <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full bg-primary border-2 border-accent text-accent text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">
        0{index + 1}
      </div>

      <div className="bg-white/80 rounded-xl p-5 border border-primary/10 shadow-sm transition-all duration-300">
        <span className="inline-block text-[10px] tracking-[2px] uppercase text-accent font-semibold mb-2">
          {isBn ? phase.bn : phase.en}
        </span>
        <h3
          lang={isBn ? 'bn' : 'en'}
          className="font-heading text-xl font-medium text-primary mb-2 leading-snug"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
        >
          {title}
        </h3>
        <p
          lang={isBn ? 'bn' : 'en'}
          className={`text-[13px] leading-[1.75] text-muted-foreground ${isBn ? 'leading-[1.8]' : ''}`}
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
        <div className="font-heading text-[40px] font-light text-primary/20 mb-4">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div lang={isBn ? 'bn' : 'en'} className={`font-heading text-xl font-medium text-primary mb-2.5 ${isBn ? 'leading-snug' : ''}`}>
          {title}
        </div>
        <p lang={isBn ? 'bn' : 'en'} style={isBn ? undefined : { fontFamily: "'DM Sans', sans-serif" }} className={`text-[13px] leading-[1.75] text-muted-foreground ${isBn ? 'leading-[1.85]' : ''}`}>
          {desc}
        </p>
      </div>
    </MotionReveal>
  );
}
