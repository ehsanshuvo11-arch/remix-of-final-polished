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
      title_en: '1. Audit Leaking Ad Spend', 
      title_bn: '১. প্রোডাক্ট ও ব্যথার জায়গা খোঁজা', 
      desc_en: 'We diagnose why your past ads bled cash. We identify the exact doubts stopping local buyers and map emotional angles to overcome them.', 
      desc_bn: 'আমরা দেখি আপনার আগের বিজ্ঞাপনে কেন মানুষ অর্ডার করেনি। কোথায় ডলার অপচয় হচ্ছিল এবং ক্রেতাদের খাঁটি বিশ্বাস অর্জনের জন্য কোন হুক কাজ করবে—তা ঠিক করি।' 
    },
    { 
      id: '2', 
      sort_order: 2, 
      title_en: '2. Sharp Bangla Copy & Visual Craft', 
      title_bn: '২. বাংলা কপি ও বিশ্বাসযোগ্য আর্ট', 
      desc_en: 'Zero generic templates. We write persuasive Bengali sales copy and build clean, high-status visuals that command full price without discounts.', 
      desc_bn: 'কোনো সস্তা ক্যানভা টেমপ্লেট নয়। আমরা প্রতিটি ক্রিয়েটিভের জন্য লিখি খাঁটি বাংলা সেলস কপি এবং সাজাই এমন পরিচ্ছন্ন ডিজাইন যা দেখে মানুষ বিশ্বাস পায়।' 
    },
    { 
      id: '3', 
      sort_order: 3, 
      title_en: '3. 48-Hour Rapid Turnaround', 
      title_bn: '৩. ৪৮ ঘণ্টার দ্রুত ডেলিভারি', 
      desc_en: 'Strict turnaround. Within 48 hours, you receive ready-to-launch Meta statics and bundle graphics with zero back-and-forth delays.', 
      desc_bn: 'সময়ের কোনো অপচয় নেই। মাত্র ৪৮ ঘণ্টায় আপনি ফিড ও স্টোরি সাইজের মেটা-কমপ্লায়েন্ট রেডি ক্রিয়েটিভ পেয়ে যাবেন—যা সরাসরি অ্যাডম্যানেজারে চালানোর উপযোগী।' 
    },
    { 
      id: '4', 
      sort_order: 4, 
      title_en: '4. Launch, Cut CPR & Scale', 
      title_bn: '৪. লঞ্চ ও লাভজনক সেলস স্কেলিং', 
      desc_en: 'Launch the tested angles. We analyze performance data to scale winning creatives and keep your cost-per-order predictably low.', 
      desc_bn: 'আপনি বা আপনার এজেন্সি অ্যাড লাইভ করবেন। আমরা রেজাল্ট দেখে উইনিং অ্যাডের ওপর জোর দিই, যাতে কম খরচে প্রতিদিন বেশি ফুল-প্রাইস সেলস নিশ্চিত হয়।' 
    },
  ];

  const displaySteps = defaultSteps;

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
