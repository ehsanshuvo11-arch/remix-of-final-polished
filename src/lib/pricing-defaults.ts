import type { PricingContent, PricingTier } from '@/types/database';

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  // ── CARD 1: TEST PACK ──
  {
    id: 'test-drive',
    title_en: 'Test Pack • ৳2,500',
    title_bn: 'টেস্ট প্যাক • ৳২,৫০০',
    target_en: 'Ready in 48–72h',
    target_bn: '৪৮–৭২ ঘণ্টায় রেডি',
    price_en: '৳2,500',
    price_bn: '৳২,৫০০',
    concession_en: 'Regular ৳3,000 — First Test ৳2,500',
    concession_bn: 'রেগুলার ৳৩,০০০ — প্রথম টেস্ট ৳২,৫০০',
    desc_en: 'Test our craftsmanship on your running ads for 1–2 days ad spend.',
    desc_bn: '১–২ দিনের অ্যাড খরচে নিজের রানিং অ্যাডে আমাদের কাজ পরখ করুন।',
    outcome_tag_en: '⚡ 2–3 orders recoup the entire cost',
    outcome_tag_bn: '⚡ ২–৩টি অর্ডার এলেই এই খরচ উঠে আসে',
    deliverables_en: [
      '✓ 1x Scroll-stopping video reel (9:16)',
      '✓ 2x High-trust image posts (1:1)',
      '✓ Heart-touching Bengali sales copy',
      '✓ 48–72h delivery (2 revisions)',
    ],
    deliverables_bn: [
      '✓ ১টি স্ক্রল-থামানো ভিডিও রিল (9:16)',
      '✓ ২টি বিশ্বাসযোগ্য ছবির পোস্ট (1:1)',
      '✓ মন ছুঁয়ে যাওয়া বাংলা ক্যাপশন',
      '✓ ৪৮–৭২ ঘণ্টায় ডেলিভারি (২টি রিভিশন)',
    ],
    cta_en: 'GET ৳2,500 TEST PACK →',
    cta_bn: '৳২,৫০০ টেস্ট প্যাক নিন →',
    whatsapp_url: 'https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%A8%2C%E0%A7%AB%E0%A7%A6%E0%A7%A6%20%E0%A6%9F%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%9F%E0%A7%87%E0%A6%B8%E0%A7%8D%E0%A6%9F%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%20%E0%A6%A6%E0%A6%BF%E0%A7%9F%E0%A7%87%20%E0%A6%B6%E0%A7%81%E0%A6%B0%E0%A7%81%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20',
    featured: false,
  },

  // ── CARD 2: MONTHLY PARTNER (MOST POPULAR) ──
  {
    id: 'monthly-partner',
    title_en: 'Monthly Partner • ৳9,999/mo',
    title_bn: 'মাসিক পার্টনার • ৳৯,৯৯৯/মাস',
    target_en: 'Dedicated Retainer',
    target_bn: 'সার্বক্ষণিক পার্টনার',
    price_en: '৳9,999 / month',
    price_bn: '৳৯,৯৯৯ / মাস',
    badge_en: '⭐ MOST POPULAR • 50% LESS THAN A DESIGNER',
    badge_bn: '⭐ MOST POPULAR • 50% LESS THAN A DESIGNER',
    desc_en: 'Less than half an in-house designer salary for an entire month of ads.',
    desc_bn: '২০–২৫ হাজার টাকার ডিজাইনারের অর্ধেকেরও কম খরচে পুরো মাসের সব বিজ্ঞাপন।',
    outcome_tag_en: "★ 50% less than a designer salary",
    outcome_tag_bn: "★ ডিজাইনারের ৫০% কম খরচে পুরো মাস",
    deliverables_en: [
      '✓ 8 Fresh ads/month (2 weekly)',
      '✓ 1x 5-Slide combo set design',
      '✓ Weekly iterations from live results',
      '✓ WhatsApp support & 48h delivery',
    ],
    deliverables_bn: [
      '✓ মাসে ৮টি নতুন বিজ্ঞাপন (সপ্তাহে ২টি)',
      '✓ ১টি ৫-স্লাইডের কম্বো সেট ডিজাইন',
      '✓ প্রতি সপ্তাহে অ্যাডের রেজাল্ট দেখে নতুন ক্যাপশন',
      '✓ হোয়াটসঅ্যাপ সাপোর্ট ও ৪৮ ঘণ্টায় ডেলিভারি',
    ],
    cta_en: 'START MONTHLY PARTNERSHIP →',
    cta_bn: 'মাসিক পার্টনারশিপ শুরু করুন →',
    whatsapp_url: 'https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%AF%2C%E0%A7%AF%E0%A7%AF%E0%A7%AF%2F%E0%A6%AE%E0%A6%BE%E0%A6%B8%20%E0%A6%AE%E0%A6%BE%E0%A6%B8%E0%A6%BF%E0%A6%95%20%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%9F%E0%A6%A8%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%9C%E0%A7%87%20%E0%A6%AF%E0%A7%81%E0%A6%95%E0%A7%8D%E0%A6%A4%20%E0%A6%B9%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20',
    featured: true,
  },

  // ── CARD 3: 4-AD PACK ──
  {
    id: 'campaign-pack',
    title_en: '4-Ad Pack • ৳7,999',
    title_bn: '৪-অ্যাড প্যাক • ৳৭,৯৯৯',
    target_en: 'Launch Campaign Pack',
    target_bn: 'লঞ্চ ক্যাম্পেইন প্যাক',
    price_en: '৳7,999',
    price_bn: '৳৭,৯৯৯',
    badge_en: 'One-Time',
    badge_bn: 'এককালীন',
    desc_en: '4 creatives for launch or Eid (add ৳2,000 for monthly partner!).',
    desc_bn: 'নতুন লঞ্চ বা ঈদের জন্য ৪টি বিজ্ঞাপন (মাত্র ৳২,০০০ যোগ করলেই পুরো মাসের প্যাক!)।',
    outcome_tag_en: '💡 Add ৳2,000 for 8 ads all month!',
    outcome_tag_bn: '💡 মাত্র ৳২,০০০ যোগ করলেই পুরো মাসের প্যাক!',
    deliverables_en: [
      '✓ 2x Product video reels (9:16)',
      '✓ 2x High-trust image posts (1:1)',
      '✓ 4 Distinct Bengali copy angles',
      '✓ 48–72h delivery (2 revisions)',
    ],
    deliverables_bn: [
      '✓ ২টি প্রোডাক্ট ভিডিও রিল (9:16)',
      '✓ ২টি বিশ্বাসযোগ্য ছবির পোস্ট (1:1)',
      '✓ ৪টি আলাদা বাংলা ক্যাপশন',
      '✓ ৪৮–৭২ ঘণ্টায় ডেলিভারি (২টি রিভিশন)',
    ],
    cta_en: 'GET ৳7,999 PACK →',
    cta_bn: '৳৭,৯৯৯ প্যাক নিন →',
    whatsapp_url: 'https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%AD%2C%E0%A7%AF%E0%A7%AF%E0%A7%AF%20%E0%A6%AC%E0%A7%9Call%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%20%E0%A6%A8%E0%A6%BF%E0%A7%9F%E0%A7%87%20%E0%A6%95%E0%A6%A5%E0%A6%BE%20%E0%A6%AC%E0%A6%B2%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20',
    featured: false,
  },
];

export const DEFAULT_PRICING: PricingContent = {
  labelEn: 'TRANSPARENT INVESTMENT',
  labelBn: 'TRANSPARENT INVESTMENT',
  titleEn: 'Simple, Clear Packages.',
  titleEmEn: 'Packages.',
  titleBn: 'Simple, Clear Packages.',
  titleEmBn: 'Packages.',
  customHeadingEn: 'Need a Custom Scale Solution?',
  customHeadingBn: 'কাস্টম স্কেলিং সাপোর্ট প্রয়োজন?',
  customDescEn: "Managing higher ad spend or a multi-brand portfolio? Let's build a dedicated performance creative setup for your exact P&L targets.",
  customDescBn: 'বড় বাজেটের বিজ্ঞাপন বা একাধিক ব্র্যান্ড চালাচ্ছেন? আপনার নির্দিষ্ট বিজনেস মডেল অনুযায়ী কাস্টম সমাধান তৈরি করতে কথা বলুন।',
  customCtaEn: 'Talk to Creative Director',
  customCtaBn: 'সরাসরি কথা বলুন',
  tiers: DEFAULT_PRICING_TIERS,
};

export function makePricingTierId() {
  return `tier-${Math.random().toString(36).slice(2, 9)}`;
}
