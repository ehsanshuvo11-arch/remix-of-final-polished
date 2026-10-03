import { lazy, Suspense, useState } from 'react';
import { m } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
const Portfolio = lazy(() => import('@/components/landing/Portfolio'));
const Pricing = lazy(() => import('@/components/landing/Pricing'));
const Process = lazy(() => import('@/components/landing/Process'));
const Contact = lazy(() => import('@/components/landing/Contact'));
const Footer = lazy(() => import('@/components/landing/Footer'));
const Evolution = lazy(() => import('@/components/landing/Evolution'));
const Testimonials = lazy(() => import('@/components/landing/Testimonials'));
const Transformations = lazy(() => import('@/components/landing/Transformations'));
const RoasCalculator = lazy(() => import('@/components/landing/RoasCalculator'));
const StickyStorytelling = lazy(() => import('@/components/landing/StickyStorytelling'));
import StickyConversionBar from '@/components/landing/StickyConversionBar';
import VisualAuditModal from '@/components/landing/VisualAuditModal';
import PageLoader, { shouldShowLoader } from '@/components/landing/PageLoader';
import MobileActionBar from '@/components/landing/MobileActionBar';

import SmoothScroll from '@/components/landing/SmoothScroll';
import SectionTheme from '@/components/landing/SectionTheme';
import SectionDivider from '@/components/landing/SectionDivider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSiteSetting, useServices, usePortfolio, useProcessSteps, useStats, useTransformations } from '@/hooks/use-site-content';
import { supabase } from '@/lib/supabase';
import type { HeroContent, AboutContent, ContactContent, FooterContent, NavContent, ServicesMetaContent, PortfolioMetaContent, ProcessMetaContent, TransformationsMetaContent } from '@/types/database';

/** Reserves vertical space so lazy sections never cause layout shift. */
const SectionFallback = ({ minHeight = '60vh' }: { minHeight?: string }) => (
  <div className="bg-primary w-full" style={{ minHeight }} aria-hidden />
);

export default function Index() {
  const [heroReady, setHeroReady] = useState(() => !shouldShowLoader());

  const fallbackLogoUrl = supabase.storage.from('polished-assets').getPublicUrl('logo/current').data.publicUrl;

  const { data: heroContent } = useSiteSetting<HeroContent>('hero');
  const { data: navContent } = useSiteSetting<NavContent>('nav');
  const { data: aboutContent } = useSiteSetting<AboutContent>('about');
  const { data: contactContent } = useSiteSetting<ContactContent>('contact');
  const { data: footerContent } = useSiteSetting<FooterContent>('footer');
  const { data: servicesMeta } = useSiteSetting<ServicesMetaContent>('services-meta');
  const { data: portfolioMeta } = useSiteSetting<PortfolioMetaContent>('portfolio-meta');
  const { data: processMeta } = useSiteSetting<ProcessMetaContent>('process-meta');
  const { data: marqueeData } = useSiteSetting<{ items: string[] }>('marquee');
  const { data: logoData } = useSiteSetting<{ url: string }>('logo');

  const { data: services = [] } = useServices();
  const { data: projects = [], isLoading: projectsLoading } = usePortfolio();
  const { data: processSteps = [] } = useProcessSteps();
  const { data: stats = [] } = useStats();
  const { data: transformations = [] } = useTransformations();
  const { data: transformationsMeta } = useSiteSetting<TransformationsMetaContent>('transformations-meta');

  return (
    <SmoothScroll>
      <main className="font-body relative min-h-screen">
        <PageLoader onComplete={() => setHeroReady(true)} />
        <SectionTheme />
        
        {/* 1. Brand Navigation */}
        <Navbar content={navContent ?? null} />

        {/* 2. Bold Hero with Quiet Luxury Aesthetics */}
        <m.div
          initial={false}
          animate={
            heroReady
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 1.05 }
          }
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '50% 50%', willChange: 'transform, opacity' }}
        >
          <Hero
            content={heroContent ?? null}
            logoUrl={logoData?.url ?? fallbackLogoUrl}
          />
        </m.div>

        {/* 3. Capability Ribbon */}
        <Marquee items={marqueeData?.items ?? []} />

        {/* 4. IMMEDIATE CREATIVE PROOF: Selected Work & Case Studies front-and-center */}
        <Suspense fallback={<SectionFallback minHeight="80vh" />}>
          <ErrorBoundary isSection sectionName="Portfolio">
            <Portfolio projects={projects} content={portfolioMeta ?? null} isLoading={projectsLoading} />
          </ErrorBoundary>
        </Suspense>

        {/* 5. STRATEGIC POSITIONING: The "Premium Bengali" Aesthetic vs Cheap Canva Templates */}
        <Suspense fallback={<SectionFallback minHeight="70vh" />}>
          <ErrorBoundary isSection sectionName="StickyStorytelling">
            <StickyStorytelling />
          </ErrorBoundary>
        </Suspense>

        {/* 7. CORE SERVICES & DELIVERABLES: 3 specialized systems with concrete checklists */}
        <Services services={services} content={servicesMeta ?? null} />

        {/* 8. VISUAL EVOLUTION & BEFORE/AFTER TRANSFORMATIONS */}
        <Suspense fallback={<SectionFallback minHeight="60vh" />}>
          <ErrorBoundary isSection sectionName="Evolution">
            <Evolution />
          </ErrorBoundary>
          <ErrorBoundary isSection sectionName="Transformations">
            <Transformations items={transformations} content={transformationsMeta ?? null} />
          </ErrorBoundary>
        </Suspense>

        {/* 9. BRAND PHILOSOPHY & PROVEN METRICS */}
        <About content={aboutContent ?? null} stats={stats} />
        <SectionDivider className="py-4" />

        {/* 10. REVENUE DIAGNOSTIC: Calculate ROAS lift right before investment decision */}
        <Suspense fallback={<SectionFallback minHeight="50vh" />}>
          <ErrorBoundary isSection sectionName="RoasCalculator">
            <RoasCalculator />
          </ErrorBoundary>
        </Suspense>

        {/* 11. TRANSPARENT PRICING & SPRINTS: ৳3,999 Trial, ৳32,299 Growth, ৳48,500 Agency */}
        <Suspense fallback={<SectionFallback minHeight="60vh" />}>
          <ErrorBoundary isSection sectionName="Pricing">
            <Pricing />
          </ErrorBoundary>
        </Suspense>

        {/* 12. SPRINT PROCESS & HOW WE OPERATE */}
        <Suspense fallback={<SectionFallback minHeight="50vh" />}>
          <ErrorBoundary isSection sectionName="Process">
            <Process steps={processSteps} content={processMeta ?? null} />
          </ErrorBoundary>
          <SectionDivider className="py-4" />
          <ErrorBoundary isSection sectionName="Testimonials">
            <Testimonials />
          </ErrorBoundary>
          <SectionDivider className="py-4" />
          <ErrorBoundary isSection sectionName="Contact">
            <Contact contact={contactContent ?? null} />
          </ErrorBoundary>
          <Footer footer={footerContent ?? null} />
        </Suspense>

        <StickyConversionBar />
        <VisualAuditModal />
        <MobileActionBar />
      </main>
    </SmoothScroll>
  );
}
