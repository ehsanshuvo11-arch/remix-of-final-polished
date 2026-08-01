import type { PricingContent, PricingTier } from '@/types/database';

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: 'social',
    title_en: 'Social Media Retainer',
    title_bn: 'সোশ্যাল মিডিয়া রিটেইনার',
    target_en: 'Established D2C Brands',
    target_bn: 'প্রতিষ্ঠিত ডি২সি ব্র্যান্ড',
    desc_en: 'A recurring design partnership for skincare and self-care brands that need consistent, scroll-stopping content across every social touchpoint.',
    desc_bn: 'স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ডের জন্য একটি নিরন্তর ডিজাইন পার্টনারশিপ—প্রতিটি সোশ্যাল টাচপয়েন্টে কনসিস্টেন্ট, আকর্ষণীয় কন্টেন্ট।',
    cta_en: 'Get Started',
    cta_bn: 'শুরু করুন',
    featured: false,
  },
  {
    id: 'visual',
    title_en: 'Visual Identity System',
    title_bn: 'ভিজ্যুয়াল আইডেন্টিটি সিস্টেম',
    target_en: 'E-commerce Makeovers',
    target_bn: 'ই-কমার্স মেকওভার',
    desc_en: 'A complete brand overhaul for stores ready to look premium — from logo and color to packaging, storefront UI, and launch assets.',
    desc_bn: 'লোগো, কালার, প্যাকেজিং থেকে স্টোরফ্রন্ট UI ও লঞ্চ অ্যাসেট পর্যন্ত—আপনার ব্র্যান্ডকে প্রিমিয়াম লুক দিতে একটি সম্পূর্ণ মেকওভার।',
    cta_en: 'Start Your Makeover',
    cta_bn: 'মেকওভার শুরু করুন',
    featured: true,
  },
  {
    id: 'white',
    title_en: 'White-Label Partner',
    title_bn: 'হোয়াইট-লেবেল পার্টনার',
    target_en: 'Marketing Agencies',
    target_bn: 'মার্কেটিং এজেন্সি',
    desc_en: 'Plug-and-play creative backend for agencies that want premium visuals delivered under their own brand name — without growing their headcount.',
    desc_bn: 'মার্কেটিং এজেন্সিগুলোর জন্য প্লাগ-অ্যান্ড-প্লে ক্রিয়েটিভ ব্যাকএন্ড—নিজেদের ব্র্যান্ড নামে প্রিমিয়াম ডেলিভারি, বাড়তি হেডকাউন্ট ছাড়াই।',
    cta_en: 'Partner With Us',
    cta_bn: 'পার্টনারশিপ করুন',
    featured: false,
  },
];

export const DEFAULT_PRICING: PricingContent = {
  labelEn: 'Investment',
  labelBn: 'ইনভেস্টমেন্ট',
  titleEn: 'Transparent partnerships.',
  titleEmEn: 'Premium execution.',
  titleBn: 'স্বচ্ছ পার্টনারশিপ।',
  titleEmBn: 'প্রিমিয়াম এক্সিকিউশন।',
  customHeadingEn: 'Need a Custom Solution?',
  customHeadingBn: 'কাস্টম সলিউশন প্রয়োজন?',
  customDescEn: "Let's craft a bespoke visual strategy tailored exactly to your brand's unique scale and goals.",
  customDescBn: 'আপনার ব্র্যান্ডের নির্দিষ্ট চাহিদা এবং লক্ষ্য অনুযায়ী একটি সম্পূর্ণ কাস্টম ভিজ্যুয়াল স্ট্র্যাটেজি তৈরি করতে আমাদের সাথে কথা বলুন।',
  customCtaEn: 'Request Custom Quote',
  customCtaBn: 'কাস্টম কোটেশন রিকোয়েস্ট করুন',
  tiers: DEFAULT_PRICING_TIERS,
};

export function makePricingTierId() {
  return `tier-${Math.random().toString(36).slice(2, 9)}`;
}
