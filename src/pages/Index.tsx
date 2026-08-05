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
import PageLoader, { shouldShowLoader } from '@/components/landing/PageLoader';
import MobileActionBar from '@/components/landing/MobileActionBar';


import SmoothScroll from '@/components/landing/SmoothScroll';
import SectionTheme from '@/components/landing/SectionTheme';
import SectionDivider from '@/components/landing/SectionDivider';
const Transformations = lazy(() => import('@/components/landing/Transformations'));
import { useSiteSetting, useServices, usePortfolio, useProcessSteps, useStats, useTransformations } from '@/hooks/use-site-content';
import { supabase } from '@/lib/supabase';
import type { HeroContent, AboutContent, ContactContent, FooterContent, NavContent, ServicesMetaContent, PortfolioMetaContent, ProcessMetaContent, TransformationsMetaContent } from '@/types/database';

/** Reserves vertical space so lazy sections never cause layout shift. */
const SectionFallback = ({ minHeight = '60vh' }: { minHeight?: string }) => (
  <div className="bg-primary w-full" style={{ minHeight }} aria-hidden />
);

export default function Index() {
  // If the loader is going to show, hold the hero in its pre-entrance state.
  // SSR-safe: defaults to "ready" on the server so prerendered HTML is visible.
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
    <main className="font-body overflow-y-auto">
      <PageLoader onComplete={() => setHeroReady(true)} />
      <SectionTheme />
      
      <Navbar content={navContent ?? null} />
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
      <Marquee items={marqueeData?.items ?? []} />
      <About content={aboutContent ?? null} stats={stats} />
      <SectionDivider className="py-4" />
      <Services services={services} content={servicesMeta ?? null} />
      <SectionDivider className="py-4" />
      <Suspense fallback={<SectionFallback />}>
        <Evolution />
        <Portfolio projects={projects} content={portfolioMeta ?? null} isLoading={projectsLoading} />
        <Transformations items={transformations} content={transformationsMeta ?? null} />
        <Process steps={processSteps} content={processMeta ?? null} />
        <SectionDivider className="py-4" />
        <Testimonials />
        <SectionDivider className="py-4" />
        <Pricing />
        <Contact contact={contactContent ?? null} />
        <Footer footer={footerContent ?? null} />
      </Suspense>
      <MobileActionBar />

    </main>
    </SmoothScroll>
  );
}
