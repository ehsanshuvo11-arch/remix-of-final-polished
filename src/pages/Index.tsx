import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import Portfolio from '@/components/landing/Portfolio';
import Pricing from '@/components/landing/Pricing';
import Process from '@/components/landing/Process';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import Evolution from '@/components/landing/Evolution';
import Testimonials from '@/components/landing/Testimonials';
import PageLoader, { shouldShowLoader } from '@/components/landing/PageLoader';

import SmoothScroll from '@/components/landing/SmoothScroll';
import SectionTheme from '@/components/landing/SectionTheme';
import SectionDivider from '@/components/landing/SectionDivider';
import Transformations from '@/components/landing/Transformations';
import { useSiteSetting, useServices, usePortfolio, useProcessSteps, useStats, useTransformations } from '@/hooks/use-site-content';
import { supabase } from '@/lib/supabase';
import type { HeroContent, AboutContent, ContactContent, FooterContent, NavContent, ServicesMetaContent, PortfolioMetaContent, ProcessMetaContent, TransformationsMetaContent } from '@/types/database';

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
    <div className="font-body">
      <PageLoader onComplete={() => setHeroReady(true)} />
      <SectionTheme />
      
      <Navbar content={navContent ?? null} />
      <motion.div
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
      </motion.div>
      <Marquee items={marqueeData?.items ?? []} />
      <About content={aboutContent ?? null} stats={stats} />
      <SectionDivider className="py-4" />
      <Services services={services} content={servicesMeta ?? null} />
      <SectionDivider className="py-4" />
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
    </div>
    </SmoothScroll>
  );
}
