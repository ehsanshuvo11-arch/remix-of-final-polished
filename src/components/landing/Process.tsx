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
    { id: '1', sort_order: 1, title_en: 'Discovery', title_bn: 'অনুসন্ধান', desc_en: 'We learn your brand, your product, and your audience. No generic templates — everything starts with understanding.', desc_bn: 'আপনার ব্র্যান্ড, আপনার পণ্য, আপনার দর্শক — সব আগে বুঝে নিই।' },
    { id: '2', sort_order: 2, title_en: 'Strategy', title_bn: 'কৌশল', desc_en: 'We decide the visual direction — tone, reference, aesthetic system — before a single pixel is placed.', desc_bn: 'একটি পিক্সেল বসানোর আগেই ঠিক হয় ভিজ্যুয়াল দিকনির্দেশনা।' },
    { id: '3', sort_order: 3, title_en: 'Design', title_bn: 'ডিজাইন', desc_en: 'Execution with precision. Clean, structured, intentional — every element earns its place in the composition.', desc_bn: 'নির্ভুলভাবে বাস্তবায়ন। পরিচ্ছন্ন, কাঠামোবদ্ধ, উদ্দেশ্যমূলক।' },
    { id: '4', sort_order: 4, title_en: 'Delivery', title_bn: 'ডেলিভারি', desc_en: 'Final files, ready to use. Organized, properly sized, and formatted for every platform you need.', desc_bn: 'চূড়ান্ত ফাইল, ব্যবহারের জন্য প্রস্তুত।' },
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  // Process headings/labels locked to English in all locales
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = content?.titleLine1En ?? 'A process built on';
  const line2 = content?.titleLine2En ?? 'precision.';

  return (
    <div className="bg-secondary">
      <section id="process" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <MotionReveal>
          <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
            {content?.labelEn ?? 'How It Works'}
          </p>
        </MotionReveal>
        <h2 lang={isBn ? 'bn' : 'en'} className="font-heading font-normal text-primary mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-14">
          {displaySteps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StepCard({ step, index }: { step: ProcessStep; index: number }) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <MotionReveal delay={0.12 * (index + 1)}>
      <div
        className="relative pt-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_10px_36px_rgba(0,0,0,0.05)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-border before:transition-colors before:duration-700 hover:before:bg-accent"
      >
        <div className="font-heading text-[40px] font-light text-primary/20 mb-4">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div lang="en" className="font-heading text-xl font-medium text-primary mb-2.5">
          {step.title_en}
        </div>
        <p lang="en" style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[13px] leading-[1.75] text-muted-foreground">
          {step.desc_en}
        </p>
      </div>
    </MotionReveal>
  );
}
