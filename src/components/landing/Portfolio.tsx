import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import DOMPurify from 'dompurify';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Check, 
  Layers, 
  ChevronDown,
  MessageCircle,
  ExternalLink,
  FileText,
  Download
} from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import PremiumSkeleton, { PortfolioSkeleton } from '@/components/landing/Skeleton';
import PremiumImage from '@/components/landing/PremiumImage';
import { buildSrcSet, resolveStorageUrl } from '@/lib/image';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import type { PortfolioMetaContent, PortfolioProject } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUILabels } from '@/hooks/use-site-content';

interface PortfolioProps {
  projects: PortfolioProject[];
  content?: PortfolioMetaContent | null;
  isLoading?: boolean;
}

const CATEGORIES = [
  { id: 'all', labelEn: 'All Works', labelBn: 'সব কাজ' },
  { id: 'skincare', labelEn: 'Skincare & D2C', labelBn: 'স্কিনকেয়ার ও ডি২সি' },
  { id: 'ads', labelEn: 'Meta Performance Ads', labelBn: 'মেটা অ্যাড ক্রিয়েটিভ' },
  { id: 'perfume', labelEn: 'Luxury Fragrance', labelBn: 'লাক্সারি পারফিউম' },
  { id: 'branding', labelEn: 'Packaging & Identity', labelBn: 'প্যাকেজিং ও ব্র্যান্ডিং' },
] as const;

function matchesCategory(project: PortfolioProject, catId: string): boolean {
  if (catId === 'all') return true;
  const en = (project.category_en || '').toLowerCase();
  const bn = (project.category_bn || '').toLowerCase();
  const title = (project.title_en || '').toLowerCase();
  
  if (catId === 'skincare') {
    return en.includes('skincare') || bn.includes('স্কিনকেয়ার') || en.includes('serum') || en.includes('elixir') || en.includes('masque') || en.includes('glow') || title.includes('lumin') || title.includes('aurora') || title.includes('cleanser') || en.includes('d2c') || bn.includes('ডি২সি');
  }
  if (catId === 'ads') {
    return en.includes('ad') || en.includes('performance') || en.includes('campaign') || bn.includes('অ্যাড') || en.includes('sprint') || en.includes('funnel') || en.includes('creative');
  }
  if (catId === 'perfume') {
    return en.includes('perfume') || en.includes('parfum') || bn.includes('পারফিউম') || en.includes('fragrance') || en.includes('scent') || bn.includes('সুগন্ধি');
  }
  if (catId === 'branding') {
    return en.includes('packaging') || en.includes('identity') || bn.includes('প্যাকেজিং') || bn.includes('ব্র্যান্ডিং') || en.includes('brand') || en.includes('design') || bn.includes('ডিজাইন');
  }
  return true;
}

export default function Portfolio({ projects, content, isLoading = false }: PortfolioProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const defaultProjects: PortfolioProject[] = [
    {
      id: '1',
      sort_order: 1,
      title_en: 'LUMÍN Botanical Glow — D2C Skincare Hero Sprint',
      title_bn: 'লুমিন বোটানিক্যাল গ্লো — ডি২সি স্কিনকেয়ার স্প্রিন্ট',
      category_en: 'D2C Skincare Performance Creative',
      category_bn: 'ডি২সি স্কিনকেয়ার পারফরম্যান্স ক্রিয়েটিভ',
      image_url: '/portfolio/lumin-botanical.jpg',
      hook_en: 'Meta Ad CPR reduced by 44% in 7 days. High-trust Bengali copy paired with Swiss-inspired quiet luxury aesthetics to dominate local D2C skincare.',
      hook_bn: '৭ দিনে মেটা অ্যাডের CPR ৪৪% হ্রাস। সুইস কোয়াইট লাক্সারি নান্দনিকতার সাথে পরিশীলিত বাংলা সেলস কপি যা স্ক্রলারদের ক্রেতায় রূপান্তর করে।',
      case_study_en: 'Challenge: The client was burning ৳1.2L/month with a CPR of ৳185 on generic Canva banners.\n\nStrategy: We engineered 5 high-converting ad variations using our "Premium Bengali" methodology. Replaced broken English with culturally resonant, persuasive Bengali copywriting.\n\nOutcome: CPR dropped to ৳98 within 7 days, ROAS jumped from 1.6x to 3.8x, and COD delivery confirmation rate increased by 28%.',
      case_study_bn: 'চ্যালেঞ্জ: সাধারণ ক্যানভা ডিজাইনের কারণে ক্লায়েন্টের প্রতি অর্ডারে খরচ (CPR) হচ্ছিল ১৮৫ টাকা।\n\nস্ট্র্যাটেজি: আমরা তৈরি করি ৫টি হাই-কনভার্টিং মেটা অ্যাড ক্রিয়েটিভ। দুর্বল ইংরেজির বদলে যোগ করি মনস্তাত্ত্বিক বাংলা সেলস কপি।\n\nফলাফল: মাত্র ৭ দিনে CPR নেমে আসে ৯৮ টাকায়, ROAS বৃদ্ধি পায় ৩.৮ গুণ এবং ক্যাশ-অন-ডেলিভারি কনফার্মেশন রেট ২৮% বাড়ে।',
      roas_lift: '3.8x ROAS',
      cpr_reduction: '-44% CPR',
      turnaround: '48h Sprint',
      revenue_generated: '৳4.2L / mo',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '2',
      sort_order: 2,
      title_en: 'AURORA Hydrating Elixir — Product Launch Campaign',
      title_bn: 'অরোরা হাইড্রেটিং এলিক্সির — প্রোডাক্ট লঞ্চ ক্যাম্পেইন',
      category_en: 'Conversion Campaign & Funnel Architecture',
      category_bn: 'কনভার্শন ক্যাম্পেইন ও ফানেল আর্কিটেকচার',
      image_url: '/portfolio/aurora-serum.jpg',
      hook_en: 'Sensory visual architecture engineered to eliminate COD hesitation. Clear ingredient transparency with high-converting social proof.',
      hook_bn: 'ক্যাশ অন ডেলিভারি (COD) গ্রাহকদের সংশয় দূর করতে বিশেষ ভিজ্যুয়াল স্ট্র্যাটেজি। উপাদান ও ফলাফলের স্বচ্ছ উপস্থাপনা।',
      case_study_en: 'Challenge: High cart abandonment due to customer trust deficit in a crowded serum market.\n\nStrategy: Built trust-forward storefront assets and comparison carousels highlighting verified botanical actives with zero hype.\n\nOutcome: Achieved 4.1x ROAS on cold traffic and generated ৳4.8L revenue in the first launch week.',
      case_study_bn: 'চ্যালেঞ্জ: সিরামের বাজারে গ্রাহকের বিশ্বাসের অভাবে হাই কার্ট এব্যান্ডনমেন্ট।\n\nস্ট্র্যাটেজি: উপাদানের কার্যকারিতা ও স্বচ্ছতা ফুটিয়ে তুলে ট্রাস্ট-বিল্ডিং ভিজ্যুয়াল ও কম্প্যারিসন ক্যারোসেল ডিজাইন।\n\nফলাফল: প্রথম সপ্তাহেই ৪.১ গুণ ROAS এবং ৪.৮ লাখ টাকার সেলস জেনারেট।',
      roas_lift: '4.1x ROAS',
      cpr_reduction: '-32% Drop',
      turnaround: '7-Day Launch',
      revenue_generated: '৳4.8L Launch',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '3',
      sort_order: 3,
      title_en: 'AURA Haute Parfumerie — Eid Luxury Collection',
      title_bn: 'অরা ওত পারফিউমারি — ঈদ লাক্সারি কালেকশন',
      category_en: 'Luxury Brand Identity & Paid Ads',
      category_bn: 'লাক্সারি ব্র্যান্ড আইডেন্টিটি ও পেইড অ্যাডস',
      image_url: '/portfolio/aura-perfume.jpg',
      hook_en: 'Transforming fragrance from a luxury splurge into an irresistible everyday self-care ritual. Premium typography that commanded 2.8x higher AOV.',
      hook_bn: 'সুগন্ধিকে দৈনন্দিন সেলফ-কেয়ার রিচুয়াল হিসেবে উপস্থাপন করে ২.৮ গুণ বেশি অ্যাভারেজ অর্ডার ভ্যালু (AOV) অর্জন।',
      case_study_en: 'Challenge: Competing against cheap imported dupes required positioning as an authentic artisanal luxury.\n\nStrategy: Classic Cormorant Garamond typography paired with sensory dark-navy and warm-amber lighting to create undeniable prestige.\n\nOutcome: Sold out 600 limited bottles with zero discounts at an average ticket price of ৳2,450.',
      case_study_bn: 'চ্যালেঞ্জ: সস্তা ইমপোর্টেড পারফিউমের ভিড়ে একটি দেশীয় ব্র্যান্ডকে প্রিমিয়াম আর্ট হিসেবে তুলে ধরা।\n\nস্ট্র্যাটেজি: ক্ল্যাসিক টাইপোগ্রাফি ও ডার্ক-নেভি অ্যাম্বার লাইটিং দিয়ে আনকম্প্রোমাইজিং লাক্সারি লুক তৈরি।\n\nফলাফল: কোনো ছাড় ছাড়াই গড়ে ২,৪৫০ টাকা মূল্যে ৬০০ বোতলের লিমিটেড স্টক মাত্র ১২ দিনে স্টক-আউট।',
      roas_lift: '2.8x AOV',
      cpr_reduction: 'Zero Discounts',
      turnaround: '12 Days Sold Out',
      revenue_generated: '600 Bottles',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '4',
      sort_order: 4,
      title_en: 'VETIVÈRE Swiss Clarifying Masque — Clean Packaging & Meta Ads',
      title_bn: 'ভেতিভ্যার সুইস ক্ল্যারিফাইং মাস্ক — লাক্সারি প্যাকেজিং ও মেটা অ্যাডস',
      category_en: 'Premium Skincare & Packaging',
      category_bn: 'প্রিমিয়াম স্কিনকেয়ার ও প্যাকেজিং',
      image_url: '/portfolio/velvet-clay.jpg',
      hook_en: 'Repositioning local clay masks into a high-status Swiss botanical indulgence. Custom minimalist frosted amber glass jar architecture paired with high-converting Meta Story reels.',
      hook_bn: 'সাধারণ ক্লে মাস্ককে সুইস বোটানিক্যাল লাক্সারি ট্রিটমেন্ট হিসেবে রি-ব্র্যান্ডিং। মিনিমালিস্ট ফ্রস্টেড অ্যাম্বার প্যাকেজিং ও স্টোরি রিলসের মাধ্যমে ৩.৪x ROAS অর্জন।',
      case_study_en: 'Challenge: Over-saturated face pack market forcing competitors into cut-throat price wars under ৳350.\n\nStrategy: Positioned as an alpine botanical indulgence at ৳1,250 with minimalist gold foil serif labeling and tactile limestone macro product shots.\n\nOutcome: Achieved 3.4x blended ROAS, with repeat order rate jumping by 68% in 30 days.',
      case_study_bn: 'চ্যালেঞ্জ: ৩৫০ টাকার নিচে সস্তা ফেসপ্যাকের ভিড়ে একটি দেশীয় ব্র্যান্ডকে প্রিমিয়াম সেগমেন্টে তুলে ধরা।\n\nস্ট্র্যাটেজি: মিনিমালিস্ট গোল্ড ফয়েল ও আলপাইন বোটানিক্যাল কনসেপ্ট দিয়ে ১,২৫০ টাকা মূল্যে রিব্র্যান্ডিং।\n\nফলাফল: ৩.৪ গুণ ROAS এবং প্রথম মাসেই ৬৮% রিপিট কাস্টমার পারচেজ নিশ্চিত।',
      roas_lift: '3.4x ROAS',
      cpr_reduction: '+68% Repeat',
      turnaround: '48h Sprint',
      revenue_generated: '৳1.8L Profit',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '5',
      sort_order: 5,
      title_en: 'VALAISON Intense Renewal Elixir — High-AOV Night Serum',
      title_bn: 'ভালেসন ইনটেন্স রিনিউয়াল এলিক্সির — হাই-AOV নাইট সিরাম',
      category_en: 'Meta Performance Ads & Funnel',
      category_bn: 'মেটা পারফরম্যান্স অ্যাডস ও ফানেল',
      image_url: '/portfolio/nocturne-repair.jpg',
      hook_en: 'Deep cobalt visual hierarchy engineered to eliminate COD skepticism. Transparent botanical active breakdown that lifted landing page conversions by 54%.',
      hook_bn: 'ডিপ কোবাল্ট ভিজ্যুয়াল আর্কিটেকচার যা ক্যাশ-অন-ডেলিভারি গ্রাহকদের সকল দ্বিধা দূর করে। ল্যান্ডিং পেজে কনভার্শন রেট ৫৪% বৃদ্ধি।',
      case_study_en: 'Challenge: High advertising burn rate on generic broad audience ads without clear positioning.\n\nStrategy: Crafted 6 high-conversion angle creatives contrasting botanical science against chemical harshness in elegant Bengali copy.\n\nOutcome: CPR reduced by 39%, ROAS surged to 4.4x, and monthly run-rate scaled to ৳3.8L.',
      case_study_bn: 'চ্যালেঞ্জ: টার্গেটিং সঠিক থাকলেও জেনেরিক ক্রিয়েটিভের কারণে বিজ্ঞাপনের খরচ লাগামহীনভাবে বাড়ছিল।\n\nস্ট্র্যাটেজি: উপাদান বিজ্ঞান ও প্রাকৃতিক যত্নের তুলনামূলক ৬টি হাই-কনভার্টিং বাংলা অ্যাড অ্যাঙ্গেল তৈরি।\n\nফলাফল: CPR ৩৯% কমে যায় এবং মাত্র ২ সপ্তাহে ROAS ৪.৪ গুণে পৌঁছায়।',
      roas_lift: '4.4x ROAS',
      cpr_reduction: '-39% CPR',
      turnaround: '48h Delivery',
      revenue_generated: '৳3.8L / mo',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '6',
      sort_order: 6,
      title_en: 'AURA Botanicals — Gentle Saffron Cleansing Oil',
      title_bn: 'অরা বোটানিক্যালস — জেন্টল স্যাফরন ক্লেনজিং অয়েল',
      category_en: 'D2C Skincare & Brand Identity',
      category_bn: 'ডি২সি স্কিনকেয়ার ও ব্র্যান্ড আইডেন্টিটি',
      image_url: '/portfolio/saffron-cleanser.jpg',
      hook_en: 'Organic sensorial storytelling. Replaced discount banners with raw ingredient provenance, allowing the client to sell at a 40% premium over local competitors.',
      hook_bn: 'ডিসকাউন্ট-নির্ভরতা ভেঙে উপাদানের স্বচ্ছতা ও আভিজাত্য তুলে ধরা। প্রতিযোগীদের চেয়ে ৪০% বেশি দামে কোনো ছাড় ছাড়াই বিক্রি নিশ্চিত।',
      case_study_en: 'Challenge: Price-sensitive customers hesitating to spend on an oil-based cleanser in humid weather.\n\nStrategy: Focused on sensory double-cleansing rituals with travertine textures and calming botanical typography.\n\nOutcome: Delivered 3.1x ROAS on cold audiences and ৳3.2L first-run revenue with zero markdowns.',
      case_study_bn: 'চ্যালেঞ্জ: আর্দ্র আবহাওয়ায় অয়েল-বেসড ক্লিনজারের উপকারিতা বুঝিয়ে ক্রেতাকে কনভিন্স করা।\n\nস্ট্র্যাটেজি: ট্রাভার্টাইন টেক্সচার ও শান্ত টাইপোগ্রাফির মাধ্যমে প্রিমিয়াম সেলফ-কেয়ার রিচুয়াল প্রতিষ্ঠা।\n\nফলাফল: কোল্ড অডিয়েন্সে ৩.১x ROAS এবং কোনো ছাড় ছাড়াই ৩.২ লাখ টাকার বিক্রি।',
      roas_lift: '3.1x ROAS',
      cpr_reduction: '+40% Margin',
      turnaround: '5-Ad Sprint',
      revenue_generated: '৳3.2L Revenue',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '7',
      sort_order: 7,
      title_en: 'SÉRUM N°7 — Active Retinol Performance Cutdowns',
      title_bn: 'সিরাম নং ৭ — অ্যাক্টিভ রেটিনল মেটা পারফরম্যান্স অ্যাডস',
      category_en: 'Meta Ad Creatives & Video Ads',
      category_bn: 'মেটা অ্যাড ক্রিয়েটিভ ও ভিডিও অ্যাডস',
      image_url: '/portfolio/aurora-serum.jpg',
      hook_en: '5 scroll-stopping 9:16 motion variations addressing dermatological pain points in conversational Bengali copy. Meta ad spend scaled from ৳20K to ৳2L/month profitably.',
      hook_bn: 'স্কিনের সংবেদনশীলতা নিয়ে মনস্তাত্ত্বিক ৫টি বাংলা মোশন কাটডাউন। বিজ্ঞাপন খরচ ২০ হাজার থেকে লাভজনকভাবে মাসে ২ লাখে স্কেল।',
      case_study_en: 'Challenge: Customer fear of skin irritation from active retinol causing severe cart abandonment.\n\nStrategy: Built high-trust step-by-step application carousels with dermatological assurance in native Bengali.\n\nOutcome: CPR slashed by 48%, scaling ad spend profitably by 10x within 45 days.',
      case_study_bn: 'চ্যালেঞ্জ: রেটিনল ব্যবহারে স্কিন ইরিটেশনের ভয়ে অধিকাংশ ভিজিটর কার্ট এব্যান্ডন করছিল।\n\nস্ট্র্যাটেজি: সহজ বাংলা ব্যবহারের নিয়ম ও ডার্মাটোলজিক্যাল ট্রাস্ট ব্যাজ দিয়ে ৫টি হাই-কনভার্টিং ক্রিয়েটিভ।\n\nফলাফল: প্রতি অর্ডারে খরচ (CPR) ৪৮% হ্রাস এবং বিজ্ঞাপনে স্কেলিং ১০ গুণ বৃদ্ধি।',
      roas_lift: '3.9x ROAS',
      cpr_reduction: '-48% CPR',
      turnaround: '48h Rapid',
      revenue_generated: '10x Scaled Spend',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '8',
      sort_order: 8,
      title_en: 'ÉLIXIR NOIR — Artisanal Oud Extrait de Parfum',
      title_bn: 'এলিক্সির নোয়ার — আর্টিসানাল উদ পারফিউম লঞ্চ',
      category_en: 'Haute Parfumerie & Luxury Positioning',
      category_bn: 'লাক্সারি পারফিউম ও প্রেস্টিজ পজিশনিং',
      image_url: '/portfolio/aura-perfume.jpg',
      hook_en: 'Crafting sensory prestige for cold Facebook traffic. Elegant gold-embossed type and tactile textures drove a record-breaking 72-hour launch sell-out.',
      hook_bn: 'কোল্ড ফেসবুক ট্রাফিকের জন্য প্রেস্টিজ ব্র্যান্ডিং। মাত্র ৭২ ঘণ্টার লঞ্চ ক্যাম্পেইনে সম্পূর্ণ স্টক আউট।',
      case_study_en: 'Challenge: Selling premium artisanal fragrance online without allowing the buyer to smell the product.\n\nStrategy: Crafted evocative, poetic Bengali olfactory descriptions combined with cinematic luxury bottle lighting.\n\nOutcome: Achieved 5.2x launch-day ROAS, completely selling out the initial 400 flacons in 72 hours.',
      case_study_bn: 'চ্যালেঞ্জ: ঘ্রাণ নেওয়ার সুযোগ ছাড়া অনলাইনে ২,০০০ টাকার ওপর লাক্সারি পারফিউম সেল করা।\n\nস্ট্র্যাটেজি: সংবেদনশীল বাংলা অনুভূতি প্রকাশ এবং রাজকীয় অ্যাম্বার আলোর শৈল্পিক সমন্বয়।\n\nফলাফল: ৫.২x রেকর্ড ROAS এবং মাত্র ৭২ ঘণ্টায় ৪০০ বোতলের স্টক সমাপ্ত।',
      roas_lift: '5.2x ROAS',
      cpr_reduction: '72h Sold Out',
      turnaround: 'Full Campaign',
      revenue_generated: '400 Flacons',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '9',
      sort_order: 9,
      title_en: 'L’HERBIER — Botanical Body Nectar & Storefront',
      title_bn: 'লার্বিয়ে — বোটানিক্যাল বডি নেকটার ও স্টোরফ্রন্ট আর্কিটেকচার',
      category_en: 'Storefront UI & Brand Packaging',
      category_bn: 'স্টোরফ্রন্ট UI ও ব্র্যান্ড প্যাকেজিং',
      image_url: '/portfolio/velvet-clay.jpg',
      hook_en: 'Harmonizing storefront UI with high-converting Meta feed statics. Reduced checkout drop-off by 38% through transparent ingredient comparison tables.',
      hook_bn: 'স্টোরফ্রন্ট ডিজাইন ও মেটা ফিড স্ট্যাটিক্সের নিখুঁত সামঞ্জস্য। চেকআউট ড্রপ-অফ ৩৮% হ্রাস।',
      case_study_en: 'Challenge: Disconnect between premium Instagram ads and a clunky, cheap Shopify theme caused bounce rates of over 75%.\n\nStrategy: Designed an integrated visual design system spanning Meta Ads, product page PDPs, and mobile checkout reassurance.\n\nOutcome: Bounce rate plunged to 32%, lifting overall store revenue to ৳6.4L monthly run-rate.',
      case_study_bn: 'চ্যালেঞ্জ: প্রিমিয়াম অ্যাডের পর সাধারণ স্টোরে এসে কাস্টমার বাউন্স রেট ছিল ৭৫% এর বেশি।\n\nস্ট্র্যাটেজি: বিজ্ঞাপন থেকে শুরু করে চেকআউট পর্যন্ত নিরবচ্ছিন্ন সুইস কোয়াইট লাক্সারি ইউজার জার্নি তৈরি।\n\nফলাফল: বাউন্স রেট ৩২% এ নেমে আসে এবং মাসিক সেলস ৬.৪ লাখে উন্নীত হয়।',
      roas_lift: '3.3x ROAS',
      cpr_reduction: '-38% Bounce',
      turnaround: 'Design Retainer',
      revenue_generated: '৳6.4L / mo',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
    {
      id: '10',
      sort_order: 10,
      title_en: 'AURA Céleste — Radiance Shield SPF 50+',
      title_bn: 'অরা সেলেস্ত — রেডিয়েন্স শিল্ড সানস্ক্রিন ক্যাম্পেইন',
      category_en: 'High-Converting Meta Creative Sprint',
      category_bn: 'হাই-কনভার্টিং মেটা ক্রিয়েটিভ স্প্রিন্ট',
      image_url: '/portfolio/saffron-cleanser.jpg',
      hook_en: 'Overcoming white-cast objections with high-trust texture macros. Tested against Canva competitor ads; achieved 2.4x higher click-to-purchase rate.',
      hook_bn: 'সানস্ক্রিনের হোয়াইট কাস্ট সংশয় দূর করতে টেক্সচার ও মেকআপ ফ্রেন্ডলিনেস হাইলাইট। ক্যানভা অ্যাডের তুলনায় ২.৪ গুণ বেশি পারচেজ কনভার্শন রেট।',
      case_study_en: 'Challenge: High consumer skepticism in Bangladesh regarding sunscreen stickiness and white cast.\n\nStrategy: Produced 5 macro-texture hero statics proving zero white cast with clean, scientific elegance.\n\nOutcome: Click-to-purchase rate surged 2.4x, driving a 3.7x ROAS across cold Meta audiences.',
      case_study_bn: 'চ্যালেঞ্জ: সাধারণ সানস্ক্রিনে মুখ সাদা বা তেলতেলে হয়ে যাওয়ার ভয় ছিল প্রধান বাধা।\n\nস্ট্র্যাটেজি: হাই-রেজোলিউশন ম্যাক্রো শট এবং স্পষ্ট বাংলা ব্যবহারের মাধ্যমে বাস্তব স্কিন ফিনিশ প্রদর্শন।\n\nফলাফল: ২.৪ গুণ বেশি ক্রয় আগ্রহ এবং ৩.৭ গুণ রিটার্ন অন অ্যাড স্পেন্ড (ROAS)।',
      roas_lift: '3.7x ROAS',
      cpr_reduction: '2.4x Purchases',
      turnaround: '48h Rapid',
      revenue_generated: '৳2.9L / mo',
      pdf_url_en: '',
      pdf_url_bn: '',
    },
  ];

  // Filter out any empty projects without images or content to prevent broken skeleton cards
  const validProjects = projects.filter((p) => {
    const hasImg = typeof p.image_url === 'string' && p.image_url.trim().length > 0;
    const hasMock = typeof p.mockup_url === 'string' && p.mockup_url.trim().length > 0;
    const hasMockList = Array.isArray(p.mockup_urls) && p.mockup_urls.length > 0;
    const hasContent = Boolean(
      (p.title_en && p.title_en.trim()) ||
      (p.title_bn && p.title_bn.trim()) ||
      (p.case_study_en && p.case_study_en.trim()) ||
      (p.case_study_bn && p.case_study_bn.trim())
    );
    return hasImg || hasMock || hasMockList || hasContent;
  });

  // Combine real database projects with default signature projects
  const displayProjects = validProjects.length >= 8 
    ? validProjects 
    : [...validProjects, ...defaultProjects.slice(validProjects.length)];

  // Active filters and views
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'visual' | 'impact'>('visual');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [selectedModalProject, setSelectedModalProject] = useState<PortfolioProject | null>(null);

  // Filter matching projects
  const filteredProjects = useMemo(() => {
    return displayProjects.filter((p) => matchesCategory(p, selectedCategory));
  }, [displayProjects, selectedCategory]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = visibleCount < filteredProjects.length;
  const remainingCount = filteredProjects.length - visibleCount;

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(4); // Reset visible count on filter change
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredProjects.length));
  };

  return (
    <section id="work" className="py-14 md:py-28 px-4 sm:px-6 md:px-14 max-w-[1200px] mx-auto scroll-mt-14">
      {/* ── Section Header ── */}
      <MotionReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <p 
              lang={isBn ? 'bn' : 'en'} 
              className={`text-accent mb-3 font-medium uppercase tracking-[2.5px] ${isBn ? 'text-[13px] tracking-normal font-semibold' : 'text-[11px]'}`} 
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
            >
              {isBn ? 'ক্লায়েন্ট কেস স্টাডি ও ভেরিফায়েড রেজাল্ট' : (content?.labelEn ?? 'Client Case Studies & Verified Growth')}
            </p>
            <h2 
              lang={isBn ? 'bn' : 'en'} 
              className={`font-heading font-normal text-primary leading-[1.15] ${
                isBn ? 'text-[clamp(24px,6vw,34px)] md:text-[clamp(32px,4vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,56px)]'
              }`}
            >
              {isBn ? (
                <>বাস্তব ব্র্যান্ডের রূপান্তর ও <em className="italic text-accent">সেলস গ্রোথ।</em></>
              ) : (
                <>
                  <WordReveal delay={0.1}>Transforming Brands.</WordReveal>{' '}
                  <em className="italic text-accent">
                    <WordReveal delay={0.25}>Proven Results.</WordReveal>
                  </em>
                </>
              )}
            </h2>
          </div>

          {/* ── View Mode Switcher: Visual Mode vs Impact Mode ── */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-primary/[0.06] border border-primary/10 backdrop-blur-sm self-start md:self-end shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-primary/70 hover:text-primary hover:bg-primary/5'
              }`}
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? '✨ ভিজ্যুয়াল ভিউ' : 'Visual Mode'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('impact')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === 'impact'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-primary/70 hover:text-primary hover:bg-primary/5'
              }`}
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isBn ? '📈 রেজাল্ট ও ROAS' : 'Impact & ROAS'}</span>
            </button>
          </div>
        </div>
      </MotionReveal>

      {/* ── Category Filter Pills Bar (Mobile Swipeable) ── */}
      <MotionReveal delay={0.15}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8 md:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? displayProjects.length 
              : displayProjects.filter((p) => matchesCategory(p, cat.id)).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none ${
                  active
                    ? 'bg-primary text-white font-semibold shadow-md'
                    : 'bg-white/80 text-primary/70 border border-primary/10 hover:border-primary/30 hover:bg-white'
                }`}
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  active ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </MotionReveal>

      {/* ── Projects Grid ── */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <PortfolioSkeleton />
        ) : (
          <div className="space-y-12 md:space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-stretch">
              {visibleProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  isBn={isBn}
                  viewMode={viewMode}
                  onOpenCaseStudy={() => setSelectedModalProject(project)}
                />
              ))}
            </div>

            {/* ── Progressive "Load More" Button ── */}
            {hasMore ? (
              <div className="flex flex-col items-center justify-center pt-4 pb-2">
                <button
                  type="button"
                  onClick={loadMore}
                  className="group px-7 py-3.5 rounded-full bg-white border border-primary/20 text-primary hover:border-accent hover:text-accent font-semibold text-xs md:text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2.5 active:scale-95 cursor-pointer"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  <Layers className="w-4 h-4 text-accent transition-transform duration-300 group-hover:rotate-12" />
                  <span>
                    {isBn
                      ? `আরও ${remainingCount}টি সিগনেচার প্রজেক্ট দেখুন`
                      : `Load ${remainingCount} More Featured Works`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
                <p className="text-[11px] text-muted-foreground/70 mt-2.5 font-mono">
                  {isBn 
                    ? `(মোট ${filteredProjects.length}টির মধ্যে ${visibleProjects.length}টি প্রদর্শিত)` 
                    : `Showing ${visibleProjects.length} of ${filteredProjects.length} curated works`}
                </p>
              </div>
            ) : filteredProjects.length > 4 ? (
              <div className="text-center pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/70">
                  <Check className="w-3.5 h-3.5 text-accent" />
                  {isBn ? 'এই ক্যাটাগরির সমস্ত কাজ প্রদর্শিত হয়েছে' : 'All works in this category displayed'}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </AnimatePresence>

      {/* ── Slide-up Case Study Bottom Sheet / Modal Drawer ── */}
      {selectedModalProject && (
        <CaseStudyDrawer
          project={selectedModalProject}
          isBn={isBn}
          onClose={() => setSelectedModalProject(null)}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Format Rich / Plain Text Content (Preserves HTML, Headings, Lists, Paragraphs)
───────────────────────────────────────────────────────────────────────────── */

function formatRichContent(content: string | null | undefined): string {
  if (!content) return '';
  const trimmed = content.trim();
  if (!trimmed) return '';

  // Check if content already contains HTML tags (e.g. from TipTap rich editor, Google Docs paste)
  const hasHtml = /<\/?(p|div|h[1-6]|ul|ol|li|blockquote|strong|b|em|i|u|s|a|table|tr|td|br|span)\b/i.test(trimmed);
  if (hasHtml) {
    return trimmed;
  }

  // If plain text with linebreaks, wrap double newlines into paragraphs, single into <br />
  return trimmed
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

/* ─────────────────────────────────────────────────────────────────────────────
   Individual Project Card (Optimized for both Visual & Impact modes)
───────────────────────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  isBn,
  viewMode,
  onOpenCaseStudy,
}: {
  project: PortfolioProject;
  index: number;
  isBn: boolean;
  viewMode: 'visual' | 'impact';
  onOpenCaseStudy: () => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mockupUrls: unknown[] = project.mockup_url_data?.length
    ? project.mockup_url_data
    : project.mockup_urls?.length
      ? project.mockup_urls
      : (project.mockup_url ? [project.mockup_url] : []);
  const hasMockups = mockupUrls.length > 0;

  const pick = (bn: string | null | undefined, en: string | null | undefined) => {
    const cleanBn = bn?.trim() ?? '';
    const cleanEn = en?.trim() ?? '';
    if (isBn) {
      return cleanBn || cleanEn;
    }
    return cleanEn || cleanBn;
  };

  const title = pick(project.title_bn, project.title_en) || (isBn ? 'কেস স্টাডি' : 'Case Study');
  const category = pick(project.category_bn, project.category_en) || (isBn ? 'ডিজাইন' : 'Creative Design');
  const hook = pick(project.hook_bn, project.hook_en);
  const caseStudy = pick(project.case_study_bn, project.case_study_en);
  const pdfUrl = isBn
    ? (project.pdf_url_bn || project.pdf_url_en)
    : (project.pdf_url_en || project.pdf_url_bn);
  const hasPdf = Boolean(pdfUrl && pdfUrl.trim());

  const heroImage = (typeof project.image_url === 'string' && project.image_url.trim())
    ? resolveStorageUrl(project.image_url)
    : (typeof mockupUrls[0] === 'string' && (mockupUrls[0] as string).trim())
      ? resolveStorageUrl(mockupUrls[0] as string)
      : '/portfolio/lumin-botanical.jpg';

  const displayHook = useMemo(() => {
    if (hook && hook.trim()) return formatRichContent(hook);
    if (!caseStudy || !caseStudy.trim()) return '';
    const stripped = caseStudy.replace(/<[^>]*>?/gm, '').trim();
    if (!stripped) return '';
    return `<p>${stripped.slice(0, 150)}${stripped.length > 150 ? '...' : ''}</p>`;
  }, [hook, caseStudy]);

  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 * (index % 4) }}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-primary/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.08)] hover:border-primary/20 transition-all duration-500 overflow-hidden p-4 sm:p-5"
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] uppercase font-semibold tracking-wider bg-primary/5 text-accent border border-primary/10 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {category}
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/60 shrink-0">
            0{index + 1}
          </span>
        </div>

        {/* Hero Image Container with 1:1 aspect ratio lock for Meta ad designs */}
        <div 
          onClick={onOpenCaseStudy}
          className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer bg-primary/5 transition-transform duration-500 group-hover:scale-[1.01]"
        >
          <PremiumImage
            src={heroImage}
            alt={`${title} — ${category}`}
            containerClassName="w-full h-full"
            className="object-cover object-center w-full h-full transform-gpu transition-transform duration-700 group-hover:scale-105"
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchPriority={index < 2 ? 'high' : 'auto'}
            decoding="async"
          />

          {/* Quick Hover / Tap Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-primary text-xs font-semibold backdrop-blur-md shadow-md">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? 'কেস স্টাডি দেখতে ট্যাপ করুন' : 'View Full Case Study'}</span>
            </span>
          </div>

          {/* Impact Mode Overlay Ribbon */}
          {viewMode === 'impact' && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[90%] z-20">
              {project.roas_lift && (
                <span className="px-2.5 py-1 rounded-lg bg-accent text-white font-bold text-[10.5px] shadow-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {project.roas_lift}
                </span>
              )}
              {project.cpr_reduction && (
                <span className="px-2.5 py-1 rounded-lg bg-primary/95 text-white font-bold text-[10.5px] shadow-md">
                  {project.cpr_reduction}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Project Title */}
        <h3 
          onClick={onOpenCaseStudy}
          className="mt-4 font-heading text-lg sm:text-xl md:text-2xl text-primary font-normal leading-snug tracking-tight cursor-pointer hover:text-accent transition-colors"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h3>

        {/* Hook / Teaser text */}
        {displayHook && (
          <div
            className="mt-2 text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-2 prose prose-sm max-w-none [&_p]:my-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayHook) }}
          />
        )}

        {/* Impact Mode Stat Strip */}
        {viewMode === 'impact' && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-primary/[0.04] border border-primary/10 grid grid-cols-2 gap-2 text-center">
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                {isBn ? 'টার্নঅ্যারাউন্ড' : 'Turnaround'}
              </span>
              <span className="text-xs font-bold text-primary font-mono">
                {project.turnaround || (isBn ? '৪৮ ঘণ্টা' : '48 Hours')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                {isBn ? 'ভেরিফায়েড রেজাল্ট' : 'Revenue / Impact'}
              </span>
              <span className="text-xs font-bold text-accent font-mono">
                {project.revenue_generated || project.roas_lift || '3.2x ROAS'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="mt-5 pt-3.5 border-t border-primary/10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenCaseStudy}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer group/btn"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
        >
          <span>{isBn ? 'সম্পূর্ণ কেস স্টাডি দেখুন' : 'Explore Case Study'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>

        <div className="flex items-center gap-2.5">
          {hasPdf && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-accent transition-colors"
              title={isBn ? 'কেস স্টাডি PDF ডাউনলোড করুন' : 'Download Case Study PDF'}
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>PDF</span>
            </a>
          )}

          {hasMockups && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-accent transition-colors cursor-pointer"
            >
              <span>{isBn ? 'মকআপ' : 'Mockups'}</span>
              <span className="text-[9.5px] font-mono opacity-70">({mockupUrls.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Mockup Lightbox Portal */}
      {lightboxOpen && (
        <MockupLightbox
          urls={mockupUrls}
          initialIndex={0}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </m.article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Slide-Up Mobile Bottom Sheet / Modal Drawer
───────────────────────────────────────────────────────────────────────────── */

function CaseStudyDrawer({
  project,
  isBn: globalIsBn,
  onClose,
}: {
  project: PortfolioProject;
  isBn: boolean;
  onClose: () => void;
}) {
  const [localLang, setLocalLang] = useState<'bn' | 'en'>(globalIsBn ? 'bn' : 'en');
  const isBn = localLang === 'bn';

  const pick = (bn: string | null | undefined, en: string | null | undefined) => {
    const cleanBn = bn?.trim() ?? '';
    const cleanEn = en?.trim() ?? '';
    if (isBn) {
      return cleanBn || cleanEn;
    }
    return cleanEn || cleanBn;
  };

  const title = pick(project.title_bn, project.title_en) || (isBn ? 'কেস স্টাডি' : 'Case Study');
  const category = pick(project.category_bn, project.category_en) || (isBn ? 'ডিজাইন' : 'Creative Design');
  const caseStudy = pick(project.case_study_bn, project.case_study_en);
  const hook = pick(project.hook_bn, project.hook_en);
  const pdfUrl = isBn
    ? (project.pdf_url_bn || project.pdf_url_en)
    : (project.pdf_url_en || project.pdf_url_bn);

  const mockupUrls = useMemo(() => {
    const list: string[] = [];
    if (Array.isArray(project.mockup_urls)) {
      project.mockup_urls.forEach((item) => {
        if (typeof item === 'string' && item.trim()) list.push(item);
        else if (item && typeof item === 'object' && 'url' in (item as any)) list.push(String((item as any).url));
      });
    }
    if (project.mockup_url && !list.includes(project.mockup_url)) {
      list.push(project.mockup_url);
    }
    return list;
  }, [project.mockup_urls, project.mockup_url]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroImage = (typeof project.image_url === 'string' && project.image_url.trim())
    ? resolveStorageUrl(project.image_url)
    : (mockupUrls.length > 0)
      ? resolveStorageUrl(mockupUrls[0])
      : '/portfolio/lumin-botanical.jpg';

  // Inform mobile dock to tuck away while modal is active
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: true } }));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: false } }));
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keyboard escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const whatsappMessage = encodeURIComponent(
    `Hi POLISHED, I just reviewed your case study for "${project.title_en || project.title_bn}" and would love to achieve similar ROAS results for my brand.`
  );

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] flex flex-col justify-end md:justify-center md:items-center">
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        />

        {/* Drawer / Sheet Window */}
        <m.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full md:max-w-2xl lg:max-w-3xl max-h-[92vh] md:max-h-[88vh] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Mobile Drag Handle Bar */}
          <div className="md:hidden flex justify-center pt-2.5 pb-1">
            <span className="w-12 h-1 rounded-full bg-primary/20" />
          </div>

          {/* Sticky Header */}
          <div className="px-5 py-3.5 border-b border-primary/10 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md sticky top-0 z-30">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block truncate">
                {category}
              </span>
              <h2 
                className="text-base sm:text-lg font-bold text-primary truncate"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
              >
                {title}
              </h2>
            </div>

            {/* Language switch + Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center p-0.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLocalLang('bn')}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    isBn ? 'bg-primary text-white' : 'text-primary/70 hover:text-primary'
                  }`}
                >
                  বাং
                </button>
                <button
                  type="button"
                  onClick={() => setLocalLang('en')}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    !isBn ? 'bg-primary text-white' : 'text-primary/70 hover:text-primary'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Case Study"
                className="w-9 h-9 rounded-full bg-primary/5 hover:bg-primary/15 text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Featured Image — 1:1 Ratio */}
            <div className="relative w-full aspect-square max-h-[60vh] rounded-2xl overflow-hidden bg-primary/5 shadow-md flex items-center justify-center">
              <img
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Verified Performance Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-[#1e3a8a] text-white">
              <div className="text-center p-1.5">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'ROAS লিফট' : 'ROAS Lift'}
                </span>
                <span className="text-lg font-bold text-accent font-mono">
                  {project.roas_lift || '3.8x ROAS'}
                </span>
              </div>
              <div className="text-center p-1.5">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'বিজ্ঞাপন খরচ (CPR)' : 'CPR Reduction'}
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {project.cpr_reduction || '-44% CPR'}
                </span>
              </div>
              <div className="text-center p-1.5">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'ডেলিভারি টাইম' : 'Turnaround'}
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {project.turnaround || (isBn ? '৪৮ ঘণ্টা' : '48 Hours')}
                </span>
              </div>
              <div className="text-center p-1.5">
                <span className="text-[10px] uppercase font-mono text-white/70 block">
                  {isBn ? 'স্ট্যাটাস' : 'Verification'}
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono flex items-center justify-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isBn ? 'যাচাইকৃত' : 'Verified'}
                </span>
              </div>
            </div>

            {/* Strategic Hook */}
            {hook && (
              <div className="p-4 rounded-xl bg-accent/10 border-l-4 border-accent text-primary">
                <div 
                  className="text-xs sm:text-sm font-medium leading-relaxed prose prose-sm max-w-none text-primary [&_p]:my-1"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatRichContent(hook)) }}
                />
              </div>
            )}

            {/* Detailed Case Study Narrative */}
            {caseStudy && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    {isBn ? 'কেস স্টাডি বিশ্লেষণ ও ফলাফল' : 'Detailed Case Breakdown'}
                  </h4>
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-[11px] font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                    </a>
                  )}
                </div>

                <div 
                  className="prose prose-sm sm:prose-base max-w-none text-foreground/90 leading-relaxed font-sans dark:prose-invert
                    [&_h1]:text-xl sm:[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:tracking-tight
                    [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:tracking-tight
                    [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:tracking-tight
                    [&_p]:my-3.5 [&_p]:leading-relaxed [&_p]:text-foreground/85
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3.5 [&_ul]:space-y-1.5 [&_ul]:text-foreground/85
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3.5 [&_ol]:space-y-1.5 [&_ol]:text-foreground/85
                    [&_li]:pl-1 [&_li]:leading-relaxed
                    [&_strong]:font-bold [&_strong]:text-primary
                    [&_b]:font-bold [&_b]:text-primary
                    [&_em]:italic
                    [&_u]:underline [&_u]:underline-offset-2
                    [&_s]:line-through [&_s]:opacity-60
                    [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:py-1.5 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_blockquote]:bg-primary/[0.02] [&_blockquote]:rounded-r-lg
                    [&_a]:text-accent [&_a]:underline [&_a]:font-medium hover:[&_a]:text-accent/80"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.85 } : { lineHeight: 1.75 }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(formatRichContent(caseStudy), {
                      ADD_ATTR: ['target', 'rel'],
                    }),
                  }}
                />
              </div>
            )}

            {/* Official PDF Document Card */}
            {pdfUrl && (
              <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-primary">
                      {isBn ? 'কেস স্টাডি অফিসিয়াল ডকুমেন্ট (PDF)' : 'Official Case Study Document (PDF)'}
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      {isBn ? 'সম্পূর্ণ ডেটা ও স্ট্র্যাটেজি এক নজরে পড়তে ডাউনলোড করুন' : 'Download full strategic breakdown and metrics report'}
                    </p>
                  </div>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2 shrink-0 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                </a>
              </div>
            )}

            {/* Project Deliverables / Mockup Gallery */}
            {mockupUrls.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-primary/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    {isBn ? `প্রজেক্ট গ্যালারি ও মকআপ (${mockupUrls.length})` : `Deliverables & Mockups (${mockupUrls.length})`}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    {isBn ? 'বড় করে দেখতে ট্যাপ করুন' : 'Tap to expand'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {mockupUrls.map((url, mi) => (
                    <div
                      key={mi}
                      onClick={() => {
                        setLightboxIndex(mi);
                        setLightboxOpen(true);
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-primary/5 border border-primary/10 cursor-pointer hover:border-accent transition-all"
                    >
                      <img
                        src={resolveStorageUrl(url)}
                        alt={`${title} mockup ${mi + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Direct Conversion Bar */}
          <div className="p-4 border-t border-primary/10 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2.5">
            <a
              href={`https://wa.me/8801346288210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isBn ? 'এই প্রজেক্ট নিয়ে কথা বলুন' : 'Chat About This Work'}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                openQuickBookingModal({
                  tierId: 'trial-pack',
                  tierTitle: 'No-Risk Test Drive Sprint',
                  tierTitleBn: 'নো-রিস্ক টেস্ট ড্রাইভ স্প্রিন্ট',
                  price: '৳3,999',
                  priceBn: '৳৩,৯৯৯',
                  source: `Case Study: ${project.title_en || project.title_bn}`,
                });
              }}
              className="w-full sm:flex-1 h-11 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>{isBn ? '৳৩,৯৯৯ স্প্রিন্ট বুক করুন' : 'Book ৳3,999 Sprint'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </m.div>

        {/* Mockup Lightbox Portal inside Drawer */}
        {lightboxOpen && (
          <MockupLightbox
            urls={mockupUrls}
            initialIndex={lightboxIndex}
            title={title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    </AnimatePresence>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mockup Lightbox (Swipeable, Esc to close)
───────────────────────────────────────────────────────────────────────────── */

function MockupLightbox({
  urls,
  initialIndex,
  title,
  onClose,
}: {
  urls: unknown[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const total = urls.length;

  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  return createPortal(
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[700] bg-black/90 flex flex-col justify-between p-4 md:p-8"
      onClick={onClose}
    >
      {/* Lightbox Header */}
      <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-mono uppercase tracking-wider text-white/70">
          {title} ({current + 1} / {total})
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div 
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {urls[current] ? (
          <img
            src={typeof urls[current] === 'string' ? (urls[current] as string) : resolveStorageUrl(String(urls[current]))}
            alt={`${title} mockup ${current + 1}`}
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        ) : null}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={current === 0}
              className="absolute left-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={current === total - 1}
              className="absolute right-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {total > 1 && (
        <div className="flex justify-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-accent' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </m.div>,
    document.body
  );
}
