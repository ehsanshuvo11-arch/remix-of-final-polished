import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Clock, Zap, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { sendInquiryEmail } from '@/lib/email';

export const AUDIT_MODAL_EVENT = 'polished:open-audit-modal';

export interface AuditModalDetail {
  source?: string;
  service?: string;
  note?: string;
}

export function openAuditModal(detail?: AuditModalDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUDIT_MODAL_EVENT, { detail }));
  }
}

export default function VisualAuditModal() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('Website CTA');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    url: '',
    whatsapp: '',
    objective: 'Lower CAC on Meta Ads',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent<AuditModalDetail>).detail;
      if (detail?.source) setSource(detail.source);
      if (detail?.service) {
        setFormData((prev) => ({ ...prev, objective: detail.service || prev.objective }));
      }
      if (detail?.note) {
        setFormData((prev) => ({ ...prev, notes: detail.note || prev.notes }));
      }
      setIsSuccess(false);
      setErrorMsg('');
      setIsOpen(true);
      window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: true } }));
    };

    window.addEventListener(AUDIT_MODAL_EVENT, handleOpen);
    return () => window.removeEventListener(AUDIT_MODAL_EVENT, handleOpen);
  }, []);

  const close = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: false } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার নাম এবং হোয়াটসঅ্যাপ নম্বর দিন।' : 'Please enter your name and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Save lead to Supabase leads/inquiries
      const leadPayload = {
        client_name: formData.name,
        brand_name: formData.brand || 'Undisclosed Brand',
        whatsapp: formData.whatsapp,
        store_url: formData.url,
        service_type: `Free 5-Min Teardown: ${formData.objective}`,
        project_details: `Source: ${source}\nURL/IG: ${formData.url}\nObjective: ${formData.objective}\nNotes: ${formData.notes}`,
        budget_range: 'Audit Lead',
      };

      await supabase.from('leads').insert([leadPayload]);

      // Fire email notification
      try {
        await sendInquiryEmail({
          client_name: formData.name,
          brand_name: formData.brand,
          email: formData.whatsapp ? `${formData.whatsapp.replace(/\D/g, '')}@lead.polished.com` : 'audit-lead@polished.com',
          whatsapp: formData.whatsapp,
          service_type: `Free Audit: ${formData.objective}`,
          budget_range: 'Free Audit',
          store_url: formData.url,
          project_details: `Requested 5-Min Free Video Teardown. Objective: ${formData.objective}\nNotes: ${formData.notes}`,
        });
      } catch (emailErr) {
        console.warn('Email dispatch warning:', emailErr);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Audit submit error:', err);
      // Even if database has network lag, show success to client with direct WhatsApp fallback
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/8801346288210?text=${encodeURIComponent(
    `Hi POLISHED Studio, I'm ${formData.name || 'a brand owner'} from ${formData.brand || 'my brand'}. I'd like to claim the 5-Minute Free Video Teardown for my storefront: ${formData.url || ''}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop with elegant blur */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-[#1e3a8a]/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white border border-[#1e3a8a]/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-sm overflow-hidden z-10 my-auto max-h-[94dvh] flex flex-col"
          >
            {/* Top Navy Banner */}
            <div className="bg-[#1e3a8a] text-white px-5 py-5 sm:px-8 sm:py-7 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#fb923c] opacity-10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-[#fb923c] text-[10px] md:text-xs font-bold uppercase tracking-[2.5px]">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c] animate-ping" />
                  <span>{isBn ? 'ফ্রি ক্রিয়েটিভ অডিট' : 'Complimentary Creative Audit'}</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-heading text-2xl md:text-3xl font-light text-white mt-2 leading-tight">
                {isBn ? (
                  <>৫-মিনিটের ফ্রি <span className="text-[#fb923c] italic font-normal">ভিডিও টিয়ারডাউন</span> বুক করুন</>
                ) : (
                  <>Claim Your 5-Minute <span className="text-[#fb923c] italic font-normal">Ad Creative Teardown</span></>
                )}
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-1.5 font-light leading-relaxed">
                {isBn
                  ? 'আমরা আপনার বর্তমান বিজ্ঞাপন ও পেজ পর্যালোচনা করে সরাসরি ভিডিওতে দেখিয়ে দেব বিজ্ঞাপনে কোথায় টাকা নষ্ট হচ্ছে এবং কীভাবে সেলস রিকভার করবেন।'
                  : 'We personally analyze your live ads and page, showing you the exact bottlenecks bleeding your budget and how to fix your conversions.'}
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10 text-[11px] text-white/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span>{isBn ? '২৪ ঘণ্টার মধ্যে ডেলিভারি' : '24h Delivery via WhatsApp'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span>{isBn ? '১০০% গোপনীয়তা' : '100% Confidential'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span>{isBn ? 'কোনো হিডেন চার্জ নেই' : 'Zero Hidden Charges'}</span>
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 bg-[#f9fafb] overflow-y-auto flex-1">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1e3a8a] font-semibold mb-1.5">
                        {isBn ? 'আপনার নাম *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isBn ? 'যেমন: তানভীর আহমেদ' : 'e.g., Ahsan Habib'}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1e3a8a]/20 rounded-sm focus:outline-none focus:border-[#fb923c] focus:ring-1 focus:ring-[#fb923c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1e3a8a] font-semibold mb-1.5">
                        {isBn ? 'ব্র্যান্ডের নাম' : 'Brand Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder={isBn ? 'যেমন: স্কিন কেয়ার বিডি' : 'e.g., Silk & Skin BD'}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1e3a8a]/20 rounded-sm focus:outline-none focus:border-[#fb923c] focus:ring-1 focus:ring-[#fb923c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1e3a8a] font-semibold mb-1.5">
                        {isBn ? 'হোয়াটসঅ্যাপ নম্বর *' : 'WhatsApp Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+880 1..."
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1e3a8a]/20 rounded-sm focus:outline-none focus:border-[#fb923c] focus:ring-1 focus:ring-[#fb923c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1e3a8a] font-semibold mb-1.5">
                        {isBn ? 'ফেসবুক পেজ লিংক বা ওয়েবসাইট' : 'Facebook Page Link or Store URL'}
                      </label>
                      <input
                        type="text"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="e.g., facebook.com/mybrand"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1e3a8a]/20 rounded-sm focus:outline-none focus:border-[#fb923c] focus:ring-1 focus:ring-[#fb923c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1e3a8a] font-semibold mb-1.5">
                      {isBn ? 'বিজ্ঞাপনের প্রধান সমস্যা' : 'Primary Ad Bottleneck'}
                    </label>
                    <select
                      value={formData.objective}
                      onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1e3a8a]/20 rounded-sm focus:outline-none focus:border-[#fb923c] focus:ring-1 focus:ring-[#fb923c] text-[#1e3a8a]"
                    >
                      <option value="Lower CPR on Meta Ads">
                        {isBn ? 'বিজ্ঞাপনে টাকা যাচ্ছে কিন্তু সেলস কম (উচ্চ CPR)' : 'High Ad Spend, Low Conversions (High CPR)'}
                      </option>
                      <option value="Stop Price-Ghosting">
                        {isBn ? 'ইনবক্সে দাম জিজ্ঞেস করে উধাও হওয়া কমানো' : 'Stop Price-Ghosting in Comments & Inbox'}
                      </option>
                      <option value="Full Price Sales">
                        {isBn ? 'ডিসকাউন্ট নির্ভরতা এড়িয়ে পুরো দামে বিক্রি করা' : 'Sell at Full Price Without Heavy Discounts'}
                      </option>
                      <option value="White-Label Agency Backend">
                        {isBn ? 'মার্কেটিং এজেন্সির জন্য নির্ভরযোগ্য ডিজাইন পার্টনার' : 'White-Label Creative Engine for Marketing Agencies'}
                      </option>
                    </select>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3.5 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-[2px] rounded-sm transition-all duration-300 shadow-[0_4px_16px_rgba(251,146,60,0.3)] hover:shadow-[0_6px_24px_rgba(251,146,60,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? (isBn ? 'প্রসেসিং হচ্ছে...' : 'Submitting Request...') : (isBn ? 'ফ্রি অডিট বুক করুন' : 'Confirm Free 5-Min Video Teardown')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3.5 px-5 bg-white border border-[#1e3a8a]/20 hover:border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a]/5 text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>{isBn ? 'হোয়াটসঅ্যাপে চ্যাট' : 'Direct WhatsApp'}</span>
                    </a>
                  </div>

                  <p className="text-[10px] text-center text-[#1e3a8a]/50 mt-2">
                    {isBn
                      ? 'স্টুডিও ক্যাপাসিটি রক্ষা করতে চলতি মাসে মাত্র ৩টি স্লট বরাদ্দ রয়েছে।'
                      : 'Strictly limited to 3 brand partner reviews per week to preserve quality.'}
                  </p>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading text-2xl text-[#1e3a8a] font-normal">
                    {isBn ? 'অডিট রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!' : 'Your Video Teardown is Reserved!'}
                  </h4>
                  <p className="text-xs md:text-sm text-[#1e3a8a]/70 max-w-md mx-auto leading-relaxed">
                    {isBn
                      ? 'আমাদের ক্রিয়েটিভ ডিরেক্টর আপনার ব্র্যান্ডের অ্যাসেট পর্যালোচনা শুরু করেছেন। ২৪ ঘণ্টার মধ্যে আপনার হোয়াটসঅ্যাপে ৫ মিনিটের কাস্টম ভিডিও অডিট পাঠানো হবে।'
                      : 'Our Creative Director has queued your storefront audit. You will receive your private 5-minute video teardown via WhatsApp within 24 hours.'}
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isBn ? 'দ্রুত হোয়াটসঅ্যাপে কথা বলুন' : 'Fast-Track on WhatsApp'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={close}
                      className="px-6 py-3 bg-white border border-[#1e3a8a]/20 text-[#1e3a8a] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-gray-50 transition-colors"
                    >
                      {isBn ? 'ঠিক আছে' : 'Done'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
