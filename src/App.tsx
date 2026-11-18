import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteDataProvider, useSiteData } from '@/context/SiteDataContext';
import { LenisProvider } from '@/hooks/useLenis';
import { useHashRoute } from '@/hooks/useHashRoute';
import { useShortlist } from '@/hooks/useShortlist';
import { registerGsap } from '@/lib/motion';
import type { Opportunity } from '@/data/schema';
import { Grain } from '@/components/ui/Grain';
import { Preloader } from '@/components/layout/Preloader';
import { PrimaryNav } from '@/components/layout/PrimaryNav';
import { StickySubNav } from '@/components/layout/StickySubNav';
import { Hero } from '@/components/hero/Hero';
import { Directory } from '@/components/directory/Directory';
import { ShortlistPanel } from '@/components/directory/ShortlistPanel';
import { Consultations } from '@/components/consult/Consultations';
import { Team } from '@/components/team/Team';
import { Finale } from '@/components/finale/Finale';
import { ScoutLauncher } from '@/components/scout/ScoutLauncher';
import { StarMorphCanvas } from '@/components/fx/StarMorphCanvas';
import { GoldMarginElements } from '@/components/fx/GoldMarginElements';

const ScoutDrawer = lazy(() => import('@/components/scout/ScoutDrawer'));
const OpportunityDrawer = lazy(() => import('@/components/directory/OpportunityDrawer'));

function NextStepShell() {
  const { opportunities } = useSiteData();
  const { activeOppId, openOpp, closeOpp } = useHashRoute(opportunities);
  const { savedIds, toggleSave, count: shortlistCount } = useShortlist();

  const [preloaderReady, setPreloaderReady] = useState(false);
  const [showSubBar, setShowSubBar] = useState(false);
  const [activeSection, setActiveSection] = useState('Overview');
  const [scoutOpen, setScoutOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);

  useEffect(() => {
    if (preloaderReady) ScrollTrigger.refresh();
  }, [preloaderReady]);

  const activeOpportunity = useMemo(
    () => opportunities.find((o) => o.id === activeOppId) ?? null,
    [opportunities, activeOppId]
  );

  const savedItems = useMemo(
    () => opportunities.filter((o) => savedIds.has(o.id)),
    [opportunities, savedIds]
  );

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 220,
        end: 'max',
        onEnter: () => setShowSubBar(true),
        onLeaveBack: () => setShowSubBar(false),
      });

      const sections = [
        { id: 'hero', label: 'Overview' },
        { id: 'opportunities', label: '01 / Opportunities' },
        { id: 'consultations', label: '02 / Consultations' },
        { id: 'team', label: '03 / Meet & Join Team' },
        { id: 'about', label: '04 / About & Vision' },
      ];

      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => setActiveSection(sec.label),
          onEnterBack: () => setActiveSection(sec.label),
        });
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [opportunities.length]);

  const handleSelectOpportunity = (opp: Opportunity) => {
    openOpp(opp.id);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-black focus:text-xs focus:font-semibold"
      >
        Skip to content
      </a>

      <Grain />
      <Preloader onComplete={() => setPreloaderReady(true)} />
      <StarMorphCanvas />
      <GoldMarginElements />
      <PrimaryNav onOpenScout={() => setScoutOpen(true)} />
      <StickySubNav
        visible={showSubBar}
        activeSection={activeSection}
        onOpenScout={() => setScoutOpen(true)}
        shortlistCount={shortlistCount}
        onOpenShortlist={() => setShortlistOpen(true)}
      />

      <main id="main-content" className="relative z-[2]">
        <Hero
          onOpenScout={() => setScoutOpen(true)}
          onSelectOpportunity={handleSelectOpportunity}
        />
        <Directory
          onOpenScout={() => setScoutOpen(true)}
          onSelectOpportunity={handleSelectOpportunity}
          savedIds={savedIds}
          onToggleSave={toggleSave}
        />
        <Consultations />
        <Team />
        <Finale />
      </main>

      <ScoutLauncher open={scoutOpen} onOpen={() => setScoutOpen(true)} />

      <Suspense fallback={null}>
        <ScoutDrawer open={scoutOpen} onClose={() => setScoutOpen(false)} />
        <OpportunityDrawer
          opp={activeOpportunity}
          isSaved={activeOpportunity ? savedIds.has(activeOpportunity.id) : false}
          onToggleSave={toggleSave}
          onClose={closeOpp}
        />
      </Suspense>

      <ShortlistPanel
        open={shortlistOpen}
        items={savedItems}
        onClose={() => setShortlistOpen(false)}
        onRemove={toggleSave}
        onSelect={handleSelectOpportunity}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <LenisProvider>
        <NextStepShell />
      </LenisProvider>
    </SiteDataProvider>
  );
}
