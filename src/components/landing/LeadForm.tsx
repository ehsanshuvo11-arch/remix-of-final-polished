import { useState, useMemo, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { sendInquiryEmail } from '@/lib/email';
import MagneticButton from '@/components/landing/MagneticButton';
import { useUILabels } from '@/hooks/use-site-content';
import { INQUIRY_PREFILL_EVENT, type InquiryPrefillDetail } from '@/lib/inquiry-events';
import type { UILabelsContent } from '@/types/database';
import { ShieldCheck, Clock, Award, MessageCircle, ChevronDown, Check } from 'lucide-react';

const easing = [0.16, 1, 0.3, 1] as const;

export type DeliveryChannel = 'whatsapp' | 'messenger' | 'instagram' | 'email';

export interface ChannelConfig {
  id: DeliveryChannel;
  priorityRank: number;
  labelEn: string;
  labelBn: string;
  badgeEn: string;
  badgeBn: string;
  inputPlaceholderEn: string;
  inputPlaceholderBn: string;
  noteEn: string;
  noteBn: string;
  type?: string;
}

export const CHANNELS: ChannelConfig[] = [
  {
    id: 'whatsapp',
    priorityRank: 1,
    labelEn: 'WhatsApp',
    labelBn: 'হোয়াটসঅ্যাপ',
    badgeEn: '⚡ #1 Priority · 2h Response',
    badgeBn: '⚡ সর্বোচ্চ অগ্রাধিকার · ২ ঘণ্টায় রেসপন্স',
    inputPlaceholderEn: 'WhatsApp Number (e.g. 01712345678 or +880 1...) *',
    inputPlaceholderBn: 'হোয়াটসঅ্যাপ নম্বর (যেমন: 01712345678 বা +880 1...) *',
    noteEn: 'Our Creative Director personally reviews and delivers your custom strategy teardown directly on WhatsApp.',
    noteBn: 'আমাদের ক্রিয়েটিভ ডিরেক্টর আপনার ব্র্যান্ডের ৫-মিনিট ভিডিও অডিট ও স্ট্র্যাটেজি সরাসরি হোয়াটসঅ্যাপে পাঠাবেন।',
    type: 'tel',
  },
  {
    id: 'messenger',
    priorityRank: 2,
    labelEn: 'Facebook Messenger',
    labelBn: 'ফেসবুক মেসেঞ্জার',
    badgeEn: '#2 Priority · 6h Response',
    badgeBn: '২য় অগ্রাধিকার · ৬ ঘণ্টার মধ্যে রেসপন্স',
    inputPlaceholderEn: 'Facebook Profile / Page Link or Username (e.g. m.me/yourbrand) *',
    inputPlaceholderBn: 'ফেসবুক প্রোফাইল / পেজ লিংক বা ইউজারনেম (যেমন: m.me/yourbrand) *',
    noteEn: 'We will connect directly through Facebook Messenger to deliver your proposal and visual audit.',
    noteBn: 'আমরা সরাসরি ফেসবুক মেসেঞ্জারে যুক্ত হয়ে আপনার সাথে প্রপোজাল শেয়ার করব।',
    type: 'text',
  },
  {
    id: 'instagram',
    priorityRank: 3,
    labelEn: 'Instagram DM',
    labelBn: 'ইনস্টাগ্রাম ডিএম',
    badgeEn: '#3 Priority · 12h Response',
    badgeBn: '৩য় অগ্রাধিকার · ১২ ঘণ্টার মধ্যে রেসপন্স',
    inputPlaceholderEn: 'Instagram Handle or Profile Link (e.g. @yourbrand) *',
    inputPlaceholderBn: 'ইনস্টাগ্রাম হ্যান্ডেল বা প্রোফাইল লিংক (যেমন: @yourbrand) *',
    noteEn: 'We will send the proposal directly to your brand’s official Instagram DM.',
    noteBn: 'আপনার অফিসিয়াল ইনস্টাগ্রাম ইনবক্সে সরাসরি স্ট্র্যাটেজি ডেক পাঠানো হবে।',
    type: 'text',
  },
  {
    id: 'email',
    priorityRank: 4,
    labelEn: 'Business Email',
    labelBn: 'বিজনেস ইমেইল',
    badgeEn: '#4 Priority · 24h Response',
    badgeBn: '৪র্থ অগ্রাধিকার · ২৪ ঘণ্টার মধ্যে রেসপন্স',
    inputPlaceholderEn: 'Business Email Address (e.g. hello@yourbrand.com) *',
    inputPlaceholderBn: 'বিজনেস ইমেইল অ্যাড্রেস (যেমন: hello@yourbrand.com) *',
    noteEn: 'A formal executive PDF proposal and creative teardown will be delivered to your inbox.',
    noteBn: 'ফর্মাল এক্সিকিউটিভ পিডিএফ প্রপোজাল ও ক্রিয়েটিভ অডিট আপনার ইনবক্সে পাঠানো হবে।',
    type: 'email',
  },
];

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
  delivery_channel: DeliveryChannel;
  channel_handle: string;
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
  delivery_channel: 'whatsapp',
  channel_handle: '',
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
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const TOTAL = 3;
  const L = (keyEn: keyof UILabelsContent, keyBn: keyof UILabelsContent, en: string, bn: string) =>
    isBn ? pick(labels, keyBn, bn) : pick(labels, keyEn, en);

  const BUDGETS = [
    { value: 'below-20k', label: L('budget1En', 'budget1Bn', 'Below 20,000 BDT', '২০,০০০ টাকার নিচে') },
    { value: '20k-50k',   label: L('budget2En', 'budget2Bn', '20,000 – 50,000 BDT', '২০,০০০ – ৫০,০০০ টাকা') },
    { value: '50k-plus',  label: L('budget3En', 'budget3Bn', '50,000 BDT and above', '৫০,০০০ টাকা ও তার বেশি') },
    { value: 'not-sure',  label: L('budget4En', 'budget4Bn', "I'm not sure yet", 'এখনো নিশ্চিত নই') },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setChannelDropdownOpen(false);
      }
    };
    if (channelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [channelDropdownOpen]);

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
    if (step === 2) {
      const ch = data.delivery_channel;
      const handle = (
        ch === 'whatsapp'
          ? (data.channel_handle || data.whatsapp)
          : ch === 'email'
          ? (data.channel_handle || data.email)
          : data.channel_handle
      ).trim();

      if (ch === 'whatsapp') {
        return handle.replace(/\D/g, '').length >= 8;
      }
      if (ch === 'messenger') {
        return handle.length >= 3;
      }
      if (ch === 'instagram') {
        return handle.length >= 2;
      }
      if (ch === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(handle);
      }
      return false;
    }
    return false;
  }, [step, data]);

  const next = () => stepValid && setStep((s) => Math.min(s + 1, TOTAL - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!stepValid || submitting) return;
    setSubmitting(true);
    setError(null);

    const activeConfig = CHANNELS.find((c) => c.id === data.delivery_channel) || CHANNELS[0];
    const finalHandle = (
      data.delivery_channel === 'whatsapp'
        ? (data.channel_handle || data.whatsapp)
        : data.delivery_channel === 'email'
        ? (data.channel_handle || data.email)
        : data.channel_handle
    ).trim();

    const metaSections: string[] = [];
    if (data.service_type) metaSections.push(`Service Focus: ${data.service_type}`);
    metaSections.push(`Preferred Delivery Channel: ${activeConfig.labelEn} [${finalHandle}] (Priority #${activeConfig.priorityRank})`);
    if (data.whatsapp && data.delivery_channel !== 'whatsapp') metaSections.push(`WhatsApp / Phone: ${data.whatsapp}`);
    if (data.diagnosed_revenue_loss) metaSections.push(`Diagnosed Revenue Loss: ${data.diagnosed_revenue_loss}`);

    const compiledScope = metaSections.length > 0
      ? `${metaSections.join(' | ')}\n\n${data.project_details.trim() || 'Direct Project Consultation Request'}`
      : (data.project_details.trim() || 'Direct Project Consultation Request');

    const emailToUse = data.delivery_channel === 'email' && finalHandle
      ? finalHandle
      : (data.email.trim() || `${(finalHandle || data.whatsapp || 'client').replace(/\D/g, '') || 'client'}@inquiry.polished.studio`);

    const whatsappToUse = data.delivery_channel === 'whatsapp'
      ? finalHandle
      : (data.whatsapp.trim() || '');

    const payload = {
      client_name: data.client_name.trim(),
      brand_name: data.brand_name.trim(),
      email: emailToUse,
      whatsapp: whatsappToUse,
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

  // Auto-sync Step 1 WhatsApp number to Step 3 handle when WhatsApp is chosen
  useEffect(() => {
    if (step === 2 && data.delivery_channel === 'whatsapp' && !data.channel_handle && data.whatsapp) {
      setData((prev) => ({ ...prev, channel_handle: prev.whatsapp }));
    }
  }, [step, data.delivery_channel, data.channel_handle, data.whatsapp]);

  const activeChannel = useMemo(
    () => CHANNELS.find((c) => c.id === data.delivery_channel) || CHANNELS[0],
    [data.delivery_channel],
  );

  const activeChannelValue = useMemo(() => {
    if (data.delivery_channel === 'whatsapp') {
      return data.channel_handle || data.whatsapp;
    }
    if (data.delivery_channel === 'email') {
      return data.channel_handle || data.email;
    }
    return data.channel_handle;
  }, [data.delivery_channel, data.channel_handle, data.whatsapp, data.email]);

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

                {/* Quiet Luxury Channel Selection Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <p className="text-[10px] tracking-[2px] uppercase text-primary-foreground/50 mb-2">
                    {isBn ? 'প্রপোজাল গ্রহণের মাধ্যম নির্বাচন করুন (অগ্রাধিকার অনুযায়ী সাজানো)' : 'Preferred Delivery Channel (Ranked by Priority)'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setChannelDropdownOpen((prev) => !prev)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-sm border transition-all duration-300 text-left min-h-[54px] bg-primary-foreground/5 ${
                      channelDropdownOpen
                        ? 'border-accent bg-primary-foreground/[0.08] shadow-[0_0_0_2px_rgba(251,146,60,0.2)]'
                        : 'border-primary-foreground/15 hover:border-primary-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center shrink-0">
                        <ChannelIcon channel={activeChannel.id} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-primary-foreground">
                            {isBn ? activeChannel.labelBn : activeChannel.labelEn}
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              activeChannel.id === 'whatsapp'
                                ? 'bg-accent/20 text-accent border border-accent/40'
                                : activeChannel.id === 'messenger'
                                ? 'bg-[#0099FF]/15 text-[#0099FF] border border-[#0099FF]/30'
                                : activeChannel.id === 'instagram'
                                ? 'bg-[#E1306C]/15 text-[#E1306C] border border-[#E1306C]/30'
                                : 'bg-primary-foreground/10 text-primary-foreground/70 border border-primary-foreground/20'
                            }`}
                          >
                            {isBn ? activeChannel.badgeBn : activeChannel.badgeEn}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-primary-foreground/60 shrink-0 transition-transform duration-300 ${
                        channelDropdownOpen ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Options */}
                  <AnimatePresence>
                    {channelDropdownOpen && (
                      <m.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: easing }}
                        className="absolute top-full left-0 right-0 mt-2 z-50 rounded-sm bg-[#0b1329] border border-primary-foreground/20 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden divide-y divide-primary-foreground/10"
                      >
                        {CHANNELS.map((ch) => {
                          const isSelected = data.delivery_channel === ch.id;
                          return (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => {
                                update('delivery_channel', ch.id);
                                if (ch.id === 'whatsapp' && !data.channel_handle && data.whatsapp) {
                                  update('channel_handle', data.whatsapp);
                                }
                                setChannelDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-3.5 transition-colors text-left ${
                                isSelected
                                  ? 'bg-accent/15 text-primary-foreground'
                                  : 'hover:bg-primary-foreground/10 text-primary-foreground/80'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-primary-foreground/10 flex items-center justify-center shrink-0">
                                  <ChannelIcon channel={ch.id} className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs md:text-sm font-medium text-primary-foreground">
                                      {isBn ? ch.labelBn : ch.labelEn}
                                    </span>
                                    <span
                                      className={`text-[8.5px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        ch.id === 'whatsapp'
                                          ? 'bg-accent/25 text-accent border border-accent/40'
                                          : ch.id === 'messenger'
                                          ? 'bg-[#0099FF]/20 text-[#0099FF] border border-[#0099FF]/30'
                                          : ch.id === 'instagram'
                                          ? 'bg-[#E1306C]/20 text-[#E1306C] border border-[#E1306C]/30'
                                          : 'bg-primary-foreground/10 text-primary-foreground/60 border border-primary-foreground/20'
                                      }`}
                                    >
                                      {isBn ? ch.badgeBn : ch.badgeEn}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-accent shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dynamic Input based on Selected Channel */}
                <div className="mt-1">
                  <PolishedInput
                    type={activeChannel.type || 'text'}
                    value={activeChannelValue}
                    onChange={(val) => {
                      update('channel_handle', val);
                      if (data.delivery_channel === 'whatsapp') {
                        update('whatsapp', val);
                      }
                      if (data.delivery_channel === 'email') {
                        update('email', val);
                      }
                    }}
                    placeholder={isBn ? activeChannel.inputPlaceholderBn : activeChannel.inputPlaceholderEn}
                    autoFocus
                  />
                </div>

                {/* WhatsApp Auto-sync confirmation badge */}
                {data.delivery_channel === 'whatsapp' && (data.whatsapp || data.channel_handle) && (
                  <div className="text-xs text-accent flex items-center gap-2 px-1">
                    <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>
                      {isBn
                        ? `ধাপ ১ থেকে নম্বর সংরক্ষিত (প্রয়োজনে পরিবর্তন করুন)`
                        : `Prefilled from Step 1 (editable if you prefer another number)`}
                    </span>
                  </div>
                )}

                {/* Channel Helper Note */}
                <p className="text-[12px] text-primary-foreground/70 leading-relaxed mt-1">
                  {isBn ? activeChannel.noteBn : activeChannel.noteEn}
                </p>

                <p className="text-[11px] text-primary-foreground/45 leading-relaxed">
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

function ChannelIcon({ channel, className = 'w-4 h-4' }: { channel: DeliveryChannel; className?: string }) {
  if (channel === 'whatsapp') {
    return (
      <svg className={`${className} text-[#25D366] fill-current`} viewBox="0 0 24 24">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2M12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16M16.57 14.37C16.32 14.24 15.1 13.64 14.87 13.56C14.64 13.47 14.48 13.43 14.31 13.68C14.15 13.93 13.67 14.49 13.53 14.66C13.38 14.82 13.24 14.84 12.99 14.72C12.74 14.59 11.94 14.33 11 13.49C10.26 12.83 9.77 12.02 9.62 11.77C9.48 11.52 9.61 11.39 9.73 11.26C9.84 11.15 9.98 10.97 10.1 10.82C10.23 10.68 10.27 10.57 10.35 10.41C10.43 10.24 10.39 10.1 10.33 9.98C10.27 9.85 9.77 8.63 9.57 8.12C9.37 7.63 9.16 7.7 9.01 7.69C8.87 7.69 8.7 7.69 8.54 7.69C8.38 7.69 8.11 7.75 7.89 7.99C7.66 8.24 7.03 8.83 7.03 10.02C7.03 11.22 7.9 12.38 8.02 12.55C8.15 12.71 9.74 15.16 12.18 16.21C12.76 16.46 13.21 16.61 13.56 16.72C14.15 16.91 14.68 16.88 15.11 16.82C15.59 16.75 16.57 16.22 16.78 15.65C16.98 15.08 16.98 14.59 16.92 14.49C16.86 14.39 16.82 14.49 16.57 14.37Z" />
      </svg>
    );
  }
  if (channel === 'messenger') {
    return (
      <svg className={`${className} text-[#0099FF] fill-current`} viewBox="0 0 24 24">
        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.26.57l-.37 2.14c-.06.33.27.59.56.44l2.5-1.28c.17-.09.37-.11.56-.06.87.23 1.79.35 2.85.35 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.08 13.06l-2.61-2.78-5.1 2.78 5.61-5.96 2.67 2.78 5.04-2.78-5.61 5.96z" />
      </svg>
    );
  }
  if (channel === 'instagram') {
    return (
      <svg className={`${className} text-[#E1306C] fill-none stroke-current`} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  return (
    <svg className={`${className} text-accent fill-none stroke-current`} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
