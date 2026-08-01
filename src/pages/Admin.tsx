import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { SaveAllProvider, SaveAllBar, useSaveRegistration } from '@/components/admin/SaveAllContext';
import {
  buildCollectionPayload,
  isSchemaColumnMismatch,
  normalizeProcessStepRow,
  normalizeServiceRow,
  normalizeStatRow,
} from '@/lib/content-schema';
import type {
  AboutContent,
  ColorsContent,
  ContactContent,
  
  FooterContent,
  HeroContent,
  MetaContent,
  NavContent,
  PortfolioMetaContent,
  PortfolioProject,
  ProcessMetaContent,
  ProcessStep,
  
  Service,
  ServicesMetaContent,
  Stat,
  EvolutionContent,
  TestimonialsContent,
  TestimonialItem,
  UILabelsContent,
  PricingContent,
  PricingTier,
} from '@/types/database';
import { DEFAULT_PRICING, makePricingTierId } from '@/lib/pricing-defaults';
import RichTextEditor from '@/components/ui/rich-text-editor';
import TransformationsEditor from '@/components/admin/TransformationsEditor';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout, { type AdminModuleId } from '@/components/admin/AdminLayout';
import InquiriesTable from '@/components/admin/InquiriesTable';

const LOGO_STORAGE_PATH = 'logo/current';

const SETTINGS_SAVE_ERROR = 'Save failed: your database did not allow this change. The row may be missing, or your INSERT/UPDATE RLS policies are blocking admin edits.';
const COLLECTION_SAVE_ERROR = 'Save failed: your database blocked this update for one or more rows.';

function getPublicAssetUrl(path: string) {
  return supabase.storage.from('polished-assets').getPublicUrl(path).data.publicUrl;
}

function withCacheBust(url: string) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}

function stripCacheBust(url: string) {
  return url.split('?')[0];
}

async function ensureAuthenticatedSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    toast.error(`Authentication error: ${error.message}`);
    return null;
  }

  let session = data.session;

  if (session?.expires_at && session.expires_at * 1000 <= Date.now() + 60_000) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      toast.error(`Session refresh failed: ${refreshError.message}`);
      return null;
    }

    session = refreshed.session;
  }

  if (!session) {
    toast.error('Your admin session expired. Please sign in again.');
    return null;
  }

  return session;
}

function normalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = normalizeJson((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }

  return value;
}

function isSameJson(a: unknown, b: unknown) {
  return JSON.stringify(normalizeJson(a)) === JSON.stringify(normalizeJson(b));
}

export default function Admin() {
  const queryClient = useQueryClient();
  useEffect(() => { setAdminQueryClient(queryClient); }, [queryClient]);

  // Restore native cursor for admin panel
  useEffect(() => {
    document.body.classList.add('admin-panel');
    return () => { document.body.classList.remove('admin-panel'); };
  }, []);
  const [authed, setAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<AdminModuleId>('inquiries');

  // Check existing session with timeout fallback
  useEffect(() => {
    // Temporary dummy login bypass for local testing
    if (localStorage.getItem('polished_dummy_admin') === 'true') {
      setAuthed(true);
      setUserEmail('admin@polished.com');
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
      setUserEmail(session?.user?.email ?? null);
      setLoading(false);
      clearTimeout(timeout);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setUserEmail(session?.user?.email ?? null);
      setLoading(false);
      clearTimeout(timeout);
    }).catch(() => {
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('polished_dummy_admin');
    await supabase.auth.signOut();
    setAuthed(false);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-polished-dark-blue flex items-center justify-center">
        <div className="font-heading text-2xl text-primary-foreground/40 tracking-[4px]">
          Loading...
        </div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout
      active={activeModule}
      onSelect={setActiveModule}
      onLogout={handleLogout}
      userEmail={userEmail}
    >
      {activeModule === 'inquiries' && <InquiriesTable />}
      {activeModule === 'content' && <LegacyContentDashboard />}
    </AdminLayout>
  );
}

// ────────────────────────────────────────────────
// Legacy content editors (Phase 2+ — kept available
// behind the "Content" sidebar item so existing
// editing functionality is not lost while we focus
// on Phase 1: secure shell + Inquiries dashboard).
// ────────────────────────────────────────────────

type ContentTabId =
  | 'hero'
  | 'brand'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'evolution'
  | 'process'
  | 'testimonials'
  | 'pricing'
  | 'contact'
  | 'labels'
  | 'footer';

const CONTENT_TABS: { id: ContentTabId; label: string; description: string }[] = [
  { id: 'hero', label: 'Hero', description: 'Headline, eyebrow & CTAs' },
  { id: 'brand', label: 'Brand', description: 'Meta, colors, logo, nav' },
  { id: 'about', label: 'About', description: 'Studio story & quote' },
  { id: 'services', label: 'Services', description: 'Services list & stats' },
  { id: 'portfolio', label: 'Portfolio', description: 'Case studies' },
  { id: 'evolution', label: 'Evolution', description: 'Before & after showcase' },
  { id: 'process', label: 'Process', description: 'How we work' },
  { id: 'testimonials', label: 'Partnerships', description: 'Partnerships label, heading, sub-copy & testimonial carousel (EN + বাংলা)' },
  { id: 'pricing', label: 'Investment', description: 'Pricing tiers & custom banner' },
  { id: 'contact', label: 'Contact', description: 'Form copy' },
  { id: 'labels', label: 'UI Labels', description: 'Buttons, nav, form micro-copy (EN + বাংলা)' },
  { id: 'footer', label: 'Footer', description: 'Footer copy' },
];

function LegacyContentDashboard() {
  const [activeTab, setActiveTab] = useState<ContentTabId>('hero');

  return (
    <SaveAllProvider>
      <div className="pb-32">
        <div className="mb-8">
          <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40 mb-2">
            Module
          </p>
          <h2 className="font-heading text-3xl text-primary-foreground font-light tracking-[2px]">
            Content
          </h2>
          <p className="text-[12px] text-primary-foreground/40 mt-2">
            Pick a section, edit, then hit <span className="text-accent">Save All Changes</span> bottom-right.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 -mx-1 overflow-x-auto">
          <div className="inline-flex gap-1 p-1 rounded-md bg-primary-foreground/[0.04] border border-primary-foreground/[0.08]">
            {CONTENT_TABS.map((t) => {
              const isActive = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  title={t.description}
                  className={[
                    'px-4 py-2 rounded-sm text-[11px] tracking-[2px] uppercase font-medium transition-all duration-200 whitespace-nowrap',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-[0_4px_14px_rgba(251,146,60,0.35)]'
                      : 'text-primary-foreground/55 hover:text-primary-foreground hover:bg-primary-foreground/[0.05]',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-2">
          {activeTab === 'hero' && <HeroEditor />}
          {activeTab === 'brand' && (
            <>
              <MetaEditor />
              <ColorsEditor />
              <LogoEditor />
              <NavigationEditor />
              <MarqueeEditor />
            </>
          )}
          {activeTab === 'about' && <AboutEditor />}
          {activeTab === 'services' && (
            <>
              <ServicesMetaEditor />
              <ServicesEditor />
              <StatsEditor />
            </>
          )}
          {activeTab === 'portfolio' && (
            <>
              <PortfolioMetaEditor />
              <PortfolioEditor />
            </>
          )}
          {activeTab === 'evolution' && (
            <>
              <EvolutionEditor />
              <TransformationsEditor />
            </>
          )}
          {activeTab === 'process' && (
            <>
              <ProcessMetaEditor />
              <ProcessEditor />
            </>
          )}
          {activeTab === 'testimonials' && <TestimonialsEditor />}
          {activeTab === 'pricing' && <PricingEditor />}
          {activeTab === 'contact' && <ContactEditor />}
          {activeTab === 'labels' && <UILabelsEditor />}
          {activeTab === 'footer' && <FooterEditor />}
        </div>
      </div>
      <SaveAllBar />
    </SaveAllProvider>
  );
}


// ── Reusable Admin Section ──

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 bg-primary-foreground/[0.03] border border-primary-foreground/[0.07] rounded p-7">
      <h3 className="font-heading text-xl text-primary-foreground font-normal mb-5 tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function AdminInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-4 py-3 text-sm outline-none rounded-sm focus:border-accent transition-colors"
    />
  );
}

function AdminTextarea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-4 py-3 text-sm outline-none rounded-sm resize-y focus:border-accent transition-colors"
    />
  );
}

// Hook: register a section with the global Save All bar.
// Tracks `data` against the last-loaded/last-saved snapshot to compute dirty.
function useDirtySection<T>(opts: {
  key: string;
  label: string;
  data: T;
  save: () => Promise<boolean>;
}) {
  const snapshotRef = useRef<T | null>(null);
  const [, force] = useState(0);

  const isDirty =
    snapshotRef.current !== null && !isSameJson(opts.data, snapshotRef.current);

  useSaveRegistration({
    key: opts.key,
    label: opts.label,
    isDirty,
    save: async () => {
      const ok = await opts.save();
      if (ok) {
        snapshotRef.current = opts.data;
        force((n) => n + 1);
      }
      return ok;
    },
  });

  return {
    markLoaded: (value: T) => {
      snapshotRef.current = value;
      force((n) => n + 1);
    },
  };
}

// ── Helper: upsert setting ──
let _queryClient: ReturnType<typeof useQueryClient> | null = null;
export function setAdminQueryClient(qc: ReturnType<typeof useQueryClient>) { _queryClient = qc; }

async function refreshSiteSettingQueries(key: string) {
  if (!_queryClient) return;

  await Promise.all([
    _queryClient.invalidateQueries({ queryKey: ['site-settings'] }),
    _queryClient.refetchQueries({ queryKey: ['site-settings'], type: 'all' }),
  ]);

}

async function refreshCollectionQueries(queryKey: 'services' | 'stats' | 'portfolio' | 'process-steps') {
  if (!_queryClient) return;

  await Promise.all([
    _queryClient.invalidateQueries({ queryKey: [queryKey] }),
    _queryClient.refetchQueries({ queryKey: [queryKey], type: 'all' }),
  ]);
}

async function upsertSetting(key: string, value: Record<string, any>) {
  const session = await ensureAuthenticatedSession();
  if (!session) return false;

  const { error: mutationError } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (mutationError) {
    toast.error('Error saving: ' + mutationError.message);
    return false;
  }

  const { data: verifiedRow, error: verifyError } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (verifyError) {
    toast.error('Saved, but refresh check failed: ' + verifyError.message);
    return false;
  }

  if (!verifiedRow || !isSameJson(verifiedRow.value, value)) {
    toast.error(SETTINGS_SAVE_ERROR);
    return false;
  }

  await refreshSiteSettingQueries(key);
  return true;
}

async function saveCollection<T extends { id: string }>(
  table: 'services' | 'stats' | 'portfolio_projects' | 'process_steps',
  rows: T[],
  queryKey: 'services' | 'stats' | 'portfolio' | 'process-steps',
  successMessage?: string,
) {
  const session = await ensureAuthenticatedSession();
  if (!session) return false;

  // Try localized columns first; on schema mismatch fall back to legacy base columns
  let mode: 'localized' | 'legacy' = 'localized';

  for (const row of rows) {
    const payload = buildCollectionPayload(table, row as unknown as Record<string, unknown>, mode);
    const { error } = await supabase.from(table).update(payload).eq('id', row.id);

    if (error && isSchemaColumnMismatch(error) && mode === 'localized') {
      // Retry entire batch with legacy columns
      mode = 'legacy';
      break;
    }

    if (error) {
      toast.error('Error saving: ' + error.message);
      return false;
    }
  }

  // If we broke out to retry in legacy mode, re-run from the start
  if (mode === 'legacy') {
    for (const row of rows) {
      const payload = buildCollectionPayload(table, row as unknown as Record<string, unknown>, 'legacy');
      const { error } = await supabase.from(table).update(payload).eq('id', row.id);
      if (error) {
        toast.error('Error saving: ' + error.message);
        return false;
      }
    }
  }

  const ids = rows.map((row) => row.id);
  const { data: verifiedRows, error: verifyError } = await supabase
    .from(table)
    .select('id')
    .in('id', ids);

  if (verifyError || !verifiedRows || verifiedRows.length !== ids.length) {
    toast.error(verifyError ? `Save failed: ${verifyError.message}` : COLLECTION_SAVE_ERROR);
    return false;
  }

  await refreshCollectionQueries(queryKey);

  if (successMessage) toast.success(successMessage);
  return true;
}

// ── HERO EDITOR ──
function HeroEditor() {
  const [data, setData] = useState<HeroContent>({
    titleEn: 'Make Your Collection',
    title2En: '*Unmissable*',
    titleBn: '',
    title2Bn: '',
    eyebrowEn: 'Graphics Design Agency · Bangladesh',
    eyebrowBn: '',
    subEn: '',
    subBn: '',
    viewWorkEn: 'View Our Work',
    viewWorkBn: 'আমাদের কাজ দেখুন',
    startProjectEn: 'Start a Project',
    startProjectBn: 'প্রজেক্ট শুরু',
    scrollEn: 'Scroll',
    scrollBn: 'স্ক্রল',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'hero').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('hero', data);
  };

  const { markLoaded } = useDirtySection({ key: 'hero', label: 'Hero Section', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Hero Section">
      <AdminField label="Eyebrow Text (EN)">
        <AdminInput value={data.eyebrowEn} onChange={(v) => setData({ ...data, eyebrowEn: v })} />
      </AdminField>
      <AdminField label="Title Line 1 (EN)">
        <AdminInput value={data.titleEn} onChange={(v) => setData({ ...data, titleEn: v })} />
      </AdminField>
      <AdminField label="Title Line 2 (EN) — wrap *italic text* in asterisks">
        <AdminInput value={data.title2En} onChange={(v) => setData({ ...data, title2En: v })} />
      </AdminField>
      <AdminField label="Title (বাংলা)">
        <AdminInput value={data.titleBn} onChange={(v) => setData({ ...data, titleBn: v })} />
      </AdminField>
      <AdminField label="Title Line 2 (বাংলা)">
        <AdminInput value={data.title2Bn ?? ''} onChange={(v) => setData({ ...data, title2Bn: v })} />
      </AdminField>
      <AdminField label="Subtitle (EN)">
        <AdminTextarea value={data.subEn} onChange={(v) => setData({ ...data, subEn: v })} />
      </AdminField>
      <AdminField label="Subtitle (বাংলা)">
        <AdminTextarea value={data.subBn} onChange={(v) => setData({ ...data, subBn: v })} />
      </AdminField>
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="View Work Button (EN)">
          <AdminInput value={data.viewWorkEn ?? ''} onChange={(v) => setData({ ...data, viewWorkEn: v })} />
        </AdminField>
        <AdminField label="View Work Button (বাংলা)">
          <AdminInput value={data.viewWorkBn ?? ''} onChange={(v) => setData({ ...data, viewWorkBn: v })} />
        </AdminField>
        <AdminField label="Start Project Button (EN)">
          <AdminInput value={data.startProjectEn ?? ''} onChange={(v) => setData({ ...data, startProjectEn: v })} />
        </AdminField>
        <AdminField label="Start Project Button (বাংলা)">
          <AdminInput value={data.startProjectBn ?? ''} onChange={(v) => setData({ ...data, startProjectBn: v })} />
        </AdminField>
        <AdminField label="Scroll Label (EN)">
          <AdminInput value={data.scrollEn ?? ''} onChange={(v) => setData({ ...data, scrollEn: v })} />
        </AdminField>
        <AdminField label="Scroll Label (বাংলা)">
          <AdminInput value={data.scrollBn ?? ''} onChange={(v) => setData({ ...data, scrollBn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

function NavigationEditor() {
  const [data, setData] = useState<NavContent>({
    aboutEn: 'About',
    aboutBn: 'আমাদের সম্পর্কে',
    servicesEn: 'Services',
    servicesBn: 'সেবাসমূহ',
    workEn: 'Work',
    workBn: 'কাজ',
    contactEn: 'Contact',
    contactBn: 'যোগাযোগ',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'nav').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('nav', data);
  };

  const { markLoaded } = useDirtySection({ key: 'nav', label: 'Navigation Labels', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Navigation Labels">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="About (EN)">
          <AdminInput value={data.aboutEn ?? ''} onChange={(v) => setData({ ...data, aboutEn: v })} />
        </AdminField>
        <AdminField label="About (বাংলা)">
          <AdminInput value={data.aboutBn ?? ''} onChange={(v) => setData({ ...data, aboutBn: v })} />
        </AdminField>
        <AdminField label="Services (EN)">
          <AdminInput value={data.servicesEn ?? ''} onChange={(v) => setData({ ...data, servicesEn: v })} />
        </AdminField>
        <AdminField label="Services (বাংলা)">
          <AdminInput value={data.servicesBn ?? ''} onChange={(v) => setData({ ...data, servicesBn: v })} />
        </AdminField>
        <AdminField label="Work (EN)">
          <AdminInput value={data.workEn ?? ''} onChange={(v) => setData({ ...data, workEn: v })} />
        </AdminField>
        <AdminField label="Work (বাংলা)">
          <AdminInput value={data.workBn ?? ''} onChange={(v) => setData({ ...data, workBn: v })} />
        </AdminField>
        <AdminField label="Contact (EN)">
          <AdminInput value={data.contactEn ?? ''} onChange={(v) => setData({ ...data, contactEn: v })} />
        </AdminField>
        <AdminField label="Contact (বাংলা)">
          <AdminInput value={data.contactBn ?? ''} onChange={(v) => setData({ ...data, contactBn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── ABOUT EDITOR ──
function AboutEditor() {
  const [data, setData] = useState<AboutContent>({
    labelEn: 'About Polished',
    labelBn: 'পলিশড সম্পর্কে',
    titleLine1En: 'Design that earns',
    titleLine1Bn: 'ডিজাইন যা অর্জন করে',
    titleLine2En: 'trust at first glance.',
    titleLine2Bn: 'প্রথম দর্শনেই বিশ্বাস।',
    p1En: '',
    p1Bn: '',
    p2En: '',
    p2Bn: '',
    quoteEn: '— Identifying a gap: professional Bangla visual design done right.',
    quoteBn: '— একটি ফাঁক চিহ্নিত করা: পেশাদার বাংলা ভিজ্যুয়াল ডিজাইন সঠিকভাবে।',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'about').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('about', data);
  };

  const { markLoaded } = useDirtySection({ key: 'about', label: 'About Section', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="About Section">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Section Label (EN)">
          <AdminInput value={data.labelEn ?? ''} onChange={(v) => setData({ ...data, labelEn: v })} />
        </AdminField>
        <AdminField label="Section Label (বাংলা)">
          <AdminInput value={data.labelBn ?? ''} onChange={(v) => setData({ ...data, labelBn: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (EN)">
          <AdminInput value={data.titleLine1En ?? ''} onChange={(v) => setData({ ...data, titleLine1En: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (বাংলা)">
          <AdminInput value={data.titleLine1Bn ?? ''} onChange={(v) => setData({ ...data, titleLine1Bn: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (EN)">
          <AdminInput value={data.titleLine2En ?? ''} onChange={(v) => setData({ ...data, titleLine2En: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (বাংলা)">
          <AdminInput value={data.titleLine2Bn ?? ''} onChange={(v) => setData({ ...data, titleLine2Bn: v })} />
        </AdminField>
      </div>
      <AdminField label="Paragraph 1 (EN)">
        <AdminTextarea value={data.p1En} onChange={(v) => setData({ ...data, p1En: v })} />
      </AdminField>
      <AdminField label="Paragraph 1 (বাংলা)">
        <AdminTextarea value={data.p1Bn} onChange={(v) => setData({ ...data, p1Bn: v })} />
      </AdminField>
      <AdminField label="Paragraph 2 (EN)">
        <AdminTextarea value={data.p2En} onChange={(v) => setData({ ...data, p2En: v })} />
      </AdminField>
      <AdminField label="Paragraph 2 (বাংলা)">
        <AdminTextarea value={data.p2Bn} onChange={(v) => setData({ ...data, p2Bn: v })} />
      </AdminField>
      <AdminField label="Quote (EN)">
        <AdminTextarea value={data.quoteEn ?? ''} onChange={(v) => setData({ ...data, quoteEn: v })} rows={2} />
      </AdminField>
      <AdminField label="Quote (বাংলা)">
        <AdminTextarea value={data.quoteBn ?? ''} onChange={(v) => setData({ ...data, quoteBn: v })} rows={2} />
      </AdminField>
    </AdminSection>
  );
}

function ServicesMetaEditor() {
  const [data, setData] = useState<ServicesMetaContent>({
    labelEn: 'What We Do',
    labelBn: 'আমরা যা করি',
    titleLine1En: 'Services built for',
    titleLine1Bn: 'ই-কমার্স ভিত্তিক স্কিনকেয়ার',
    titleLine2En: 'ecommerce-based skincare brands.',
    titleLine2Bn: 'ব্র্যান্ডের জন্য তৈরি সেবা।',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'services-meta').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('services-meta', data);
  };

  const { markLoaded } = useDirtySection({ key: 'services-meta', label: 'Services Header', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Services Header">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Label (EN)">
          <AdminInput value={data.labelEn ?? ''} onChange={(v) => setData({ ...data, labelEn: v })} />
        </AdminField>
        <AdminField label="Label (বাংলা)">
          <AdminInput value={data.labelBn ?? ''} onChange={(v) => setData({ ...data, labelBn: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (EN)">
          <AdminInput value={data.titleLine1En ?? ''} onChange={(v) => setData({ ...data, titleLine1En: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (বাংলা)">
          <AdminInput value={data.titleLine1Bn ?? ''} onChange={(v) => setData({ ...data, titleLine1Bn: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (EN)">
          <AdminInput value={data.titleLine2En ?? ''} onChange={(v) => setData({ ...data, titleLine2En: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (বাংলা)">
          <AdminInput value={data.titleLine2Bn ?? ''} onChange={(v) => setData({ ...data, titleLine2Bn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── SERVICES EDITOR ──
function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      if (data) {
        const rows = data.map((r) => normalizeServiceRow(r as Record<string, unknown>));
        setServices(rows);
        markLoaded(rows);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateService = (idx: number, field: keyof Service, value: string) => {
    setServices((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const save = async (): Promise<boolean> => {
    return await saveCollection('services', services, 'services');
  };

  const { markLoaded } = useDirtySection({ key: 'services', label: 'Services', data: services, save });


  const addService = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    let payload: Record<string, unknown> = { sort_order: services.length + 1, name_en: 'New Service', name_bn: '', desc_en: '', desc_bn: '' };
    let { data, error } = await supabase.from('services').insert(payload).select().single();

    if (error && isSchemaColumnMismatch(error)) {
      payload = { sort_order: services.length + 1, name: 'New Service', description: '' };
      ({ data, error } = await supabase.from('services').insert(payload).select().single());
    }

    if (error) {
      toast.error('Error adding service: ' + error.message);
      return;
    }

    if (data) {
      const next = [...services, normalizeServiceRow(data as Record<string, unknown>)];
      setServices(next);
      markLoaded(next);
      await refreshCollectionQueries('services');
    }
  };

  const removeService = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const svc = services[idx];
    if (!confirm(`Remove "${svc.name_en}"?`)) return;
    const { error } = await supabase.from('services').delete().eq('id', svc.id);
    if (error) { toast.error('Error removing: ' + error.message); return; }
    const next = services.filter((_, i) => i !== idx);
    setServices(next);
    markLoaded(next);
    await refreshCollectionQueries('services');
  };

  return (
    <AdminSection title="Services">
      {services.map((svc, i) => (
        <div key={svc.id} className="border border-primary-foreground/[0.07] rounded p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] tracking-[2px] text-primary-foreground/40 uppercase">Service {i + 1}</span>
            <button onClick={() => removeService(i)} className="text-destructive/60 text-xs hover:text-destructive transition-colors">Remove</button>
          </div>
          <AdminField label="Name (EN)">
            <AdminInput value={svc.name_en} onChange={(v) => updateService(i, 'name_en', v)} />
          </AdminField>
          <AdminField label="Name (বাংলা)">
            <AdminInput value={svc.name_bn} onChange={(v) => updateService(i, 'name_bn', v)} />
          </AdminField>
          <AdminField label="Description (EN)">
            <AdminTextarea value={svc.desc_en} onChange={(v) => updateService(i, 'desc_en', v)} />
          </AdminField>
          <AdminField label="Description (বাংলা)">
            <AdminTextarea value={svc.desc_bn} onChange={(v) => updateService(i, 'desc_bn', v)} />
          </AdminField>
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        <button onClick={addService} className="px-6 py-3 border border-primary-foreground/20 text-primary-foreground/60 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition-colors">
          + Add Service
        </button>
      </div>
    </AdminSection>
  );
}

// ── STATS EDITOR ──
function StatsEditor() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    supabase.from('stats').select('*').order('sort_order').then(({ data }) => {
      if (data) {
        const rows = data.map((r) => normalizeStatRow(r as Record<string, unknown>));
        setStats(rows);
        markLoaded(rows);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStat = (idx: number, field: keyof Stat, value: string) => {
    setStats((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const save = async (): Promise<boolean> => {
    return await saveCollection('stats', stats, 'stats');
  };

  const { markLoaded } = useDirtySection({ key: 'stats', label: 'Stats', data: stats, save });

  const addStat = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    let payload: Record<string, unknown> = { sort_order: stats.length + 1, num: '0', suffix: '+', label_en: 'New Stat', label_bn: '' };
    let { data, error } = await supabase.from('stats').insert(payload).select().single();
    if (error && isSchemaColumnMismatch(error)) {
      payload = { sort_order: stats.length + 1, num: '0', suffix: '+', label: 'New Stat' };
      ({ data, error } = await supabase.from('stats').insert(payload).select().single());
    }
    if (error) { toast.error('Error adding stat: ' + error.message); return; }
    if (data) {
      const next = [...stats, normalizeStatRow(data as Record<string, unknown>)];
      setStats(next); markLoaded(next);
      await refreshCollectionQueries('stats');
    }
  };

  const removeStat = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const stat = stats[idx];
    if (!confirm(`Remove "${stat.label_en}"?`)) return;
    const { error } = await supabase.from('stats').delete().eq('id', stat.id);
    if (error) { toast.error('Error removing: ' + error.message); return; }
    const next = stats.filter((_, i) => i !== idx);
    setStats(next); markLoaded(next);
    await refreshCollectionQueries('stats');
  };

  return (
    <AdminSection title="Stats">
      {stats.map((stat, i) => (
        <div key={stat.id} className="border border-primary-foreground/[0.07] rounded p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] tracking-[2px] text-primary-foreground/40 uppercase">Stat {i + 1}</span>
            <button onClick={() => removeStat(i)} className="text-destructive/60 text-xs hover:text-destructive transition-colors">Remove</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Number">
              <AdminInput value={stat.num} onChange={(v) => updateStat(i, 'num', v)} />
            </AdminField>
            <AdminField label="Suffix (+, %, yrs)">
              <AdminInput value={stat.suffix} onChange={(v) => updateStat(i, 'suffix', v)} />
            </AdminField>
          </div>
          <AdminField label="Label (EN)">
            <AdminInput value={stat.label_en} onChange={(v) => updateStat(i, 'label_en', v)} />
          </AdminField>
          <AdminField label="Label (বাংলা)">
            <AdminInput value={stat.label_bn} onChange={(v) => updateStat(i, 'label_bn', v)} />
          </AdminField>
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        <button onClick={addStat} className="px-6 py-3 border border-primary-foreground/20 text-primary-foreground/60 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition-colors">
          + Add Stat
        </button>
      </div>
    </AdminSection>
  );
}

// ── PORTFOLIO EDITOR ──
function PortfolioEditor() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const pdfEnRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const pdfBnRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const mockupRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    supabase.from('portfolio_projects').select('*').order('sort_order').then(({ data }) => {
      if (data) { setProjects(data); markLoaded(data); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProject = (idx: number, field: keyof PortfolioProject, value: string | string[]) => {
    setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const handleUpload = async (idx: number, file: File) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const ext = file.name.split('.').pop();
    const path = `portfolio/${Date.now()}_${idx}.${ext}`;
    const { error } = await supabase.storage.from('polished-assets').upload(path, file);
    if (error) {
      toast.error('Upload error: ' + error.message);
      return;
    }
    const { data } = supabase.storage.from('polished-assets').getPublicUrl(path);
    updateProject(idx, 'image_url', data.publicUrl);
  };

  const handlePdfUpload = async (idx: number, file: File, lang: 'en' | 'bn') => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const path = `portfolio-pdfs/${Date.now()}_${idx}_${lang}.pdf`;
    const { error } = await supabase.storage.from('polished-assets').upload(path, file, { contentType: 'application/pdf' });
    if (error) {
      toast.error('PDF upload error: ' + error.message);
      return;
    }
    const { data } = supabase.storage.from('polished-assets').getPublicUrl(path);
    updateProject(idx, lang === 'en' ? 'pdf_url_en' : 'pdf_url_bn', data.publicUrl);
  };

  const handleMockupUpload = async (idx: number, file: File) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const ext = file.name.split('.').pop();
    const path = `portfolio-mockups/${Date.now()}_${idx}.${ext}`;
    const { error } = await supabase.storage.from('polished-assets').upload(path, file);
    if (error) {
      toast.error('Mockup upload error: ' + error.message);
      return;
    }
    const { data } = supabase.storage.from('polished-assets').getPublicUrl(path);
    const currentUrls = projects[idx].mockup_urls ?? [];
    updateProject(idx, 'mockup_urls', [...currentUrls, data.publicUrl]);
  };

  const removeMockup = (projIdx: number, mockupIdx: number) => {
    const currentUrls = projects[projIdx].mockup_urls ?? [];
    updateProject(projIdx, 'mockup_urls', currentUrls.filter((_, i) => i !== mockupIdx));
  };

  const save = async (): Promise<boolean> => {
    return await saveCollection('portfolio_projects', projects, 'portfolio');
  };

  const { markLoaded } = useDirtySection({ key: 'portfolio_projects', label: 'Portfolio Projects', data: projects, save });

  const addProject = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert({ sort_order: projects.length + 1, title_en: 'New Project', title_bn: '', category_en: 'Design', category_bn: '', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '', mockup_url: '', mockup_urls: [] })
      .select()
      .single();
    if (error) {
      toast.error('Error adding project: ' + error.message);
      return;
    }

    if (data) {
      const next = [...projects, data];
      setProjects(next); markLoaded(next);
      await refreshCollectionQueries('portfolio');
    }
  };

  const removeProject = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const proj = projects[idx];
    if (!confirm(`Remove "${proj.title_en}"?`)) return;
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', proj.id);
    if (error) {
      toast.error('Error removing project: ' + error.message);
      return;
    }

    const next = projects.filter((_, i) => i !== idx);
    setProjects(next); markLoaded(next);
    await refreshCollectionQueries('portfolio');
  };

  return (
    <AdminSection title="Portfolio Projects">
      {projects.map((proj, i) => (
        <div key={proj.id} className="border border-primary-foreground/[0.07] rounded p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] tracking-[2px] text-primary-foreground/40 uppercase">
              Project {i + 1}
            </span>
            <button onClick={() => removeProject(i)} className="text-destructive/60 text-xs hover:text-destructive transition-colors">
              Remove
            </button>
          </div>
          <AdminField label="Title (EN)">
            <AdminInput value={proj.title_en} onChange={(v) => updateProject(i, 'title_en', v)} />
          </AdminField>
          <AdminField label="Title (বাংলা)">
            <AdminInput value={proj.title_bn} onChange={(v) => updateProject(i, 'title_bn', v)} />
          </AdminField>
          <AdminField label="Category (EN)">
            <AdminInput value={proj.category_en} onChange={(v) => updateProject(i, 'category_en', v)} />
          </AdminField>
          <AdminField label="Category (বাংলা)">
            <AdminInput value={proj.category_bn} onChange={(v) => updateProject(i, 'category_bn', v)} />
          </AdminField>
          <AdminField label="Project Image">
            <div
              className="border-2 border-dashed border-primary-foreground/15 rounded p-6 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5"
              onClick={() => fileRefs.current[i]?.click()}
            >
              <input
                ref={(el) => { fileRefs.current[i] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(i, file);
                }}
              />
              <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">
                📸 Click to upload
              </span>
              {proj.image_url && (
                <img src={proj.image_url} alt="" className="max-w-[120px] max-h-[120px] mx-auto mt-3 rounded" />
              )}
            </div>
          </AdminField>

          {/* Hook text — shown by default on frontend */}
          <AdminField label="Hook Text (EN) — visible before expanding">
            <RichTextEditor value={proj.hook_en ?? ''} onChange={(v) => updateProject(i, 'hook_en', v)} placeholder="Short teaser text shown by default..." />
          </AdminField>
          <AdminField label="Hook Text (বাংলা)">
            <RichTextEditor value={proj.hook_bn ?? ''} onChange={(v) => updateProject(i, 'hook_bn', v)} placeholder="ডিফল্টভাবে দেখানো সংক্ষিপ্ত টিজার..." />
          </AdminField>

          <AdminField label="Case Study (English) — Paste from Google Docs">
            <RichTextEditor value={proj.case_study_en ?? ''} onChange={(v) => updateProject(i, 'case_study_en', v)} placeholder="Paste your case study from Google Docs..." />
          </AdminField>
          <AdminField label="Case Study (বাংলা) — Google Docs থেকে পেস্ট করুন">
            <RichTextEditor value={proj.case_study_bn ?? ''} onChange={(v) => updateProject(i, 'case_study_bn', v)} placeholder="Google Docs থেকে কেস স্টাডি পেস্ট করুন..." />
          </AdminField>

          {/* Dual PDF Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminField label="📄 Case Study PDF (English)">
              <div
                className="border-2 border-dashed border-primary-foreground/15 rounded p-4 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5"
                onClick={() => pdfEnRefs.current[i]?.click()}
              >
                <input
                  ref={(el) => { pdfEnRefs.current[i] = el; }}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePdfUpload(i, file, 'en');
                  }}
                />
                <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">
                  {proj.pdf_url_en ? '✅ PDF uploaded — click to replace' : 'Click to upload English PDF'}
                </span>
              </div>
            </AdminField>
            <AdminField label="📄 Case Study PDF (বাংলা)">
              <div
                className="border-2 border-dashed border-primary-foreground/15 rounded p-4 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5"
                onClick={() => pdfBnRefs.current[i]?.click()}
              >
                <input
                  ref={(el) => { pdfBnRefs.current[i] = el; }}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePdfUpload(i, file, 'bn');
                  }}
                />
                <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">
                  {proj.pdf_url_bn ? '✅ PDF uploaded — click to replace' : 'Click to upload Bengali PDF'}
                </span>
              </div>
            </AdminField>
          </div>

          {/* Multi-Mockup Upload */}
          <AdminField label="🖼️ Project Mockups (gallery — click to add more)">
            <div
              className="border-2 border-dashed border-primary-foreground/15 rounded p-6 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5"
              onClick={() => mockupRefs.current[i]?.click()}
            >
              <input
                ref={(el) => { mockupRefs.current[i] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMockupUpload(i, file);
                }}
              />
              <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">
                {(proj.mockup_urls?.length ?? 0) > 0 ? `✅ ${proj.mockup_urls!.length} mockup(s) — click to add more` : 'Click to upload mockup images'}
              </span>
            </div>
            {(proj.mockup_urls?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {proj.mockup_urls!.map((url, mi) => (
                  <div key={mi} className="relative group">
                    <img src={url} alt="" className="w-[80px] h-[80px] object-cover rounded" />
                    <button
                      onClick={() => removeMockup(i, mi)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminField>
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        <button onClick={addProject} className="px-6 py-3 border border-primary-foreground/20 text-primary-foreground/60 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition-colors">
          + Add Project
        </button>
      </div>
    </AdminSection>
  );
}
function PortfolioMetaEditor() {
  const [data, setData] = useState<PortfolioMetaContent>({
    labelEn: 'Selected Work',
    labelBn: 'বাছাই করা কাজ',
    titleLine1En: 'Recent',
    titleLine1Bn: 'সাম্প্রতিক',
    titleLine2En: 'projects.',
    titleLine2Bn: 'প্রজেক্ট।',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'portfolio-meta').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('portfolio-meta', data);
  };

  const { markLoaded } = useDirtySection({ key: 'portfolio-meta', label: 'Portfolio Header', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Portfolio Header">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Label (EN)">
          <AdminInput value={data.labelEn ?? ''} onChange={(v) => setData({ ...data, labelEn: v })} />
        </AdminField>
        <AdminField label="Label (বাংলা)">
          <AdminInput value={data.labelBn ?? ''} onChange={(v) => setData({ ...data, labelBn: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (EN)">
          <AdminInput value={data.titleLine1En ?? ''} onChange={(v) => setData({ ...data, titleLine1En: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (বাংলা)">
          <AdminInput value={data.titleLine1Bn ?? ''} onChange={(v) => setData({ ...data, titleLine1Bn: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (EN)">
          <AdminInput value={data.titleLine2En ?? ''} onChange={(v) => setData({ ...data, titleLine2En: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (বাংলা)">
          <AdminInput value={data.titleLine2Bn ?? ''} onChange={(v) => setData({ ...data, titleLine2Bn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── PROCESS EDITOR ──
function ProcessEditor() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  useEffect(() => {
    supabase.from('process_steps').select('*').order('sort_order').then(({ data }) => {
      if (data) {
        const rows = data.map((r) => normalizeProcessStepRow(r as Record<string, unknown>));
        setSteps(rows); markLoaded(rows);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStep = (idx: number, field: keyof ProcessStep, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const save = async (): Promise<boolean> => {
    return await saveCollection('process_steps', steps, 'process-steps');
  };

  const { markLoaded } = useDirtySection({ key: 'process_steps', label: 'Process Steps', data: steps, save });

  const addStep = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    let payload: Record<string, unknown> = { sort_order: steps.length + 1, title_en: 'New Step', title_bn: '', desc_en: '', desc_bn: '' };
    let { data, error } = await supabase.from('process_steps').insert(payload).select().single();
    if (error && isSchemaColumnMismatch(error)) {
      payload = { sort_order: steps.length + 1, title: 'New Step', description: '' };
      ({ data, error } = await supabase.from('process_steps').insert(payload).select().single());
    }
    if (error) { toast.error('Error adding step: ' + error.message); return; }
    if (data) {
      const next = [...steps, normalizeProcessStepRow(data as Record<string, unknown>)];
      setSteps(next); markLoaded(next);
      await refreshCollectionQueries('process-steps');
    }
  };

  const removeStep = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const step = steps[idx];
    if (!confirm(`Remove "${step.title_en}"?`)) return;
    const { error } = await supabase.from('process_steps').delete().eq('id', step.id);
    if (error) { toast.error('Error removing: ' + error.message); return; }
    const next = steps.filter((_, i) => i !== idx);
    setSteps(next); markLoaded(next);
    await refreshCollectionQueries('process-steps');
  };

  return (
    <AdminSection title="Process Steps">
      {steps.map((step, i) => (
        <div key={step.id} className="border border-primary-foreground/[0.07] rounded p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] tracking-[2px] text-primary-foreground/40 uppercase">Step {i + 1}</span>
            <button onClick={() => removeStep(i)} className="text-destructive/60 text-xs hover:text-destructive transition-colors">Remove</button>
          </div>
          <AdminField label="Title (EN)">
            <AdminInput value={step.title_en} onChange={(v) => updateStep(i, 'title_en', v)} />
          </AdminField>
          <AdminField label="Title (বাংলা)">
            <AdminInput value={step.title_bn} onChange={(v) => updateStep(i, 'title_bn', v)} />
          </AdminField>
          <AdminField label="Description (EN)">
            <AdminTextarea value={step.desc_en} onChange={(v) => updateStep(i, 'desc_en', v)} />
          </AdminField>
          <AdminField label="Description (বাংলা)">
            <AdminTextarea value={step.desc_bn} onChange={(v) => updateStep(i, 'desc_bn', v)} />
          </AdminField>
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        <button onClick={addStep} className="px-6 py-3 border border-primary-foreground/20 text-primary-foreground/60 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition-colors">
          + Add Step
        </button>
      </div>
    </AdminSection>
  );
}

function ProcessMetaEditor() {
  const [data, setData] = useState<ProcessMetaContent>({
    labelEn: 'How It Works',
    labelBn: 'কীভাবে কাজ হয়',
    titleLine1En: 'A process built on',
    titleLine1Bn: 'নির্ভুলতার উপর',
    titleLine2En: 'precision.',
    titleLine2Bn: 'গড়া প্রক্রিয়া।',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'process-meta').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('process-meta', data);
  };

  const { markLoaded } = useDirtySection({ key: 'process-meta', label: 'Process Header', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Process Header">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Label (EN)">
          <AdminInput value={data.labelEn ?? ''} onChange={(v) => setData({ ...data, labelEn: v })} />
        </AdminField>
        <AdminField label="Label (বাংলা)">
          <AdminInput value={data.labelBn ?? ''} onChange={(v) => setData({ ...data, labelBn: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (EN)">
          <AdminInput value={data.titleLine1En ?? ''} onChange={(v) => setData({ ...data, titleLine1En: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (বাংলা)">
          <AdminInput value={data.titleLine1Bn ?? ''} onChange={(v) => setData({ ...data, titleLine1Bn: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (EN)">
          <AdminInput value={data.titleLine2En ?? ''} onChange={(v) => setData({ ...data, titleLine2En: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (বাংলা)">
          <AdminInput value={data.titleLine2Bn ?? ''} onChange={(v) => setData({ ...data, titleLine2Bn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── CONTACT EDITOR ──
function ContactEditor() {
  const [data, setData] = useState<ContactContent>({
    email: '',
    ig: '',
    fb: '',
    wa: '',
    sectionLabelEn: 'Get In Touch',
    sectionLabelBn: 'যোগাযোগ করুন',
    titleLine1En: "Let's build something",
    titleLine1Bn: 'আসুন এমন কিছু তৈরি করি',
    titleLine2En: 'worth noticing.',
    titleLine2Bn: 'যা নজর কাড়ে।',
    descEn: "Have a skincare brand that deserves better visuals? Let's talk. We take on a limited number of projects to ensure every client gets full attention.",
    descBn: 'আপনার স্কিনকেয়ার ব্র্যান্ড কি আরও ভালো ভিজ্যুয়াল পাওয়ার যোগ্য? যোগাযোগ করুন। আমরা সীমিত সংখ্যক প্রজেক্ট নিই।',
    brandPlaceholderEn: 'Your Brand Name / আপনার ব্র্যান্ডের নাম',
    brandPlaceholderBn: 'আপনার ব্র্যান্ডের নাম / Your Brand Name',
    emailPlaceholderEn: 'Email Address / ইমেইল',
    emailPlaceholderBn: 'ইমেইল / Email Address',
    messagePlaceholderEn: 'Tell us about your brand... / আপনার ব্র্যান্ড সম্পর্কে বলুন...',
    messagePlaceholderBn: 'আপনার ব্র্যান্ড সম্পর্কে বলুন... / Tell us about your brand...',
    submitLabelEn: 'Send Inquiry',
    submitLabelBn: 'বার্তা পাঠান',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'contact').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('contact', data);
  };

  const { markLoaded } = useDirtySection({ key: 'contact', label: 'Contact Info', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Contact Info">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Section Label (EN)">
          <AdminInput value={data.sectionLabelEn ?? ''} onChange={(v) => setData({ ...data, sectionLabelEn: v })} />
        </AdminField>
        <AdminField label="Section Label (বাংলা)">
          <AdminInput value={data.sectionLabelBn ?? ''} onChange={(v) => setData({ ...data, sectionLabelBn: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (EN)">
          <AdminInput value={data.titleLine1En ?? ''} onChange={(v) => setData({ ...data, titleLine1En: v })} />
        </AdminField>
        <AdminField label="Title Line 1 (বাংলা)">
          <AdminInput value={data.titleLine1Bn ?? ''} onChange={(v) => setData({ ...data, titleLine1Bn: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (EN)">
          <AdminInput value={data.titleLine2En ?? ''} onChange={(v) => setData({ ...data, titleLine2En: v })} />
        </AdminField>
        <AdminField label="Title Line 2 (বাংলা)">
          <AdminInput value={data.titleLine2Bn ?? ''} onChange={(v) => setData({ ...data, titleLine2Bn: v })} />
        </AdminField>
      </div>
      <AdminField label="Description (EN)">
        <AdminTextarea value={data.descEn ?? ''} onChange={(v) => setData({ ...data, descEn: v })} rows={3} />
      </AdminField>
      <AdminField label="Description (বাংলা)">
        <AdminTextarea value={data.descBn ?? ''} onChange={(v) => setData({ ...data, descBn: v })} rows={3} />
      </AdminField>
      <AdminField label="Email">
        <AdminInput value={data.email} onChange={(v) => setData({ ...data, email: v })} />
      </AdminField>
      <AdminField label="Instagram">
        <AdminInput value={data.ig} onChange={(v) => setData({ ...data, ig: v })} />
      </AdminField>
      <AdminField label="Facebook URL">
        <AdminInput value={data.fb} onChange={(v) => setData({ ...data, fb: v })} />
      </AdminField>
      <AdminField label="WhatsApp">
        <AdminInput value={data.wa} onChange={(v) => setData({ ...data, wa: v })} />
      </AdminField>
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Brand Placeholder (EN)">
          <AdminInput value={data.brandPlaceholderEn ?? ''} onChange={(v) => setData({ ...data, brandPlaceholderEn: v })} />
        </AdminField>
        <AdminField label="Brand Placeholder (বাংলা)">
          <AdminInput value={data.brandPlaceholderBn ?? ''} onChange={(v) => setData({ ...data, brandPlaceholderBn: v })} />
        </AdminField>
        <AdminField label="Email Placeholder (EN)">
          <AdminInput value={data.emailPlaceholderEn ?? ''} onChange={(v) => setData({ ...data, emailPlaceholderEn: v })} />
        </AdminField>
        <AdminField label="Email Placeholder (বাংলা)">
          <AdminInput value={data.emailPlaceholderBn ?? ''} onChange={(v) => setData({ ...data, emailPlaceholderBn: v })} />
        </AdminField>
        <AdminField label="Message Placeholder (EN)">
          <AdminInput value={data.messagePlaceholderEn ?? ''} onChange={(v) => setData({ ...data, messagePlaceholderEn: v })} />
        </AdminField>
        <AdminField label="Message Placeholder (বাংলা)">
          <AdminInput value={data.messagePlaceholderBn ?? ''} onChange={(v) => setData({ ...data, messagePlaceholderBn: v })} />
        </AdminField>
        <AdminField label="Submit Button (EN)">
          <AdminInput value={data.submitLabelEn ?? ''} onChange={(v) => setData({ ...data, submitLabelEn: v })} />
        </AdminField>
        <AdminField label="Submit Button (বাংলা)">
          <AdminInput value={data.submitLabelBn ?? ''} onChange={(v) => setData({ ...data, submitLabelBn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── MARQUEE EDITOR ──
// ── EVOLUTION EDITOR ──
function EvolutionEditor() {
  const [data, setData] = useState<EvolutionContent>({
    before_image_url: '',
    after_image_url: '',
    title_en: 'The Evolution',
    title_bn: 'দ্য ইভোলিউশন',
    subtitle_en: 'See the impact of a premium visual identity.',
    subtitle_bn: 'একটি প্রিমিয়াম আইডেন্টিটি কীভাবে ব্র্যান্ডের রূপ বদলে দেয়, তা নিজেই দেখুন।',
    before_label_en: 'Old Concept',
    before_label_bn: 'পুরনো ধারণা',
    after_label_en: 'POLISHED Standard',
    after_label_bn: 'POLISHED মান',
  });
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'evolution').maybeSingle().then(({ data: row }) => {
      const next = { ...data, ...(row?.value ?? {}) } as EvolutionContent;
      setData(next);
      markLoaded(next);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (file: File, kind: 'before' | 'after') => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `evolution/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('polished-assets').upload(path, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type || undefined,
    });
    if (error) { toast.error('Upload error: ' + error.message); return; }
    const url = getPublicAssetUrl(path);
    setData((prev) => ({ ...prev, [kind === 'before' ? 'before_image_url' : 'after_image_url']: url }));
  };

  const save = async (): Promise<boolean> => upsertSetting('evolution', data);
  const { markLoaded } = useDirtySection({ key: 'evolution', label: 'Evolution Section', data, save });

  return (
    <AdminSection title="Evolution (Before / After)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">Before image (Old Concept)</p>
          <div
            className="border-2 border-dashed border-primary-foreground/15 rounded p-4 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
            onClick={() => beforeRef.current?.click()}
          >
            <input ref={beforeRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'before'); }} />
            <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">📸 Upload before</span>
            {data.before_image_url && <img src={data.before_image_url} alt="Before" className="w-full aspect-square object-cover rounded mt-3" />}
          </div>
          <AdminInput value={data.before_image_url ?? ''} onChange={(v) => setData({ ...data, before_image_url: v })} placeholder="Or paste URL" />
        </div>
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">After image (POLISHED Standard)</p>
          <div
            className="border-2 border-dashed border-primary-foreground/15 rounded p-4 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
            onClick={() => afterRef.current?.click()}
          >
            <input ref={afterRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'after'); }} />
            <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">📸 Upload after</span>
            {data.after_image_url && <img src={data.after_image_url} alt="After" className="w-full aspect-square object-cover rounded mt-3" />}
          </div>
          <AdminInput value={data.after_image_url ?? ''} onChange={(v) => setData({ ...data, after_image_url: v })} placeholder="Or paste URL" />
        </div>
      </div>
      <AdminField label="Title (EN)"><AdminInput value={data.title_en ?? ''} onChange={(v) => setData({ ...data, title_en: v })} /></AdminField>
      <AdminField label="Title (বাংলা)"><AdminInput value={data.title_bn ?? ''} onChange={(v) => setData({ ...data, title_bn: v })} /></AdminField>
      <AdminField label="Subtitle (EN)"><AdminTextarea value={data.subtitle_en ?? ''} onChange={(v) => setData({ ...data, subtitle_en: v })} /></AdminField>
      <AdminField label="Subtitle (বাংলা)"><AdminTextarea value={data.subtitle_bn ?? ''} onChange={(v) => setData({ ...data, subtitle_bn: v })} /></AdminField>
      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Before label (EN)"><AdminInput value={data.before_label_en ?? ''} onChange={(v) => setData({ ...data, before_label_en: v })} /></AdminField>
        <AdminField label="Before label (বাংলা)"><AdminInput value={data.before_label_bn ?? ''} onChange={(v) => setData({ ...data, before_label_bn: v })} /></AdminField>
        <AdminField label="After label (EN)"><AdminInput value={data.after_label_en ?? ''} onChange={(v) => setData({ ...data, after_label_en: v })} /></AdminField>
        <AdminField label="After label (বাংলা)"><AdminInput value={data.after_label_bn ?? ''} onChange={(v) => setData({ ...data, after_label_bn: v })} /></AdminField>
      </div>
    </AdminSection>
  );
}



function MarqueeEditor() {
  const [text, setText] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'marquee').maybeSingle().then(({ data: row }) => {
      const value = row?.value?.items ? row.value.items.join('\n') : '';
      setText(value);
      markLoaded(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (): Promise<boolean> => {
    const items = text.split('\n').filter((l) => l.trim());
    return await upsertSetting('marquee', { items });
  };

  const { markLoaded } = useDirtySection({ key: 'marquee', label: 'Marquee Text', data: text, save });

  return (
    <AdminSection title="Marquee Text">
      <AdminField label="Items (one per line)">
        <AdminTextarea value={text} onChange={setText} rows={5} />
      </AdminField>
    </AdminSection>
  );
}

// ── LOGO EDITOR ──
function LogoEditor() {
  const [url, setUrl] = useState(() => withCacheBust(getPublicAssetUrl(LOGO_STORAGE_PATH)));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'logo').maybeSingle().then(({ data: row }) => {
      const next = withCacheBust(row?.value?.url ?? getPublicAssetUrl(LOGO_STORAGE_PATH));
      setUrl(next);
      markLoaded(stripCacheBust(next));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (file: File) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const { error } = await supabase.storage.from('polished-assets').upload(LOGO_STORAGE_PATH, file, {
      upsert: true,
      cacheControl: '0',
      contentType: file.type || undefined,
    });
    if (error) { toast.error('Upload error: ' + error.message); return; }
    setUrl(withCacheBust(getPublicAssetUrl(LOGO_STORAGE_PATH)));
  };

  const cleanUrl = stripCacheBust(url);
  const save = async (): Promise<boolean> => {
    return await upsertSetting('logo', { url: cleanUrl });
  };

  const { markLoaded } = useDirtySection({ key: 'logo', label: 'Logo', data: cleanUrl, save });

  return (
    <AdminSection title="Logo">
      <div
        className="border-2 border-dashed border-primary-foreground/15 rounded p-6 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 mb-4"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">📸 Click to upload logo</span>
        {url && <img src={url} alt="Logo" className="max-w-[120px] max-h-[120px] mx-auto mt-3 rounded" />}
      </div>
    </AdminSection>
  );
}



// ── FOOTER EDITOR ──
function FooterEditor() {
  const [data, setData] = useState<FooterContent>({
    brandName: 'POLISHED',
    year: '2025',
    rightsTextEn: 'All rights reserved.',
    rightsTextBn: 'সর্বস্বত্ব সংরক্ষিত।',
  });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'footer').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('footer', data);
  };

  const { markLoaded } = useDirtySection({ key: 'footer', label: 'Footer', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Footer">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Brand Name">
          <AdminInput value={data.brandName} onChange={(v) => setData({ ...data, brandName: v })} />
        </AdminField>
        <AdminField label="Copyright Year">
          <AdminInput value={data.year} onChange={(v) => setData({ ...data, year: v })} />
        </AdminField>
        <AdminField label="Rights Text (EN)">
          <AdminInput value={data.rightsTextEn ?? ''} onChange={(v) => setData({ ...data, rightsTextEn: v })} />
        </AdminField>
        <AdminField label="Rights Text (বাংলা)">
          <AdminInput value={data.rightsTextBn ?? ''} onChange={(v) => setData({ ...data, rightsTextBn: v })} />
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── META / SEO EDITOR ──
function MetaEditor() {
  const [data, setData] = useState<MetaContent>({ title: 'POLISHED — Graphics Design Agency', desc: 'We craft refined, trust-driven visual identities for skincare brands.', gaId: '' });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'meta').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('meta', data);
  };

  const { markLoaded } = useDirtySection({ key: 'meta', label: 'Meta / SEO', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Meta / SEO">
      <AdminField label="Page Title">
        <AdminInput value={data.title} onChange={(v) => setData({ ...data, title: v })} placeholder="POLISHED — Graphics Design Agency" />
      </AdminField>
      <AdminField label="Meta Description">
        <AdminTextarea value={data.desc} onChange={(v) => setData({ ...data, desc: v })} rows={2} />
      </AdminField>
      <AdminField label="Google Analytics ID">
        <AdminInput value={data.gaId} onChange={(v) => setData({ ...data, gaId: v })} placeholder="G-XXXXXXXXXX" />
      </AdminField>
    </AdminSection>
  );
}

// ── COLORS EDITOR ──
function ColorsEditor() {
  const [data, setData] = useState<ColorsContent>({ blue: '#1e3a8a', orange: '#fb923c', bg: '#f9fafb', text: '#0f172a' });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'colors').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('colors', data);
  };

  const { markLoaded } = useDirtySection({ key: 'colors', label: 'Brand Colors', data, save });

  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  return (
    <AdminSection title="Brand Colors">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Primary Blue">
          <div className="flex gap-2 items-center">
            <input type="color" value={data.blue} onChange={(e) => setData({ ...data, blue: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
            <AdminInput value={data.blue} onChange={(v) => setData({ ...data, blue: v })} />
          </div>
        </AdminField>
        <AdminField label="Accent Orange">
          <div className="flex gap-2 items-center">
            <input type="color" value={data.orange} onChange={(e) => setData({ ...data, orange: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
            <AdminInput value={data.orange} onChange={(v) => setData({ ...data, orange: v })} />
          </div>
        </AdminField>
        <AdminField label="Background">
          <div className="flex gap-2 items-center">
            <input type="color" value={data.bg} onChange={(e) => setData({ ...data, bg: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
            <AdminInput value={data.bg} onChange={(v) => setData({ ...data, bg: v })} />
          </div>
        </AdminField>
        <AdminField label="Text Color">
          <div className="flex gap-2 items-center">
            <input type="color" value={data.text} onChange={(e) => setData({ ...data, text: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
            <AdminInput value={data.text} onChange={(v) => setData({ ...data, text: v })} />
          </div>
        </AdminField>
      </div>
    </AdminSection>
  );
}

// ── TESTIMONIALS EDITOR ──
const DEFAULT_TESTIMONIALS: TestimonialsContent = {
  labelEn: 'Partnerships',
  labelBn: 'পার্টনারশিপ',
  headingEn: 'Trusted by Visionaries.',
  headingBn: 'যাদের আস্থায় আমরা।',
  subEn: 'Words from the visionaries behind premium e-commerce brands and marketing agencies.',
  subBn: 'প্রিমিয়াম ই-কমার্স ব্র্যান্ড এবং মার্কেটিং ভিশনারিদের কিছু কথা।',
  items: [],
};

function makeTestimonialId() {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function TestimonialsEditor() {
  const [data, setData] = useState<TestimonialsContent>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'testimonials').maybeSingle().then(({ data: row }) => {
      if (row?.value) {
        const v = row.value as TestimonialsContent;
        setData({
          ...DEFAULT_TESTIMONIALS,
          ...v,
          items: (v.items ?? []).map((it) => ({
            id: it.id || makeTestimonialId(),
            quote_en: it.quote_en ?? '',
            quote_bn: it.quote_bn ?? '',
            name: it.name ?? '',
            role_en: it.role_en ?? '',
            role_bn: it.role_bn ?? '',
          })),
        });
      }
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('testimonials', data as unknown as Record<string, any>);
  };

  const { markLoaded } = useDirtySection({ key: 'testimonials', label: 'Partnerships', data, save });
  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  const items = data.items ?? [];

  const updateItem = (idx: number, patch: Partial<TestimonialItem>) => {
    const nextItems = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setData({ ...data, items: nextItems });
  };
  const removeItem = (idx: number) => setData({ ...data, items: items.filter((_, i) => i !== idx) });
  const moveItem = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= items.length) return;
    const next = [...items];
    [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
    setData({ ...data, items: next });
  };
  const addItem = () => {
    setData({
      ...data,
      items: [
        ...items,
        { id: makeTestimonialId(), quote_en: '', quote_bn: '', name: '', role_en: '', role_bn: '' },
      ],
    });
  };

  return (
    <>
      <AdminSection title="Partnerships — Section copy">
        <div className="grid grid-cols-2 gap-4">
          <AdminField label="Eyebrow (EN)">
            <AdminInput value={data.labelEn ?? ''} onChange={(v) => setData({ ...data, labelEn: v })} />
          </AdminField>
          <AdminField label="Eyebrow (বাংলা)">
            <AdminInput value={data.labelBn ?? ''} onChange={(v) => setData({ ...data, labelBn: v })} />
          </AdminField>
          <AdminField label="Heading (EN)">
            <AdminInput value={data.headingEn ?? ''} onChange={(v) => setData({ ...data, headingEn: v })} />
          </AdminField>
          <AdminField label="Heading (বাংলা)">
            <AdminInput value={data.headingBn ?? ''} onChange={(v) => setData({ ...data, headingBn: v })} />
          </AdminField>
          <AdminField label="Subheading (EN)">
            <AdminTextarea value={data.subEn ?? ''} onChange={(v) => setData({ ...data, subEn: v })} rows={2} />
          </AdminField>
          <AdminField label="Subheading (বাংলা)">
            <AdminTextarea value={data.subBn ?? ''} onChange={(v) => setData({ ...data, subBn: v })} rows={2} />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title={`Partnership quotes (${items.length})`}>
        <div className="space-y-6">
          {items.map((it, i) => (
            <div key={it.id} className="border border-primary-foreground/10 rounded p-5 bg-primary-foreground/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40">#{i + 1}</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="text-[11px] tracking-[2px] uppercase px-2 py-1 text-primary-foreground/60 hover:text-accent disabled:opacity-20">↑</button>
                  <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="text-[11px] tracking-[2px] uppercase px-2 py-1 text-primary-foreground/60 hover:text-accent disabled:opacity-20">↓</button>
                  <button type="button" onClick={() => removeItem(i)} className="text-[11px] tracking-[2px] uppercase px-2 py-1 text-red-400/80 hover:text-red-300">Remove</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Name">
                  <AdminInput value={it.name} onChange={(v) => updateItem(i, { name: v })} />
                </AdminField>
                <div />
                <AdminField label="Role (EN)">
                  <AdminInput value={it.role_en} onChange={(v) => updateItem(i, { role_en: v })} placeholder="Founder, Brand Co." />
                </AdminField>
                <AdminField label="Role (বাংলা)">
                  <AdminInput value={it.role_bn} onChange={(v) => updateItem(i, { role_bn: v })} placeholder="ফাউন্ডার, ব্র্যান্ড কোং" />
                </AdminField>
                <AdminField label="Quote (EN)">
                  <AdminTextarea value={it.quote_en} onChange={(v) => updateItem(i, { quote_en: v })} rows={4} />
                </AdminField>
                <AdminField label="Quote (বাংলা)">
                  <AdminTextarea value={it.quote_bn} onChange={(v) => updateItem(i, { quote_bn: v })} rows={4} />
                </AdminField>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-6 px-4 py-2 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase rounded-sm hover:-translate-y-0.5 transition-transform duration-300"
        >
          + Add testimonial
        </button>
        <p className="text-[11px] text-primary-foreground/40 mt-3">
          When empty, the site falls back to built-in sample testimonials.
        </p>
      </AdminSection>
    </>
  );
}

// ── UI LABELS EDITOR ──
const UI_LABEL_GROUPS: {
  title: string;
  fields: { keyEn: keyof UILabelsContent; keyBn: keyof UILabelsContent; label: string; placeholderEn: string; placeholderBn: string; textarea?: boolean }[];
}[] = [
  {
    title: 'Navigation (বাংলা labels are used when the site is switched to Bengali)',
    fields: [
      { keyEn: 'navEvolutionEn', keyBn: 'navEvolutionBn', label: 'Evolution', placeholderEn: 'The Evolution', placeholderBn: 'বিবর্তন' },
      { keyEn: 'navEvolutionEn', keyBn: 'navAboutBn', label: 'About (বাংলা only)', placeholderEn: '—', placeholderBn: 'পরিচিতি' },
      { keyEn: 'navEvolutionEn', keyBn: 'navServicesBn', label: 'Services (বাংলা only)', placeholderEn: '—', placeholderBn: 'এক্সপার্টিজ' },
      { keyEn: 'navEvolutionEn', keyBn: 'navWorkBn', label: 'Work (বাংলা only)', placeholderEn: '—', placeholderBn: 'সিগনেচার প্রজেক্ট' },
      { keyEn: 'navEvolutionEn', keyBn: 'navContactBn', label: 'Contact (বাংলা only)', placeholderEn: '—', placeholderBn: 'যোগাযোগ' },
    ],
  },
  {
    title: 'Portfolio buttons',
    fields: [
      { keyEn: 'portfolioClickExpandEn', keyBn: 'portfolioClickExpandBn', label: 'Click to expand image', placeholderEn: 'Click image for full view', placeholderBn: 'ফুল ভিউ দেখতে ছবিতে ক্লিক করুন' },
      { keyEn: 'portfolioClickCollapseEn', keyBn: 'portfolioClickCollapseBn', label: 'Click to collapse image', placeholderEn: 'Click to collapse', placeholderBn: 'সংকুচিত করতে ক্লিক করুন' },
      { keyEn: 'portfolioViewCaseStudyEn', keyBn: 'portfolioViewCaseStudyBn', label: 'View case study button', placeholderEn: 'View full case study', placeholderBn: 'সম্পূর্ণ কেস স্টাডি দেখুন' },
      { keyEn: 'portfolioHideCaseStudyEn', keyBn: 'portfolioHideCaseStudyBn', label: 'Hide case study button', placeholderEn: 'Hide case study', placeholderBn: 'কেস স্টাডি লুকান' },
      { keyEn: 'portfolioViewMockupsEn', keyBn: 'portfolioViewMockupsBn', label: 'View mockups button', placeholderEn: 'View project mockups', placeholderBn: 'প্রোজেক্ট মকআপ দেখুন' },
    ],
  },
  {
    title: 'Lead form — Bengali intro block',
    fields: [
      { keyEn: 'navEvolutionEn', keyBn: 'leadFormIntroTitleBn', label: 'Intro title (বাংলা only)', placeholderEn: '—', placeholderBn: 'পার্টনারশিপ ইনকোয়ারি' },
      { keyEn: 'navEvolutionEn', keyBn: 'leadFormIntroDescBn', label: 'Intro description (বাংলা only)', placeholderEn: '—', placeholderBn: 'আমরা প্রতিটি ব্র্যান্ডের সাথে…', textarea: true },
    ],
  },
  {
    title: 'Lead form — progress',
    fields: [
      { keyEn: 'leadFormStepOfEn', keyBn: 'leadFormStepOfBn', label: 'Step counter (use {n} and {total})', placeholderEn: 'Step {n} of {total}', placeholderBn: 'ধাপ {n} / {total}' },
      { keyEn: 'leadFormStepBrandEn', keyBn: 'leadFormStepBrandBn', label: 'Step 1 name', placeholderEn: 'Brand', placeholderBn: 'ব্র্যান্ড' },
      { keyEn: 'leadFormStepVisionEn', keyBn: 'leadFormStepVisionBn', label: 'Step 2 name', placeholderEn: 'Vision', placeholderBn: 'ভিশন' },
      { keyEn: 'leadFormStepContactEn', keyBn: 'leadFormStepContactBn', label: 'Step 3 name', placeholderEn: 'Contact', placeholderBn: 'যোগাযোগ' },
    ],
  },
  {
    title: 'Lead form — Step 1',
    fields: [
      { keyEn: 'leadFormStep1EyebrowEn', keyBn: 'leadFormStep1EyebrowBn', label: 'Step 1 eyebrow', placeholderEn: 'Tell us about you', placeholderBn: 'আপনার সম্পর্কে' },
      { keyEn: 'leadFormStep1TitleEn', keyBn: 'leadFormStep1TitleBn', label: 'Step 1 title', placeholderEn: 'Who are we talking to?', placeholderBn: 'কে যোগাযোগ করছেন?' },
      { keyEn: 'leadFormNameEn', keyBn: 'leadFormNameBn', label: 'Name placeholder', placeholderEn: 'Your full name', placeholderBn: 'আপনার নাম' },
      { keyEn: 'leadFormBrandNameEn', keyBn: 'leadFormBrandNameBn', label: 'Brand placeholder', placeholderEn: 'Brand or store name', placeholderBn: 'আপনার ব্র্যান্ডের নাম' },
      { keyEn: 'leadFormStoreUrlEn', keyBn: 'leadFormStoreUrlBn', label: 'Store URL placeholder', placeholderEn: 'Website / Instagram (optional)', placeholderBn: 'ওয়েবসাইট / ইনস্টাগ্রাম লিংক' },
    ],
  },
  {
    title: 'Lead form — Step 2',
    fields: [
      { keyEn: 'leadFormStep2EyebrowEn', keyBn: 'leadFormStep2EyebrowBn', label: 'Step 2 eyebrow', placeholderEn: 'Investment & vision', placeholderBn: 'প্রোজেক্টের লক্ষ্য ও ভিশন' },
      { keyEn: 'leadFormStep2TitleEn', keyBn: 'leadFormStep2TitleBn', label: 'Step 2 title', placeholderEn: "What's the scope?", placeholderBn: 'প্রোজেক্টের পরিধি?' },
      { keyEn: 'leadFormBudgetLabelEn', keyBn: 'leadFormBudgetLabelBn', label: 'Budget label', placeholderEn: 'Estimated budget', placeholderBn: 'আনুমানিক বাজেট' },
      { keyEn: 'budget1En', keyBn: 'budget1Bn', label: 'Budget option 1', placeholderEn: 'Below 20,000 BDT', placeholderBn: '২০,০০০ টাকার নিচে' },
      { keyEn: 'budget2En', keyBn: 'budget2Bn', label: 'Budget option 2', placeholderEn: '20,000 – 50,000 BDT', placeholderBn: '২০,০০০ – ৫০,০০০ টাকা' },
      { keyEn: 'budget3En', keyBn: 'budget3Bn', label: 'Budget option 3', placeholderEn: '50,000 BDT and above', placeholderBn: '৫০,০০০ টাকা ও তার বেশি' },
      { keyEn: 'budget4En', keyBn: 'budget4Bn', label: 'Budget option 4', placeholderEn: "I'm not sure yet", placeholderBn: 'এখনো নিশ্চিত নই' },
      { keyEn: 'leadFormProjectPlaceholderEn', keyBn: 'leadFormProjectPlaceholderBn', label: 'Project details placeholder', placeholderEn: 'Describe your project — goals, timeline…', placeholderBn: 'আপনার ব্র্যান্ডকে নেক্সট লেভেলে…', textarea: true },
    ],
  },
  {
    title: 'Lead form — Step 3',
    fields: [
      { keyEn: 'leadFormStep3EyebrowEn', keyBn: 'leadFormStep3EyebrowBn', label: 'Step 3 eyebrow', placeholderEn: 'Almost done', placeholderBn: 'প্রায় শেষ' },
      { keyEn: 'leadFormStep3TitleEn', keyBn: 'leadFormStep3TitleBn', label: 'Step 3 title', placeholderEn: 'Where can we reach you?', placeholderBn: 'বিজনেস ইমেইল' },
      { keyEn: 'leadFormEmailPlaceholderEn', keyBn: 'leadFormEmailPlaceholderBn', label: 'Email placeholder', placeholderEn: 'Email address', placeholderBn: 'hello@yourbrand.com' },
      { keyEn: 'leadFormReassuranceEn', keyBn: 'leadFormReassuranceBn', label: 'Reassurance copy', placeholderEn: 'We respond personally within 24 hours…', placeholderBn: 'আমরা ২৪ ঘণ্টার মধ্যে…', textarea: true },
    ],
  },
  {
    title: 'Lead form — buttons & thank you',
    fields: [
      { keyEn: 'leadFormBackEn', keyBn: 'leadFormBackBn', label: 'Back button', placeholderEn: 'Back', placeholderBn: 'পিছনে' },
      { keyEn: 'leadFormContinueEn', keyBn: 'leadFormContinueBn', label: 'Continue button', placeholderEn: 'Continue', placeholderBn: 'এগিয়ে যান' },
      { keyEn: 'leadFormSubmitEn', keyBn: 'leadFormSubmitBn', label: 'Submit button', placeholderEn: 'Request Consultation', placeholderBn: 'রিকোয়েস্ট সাবমিট করুন' },
      { keyEn: 'leadFormSendingEn', keyBn: 'leadFormSendingBn', label: 'Sending state', placeholderEn: 'Sending…', placeholderBn: 'সাবমিট হচ্ছে...' },
      { keyEn: 'leadFormReceivedEn', keyBn: 'leadFormReceivedBn', label: 'Received eyebrow', placeholderEn: 'Received', placeholderBn: 'প্রাপ্ত' },
      { keyEn: 'leadFormThankTitleEn', keyBn: 'leadFormThankTitleBn', label: 'Thank-you title', placeholderEn: 'Thank you. We\u2019ll be in touch.', placeholderBn: 'ধন্যবাদ। আমরা শীঘ্রই যোগাযোগ করব।' },
      { keyEn: 'leadFormThankSubEn', keyBn: 'leadFormThankSubBn', label: 'Thank-you subtitle', placeholderEn: 'Your inquiry just landed…', placeholderBn: 'আপনার বার্তা আমাদের স্টুডিওতে…', textarea: true },
      { keyEn: 'leadFormResetEn', keyBn: 'leadFormResetBn', label: 'Reset button', placeholderEn: 'Submit another inquiry', placeholderBn: 'আরেকটি বার্তা পাঠান' },
    ],
  },
];

function UILabelsEditor() {
  const [data, setData] = useState<UILabelsContent>({});

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'ui_labels').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData(row.value as UILabelsContent);
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> => {
    return await upsertSetting('ui_labels', data as unknown as Record<string, any>);
  };

  const { markLoaded } = useDirtySection({ key: 'ui_labels', label: 'UI Labels', data, save });
  const [_loaded, _setLoaded] = useState(false);
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  const set = (key: keyof UILabelsContent, v: string) => setData({ ...data, [key]: v });

  return (
    <>
      {UI_LABEL_GROUPS.map((group) => (
        <AdminSection key={group.title} title={group.title}>
          <div className="space-y-4">
            {group.fields.map((f, idx) => {
              const showEn = f.placeholderEn !== '—';
              const Field = f.textarea ? AdminTextarea : AdminInput;
              return (
                <div key={`${f.keyBn}-${idx}`} className="grid grid-cols-2 gap-4">
                  {showEn ? (
                    <AdminField label={`${f.label} (EN)`}>
                      <Field
                        value={(data[f.keyEn] as string | undefined) ?? ''}
                        onChange={(v: string) => set(f.keyEn, v)}
                        placeholder={f.placeholderEn}
                      />
                    </AdminField>
                  ) : <div />}
                  <AdminField label={`${f.label} (বাংলা)`}>
                    <Field
                      value={(data[f.keyBn] as string | undefined) ?? ''}
                      onChange={(v: string) => set(f.keyBn, v)}
                      placeholder={f.placeholderBn}
                    />
                  </AdminField>
                </div>
              );
            })}
          </div>
        </AdminSection>
      ))}
    </>
  );
}




// ── PRICING / INVESTMENT EDITOR ──
function PricingEditor() {
  const [data, setData] = useState<PricingContent>(DEFAULT_PRICING);
  const [_loaded, _setLoaded] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'pricing').maybeSingle().then(({ data: row }) => {
      if (row?.value) {
        const v = row.value as PricingContent;
        setData({
          ...DEFAULT_PRICING,
          ...v,
          tiers: (v.tiers ?? DEFAULT_PRICING.tiers ?? []).map((t) => ({
            ...t,
            id: t.id || makePricingTierId(),
          })),
        });
      }
      _setLoaded(true);
    });
  }, []);

  const save = async (): Promise<boolean> =>
    await upsertSetting('pricing', data as unknown as Record<string, any>);

  const { markLoaded } = useDirtySection({ key: 'pricing', label: 'Investment / Pricing', data, save });
  useEffect(() => { if (_loaded) markLoaded(data); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [_loaded]);

  const tiers = data.tiers ?? [];
  const updateTier = (idx: number, patch: Partial<PricingTier>) =>
    setData({ ...data, tiers: tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t)) });
  const removeTier = (idx: number) => setData({ ...data, tiers: tiers.filter((_, i) => i !== idx) });
  const moveTier = (idx: number, dir: -1 | 1) => {
    const n = idx + dir;
    if (n < 0 || n >= tiers.length) return;
    const next = [...tiers];
    [next[idx], next[n]] = [next[n], next[idx]];
    setData({ ...data, tiers: next });
  };
  const addTier = () =>
    setData({
      ...data,
      tiers: [
        ...tiers,
        {
          id: makePricingTierId(),
          title_en: '', title_bn: '',
          target_en: '', target_bn: '',
          desc_en: '', desc_bn: '',
          cta_en: '', cta_bn: '',
          featured: false,
        },
      ],
    });

  return (
    <>
      <AdminSection title="Investment — Section heading">
        <div className="grid grid-cols-2 gap-4">
          <AdminField label="Eyebrow (EN)">
            <AdminInput value={data.labelEn ?? ''} onChange={(v) => setData({ ...data, labelEn: v })} />
          </AdminField>
          <AdminField label="Eyebrow (বাংলা)">
            <AdminInput value={data.labelBn ?? ''} onChange={(v) => setData({ ...data, labelBn: v })} />
          </AdminField>
          <AdminField label="Heading line 1 (EN)">
            <AdminInput value={data.titleEn ?? ''} onChange={(v) => setData({ ...data, titleEn: v })} />
          </AdminField>
          <AdminField label="Heading line 1 (বাংলা)">
            <AdminInput value={data.titleBn ?? ''} onChange={(v) => setData({ ...data, titleBn: v })} />
          </AdminField>
          <AdminField label="Heading line 2 — italic (EN)">
            <AdminInput value={data.titleEmEn ?? ''} onChange={(v) => setData({ ...data, titleEmEn: v })} />
          </AdminField>
          <AdminField label="Heading line 2 — italic (বাংলা)">
            <AdminInput value={data.titleEmBn ?? ''} onChange={(v) => setData({ ...data, titleEmBn: v })} />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title={`Pricing tiers (${tiers.length})`}>
        <div className="space-y-6">
          {tiers.map((t, i) => (
            <div key={t.id} className="border border-primary-foreground/10 rounded p-5 bg-primary-foreground/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40">#{i + 1}</p>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-primary-foreground/60 mr-2">
                    <input
                      type="checkbox"
                      checked={!!t.featured}
                      onChange={(e) => updateTier(i, { featured: e.target.checked })}
                      className="accent-[hsl(var(--accent))]"
                    />
                    Featured
                  </label>
                  <button type="button" onClick={() => moveTier(i, -1)} disabled={i === 0} className="text-[11px] px-2 py-1 text-primary-foreground/60 hover:text-accent disabled:opacity-20">↑</button>
                  <button type="button" onClick={() => moveTier(i, 1)} disabled={i === tiers.length - 1} className="text-[11px] px-2 py-1 text-primary-foreground/60 hover:text-accent disabled:opacity-20">↓</button>
                  <button type="button" onClick={() => removeTier(i)} className="text-[11px] tracking-[2px] uppercase px-2 py-1 text-red-400/80 hover:text-red-300">Remove</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Audience label (EN)">
                  <AdminInput value={t.target_en} onChange={(v) => updateTier(i, { target_en: v })} />
                </AdminField>
                <AdminField label="Audience label (বাংলা)">
                  <AdminInput value={t.target_bn} onChange={(v) => updateTier(i, { target_bn: v })} />
                </AdminField>
                <AdminField label="Title (EN)">
                  <AdminInput value={t.title_en} onChange={(v) => updateTier(i, { title_en: v })} />
                </AdminField>
                <AdminField label="Title (বাংলা)">
                  <AdminInput value={t.title_bn} onChange={(v) => updateTier(i, { title_bn: v })} />
                </AdminField>
                <AdminField label="Description (EN)">
                  <AdminTextarea value={t.desc_en} onChange={(v) => updateTier(i, { desc_en: v })} rows={4} />
                </AdminField>
                <AdminField label="Description (বাংলা)">
                  <AdminTextarea value={t.desc_bn} onChange={(v) => updateTier(i, { desc_bn: v })} rows={4} />
                </AdminField>
                <AdminField label="Button label (EN)">
                  <AdminInput value={t.cta_en} onChange={(v) => updateTier(i, { cta_en: v })} />
                </AdminField>
                <AdminField label="Button label (বাংলা)">
                  <AdminInput value={t.cta_bn} onChange={(v) => updateTier(i, { cta_bn: v })} />
                </AdminField>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTier}
          className="mt-6 px-4 py-2 bg-accent text-accent-foreground text-[11px] tracking-[2px] uppercase rounded-sm hover:-translate-y-0.5 transition-transform duration-300"
        >
          + Add tier
        </button>
      </AdminSection>

      <AdminSection title="Custom solution banner">
        <div className="grid grid-cols-2 gap-4">
          <AdminField label="Heading (EN)">
            <AdminInput value={data.customHeadingEn ?? ''} onChange={(v) => setData({ ...data, customHeadingEn: v })} />
          </AdminField>
          <AdminField label="Heading (বাংলা)">
            <AdminInput value={data.customHeadingBn ?? ''} onChange={(v) => setData({ ...data, customHeadingBn: v })} />
          </AdminField>
          <AdminField label="Description (EN)">
            <AdminTextarea value={data.customDescEn ?? ''} onChange={(v) => setData({ ...data, customDescEn: v })} rows={3} />
          </AdminField>
          <AdminField label="Description (বাংলা)">
            <AdminTextarea value={data.customDescBn ?? ''} onChange={(v) => setData({ ...data, customDescBn: v })} rows={3} />
          </AdminField>
          <AdminField label="Button label (EN)">
            <AdminInput value={data.customCtaEn ?? ''} onChange={(v) => setData({ ...data, customCtaEn: v })} />
          </AdminField>
          <AdminField label="Button label (বাংলা)">
            <AdminInput value={data.customCtaBn ?? ''} onChange={(v) => setData({ ...data, customCtaBn: v })} />
          </AdminField>
        </div>
      </AdminSection>
    </>
  );
}
