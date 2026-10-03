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
      title_en: 'Audit & Hook Analysis', 
      title_bn: 'অডিট ও হুক অ্যানালাইসিস', 
      desc_en: 'We audit your ad account, flagship products, and CPR bottlenecks. We dissect what made past ads fail and map emotional hooks for local buyers.', 
      desc_bn: 'আমরা আপনার অ্যাড অ্যাকাউন্ট, সেরা প্রোডাক্ট এবং বর্তমান CPR স্টাডি করি। পূর্বের ক্যাম্পেইন কেন ফেইল করেছে তা চিহ্নিত করে লোকাল ক্রেতাদের সাইকোলজি ম্যাপ করি।' 
    },
    { 
      id: '2', 
      sort_order: 2, 
      title_en: 'Bangla Copy & Art Direction', 
      title_bn: 'বাংলা কপি ও আর্ট ডিরেকশন', 
      desc_en: 'We craft high-status Bengali copywriting and Quiet Luxury visual compositions. Zero generic templates — every element is designed to stop the scroll.', 
      desc_bn: 'আমরা মার্জিত বাংলা সেলস কপি এবং শান্ত লাক্সারি ভিজ্যুয়াল কম্পোজিশন সাজাই। কোনো সস্তা ক্যানভা টেমপ্লেট নয়—প্রতিটি পিক্সেল প্রথম দেখাতেই বিশ্বাস অর্জনের জন্য তৈরি।' 
    },
    { 
      id: '3', 
      sort_order: 3, 
      title_en: '48-Hour Rapid Sprint', 
      title_bn: '৪৮ ঘণ্টার র্যাপিড স্প্রিন্ট প্রোডাকশন', 
      desc_en: 'Precision production under strict turnaround. You receive 5-15 Meta-compliant statics, motion cutdowns, and bundle graphics ready for Ads Manager.', 
      desc_bn: 'নিখুঁত ও দ্রুত প্রোডাকশন। মাত্র ৪৮ ঘণ্টায় আপনি পান মেটা-কমপ্লায়েন্ট স্ট্যাটিক্স, মোশন কাটডাউন এবং কম্বো গ্রাফিক্স—যা সরাসরি অ্যাড ম্যানেজারে ব্যবহারের উপযোগী।' 
    },
    { 
      id: '4', 
      sort_order: 4, 
      title_en: 'Launch, Track & Scale', 
      title_bn: 'মেটা অ্যাড লঞ্চ ও অপটিমাইজেশন', 
      desc_en: 'Your team or agency launches the test angles. We analyze CTR, CPR, and AOV to double down on winning creatives and eliminate ad fatigue.', 
      desc_bn: 'আপনার টিম বা এজেন্সি ক্যাম্পেইন লাইভ করে। আমরা CTR, CPR এবং AOV ডেটা ট্র্যাক করে উইনিং ক্রিয়েটিভ স্কেল করি এবং বিজ্ঞাপন খরচ সর্বনিম্ন রাখি।' 
    },
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;



  // Process headings/labels locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = content?.titleLine1En ?? 'A process built on';
  const line2 = content?.titleLine2En ?? 'precision.';

  return (
    <div className="bg-secondary">
      <section id="process" className="py-20 md:py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          {isBn ? (
            <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              আমাদের কাজের প্রসেস
            </p>
          ) : (
            <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
              {content?.labelEn ?? 'How It Works'}
            </p>
          )}
        </MotionReveal>
        <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary mb-7 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
          {isBn ? (
            <WordReveal delay={0.1}>নিখুঁত কাজের পেছনের মাস্টারপ্ল্যান।</WordReveal>
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
