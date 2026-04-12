import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import type { ProcessMetaContent, ProcessStep } from '@/types/database';

interface ProcessProps {
  steps: ProcessStep[];
  content?: ProcessMetaContent | null;
}

export default function Process({ steps, content }: ProcessProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const labelRef = useScrollReveal();
  const titleRef = useScrollReveal(0.1);

  const defaultSteps: ProcessStep[] = [
    { id: '1', sort_order: 1, title_en: 'Discovery', title_bn: 'অনুসন্ধান', desc_en: 'We learn your brand, your product, and your audience. No generic templates — everything starts with understanding.', desc_bn: 'আপনার ব্র্যান্ড, আপনার পণ্য, আপনার দর্শক — সব আগে বুঝে নিই।' },
    { id: '2', sort_order: 2, title_en: 'Strategy', title_bn: 'কৌশল', desc_en: 'We decide the visual direction — tone, reference, aesthetic system — before a single pixel is placed.', desc_bn: 'একটি পিক্সেল বসানোর আগেই ঠিক হয় ভিজ্যুয়াল দিকনির্দেশনা।' },
    { id: '3', sort_order: 3, title_en: 'Design', title_bn: 'ডিজাইন', desc_en: 'Execution with precision. Clean, structured, intentional — every element earns its place in the composition.', desc_bn: 'নির্ভুলভাবে বাস্তবায়ন। পরিচ্ছন্ন, কাঠামোবদ্ধ, উদ্দেশ্যমূলক।' },
    { id: '4', sort_order: 4, title_en: 'Delivery', title_bn: 'ডেলিভারি', desc_en: 'Final files, ready to use. Organized, properly sized, and formatted for every platform you need.', desc_bn: 'চূড়ান্ত ফাইল, ব্যবহারের জন্য প্রস্তুত।' },
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-secondary">
      <section id="process" className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto">
        <p ref={labelRef} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
          {t(content?.labelEn ?? 'How It Works', content?.labelBn ?? 'কীভাবে কাজ হয়')}
        </p>
        <h2 ref={titleRef} className="font-heading font-normal text-primary mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
          {t(content?.titleLine1En ?? 'A process built on', content?.titleLine1Bn ?? 'নির্ভুলতার উপর')}<br />
          <em className="italic">{t(content?.titleLine2En ?? 'precision.', content?.titleLine2Bn ?? 'গড়া প্রক্রিয়া।')}</em>
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
  const ref = useScrollReveal(0.1 * (index + 1));

  return (
    <div
      ref={ref}
      className="relative pt-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_10px_36px_rgba(0,0,0,0.05)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-border before:transition-colors before:duration-500 hover:before:bg-accent"
    >
      <div className="font-heading text-[40px] font-light text-primary/20 mb-4">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="font-heading text-xl font-medium text-primary mb-2.5">
        {t(step.title_en, step.title_bn)}
      </div>
      <p className="text-[13px] leading-[1.75] text-muted-foreground">
        {t(step.desc_en, step.desc_bn)}
      </p>
    </div>
  );
}
