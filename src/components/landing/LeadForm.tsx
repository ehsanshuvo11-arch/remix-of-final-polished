import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { sendInquiryEmail } from '@/lib/email';
import MagneticButton from '@/components/landing/MagneticButton';
import { useUILabels } from '@/hooks/use-site-content';
import type { UILabelsContent } from '@/types/database';

const easing = [0.16, 1, 0.3, 1] as const;

interface FormState {
  client_name: string;
  brand_name: string;
  store_url: string;
  budget_range: string;
  project_details: string;
  email: string;
}

const initialState: FormState = {
  client_name: '',
  brand_name: '',
  store_url: '',
  budget_range: '',
  project_details: '',
  email: '',
};

const pick = (labels: UILabelsContent | null | undefined, key: keyof UILabelsContent, fallback: string) =>
  (labels?.[key] as string | undefined)?.trim() || fallback;

export default function LeadForm({ isBn = false }: { isBn?: boolean }) {
  const { data: labels } = useUILabels();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const TOTAL = 3;
  const t = (en: string, bn: string) => (isBn ? bn : en);
  const L = (keyEn: keyof UILabelsContent, keyBn: keyof UILabelsContent, en: string, bn: string) =>
    isBn ? pick(labels, keyBn, bn) : pick(labels, keyEn, en);

  const BUDGETS = [
    { value: 'below-20k', label: L('budget1En', 'budget1Bn', 'Below 20,000 BDT', '২০,০০০ টাকার নিচে') },
    { value: '20k-50k',   label: L('budget2En', 'budget2Bn', '20,000 – 50,000 BDT', '২০,০০০ – ৫০,০০০ টাকা') },
    { value: '50k-plus',  label: L('budget3En', 'budget3Bn', '50,000 BDT and above', '৫০,০০০ টাকা ও তার বেশি') },
    { value: 'not-sure',  label: L('budget4En', 'budget4Bn', "I'm not sure yet", 'এখনো নিশ্চিত নই') },
  ];

  const update = (field: keyof FormState, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const stepValid = useMemo(() => {
    if (step === 0) return data.client_name.trim() && data.brand_name.trim();
    if (step === 1) return !!data.budget_range && data.project_details.trim().length >= 10;
    if (step === 2) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
    return false;
  }, [step, data]);

  const next = () => stepValid && setStep((s) => Math.min(s + 1, TOTAL - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!stepValid || submitting) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      client_name: data.client_name.trim(),
      brand_name: data.brand_name.trim(),
      email: data.email.trim(),
      store_url: data.store_url.trim() || null,
      budget_range: data.budget_range,
      project_details: data.project_details.trim(),
    };
    const { error: insertError } = await supabase.from('inquiries').insert({
      ...payload,
      status: 'new',
    });
    setSubmitting(false);
    if (insertError) {
      setError(
        (insertError as { code?: string }).code === '42P01'
          ? "We couldn't reach the inbox just yet — please try again in a moment."
          : insertError.message,
      );
      return;
    }
    void sendInquiryEmail(payload);
    setDone(true);
  };

  if (done) return <ThankYou isBn={isBn} labels={labels ?? null} onReset={() => { setDone(false); setStep(0); setData(initialState); }} />;

  const progressPct = ((step + 1) / TOTAL) * 100;

  const stepOfTemplate = L(
    'leadFormStepOfEn',
    'leadFormStepOfBn',
    'Step {n} of {total}',
    'ধাপ {n} / {total}',
  );
  const stepOfText = stepOfTemplate
    .replace('{n}', String(step + 1))
    .replace('{total}', String(TOTAL));

  return (
    <div className="relative">
      {/* Bengali-only premium form heading */}
      {isBn && (
        <div className="mb-8" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          <h3 lang="bn" className="font-heading text-primary-foreground text-[clamp(22px,3vw,30px)] font-light leading-tight mb-3">
            {pick(labels, 'leadFormIntroTitleBn', 'পার্টনারশিপ ইনকোয়ারি')}
          </h3>
          <p lang="bn" className="text-primary-foreground/55 text-[13px] md:text-[14px] leading-[1.85]">
            {pick(labels, 'leadFormIntroDescBn', 'আমরা প্রতিটি ব্র্যান্ডের সাথে অত্যন্ত নিবিড়ভাবে কাজ করি, তাই আমাদের ক্লায়েন্ট স্লট খুবই সীমিত। আপনার স্কিনকেয়ার ব্র্যান্ডের ভিশন এবং লক্ষ্য আমাদের সাথে শেয়ার করুন।')}
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-[10px] tracking-[3px] uppercase text-primary-foreground/40 mb-3">
          <span>{stepOfText}</span>
          <span className="font-heading italic text-primary-foreground/60">
            {step === 0 && L('leadFormStepBrandEn', 'leadFormStepBrandBn', 'Brand', 'ব্র্যান্ড')}
            {step === 1 && L('leadFormStepVisionEn', 'leadFormStepVisionBn', 'Vision', 'ভিশন')}
            {step === 2 && L('leadFormStepContactEn', 'leadFormStepContactBn', 'Contact', 'যোগাযোগ')}
          </span>
        </div>
        <div className="h-px w-full bg-primary-foreground/10 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: easing }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="min-h-[360px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: easing }}
            className="flex flex-col gap-4"
          >
            {step === 0 && (
              <>
                <StepHeading
                  eyebrow={L('leadFormStep1EyebrowEn', 'leadFormStep1EyebrowBn', 'Tell us about you', 'আপনার সম্পর্কে')}
                  title={L('leadFormStep1TitleEn', 'leadFormStep1TitleBn', 'Who are we talking to?', 'কে যোগাযোগ করছেন?')}
                />
                <PolishedInput
                  value={data.client_name}
                  onChange={(v) => update('client_name', v)}
                  placeholder={L('leadFormNameEn', 'leadFormNameBn', 'Your full name', 'আপনার নাম')}
                />
                <PolishedInput
                  value={data.brand_name}
                  onChange={(v) => update('brand_name', v)}
                  placeholder={L('leadFormBrandNameEn', 'leadFormBrandNameBn', 'Brand or store name', 'আপনার ব্র্যান্ডের নাম')}
                />
                <PolishedInput
                  value={data.store_url}
                  onChange={(v) => update('store_url', v)}
                  placeholder={L('leadFormStoreUrlEn', 'leadFormStoreUrlBn', 'Website / Instagram (optional)', 'ওয়েবসাইট / ইনস্টাগ্রাম লিংক')}
                />
              </>
            )}

            {step === 1 && (
              <>
                <StepHeading
                  eyebrow={L('leadFormStep2EyebrowEn', 'leadFormStep2EyebrowBn', 'Investment & vision', 'প্রোজেক্টের লক্ষ্য ও ভিশন')}
                  title={L('leadFormStep2TitleEn', 'leadFormStep2TitleBn', "What's the scope?", 'প্রোজেক্টের পরিধি?')}
                />
                <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-1">
                  {L('leadFormBudgetLabelEn', 'leadFormBudgetLabelBn', 'Estimated budget', 'আনুমানিক বাজেট')}
                </p>
                <div className="grid gap-2">
                  {BUDGETS.map((b) => {
                    const active = data.budget_range === b.value;
                    return (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => update('budget_range', b.value)}
                        className={`text-left px-5 py-4 border rounded-sm text-sm transition-all duration-500 min-h-[48px] ${
                          active
                            ? 'border-accent bg-accent/10 text-primary-foreground'
                            : 'border-primary-foreground/10 text-primary-foreground/70 hover:border-primary-foreground/30 hover:bg-primary-foreground/5'
                        }`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-3.5 h-3.5 rounded-full border ${active ? 'border-accent bg-accent' : 'border-primary-foreground/30'}`} />
                          {b.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <PolishedTextarea
                  value={data.project_details}
                  onChange={(v) => update('project_details', v)}
                  placeholder={L(
                    'leadFormProjectPlaceholderEn',
                    'leadFormProjectPlaceholderBn',
                    'Describe your project — goals, timeline, anything we should know.',
                    'আপনার ব্র্যান্ডকে নেক্সট লেভেলে নিয়ে যাওয়ার জন্য আপনি কী ভাবছেন, তা সংক্ষেপে লিখুন...',
                  )}
                  rows={5}
                />
              </>
            )}

            {step === 2 && (
              <>
                <StepHeading
                  eyebrow={L('leadFormStep3EyebrowEn', 'leadFormStep3EyebrowBn', 'Almost done', 'প্রায় শেষ')}
                  title={L('leadFormStep3TitleEn', 'leadFormStep3TitleBn', 'Where can we reach you?', 'বিজনেস ইমেইল')}
                />
                <PolishedInput
                  type="email"
                  value={data.email}
                  onChange={(v) => update('email', v)}
                  placeholder={L('leadFormEmailPlaceholderEn', 'leadFormEmailPlaceholderBn', 'Email address', 'hello@yourbrand.com')}
                />
                <p className="text-[12px] text-primary-foreground/40 leading-relaxed mt-1">
                  {L(
                    'leadFormReassuranceEn',
                    'leadFormReassuranceBn',
                    'We respond personally within 24 hours. Your details stay private.',
                    'আমরা ২৪ ঘণ্টার মধ্যে ব্যক্তিগতভাবে উত্তর দিই। আপনার তথ্য গোপন থাকে।',
                  )}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-accent/90 text-xs mt-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-primary-foreground/10">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className={`text-[11px] uppercase text-primary-foreground/50 hover:text-primary-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed min-h-[44px] px-2 -ml-2 ${isBn ? 'tracking-[1px]' : 'tracking-[3px]'}`}
        >
          ← {L('leadFormBackEn', 'leadFormBackBn', 'Back', 'পিছনে')}
        </button>

        {step < TOTAL - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!stepValid}
            className={`px-8 py-3.5 bg-accent text-accent-foreground text-[11px] uppercase rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(251,146,60,0.35)] disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed ${isBn ? 'tracking-[1px]' : 'tracking-[3px]'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            {L('leadFormContinueEn', 'leadFormContinueBn', 'Continue', 'এগিয়ে যান')}
          </button>
        ) : !stepValid || submitting ? (
          <button
            type="button"
            disabled
            className="px-8 py-3.5 bg-accent text-accent-foreground text-[11px] tracking-[3px] uppercase rounded-sm transition-all duration-500 opacity-30 cursor-not-allowed min-h-[48px]"
          >
            {submitting
              ? L('leadFormSendingEn', 'leadFormSendingBn', 'Sending…', 'সাবমিট হচ্ছে...')
              : L('leadFormSubmitEn', 'leadFormSubmitBn', 'Request Consultation', 'রিকোয়েস্ট সাবমিট করুন')}
          </button>
        ) : (
          <MagneticButton
            onClick={submit}
            className="px-8 py-3.5 bg-accent text-accent-foreground text-[11px] tracking-[3px] uppercase rounded-sm transition-shadow duration-500 hover:shadow-[0_10px_30px_rgba(251,146,60,0.35)] min-h-[48px] inline-flex items-center justify-center"
          >
            {L('leadFormSubmitEn', 'leadFormSubmitBn', 'Request Consultation', 'রিকোয়েস্ট সাবমিট করুন')}
          </MagneticButton>
        )}
      </div>
    </div>
  );
}

// ───────── building blocks ─────────

function StepHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  const isBn = /[\u0980-\u09FF]/.test(eyebrow);
  return (
    <div className="mb-3">
      <p
        lang={isBn ? 'bn' : 'en'}
        className={`text-[10px] text-accent mb-2 ${isBn ? 'tracking-normal' : 'tracking-[3px] uppercase'}`}
        style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: '0' } : undefined}
      >
        {eyebrow}
      </p>
      <h3 className="font-heading italic text-primary-foreground text-[clamp(22px,2.5vw,28px)] font-light leading-tight">
        {title}
      </h3>
    </div>
  );
}

function PolishedInput({
  value, onChange, placeholder, type = 'text', autoFocus = false,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoFocus?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-5 py-4 text-base md:text-sm font-light outline-none rounded-sm transition-all duration-500 placeholder:text-primary-foreground/30 focus:border-accent focus:bg-primary-foreground/[0.08] focus:shadow-[0_0_0_3px_rgba(251,146,60,0.12)] min-h-[48px]"
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', fontSize: 'max(16px, 0.875rem)' }}
    />
  );
}

function PolishedTextarea({
  value, onChange, placeholder, rows = 4,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-5 py-4 text-base md:text-sm font-light outline-none rounded-sm resize-none transition-all duration-500 placeholder:text-primary-foreground/30 focus:border-accent focus:bg-primary-foreground/[0.08] focus:shadow-[0_0_0_3px_rgba(251,146,60,0.12)]"
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', fontSize: 'max(16px, 0.875rem)' }}
    />
  );
}

function ThankYou({ isBn, labels, onReset }: { isBn: boolean; labels: UILabelsContent | null; onReset: () => void }) {
  const L = (keyEn: keyof UILabelsContent, keyBn: keyof UILabelsContent, en: string, bn: string) =>
    isBn ? pick(labels, keyBn, bn) : pick(labels, keyEn, en);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easing }}
      className="text-center py-10"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: easing }}
        className="w-16 h-16 mx-auto mb-6 rounded-full border border-accent/40 flex items-center justify-center"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </motion.div>
      <p className="text-[10px] tracking-[4px] uppercase text-accent mb-3">
        {L('leadFormReceivedEn', 'leadFormReceivedBn', 'Received', 'প্রাপ্ত')}
      </p>
      <h3 className="font-heading italic text-primary-foreground text-[clamp(28px,3.5vw,40px)] font-light leading-tight mb-4">
        {L('leadFormThankTitleEn', 'leadFormThankTitleBn', 'Thank you. We\u2019ll be in touch.', 'ধন্যবাদ। আমরা শীঘ্রই যোগাযোগ করব।')}
      </h3>
      <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-md mx-auto mb-8">
        {L(
          'leadFormThankSubEn',
          'leadFormThankSubBn',
          'Your inquiry just landed in our studio. Expect a personal reply within 24 hours.',
          'আপনার বার্তা আমাদের স্টুডিওতে পৌঁছেছে। ২৪ ঘণ্টার মধ্যে ব্যক্তিগত উত্তর পাবেন।',
        )}
      </p>
      <button
        onClick={onReset}
        className="text-[11px] tracking-[3px] uppercase text-accent border border-accent px-6 py-3 min-h-[44px] rounded-sm shadow-[0_0_0_rgba(251,146,60,0)] hover:shadow-[0_0_18px_rgba(251,146,60,0.45)] hover:border-accent transition-all duration-300 ease-in-out"
      >
        {L('leadFormResetEn', 'leadFormResetBn', 'Submit another inquiry', 'আরেকটি বার্তা পাঠান')}
      </button>
    </motion.div>
  );
}
