import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import type { ProcessMetaContent, ProcessStep } from '@/types/database';

interface ProcessProps {
  steps: ProcessStep[];
  content?: ProcessMetaContent | null;
}

export default function Process({ steps, content }: ProcessProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';

  const defaultSteps: ProcessStep[] = [
    { id: '1', sort_order: 1, title_en: 'Discovery', title_bn: 'ডিসকভারি', desc_en: 'We learn your brand, your product, and your audience. No generic templates — everything starts with understanding.', desc_bn: 'আমরা আপনার ব্র্যান্ড, প্রোডাক্ট এবং অডিয়েন্সকে গভীরভাবে স্টাডি করি। কোনো জেনেরিক টেমপ্লেট নয়—আমাদের সবকিছুর শুরু হয় ব্র্যান্ডকে পুরোপুরি বোঝার মাধ্যমে।' },
    { id: '2', sort_order: 2, title_en: 'Strategy', title_bn: 'স্ট্র্যাটেজি', desc_en: 'We decide the visual direction — tone, reference, aesthetic system — before a single pixel is placed.', desc_bn: 'ক্যানভাসে একটি পিক্সেল বসানোর আগেও আমরা ভিজ্যুয়াল ডিরেকশন—ব্র্যান্ড টোন, রেফারেন্স এবং ওভারঅল অ্যাসথেটিক্স (Aesthetics) চূড়ান্ত করি।' },
    { id: '3', sort_order: 3, title_en: 'Design', title_bn: 'ডিজাইন', desc_en: 'Execution with precision. Clean, structured, intentional — every element earns its place in the composition.', desc_bn: 'নিখুঁত এক্সিকিউশন। ক্লিন, গোছানো এবং অর্থবহ—ডিজাইনের প্রতিটি এলিমেন্ট খুব ভেবেচিন্তে তার নির্দিষ্ট জায়গায় বসানো হয়।' },
    { id: '4', sort_order: 4, title_en: 'Delivery', title_bn: 'ডেলিভারি', desc_en: 'Final files, ready to use. Organized, properly sized, and formatted for every platform you need.', desc_bn: 'রেডি-টু-ইউজ ফাইনাল ফাইল। আপনার প্রয়োজনীয় সব প্ল্যাটফর্মের জন্য একদম পারফেক্ট সাইজ, ফরম্যাট এবং ওয়েল-অর্গানাইজড অবস্থায় আমরা প্রোজেক্ট বুঝিয়ে দিই।' },
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  // Process headings/labels locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = content?.titleLine1En ?? 'A process built on';
  const line2 = content?.titleLine2En ?? 'precision.';

  return (
    <div className="bg-secondary">
      <section id="process" className="py-16 md:py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 mt-10 md:mt-14">
          {displaySteps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>
      </section>
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
