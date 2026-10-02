import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Zap,
  ShoppingBag,
  Share2
} from 'lucide-react';
import type { ServicesMetaContent } from '@/types/database';

interface ServicesProps {
  services?: any[];
  content?: ServicesMetaContent | null;
}

export default function Services({ content }: ServicesProps) {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState(0);

  const servicesData = [
    {
      id: 'social-media',
      num: '01',
      titleEn: 'High-Conversion Social Media Design',
      titleBn: 'হাই-কনভার্শন সোশ্যাল মিডিয়া ডিজাইন',
      targetEn: 'For D2C Skincare, Haircare & Wellness Brands',
      targetBn: 'ডি২সি স্কিনকেয়ার, হেয়ারকেয়ার ও ওয়েলনেস ব্র্যান্ডের জন্য',
      turnaroundEn: '48-Hour Rapid Sprint',
      turnaroundBn: '৪৮ ঘণ্টার র্যাপিড স্প্রিন্ট',
      icon: Share2,
      descEn:
        'Feed posts, carousels, reels covers, and ad funnels using our signature "Premium Bengali" approach. Specifically engineered to stop the frantic scroll within 0.8 seconds and convert scrollers into high-value buyers.',
      descBn:
        'ফিড পোস্ট, ক্যারোসেল, রিলস কভার এবং সম্পূর্ণ মেটা অ্যাড ফানেল—আমাদের সিগনেচার "প্রিমিয়াম বাংলা" মেথডে তৈরি। যা প্রথম ০.৮ সেকেন্ডেই স্ক্রলিং থামিয়ে সাধারণ স্ক্রোলারদের উচ্চমূল্যের বিশ্বস্ত ক্রেতায় রূপান্তর করে।',
      deliverablesEn: [
        '5 to 15 High-Converting Feed & Meta Ad Creatives (Statics + Motion Cutdowns)',
        'Culturally Intelligent, Sophisticated Bengali Copywriting & Emotional Hooks',
        '100% Meta Ad Policy Compliance Audit (Guaranteed protection against ad bans)',
        'Multiple Audience Testing Angles (A/B testing ready for ads manager)',
        'Full Source Files (Figma / Canva / PSD) + Optimized WebP/PNG Exports',
      ],
      deliverablesBn: [
        '৫ থেকে ১৫টি হাই-কনভার্টিং ফিড ও মেটা অ্যাড ক্রিয়েটিভ (স্ট্যাটিক্স ও মোশন কাটস)',
        'মনস্তাত্ত্বিক বাংলা সেলস কপিরাইটিং ও স্ক্রল-স্টপিং ইমোশনাল হুক',
        '১০০% মেটা পলিসি কমপ্লায়েন্স অডিট (অ্যাকাউন্ট ব্যান ও রেস্ট্রিকশন মুক্ত)',
        'মাল্টিপল অডিয়েন্স টেস্টিং অ্যাঙ্গেলস (Ads Manager-এ টেস্ট করার জন্য রেডি)',
        'পূর্ণাঙ্গ সোর্স ফাইল (Figma / Canva) + অপটিমাইজড এক্সপোর্টস',
      ],
      roiOutcomeEn: 'Direct CPR Reduction (Avg. -42%) & 3.2x ROAS Lift',
      roiOutcomeBn: 'বিজ্ঞাপনের সিপিআর গড়ে ৪২% পর্যন্ত হ্রাস এবং ৩.২x আরওএএস বৃদ্ধি',
      whatsappText: 'Hi POLISHED, I am interested in the High-Conversion Social Media Design service for my brand.',
    },
    {
      id: 'ecommerce-visuals',
      num: '02',
      titleEn: 'E-commerce Visual Strategy & Storefronts',
      titleBn: 'ই-কমার্স ভিজ্যুয়াল স্ট্র্যাটেজি ও স্টোরফ্রন্ট',
      targetEn: 'For High-Growth E-Commerce Storefronts & Shopify/Custom Stores',
      targetBn: 'গ্রোথ-ফোকাসড ই-কমার্স স্টোরফ্রন্ট ও অনলাইন শপের জন্য',
      turnaroundEn: '3 - 5 Business Days',
      turnaroundBn: '৩ - ৫ কর্মদিবস',
      icon: ShoppingBag,
      descEn:
        'Crafting trust-building visual assets for storefronts, product detail pages (PDP), and checkout funnels. Ensuring your brand looks unapologetically luxurious, highly authoritative, and engineered to eliminate Cash-on-Delivery (COD) hesitation.',
      descBn:
        'স্টোরফ্রন্ট, প্রোডাক্ট পেজ (PDP) এবং চেকআউট ফানেলের জন্য ট্রাস্ট-বিল্ডিং ভিজ্যুয়াল আর্কিটেকচার। যা ব্র্যান্ডকে আন্তর্জাতিক মানের প্রিমিয়াম লুক দেয় এবং ক্যাশ-অন-ডেলিভারি (COD) নিয়ে গ্রাহকের দ্বিধা দূর করে নিশ্চিত অর্ডার নিশ্চিত করে।',
      deliverablesEn: [
        'High-Status Storefront Hero Banners & Strategic Category Navigators',
        'Product Detail Page (PDP) Conversion Infographics & Feature Callouts',
        'AOV-Maximizing Combo, Bundle & Seasonal Gift Framing',
        'Trust & Legitimacy Badges (Dermatologist tested, COD guarantee, Organic seals)',
        'Mobile-First Responsive Layout Assets Optimized for 0.5s Load Time',
      ],
      deliverablesBn: [
        'হাই-স্ট্যাটাস স্টোরফ্রন্ট ব্যানার ও স্ট্র্যাটেজিক কালেকশন নেভিগেটর',
        'প্রোডাক্ট পেজ (PDP) কনভার্শন ইনফোগ্রাফিক্স ও বেনিফিট হাইলাইটস',
        'গড় অর্ডার ভ্যালু (AOV) বৃদ্ধিকারী কম্বো ও বান্ডেল অফার গ্রাফিক্স',
        'আস্থা বৃদ্ধিকারী ট্রাস্ট ব্যাজ (COD গ্যারান্টি, ডার্মাটোলজিক্যালি টেস্টেড সিল)',
        'মোবাইল-ফার্স্ট রেসপন্সিভ অ্যাসেটস (সুপারফাস্ট লোডিংয়ের জন্য অপটিমাইজড)',
      ],
      roiOutcomeEn: 'Aggressive AOV Increase & Drastic COD Cancellation Drop',
      roiOutcomeBn: 'গড় অর্ডার ভ্যালু (AOV) বৃদ্ধি এবং সিওডি রিটার্ন ঝুঁকি হ্রাস',
      whatsappText: 'Hi POLISHED, I am interested in the E-commerce Visual Strategy & Storefronts service.',
    },
    {
      id: 'white-label-agency',
      num: '03',
      titleEn: 'White-Label Agency Partnership',
      titleBn: 'হোয়াইট-লেবেল এজেন্সি পার্টনারশিপ',
      targetEn: 'For Performance Marketing & Media Buying Agencies',
      targetBn: 'পারফরম্যান্স মার্কেটিং ও মিডিয়া বায়িং এজেন্সির জন্য',
      turnaroundEn: 'Strict 48-Hour Turnaround SLA',
      turnaroundBn: 'কঠোর ৪৮ ঘণ্টার র্যাপিড SLA',
      icon: Zap,
      descEn:
        'Acting as the invisible creative powerhouse for marketing agencies. We deliver high-converting "Premium Bengali" visual assets to lower CAC and maximize ROAS for your clients, without the friction, payroll, and bottleneck of an in-house design team.',
      descBn:
        'মার্কেটিং এজেন্সির ইনভিজিবল ব্যাকএন্ড ক্রিয়েটিভ পাওয়ারহাউস। ইন-হাউস ডিজাইনার হায়ার করার ঝামেলা, মাসিক বেতন এবং দীর্ঘসূত্রিতা ছাড়াই আপনার ক্লায়েন্টদের জন্য হাই-কনভার্টিং ক্রিয়েটিভ ডেলিভারি নিশ্চিত করুন।',
      deliverablesEn: [
        'Dedicated On-Demand Creative Capacity (Up to 30 assets/mo per client tier)',
        'Strict 48-Hour Rapid Sprint Delivery SLA for Fast Campaign Iterations',
        '100% White-Label Delivery via Unbranded Figma Workspaces or Google Drive',
        'High-Performing Visual Frameworks Designed to Maximize Agency Client Retention',
        'Direct Slack / WhatsApp Channel with Dedicated Senior Creative Director',
      ],
      deliverablesBn: [
        'অন-ডিমান্ড ডেডিকেটেড ক্রিয়েটিভ ব্যান্ডউইথ (ক্লায়েন্ট স্কেলিংয়ের জন্য প্রস্তুত)',
        'কঠোর ৪৮ ঘণ্টার র্যাপিড ডেলিভারি SLA (ক্যাম্পেইনে কোনো দেরি নয়)',
        '১০০% হোয়াইট-লেবেল ডেলিভারি (আমাদের কোনো ব্র্যান্ডিং থাকবে না)',
        'ক্লায়েন্ট রিটেনশন ও ক্যাম্পেইন আরওএএস বাড়ানোর প্রুভেন ফ্রেমওয়ার্ক',
        'সিনিয়র ক্রিয়েটিভ ডিরেক্টরের সাথে ডিরেক্ট স্ল্যাক / হোয়াটসঅ্যাপ সাপোর্ট',
      ],
      roiOutcomeEn: 'Scale Client Roster 3x Faster Without In-House Overhead',
      roiOutcomeBn: 'টিম খরচ ছাড়াই ৩ গুণ বেশি ক্লায়েন্ট পরিচালনা ও স্কেল করার সুবিধা',
      whatsappText: 'Hi POLISHED, I run an agency and want to discuss the White-Label Agency Partnership.',
    },
  ];

  return (
    <section id="services" className="bg-primary text-[#f9fafb] py-20 md:py-32 px-5 sm:px-8 md:px-14 relative overflow-hidden border-t border-b border-white/10">
      
      {/* Background Subtle Moving Grid Texture matching brand aesthetic */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-[1240px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <MotionReveal>
            <span 
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fb923c]/15 text-[#fb923c] border border-[#fb923c]/30 text-[11px] font-semibold uppercase mb-4 shadow-sm ${
                isBn ? 'tracking-normal' : 'tracking-[0.25em]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? 'আমাদের মূল সেবা ও ডেলিভারেবলস' : 'Core Services & Deliverables'}</span>
            </span>
          </MotionReveal>

          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-normal text-[#f9fafb] tracking-tight leading-[1.15] mb-5"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isBn ? (
              <>
                আস্থা ও বিক্রয় বৃদ্ধির জন্য তৈরি <span className="text-[#fb923c] italic font-semibold">আমাদের ৩টি ক্রিয়েটিভ সিস্টেম</span>
              </>
            ) : (
              <>
                Performance Creative Systems <span className="text-[#fb923c] italic font-semibold">Engineered to Convert & Scale</span>
              </>
            )}
          </h2>

          <p 
            className="text-[#f9fafb]/80 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed font-light"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {isBn
              ? 'আমরা কোনো গড়পড়তা জেনেরিক ডিজাইন প্যাকেজ অফার করি না। আমরা তৈরি করি বাস্তব ফলাফলভিত্তিক ভিজ্যুয়াল অ্যাসেট—যা প্রিমিয়াম D2C ব্র্যান্ড ও মার্কেটিং এজেন্সির সেলস ও আরওএএস বাড়াতে বিশেষভাবে কার্যকর।'
              : 'We do not sell generic freelance hours or templated banners. We deliver specialized, high-converting visual systems engineered specifically for premium skincare brands and marketing agencies.'
            }
          </p>
        </div>

        {/* 3 Core Services Deep-Dive Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((svc, idx) => {
            const IconComponent = svc.icon;
            return (
              <MotionReveal key={svc.id} delay={0.1 * (idx + 1)} className="h-full">
                <div className="h-full rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.08] hover:border-[#fb923c]/40 transition-all duration-500 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between group shadow-xl relative overflow-hidden">
                  
                  {/* Top Meta Strip */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-2xl font-light text-[#fb923c]">
                          {svc.num}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                          {isBn ? 'স্পেশালাইজড সার্ভিস' : 'Specialized System'}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#fb923c] group-hover:scale-110 transition-transform">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 
                      className="text-xl sm:text-2xl font-heading text-white leading-snug mb-3 group-hover:text-[#fb923c] transition-colors"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {isBn ? svc.titleBn : svc.titleEn}
                    </h3>

                    {/* Target Audience & Turnaround Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#fb923c]/15 text-[#fb923c] text-[10px] sm:text-[11px] font-medium border border-[#fb923c]/25">
                        <Target className="w-3 h-3" />
                        <span>{isBn ? svc.targetBn : svc.targetEn}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white/80 text-[10px] sm:text-[11px] font-medium border border-white/15">
                        <Clock className="w-3 h-3 text-[#fb923c]" />
                        <span>{isBn ? svc.turnaroundBn : svc.turnaroundEn}</span>
                      </span>
                    </div>

                    {/* Core Narrative */}
                    <p 
                      className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light mb-6"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? svc.descBn : svc.descEn}
                    </p>

                    {/* What's Included / Concrete Deliverables Checklist */}
                    <div className="bg-black/20 rounded-xl p-4 sm:p-5 border border-white/10 mb-6">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-[#fb923c] font-semibold mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'এই সার্ভিসে আপনি ঠিক কী কী পাবেন:' : "What's Included in the Deliverables:"}</span>
                      </p>
                      <ul className="space-y-2.5">
                        {(isBn ? svc.deliverablesBn : svc.deliverablesEn).map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 text-[12px] sm:text-[13px] text-white/85 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c] shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action & Verified Outcome */}
                  <div>
                    {/* ROI Tag */}
                    <div className="mb-5 flex items-center gap-2 text-[11px] font-medium text-[#fb923c] bg-white/[0.03] px-3 py-2 rounded-lg border border-white/5">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      <span>{isBn ? svc.roiOutcomeBn : svc.roiOutcomeEn}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5">
                      <a
                        href={`https://wa.me/8801346288210?text=${encodeURIComponent(svc.whatsappText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#fb923c] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f97316] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md"
                      >
                        <span>{isBn ? 'হোয়াটসঅ্যাপে বুকিং করুন' : 'Book on WhatsApp'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => openAuditModal({ service: svc.titleEn, source: `Service Card: ${svc.titleEn}` })}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white/90 text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3 h-3 text-[#fb923c]" />
                        <span>{isBn ? 'ফ্রি ৫-মিনিট ভিজ্যুয়াল অডিট' : 'Free 5-Min Visual Audit'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </MotionReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
