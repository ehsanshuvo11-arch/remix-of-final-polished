import { useState, useMemo, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { sendInquiryEmail } from '@/lib/email';
import MagneticButton from '@/components/landing/MagneticButton';
import { useUILabels } from '@/hooks/use-site-content';
import { INQUIRY_PREFILL_EVENT, type InquiryPrefillDetail } from '@/lib/inquiry-events';
import type { UILabelsContent } from '@/types/database';
import { ShieldCheck, Clock, Award, MessageCircle } from 'lucide-react';

const easing = [0.16, 1, 0.3, 1] as const;

interface FormState {
  client_name: string;
  brand_name: string;
  whatsapp: string;
  store_url: string;
  service_type: string;
  budget_range: string;
  project_details: string;
  diagnosed_revenue_loss: string;
  email: string;
}

const initialState: FormState = {
  client_name: '',
  brand_name: '',
  whatsapp: '',
  store_url: '',
  service_type: '',
  budget_range: '',
  project_details: '',
  diagnosed_revenue_loss: '',
  email: '',
};

const pick = (labels: UILabelsContent | null | undefined, key: keyof UILabelsContent, fallback: string) =>
  (labels?.[key] as string | undefined)?.trim() || fallback;

const SERVICE_CHIPS = [
  { id: 'Social Media Retainer', en: 'Social Media Retainer', bn: 'সোশ্যাল মিডিয়া রিটেইনার' },
  { id: 'Storefront & Brand Identity', en: 'Storefront & Brand Identity', bn: 'স্টোরফ্রন্ট ও ব্র্যান্ড আইডেন্টিটি' },
  { id: 'White-Label Agency Partner', en: 'White-Label Agency Partner', bn: 'হোয়াইট-লেবেল এজেন্সি পার্টনার' },
  { id: 'Free 5-Min Video Teardown', en: 'Free 5-Min Video Teardown', bn: 'ফ্রি ৫-মিনিট ভিডিও অডিট' },
];

export default function LeadForm({ isBn = false }: { isBn?: boolean }) {
  const { data: labels } = useUILabels();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const TOTAL = 3;
  const L = (keyEn: keyof UILabelsContent, keyBn: keyof UILabelsContent, en: string, bn: string) =>
    isBn ? pick(labels, keyBn, bn) : pick(labels, keyEn, en);

  const BUDGETS = [
    { value: 'below-20k', label: L('budget1En', 'budget1Bn', 'Below 20,000 BDT', '২০,০০০ টাকার নিচে') },
    { value: '20k-50k',   label: L('budget2En', 'budget2Bn', '20,000 – 50,000 BDT', '২০,০০০ – ৫০,০০০ টাকা') },
    { value: '50k-plus',  label: L('budget3En', 'budget3Bn', '50,000 BDT and above', '৫০,০০০ টাকা ও তার বেশি') },
    { value: 'not-sure',  label: L('budget4En', 'budget4Bn', "I'm not sure yet", 'এখনো নিশ্চিত নই') },
  ];

  // Listen for prefill events from ROAS calculator, services, or pricing
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<InquiryPrefillDetail>).detail;
      if (!detail) return;
      setData((prev) => ({
        ...prev,
        service_type: detail.service || prev.service_type,
        budget_range: detail.budget || prev.budget_range,
        diagnosed_revenue_loss: detail.revenueLost || prev.diagnosed_revenue_loss,
        project_details: detail.note
          ? prev.project_details ? `${prev.project_details}\n\n${detail.note}` : detail.note
          : prev.project_details,
      }));
    };
    window.addEventListener(INQUIRY_PREFILL_EVENT, handler);
    return () => window.removeEventListener(INQUIRY_PREFILL_EVENT, handler);
  }, []);

  const update = (field: keyof FormState, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const stepValid = useMemo(() => {
    if (step === 0) return data.client_name.trim().length > 0 && data.brand_name.trim().length > 0;
    if (step === 1) return !!data.budget_range;
    if (step === 2) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) || data.whatsapp.trim().length >= 8;
    return false;
  }, [step, data]);

  const next = () => stepValid && setStep((s) => Math.min(s + 1, TOTAL - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!stepValid || submitting) return;
    setSubmitting(true);
    setError(null);

    const metaSections: string[] = [];
    if (data.service_type) metaSections.push(`Service Focus: ${data.service_type}`);
    if (data.whatsapp) metaSections.push(`WhatsApp / Phone: ${data.whatsapp}`);
    if (data.diagnosed_revenue_loss) metaSections.push(`Diagnosed Revenue Loss: ${data.diagnosed_revenue_loss}`);

    const compiledScope = metaSections.length > 0
      ? `${metaSections.join(' | ')}\n\n${data.project_details.trim() || 'Direct Project Consultation Request'}`
      : (data.project_details.trim() || 'Direct Project Consultation Request');

    const emailToUse = data.email.trim() || `${(data.whatsapp.replace(/\D/g, '') || 'client')}@inquiry.polished.studio`;

    const payload = {
      client_name: data.client_name.trim(),
      brand_name: data.brand_name.trim(),
      email: emailToUse,
      whatsapp: data.whatsapp.trim(),
      service_type: data.service_type,
      store_url: data.store_url.trim() || null,
      budget_range: data.budget_range,
      project_details: compiledScope,
      diagnosed_revenue_loss: data.diagnosed_revenue_loss,
    };

    const { error: insertError } = await supabase.from('inquiries').insert({
      client_name: payload.client_name,
      brand_name: payload.brand_name,
      email: payload.email,
      store_url: payload.store_url,
      budget_range: payload.budget_range,
      project_details: payload.project_details,
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
      {/* Diagnosed Revenue Loss Banner */}
      {data.diagnosed_revenue_loss && (
        <div className="mb-6 p-4 rounded-sm bg-accent/15 border border-accent/40 flex items-start gap-3">
          <span className="text-xl">📊</span>
          <div>
            <p className="text-[11px] font-bold text-accent uppercase tracking-wider">
              {isBn ? 'হিসাবকৃত সম্ভাব্য রেভিনিউ লিক' : 'Diagnosed Revenue Opportunity'}
            </p>
            <p className="text-xs md:text-sm text-primary-foreground/90 font-light mt-0.5">
              {isBn
                ? `আপনি প্রতি মাসে আনুমানিক ${data.diagnosed_revenue_loss} রেভিনিউ হারাচ্ছেন। আমাদের টিম এটি রিকভার করার স্ট্র্যাটেজি তৈরি করবে।`
                : `You're leaving ~${data.diagnosed_revenue_loss} on the table monthly. We will craft a high-converting creative strategy to reclaim this revenue.`}
            </p>
          </div>
        </div>
      )}

      {/* Bengali-only premium form heading */}
      {isBn && (
        <div className="mb-8" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          <h3 lang="bn" className="font-heading text-primary-foreground text-[clamp(22px,3vw,30px)] font-light leading-tight mb-2">
            {pick(labels, 'leadFormIntroTitleBn', 'পার্টনারশিপ ইনকোয়ারি ও ফ্রি অডিট')}
          </h3>
          <p lang="bn" className="text-primary-foreground/60 text-[13px] md:text-[14px] leading-[1.85]">
            {pick(labels, 'leadFormIntroDescBn', 'আমরা প্রতিটি ব্র্যান্ডের জন্য সম্পূর্ণ কাস্টম ডিজাইন তৈরি করি। আপনার ব্র্যান্ড ও অ্যাসেটের তথ্য শেয়ার করুন—আমরা বিশ্লেষণ করে জানাব।')}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-[10px] tracking-[3px] uppercase text-primary-foreground/40 mb-3">
          <span>{stepOfText}</span>
          <span className="font-heading italic text-primary-foreground/75 font-medium">
            {step === 0 && L('leadFormStepBrandEn', 'leadFormStepBrandBn', 'Brand & Contact', 'ব্র্যান্ড ও যোগাযোগ')}
            {step === 1 && L('leadFormStepVisionEn', 'leadFormStepVisionBn', 'Scope & Investment', 'স্কোপ ও বাজেট')}
            {step === 2 && L('leadFormStepContactEn', 'leadFormStepContactBn', 'Final Confirmation', 'কনফার্মেশন')}
          </span>
        </div>
        <div className="h-1 w-full bg-primary-foreground/10 overflow-hidden rounded-full">
          <m.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: easing }}
          />
        </div>
      </div>

      {/* Steps Container */}
      <div className="min-h-[360px]">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
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
                  eyebrow={L('leadFormStep1EyebrowEn', 'leadFormStep1EyebrowBn', 'Step 1 · Brand Profile', 'ধাপ ১ · ব্র্যান্ড প্রোফাইল')}
                  title={L('leadFormStep1TitleEn', 'leadFormStep1TitleBn', 'Who are we partnering with?', 'কার সাথে কথা বলছি?')}
                />
                <PolishedInput
                  value={data.client_name}
                  onChange={(v) => update('client_name', v)}
                  placeholder={L('leadFormNameEn', 'leadFormNameBn', 'Your full name *', 'আপনার পুরো নাম *')}
                />
                <PolishedInput
                  value={data.brand_name}
                  onChange={(v) => update('brand_name', v)}
                  placeholder={L('leadFormBrandNameEn', 'leadFormBrandNameBn', 'Brand or company name *', 'আপনার ব্র্যান্ডের নাম *')}
                />
                <PolishedInput
                  value={data.whatsapp}
                  onChange={(v) => update('whatsapp', v)}
                  placeholder={isBn ? 'হোয়াটসঅ্যাপ নম্বর (যেমন: 017... দ্রুত মেসেজের জন্য)' : 'WhatsApp / Phone (+880 1... for rapid WhatsApp response)'}
                />
                <PolishedInput
                  value={data.store_url}
                  onChange={(v) => update('store_url', v)}
                  placeholder={L('leadFormStoreUrlEn', 'leadFormStoreUrlBn', 'Website / Instagram link (optional)', 'ওয়েবসাইট / ইনস্টাগ্রাম লিংক')}
                />
              </>
            )}

            {step === 1 && (
              <>
                <StepHeading
                  eyebrow={L('leadFormStep2EyebrowEn', 'leadFormStep2EyebrowBn', 'Step 2 · Investment & Scope', 'ধাপ ২ · ইনভেস্টমেন্ট ও স্কোপ')}
                  title={L('leadFormStep2TitleEn', 'leadFormStep2TitleBn', "What are your primary goals?", 'প্রজেক্টের লক্ষ্য ও বাজেট?')}
                />

                {/* Service Chips */}
                <div>
                  <p className="text-[10px] tracking-[2px] uppercase text-primary-foreground/50 mb-2">
                    {isBn ? 'সার্ভিস ফোকাস নির্বাচন করুন (ঐচ্ছিক)' : 'Select Primary Focus (Optional)'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {SERVICE_CHIPS.map((chip) => {
                      const selected = data.service_type === chip.id;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => update('service_type', selected ? '' : chip.id)}
                          className={`text-left p-3 rounded-sm text-xs transition-all ${
                            selected
                              ? 'border border-accent bg-accent/20 text-accent font-medium'
                              : 'border border-primary-foreground/15 text-primary-foreground/70 hover:border-primary-foreground/30'
                          }`}
                        >
                          {isBn ? chip.bn : chip.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[10px] tracking-[2px] uppercase text-primary-foreground/50 mt-2 mb-1">
                  {L('leadFormBudgetLabelEn', 'leadFormBudgetLabelBn', 'Estimated monthly budget *', 'আনুমানিক মাসিক বাজেট *')}
                </p>
                <div className="grid gap-2">
                  {BUDGETS.map((b) => {
                    const active = data.budget_range === b.value;
                    return (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => update('budget_range', b.value)}
                        className={`text-left px-5 py-3.5 border rounded-sm text-sm transition-all duration-300 min-h-[46px] ${
                          active
                            ? 'border-accent bg-accent/15 text-primary-foreground font-medium'
                            : 'border-primary-foreground/10 text-primary-foreground/70 hover:border-primary-foreground/30 hover:bg-primary-foreground/5'
                        }`}
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
                    'Brief notes on your goals, bottlenecks, or timeline (optional)...',
                    'আপনার ব্র্যান্ডের বর্তমান চ্যালেঞ্জ ও লক্ষ্য সম্পর্কে সংক্ষেপে লিখুন (ঐচ্ছিক)...',
                  )}
                  rows={3}
                />
              </>
            )}

            {step === 2 && (
              <>
                <StepHeading
                  eyebrow={L('leadFormStep3EyebrowEn', 'leadFormStep3EyebrowBn', 'Step 3 · Delivery Channel', 'ধাপ ৩ · যোগাযোগের মাধ্যম')}
                  title={L('leadFormStep3TitleEn', 'leadFormStep3TitleBn', 'Where should we send your strategy proposal?', 'প্রপোজাল কোথায় পাঠাব?')}
                />
                <PolishedInput
                  type="email"
                  value={data.email}
                  onChange={(v) => update('email', v)}
                  placeholder={L('leadFormEmailPlaceholderEn', 'leadFormEmailPlaceholderBn', 'Business Email Address *', 'বিজনেস ইমেইল অ্যাড্রেস *')}
                  autoFocus
                />
                {data.whatsapp && (
                  <div className="text-xs text-accent/90 flex items-center gap-2 px-1">
                    <span>✓</span>
                    <span>{isBn ? `হোয়াটসঅ্যাপ নম্বর সংরক্ষিত: ${data.whatsapp}` : `WhatsApp confirmed: ${data.whatsapp}`}</span>
                  </div>
                )}
                <p className="text-[12px] text-primary-foreground/60 leading-relaxed mt-1">
                  {L(
                    'leadFormReassuranceEn',
                    'leadFormReassuranceBn',
                    'Our Creative Director personally reviews every inquiry within 24 hours. Your brand data is strictly protected.',
                    'আমাদের ক্রিয়েটিভ ডিরেক্টর ২৪ ঘণ্টার মধ্যে প্রতিটি ইনকোয়ারি ব্যক্তিগতভাবে রিভিউ করবেন। আপনার তথ্য ১০০% নিরাপদ।',
                  )}
                </p>
              </>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <m.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-accent text-xs mt-3"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
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
            className={`px-8 py-3.5 bg-accent text-accent-foreground text-[11px] uppercase rounded-sm transition-all duration-300 font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,146,60,0.4)] disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed ${isBn ? 'tracking-[1px]' : 'tracking-[2px]'}`}
          >
            {L('leadFormContinueEn', 'leadFormContinueBn', 'Continue', 'এগিয়ে যান')} →
          </button>
        ) : !stepValid || submitting ? (
          <button
            type="button"
            disabled
            className="px-8 py-3.5 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase rounded-sm opacity-30 cursor-not-allowed min-h-[48px] font-semibold"
          >
            {submitting
              ? L('leadFormSendingEn', 'leadFormSendingBn', 'Submitting…', 'সাবমিট হচ্ছে...')
              : L('leadFormSubmitEn', 'leadFormSubmitBn', 'Request Strategy Proposal', 'প্রপোজাল রিকোয়েস্ট করুন')}
          </button>
        ) : (
          <MagneticButton
            onClick={submit}
            className="px-8 py-3.5 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase rounded-sm transition-shadow duration-300 hover:shadow-[0_10px_32px_rgba(251,146,60,0.45)] min-h-[48px] inline-flex items-center justify-center font-semibold"
          >
            {L('leadFormSubmitEn', 'leadFormSubmitBn', 'Request Strategy Proposal', 'প্রপোজাল রিকোয়েস্ট করুন')}
          </MagneticButton>
        )}
      </div>

      {/* Trust & Risk Reversal Seals */}
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-primary-foreground/60 text-[11px]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{isBn ? '২৪ ঘণ্টায় রেসপন্স গ্যারান্টি' : 'Guaranteed 24h Response'}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{isBn ? '১০০% গোপনীয়তা ও হোয়াইট-লেবেল NDA' : '100% Confidential & NDA'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{isBn ? 'সিনিয়র ডিরেক্টরের সরাসরি অডিট' : 'Direct Strategy Consultation'}</span>
        </div>
      </div>

      {/* Direct WhatsApp Quick-Connect Box */}
      <div className="mt-6 p-4 rounded-sm border border-primary-foreground/15 bg-primary-foreground/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary-foreground">
              {isBn ? 'তাত্ক্ষণিক হোয়াটসঅ্যাপ যোগাযোগ?' : 'Prefer direct WhatsApp chat?'}
            </p>
            <p className="text-[11px] text-primary-foreground/50">
              {isBn ? 'আমাদের ক্রিয়েটিভ ডিরেক্টরের সাথে সরাসরি কথা বলুন' : 'Chat directly with our Creative Director'}
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20would%20like%20to%20discuss%20a%20visual%20identity%20project%20for%20my%20brand."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-medium transition-colors"
        >
          <span>WhatsApp Us Now →</span>
        </a>
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
        className={`text-[10px] text-accent mb-2 font-semibold ${isBn ? 'tracking-normal' : 'tracking-[3px] uppercase'}`}
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
      className="bg-primary-foreground/5 border border-primary-foreground/15 text-primary-foreground px-5 py-3.5 text-base md:text-sm font-light outline-none rounded-sm transition-all duration-300 placeholder:text-primary-foreground/35 focus:border-accent focus:bg-primary-foreground/[0.08] focus:shadow-[0_0_0_3px_rgba(251,146,60,0.15)] min-h-[46px]"
      style={{ fontSize: 'max(16px, 0.875rem)' }}
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
      className="bg-primary-foreground/5 border border-primary-foreground/15 text-primary-foreground px-5 py-3.5 text-base md:text-sm font-light outline-none rounded-sm resize-none transition-all duration-300 placeholder:text-primary-foreground/35 focus:border-accent focus:bg-primary-foreground/[0.08] focus:shadow-[0_0_0_3px_rgba(251,146,60,0.15)]"
      style={{ fontSize: 'max(16px, 0.875rem)' }}
    />
  );
}

function ThankYou({ isBn, labels, onReset }: { isBn: boolean; labels: UILabelsContent | null; onReset: () => void }) {
  const L = (keyEn: keyof UILabelsContent, keyBn: keyof UILabelsContent, en: string, bn: string) =>
    isBn ? pick(labels, keyBn, bn) : pick(labels, keyEn, en);
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easing }}
      className="text-center py-10"
    >
      <m.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: easing }}
        className="w-16 h-16 mx-auto mb-6 rounded-full border border-accent/40 flex items-center justify-center bg-accent/10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </m.div>
      <p className="text-[10px] tracking-[4px] uppercase text-accent mb-3 font-semibold">
        {L('leadFormReceivedEn', 'leadFormReceivedBn', 'Received', 'প্রাপ্ত')}
      </p>
      <h3 className="font-heading italic text-primary-foreground text-[clamp(28px,3.5vw,40px)] font-light leading-tight mb-4">
        {L('leadFormThankTitleEn', 'leadFormThankTitleBn', 'Thank you. We’ll be in touch.', 'ধন্যবাদ। আমরা দ্রুত যোগাযোগ করব।')}
      </h3>
      <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-md mx-auto mb-6">
        {L(
          'leadFormThankSubEn',
          'leadFormThankSubBn',
          'Your inquiry just landed in our studio. Expect a personal reply via WhatsApp or Email within 24 hours.',
          'আপনার বার্তা আমাদের স্টুডিওতে পৌঁছেছে। ২৪ ঘণ্টার মধ্যে হোয়াটসঅ্যাপ অথবা ইমেইলে যোগাযোগ করা হবে।',
        )}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20just%20submitted%20an%20inquiry%20on%20your%20website."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#20ba59] transition-colors"
        >
          <span>Chat on WhatsApp Now</span>
        </a>
        <button
          onClick={onReset}
          className="text-[11px] tracking-[2px] uppercase text-accent border border-accent px-6 py-3 min-h-[44px] rounded-sm hover:bg-accent/10 transition-colors"
        >
          {L('leadFormResetEn', 'leadFormResetBn', 'Submit another inquiry', 'আরেকটি বার্তা পাঠান')}
        </button>
      </div>
    </m.div>
  );
}
