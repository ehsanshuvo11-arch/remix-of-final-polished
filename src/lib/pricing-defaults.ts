import type { PricingContent, PricingTier } from '@/types/database';

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: 'trial-pack',
    title_en: 'Skincare Trial Pack',
    title_bn: 'স্কিনকেয়ার ট্রায়াল প্যাক',
    target_en: 'No-Risk Starter',
    target_bn: 'নো-রিস্ক স্টার্টার',
    price_en: '৳999',
    price_bn: '৳৯৯৯',
    desc_en: 'Test our data-driven creative process with zero commitment. Designed to drop your Meta Ad CPR on your flagship product.',
    desc_bn: 'কোনো দীর্ঘমেয়াদী কমিটমেন্ট ছাড়াই আমাদের ডেটা-ড্রিভেন ক্রিয়েটিভ প্রসেস টেস্ট করুন। আপনার মেইন প্রোডাক্টের মেটা অ্যাডের CPR কমানোর জন্য তৈরি।',
    outcome_tag_en: 'CPR Reduction Sprint',
    outcome_tag_bn: 'বিজ্ঞাপনের CPR কমানোর স্প্রিন্ট',
    deliverables_en: [
      '5 Premium Meta Ad Creatives',
      'Bangla Sales Copy',
    ],
    deliverables_bn: [
      '৫টি প্রিমিয়াম মেটা অ্যাড ক্রিয়েটিভ',
      'উচ্চ-কনভার্টিং বাংলা সেলস কপি',
    ],
    cta_en: 'Book Trial on WhatsApp',
    cta_bn: 'হোয়াটসঅ্যাপে ট্রায়াল বুক করুন',
    whatsapp_url: "https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20book%20the%20%E0%A7%B3999%20Skincare%20Trial%20Pack.",
    featured: false,
  },
  {
    id: 'growth-pack',
    title_en: 'F-Commerce Growth Pack',
    title_bn: 'এফ-কমার্স গ্রোথ প্যাক',
    target_en: 'D2C Scaling Brands',
    target_bn: 'ডি২সি স্কেলিং ব্র্যান্ড',
    price_en: '৳2,299 / month',
    price_bn: '৳২,২৯৯ / মাস',
    desc_en: 'Complete visual content engine to automate your sales funnel, slash CAC, and maintain premium brand presentation across social channels.',
    desc_bn: 'আপনার সেলস ফানেল অটোমেট করা, CAC কমানো এবং সোশ্যাল চ্যানেলে প্রিমিয়াম ব্র্যান্ড প্রেজেন্টেশন বজায় রাখার জন্য সম্পূর্ণ কন্টেন্ট ইঞ্জিন।',
    outcome_tag_en: 'Automate Your Sales Funnel',
    outcome_tag_bn: 'আপনার সেলস ফানেল অটোমেট করুন',
    deliverables_en: [
      '12 High-Converting Posts',
      '1 Free Page Cover',
      'Unlimited Minor Revisions',
    ],
    deliverables_bn: [
      '১২টি হাই-কনভার্টিং পোস্ট',
      '১টি ফ্রি পেইজ কভার ডিজাইন',
      'আনলিমিটেড মাইনর রিভিশন',
    ],
    cta_en: 'Partner With Us',
    cta_bn: 'পার্টনারশিপ শুরু করুন',
    whatsapp_url: "https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20am%20interested%20in%20the%20F-Commerce%20Growth%20Pack.",
    featured: true,
  },
];

export const DEFAULT_PRICING: PricingContent = {
  labelEn: 'Investment & ROI',
  labelBn: 'ইনভেস্টমেন্ট ও ROI',
  titleEn: 'High-Converting Creative Sprints.',
  titleEmEn: 'No fluff, no hidden fees.',
  titleBn: 'হাই-কনভার্টিং ক্রিয়েটিভ স্প্রিন্ট।',
  titleEmBn: 'কোনো ফ্লাফ নয়, কোনো লুকানো ফি নয়।',
  customHeadingEn: 'Need a Custom Scale Solution?',
  customHeadingBn: 'কাস্টম স্কেলিং সলিউশন প্রয়োজন?',
  customDescEn: "Let's craft a bespoke visual performance strategy tailored exactly to your brand's unique revenue targets and P&L.",
  customDescBn: 'আপনার ব্র্যান্ডের নির্দিষ্ট রেভিনিউ টার্গেট এবং P&L অনুযায়ী একটি কাস্টম ভিজ্যুয়াল স্ট্র্যাটেজি তৈরি করতে আমাদের সাথে কথা বলুন।',
  customCtaEn: 'Request Custom Growth Quote',
  customCtaBn: 'কাস্টম কোটেশন রিকোয়েস্ট করুন',
  tiers: DEFAULT_PRICING_TIERS,
};

export function makePricingTierId() {
  return `tier-${Math.random().toString(36).slice(2, 9)}`;
}
