import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import Portfolio from '@/components/landing/Portfolio';
import Process from '@/components/landing/Process';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import PuzzleGame from '@/components/landing/PuzzleGame';
import PageLoader from '@/components/landing/PageLoader';
import CustomCursor from '@/components/landing/CustomCursor';
import SmoothScroll from '@/components/landing/SmoothScroll';
import { useSiteSetting, useServices, usePortfolio, useProcessSteps, useStats } from '@/hooks/use-site-content';
import { supabase } from '@/lib/supabase';
import type { HeroContent, AboutContent, ContactContent, FooterContent, DiscountContent, NavContent, ServicesMetaContent, PortfolioMetaContent, ProcessMetaContent, PuzzleContent } from '@/types/database';

export default function Index() {
  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const fallbackLogoUrl = supabase.storage.from('polished-assets').getPublicUrl('logo/current').data.publicUrl;
  const fallbackPuzzleImageUrl = supabase.storage.from('polished-assets').getPublicUrl('puzzle/current').data.publicUrl;

  const { data: heroContent } = useSiteSetting<HeroContent>('hero');
  const { data: navContent } = useSiteSetting<NavContent>('nav');
  const { data: aboutContent } = useSiteSetting<AboutContent>('about');
  const { data: contactContent } = useSiteSetting<ContactContent>('contact');
  const { data: footerContent } = useSiteSetting<FooterContent>('footer');
  const { data: discountContent } = useSiteSetting<DiscountContent>('discount');
  const { data: servicesMeta } = useSiteSetting<ServicesMetaContent>('services-meta');
  const { data: portfolioMeta } = useSiteSetting<PortfolioMetaContent>('portfolio-meta');
  const { data: processMeta } = useSiteSetting<ProcessMetaContent>('process-meta');
  const { data: marqueeData } = useSiteSetting<{ items: string[] }>('marquee');
  const { data: logoData } = useSiteSetting<{ url: string }>('logo');
  const { data: puzzleData } = useSiteSetting<PuzzleContent>('puzzle');

  const { data: services = [] } = useServices();
  const { data: projects = [] } = usePortfolio();
  const { data: processSteps = [] } = useProcessSteps();
  const { data: stats = [] } = useStats();

  return (
    <div className="font-body">
      <PageLoader />
      <CustomCursor />
      <Navbar onPuzzleOpen={() => setPuzzleOpen(true)} content={navContent ?? null} />
      <Hero
        content={heroContent ?? null}
        logoUrl={logoData?.url ?? fallbackLogoUrl}
        onPuzzleOpen={() => setPuzzleOpen(true)}
      />
      <Marquee items={marqueeData?.items ?? []} />
      <About content={aboutContent ?? null} stats={stats} />
      <Services services={services} content={servicesMeta ?? null} />
      <Portfolio projects={projects} content={portfolioMeta ?? null} />
      <Process steps={processSteps} content={processMeta ?? null} />
      <Contact contact={contactContent ?? null} />
      <Footer footer={footerContent ?? null} />

      <PuzzleGame
        isOpen={puzzleOpen}
        onClose={() => setPuzzleOpen(false)}
        imageUrl={puzzleData?.imageUrl ?? fallbackPuzzleImageUrl}
        pieceImages={puzzleData?.pieceImages ?? []}
        discountCode={discountContent?.code ?? 'POLISHED100'}
        discountAmount={discountContent?.amount ?? '100'}
        content={puzzleData ?? null}
      />
    </div>
  );
}
