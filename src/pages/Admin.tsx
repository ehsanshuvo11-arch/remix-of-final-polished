import { useState, useEffect, useRef, useMemo } from 'react';
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
  DiscountContent,
  FooterContent,
  HeroContent,
  MetaContent,
  NavContent,
  PortfolioMetaContent,
  PortfolioProject,
  ProcessMetaContent,
  ProcessStep,
  PuzzleContent,
  Service,
  ServicesMetaContent,
  Stat,
} from '@/types/database';
import RichTextEditor from '@/components/ui/rich-text-editor';
import TransformationsEditor from '@/components/admin/TransformationsEditor';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout, { type AdminModuleId } from '@/components/admin/AdminLayout';
import InquiriesTable from '@/components/admin/InquiriesTable';

const LOGO_STORAGE_PATH = 'logo/current';
const PUZZLE_STORAGE_PATH = 'puzzle/current';
const PUZZLE_PIECE_COUNT = 8;
const PUZZLE_PIECE_STORAGE_PREFIX = 'puzzle/pieces';

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

function createEmptyPieceImages() {
  return Array.from({ length: PUZZLE_PIECE_COUNT }, () => '');
}

async function ensureAuthenticatedSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    alert(`Authentication error: ${error.message}`);
    return null;
  }

  let session = data.session;

  if (session?.expires_at && session.expires_at * 1000 <= Date.now() + 60_000) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      alert(`Session refresh failed: ${refreshError.message}`);
      return null;
    }

    session = refreshed.session;
  }

  if (!session) {
    alert('Your admin session expired. Please sign in again.');
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

function LegacyContentDashboard() {
  return (
    <SaveAllProvider>
      <div className="pb-32">
        <div className="mb-10">
          <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40 mb-2">
            Module
          </p>
          <h2 className="font-heading text-3xl text-primary-foreground font-light tracking-[2px]">
            Content
          </h2>
          <p className="text-[12px] text-primary-foreground/40 mt-2">
            Edit any section, then click <span className="text-accent">Save All Changes</span> in the bottom-right to commit everything at once.
          </p>
        </div>

        <MetaEditor />
        <ColorsEditor />
        <HeroEditor />
        <NavigationEditor />
        <AboutEditor />
        <ServicesMetaEditor />
        <ServicesEditor />
        <StatsEditor />
        <PortfolioMetaEditor />
        <PortfolioEditor />
        <TransformationsEditor />
        <ProcessMetaEditor />
        <ProcessEditor />
        <ContactEditor />
        <MarqueeEditor />
        <LogoEditor />
        <PuzzleImageEditor />
        <PuzzleTextEditor />
        <DiscountEditor />
        <FooterEditor />
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

function SaveButton({ onClick, label = 'Save' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 bg-accent text-accent-foreground text-xs tracking-[2px] uppercase rounded-sm transition-all duration-300 hover:bg-[hsl(28,96%,55%)] hover:-translate-y-0.5"
    >
      {label}
    </button>
  );
}

// ── Helper: upsert setting ──
let _queryClient: ReturnType<typeof useQueryClient> | null = null;
export function setAdminQueryClient(qc: ReturnType<typeof useQueryClient>) { _queryClient = qc; }

async function refreshSiteSettingQueries(key: string) {
  if (!_queryClient) return;

  await Promise.all([
    _queryClient.invalidateQueries({ queryKey: ['site-setting'] }),
    _queryClient.invalidateQueries({ queryKey: ['site-setting', key] }),
    _queryClient.refetchQueries({ queryKey: ['site-setting'], type: 'all' }),
    _queryClient.refetchQueries({ queryKey: ['site-setting', key], type: 'all' }),
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
    alert('Error saving: ' + mutationError.message);
    return false;
  }

  const { data: verifiedRow, error: verifyError } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (verifyError) {
    alert('Saved, but refresh check failed: ' + verifyError.message);
    return false;
  }

  if (!verifiedRow || !isSameJson(verifiedRow.value, value)) {
    alert(SETTINGS_SAVE_ERROR);
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
      alert('Error saving: ' + error.message);
      return false;
    }
  }

  // If we broke out to retry in legacy mode, re-run from the start
  if (mode === 'legacy') {
    for (const row of rows) {
      const payload = buildCollectionPayload(table, row as unknown as Record<string, unknown>, 'legacy');
      const { error } = await supabase.from(table).update(payload).eq('id', row.id);
      if (error) {
        alert('Error saving: ' + error.message);
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
    alert(verifyError ? `Save failed: ${verifyError.message}` : COLLECTION_SAVE_ERROR);
    return false;
  }

  await refreshCollectionQueries(queryKey);

  if (successMessage) alert(successMessage);
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
    playCtaEn: 'Play & Unlock a Bonus',
    playCtaBn: 'খেলুন ও বোনাস পান',
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('hero', data)) alert('Hero saved!');
  };

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
        <AdminField label="Play Button (EN)">
          <AdminInput value={data.playCtaEn ?? ''} onChange={(v) => setData({ ...data, playCtaEn: v })} />
        </AdminField>
        <AdminField label="Play Button (বাংলা)">
          <AdminInput value={data.playCtaBn ?? ''} onChange={(v) => setData({ ...data, playCtaBn: v })} />
        </AdminField>
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
      <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('nav', data)) alert('Navigation saved!');
  };

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
      <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('about', data)) alert('About saved!');
  };

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
      <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('services-meta', data)) alert('Services header saved!');
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── SERVICES EDITOR ──
function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      if (data) setServices(data.map((r) => normalizeServiceRow(r as Record<string, unknown>)));
    });
  }, []);

  const updateService = (idx: number, field: keyof Service, value: string) => {
    setServices((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const save = async () => {
    await saveCollection('services', services, 'services', 'Services saved!');
  };

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
      alert('Error adding service: ' + error.message);
      return;
    }

    if (data) {
      setServices((prev) => [...prev, normalizeServiceRow(data as Record<string, unknown>)]);
      await refreshCollectionQueries('services');
    }
  };

  const removeService = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const svc = services[idx];
    if (!confirm(`Remove "${svc.name_en}"?`)) return;
    const { error } = await supabase.from('services').delete().eq('id', svc.id);
    if (error) { alert('Error removing: ' + error.message); return; }
    setServices((prev) => prev.filter((_, i) => i !== idx));
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
        <SaveButton onClick={save} />
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
      if (data) setStats(data.map((r) => normalizeStatRow(r as Record<string, unknown>)));
    });
  }, []);

  const updateStat = (idx: number, field: keyof Stat, value: string) => {
    setStats((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const save = async () => {
    await saveCollection('stats', stats, 'stats', 'Stats saved!');
  };

  const addStat = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    let payload: Record<string, unknown> = { sort_order: stats.length + 1, num: '0', suffix: '+', label_en: 'New Stat', label_bn: '' };
    let { data, error } = await supabase.from('stats').insert(payload).select().single();
    if (error && isSchemaColumnMismatch(error)) {
      payload = { sort_order: stats.length + 1, num: '0', suffix: '+', label: 'New Stat' };
      ({ data, error } = await supabase.from('stats').insert(payload).select().single());
    }
    if (error) { alert('Error adding stat: ' + error.message); return; }
    if (data) { setStats((prev) => [...prev, normalizeStatRow(data as Record<string, unknown>)]); await refreshCollectionQueries('stats'); }
  };

  const removeStat = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const stat = stats[idx];
    if (!confirm(`Remove "${stat.label_en}"?`)) return;
    const { error } = await supabase.from('stats').delete().eq('id', stat.id);
    if (error) { alert('Error removing: ' + error.message); return; }
    setStats((prev) => prev.filter((_, i) => i !== idx));
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
        <SaveButton onClick={save} />
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
      if (data) setProjects(data);
    });
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
      alert('Upload error: ' + error.message);
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
      alert('PDF upload error: ' + error.message);
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
      alert('Mockup upload error: ' + error.message);
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

  const save = async () => {
    await saveCollection('portfolio_projects', projects, 'portfolio', 'Projects saved!');
  };

  const addProject = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert({ sort_order: projects.length + 1, title_en: 'New Project', title_bn: '', category_en: 'Design', category_bn: '', image_url: '', case_study_en: '', case_study_bn: '', hook_en: '', hook_bn: '', pdf_url_en: '', pdf_url_bn: '', mockup_url: '', mockup_urls: [] })
      .select()
      .single();
    if (error) {
      alert('Error adding project: ' + error.message);
      return;
    }

    if (data) {
      setProjects((prev) => [...prev, data]);
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
      alert('Error removing project: ' + error.message);
      return;
    }

    setProjects((prev) => prev.filter((_, i) => i !== idx));
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
        <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('portfolio-meta', data)) alert('Portfolio header saved!');
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── PROCESS EDITOR ──
function ProcessEditor() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  useEffect(() => {
    supabase.from('process_steps').select('*').order('sort_order').then(({ data }) => {
      if (data) setSteps(data.map((r) => normalizeProcessStepRow(r as Record<string, unknown>)));
    });
  }, []);

  const updateStep = (idx: number, field: keyof ProcessStep, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const save = async () => {
    await saveCollection('process_steps', steps, 'process-steps', 'Process steps saved!');
  };

  const addStep = async () => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    let payload: Record<string, unknown> = { sort_order: steps.length + 1, title_en: 'New Step', title_bn: '', desc_en: '', desc_bn: '' };
    let { data, error } = await supabase.from('process_steps').insert(payload).select().single();
    if (error && isSchemaColumnMismatch(error)) {
      payload = { sort_order: steps.length + 1, title: 'New Step', description: '' };
      ({ data, error } = await supabase.from('process_steps').insert(payload).select().single());
    }
    if (error) { alert('Error adding step: ' + error.message); return; }
    if (data) { setSteps((prev) => [...prev, normalizeProcessStepRow(data as Record<string, unknown>)]); await refreshCollectionQueries('process-steps'); }
  };

  const removeStep = async (idx: number) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;
    const step = steps[idx];
    if (!confirm(`Remove "${step.title_en}"?`)) return;
    const { error } = await supabase.from('process_steps').delete().eq('id', step.id);
    if (error) { alert('Error removing: ' + error.message); return; }
    setSteps((prev) => prev.filter((_, i) => i !== idx));
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
        <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('process-meta', data)) alert('Process header saved!');
  };

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
      <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('contact', data)) alert('Contact saved!');
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── MARQUEE EDITOR ──
function MarqueeEditor() {
  const [text, setText] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'marquee').maybeSingle().then(({ data: row }) => {
      if (row?.value?.items) setText(row.value.items.join('\n'));
    });
  }, []);

  const save = async () => {
    const items = text.split('\n').filter((l) => l.trim());
    if (await upsertSetting('marquee', { items })) alert('Marquee saved!');
  };

  return (
    <AdminSection title="Marquee Text">
      <AdminField label="Items (one per line)">
        <AdminTextarea value={text} onChange={setText} rows={5} />
      </AdminField>
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── LOGO EDITOR ──
function LogoEditor() {
  const [url, setUrl] = useState(() => withCacheBust(getPublicAssetUrl(LOGO_STORAGE_PATH)));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'logo').maybeSingle().then(({ data: row }) => {
      if (row?.value?.url) {
        setUrl(withCacheBust(row.value.url));
        return;
      }

      setUrl(withCacheBust(getPublicAssetUrl(LOGO_STORAGE_PATH)));
    });
  }, []);

  const handleUpload = async (file: File) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const { error } = await supabase.storage.from('polished-assets').upload(LOGO_STORAGE_PATH, file, {
      upsert: true,
      cacheControl: '0',
      contentType: file.type || undefined,
    });
    if (error) { alert('Upload error: ' + error.message); return; }
    setUrl(withCacheBust(getPublicAssetUrl(LOGO_STORAGE_PATH)));
  };

  const save = async () => {
    const cleanUrl = url.split('?')[0];
    if (await upsertSetting('logo', { url: cleanUrl })) {
      alert('Logo saved!');
      return;
    }

    if (cleanUrl === getPublicAssetUrl(LOGO_STORAGE_PATH)) {
      alert('Logo uploaded. The main site will use this uploaded logo even if the logo setting row is blocked.');
    }
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── PUZZLE IMAGE EDITOR ──
function PuzzleImageEditor() {
  const [data, setData] = useState<PuzzleContent>({
    imageUrl: withCacheBust(getPublicAssetUrl(PUZZLE_STORAGE_PATH)),
    pieceImages: createEmptyPieceImages(),
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const pieceFileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'puzzle').maybeSingle().then(({ data: row }) => {
      if (row?.value) {
        setData({
          ...row.value,
          imageUrl: row.value.imageUrl ? withCacheBust(row.value.imageUrl) : withCacheBust(getPublicAssetUrl(PUZZLE_STORAGE_PATH)),
          pieceImages: Array.from({ length: PUZZLE_PIECE_COUNT }, (_, index) => {
            const url = row.value?.pieceImages?.[index];
            return url ? withCacheBust(url) : '';
          }),
        });
        return;
      }

      setData((prev) => ({ ...prev, imageUrl: withCacheBust(getPublicAssetUrl(PUZZLE_STORAGE_PATH)) }));
    });
  }, []);

  const handleUpload = async (file: File) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const { error } = await supabase.storage.from('polished-assets').upload(PUZZLE_STORAGE_PATH, file, {
      upsert: true,
      cacheControl: '0',
      contentType: file.type || undefined,
    });
    if (error) { alert('Upload error: ' + error.message); return; }
    setData((prev) => ({ ...prev, imageUrl: withCacheBust(getPublicAssetUrl(PUZZLE_STORAGE_PATH)) }));
  };

  const handlePieceUpload = async (index: number, file: File) => {
    const session = await ensureAuthenticatedSession();
    if (!session) return;

    const ext = file.name.split('.').pop() || 'png';
    const path = `${PUZZLE_PIECE_STORAGE_PREFIX}/piece-${index + 1}.${ext}`;
    const { error } = await supabase.storage.from('polished-assets').upload(path, file, {
      upsert: true,
      cacheControl: '0',
      contentType: file.type || undefined,
    });
    if (error) {
      alert('Upload error: ' + error.message);
      return;
    }

    const publicUrl = withCacheBust(getPublicAssetUrl(path));
    setData((prev) => ({
      ...prev,
      pieceImages: prev.pieceImages?.map((item, itemIndex) => itemIndex === index ? publicUrl : item) ?? createEmptyPieceImages().map((item, itemIndex) => itemIndex === index ? publicUrl : item),
    }));
  };

  const save = async () => {
    const payload: PuzzleContent = {
      ...data,
      imageUrl: stripCacheBust(data.imageUrl),
      pieceImages: (data.pieceImages ?? createEmptyPieceImages()).map((item) => item ? stripCacheBust(item) : ''),
    };

    if (await upsertSetting('puzzle', payload)) {
      alert('Puzzle image saved!');
      return;
    }

    if (payload.imageUrl === getPublicAssetUrl(PUZZLE_STORAGE_PATH)) {
      alert('Puzzle image uploaded. The main site will use this uploaded file even if the puzzle row is missing.');
    }
  };

  return (
    <AdminSection title="Puzzle Game Image">
      <div
        className="border-2 border-dashed border-primary-foreground/15 rounded p-6 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 mb-4"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        <span className="text-xs tracking-wider text-primary-foreground/50 uppercase">📸 Click to upload puzzle image</span>
        {data.imageUrl && <img src={data.imageUrl} alt="Puzzle" className="max-w-[120px] max-h-[120px] mx-auto mt-3 rounded" />}
      </div>
      <AdminField label="Or paste image URL directly">
        <AdminInput value={data.imageUrl} onChange={(v) => setData((prev) => ({ ...prev, imageUrl: v }))} placeholder="https://example.com/image.jpg" />
      </AdminField>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {(data.pieceImages ?? createEmptyPieceImages()).map((pieceUrl, index) => (
          <div key={index} className="border border-primary-foreground/[0.07] rounded p-3">
            <div className="text-[10px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">Piece {index + 1}</div>
            <div
              className="border-2 border-dashed border-primary-foreground/15 rounded p-3 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5"
              onClick={() => pieceFileRefs.current[index]?.click()}
            >
              <input
                ref={(el) => { pieceFileRefs.current[index] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePieceUpload(index, file);
                }}
              />
              <span className="text-[10px] tracking-wider text-primary-foreground/50 uppercase">Upload</span>
              {pieceUrl ? <img src={pieceUrl} alt={`Puzzle piece ${index + 1}`} className="w-full aspect-square object-cover rounded mt-2" /> : null}
            </div>
          </div>
        ))}
      </div>
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── DISCOUNT EDITOR ──
function DiscountEditor() {
  const [data, setData] = useState({ code: 'POLISHED100', amount: '100' });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'discount').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('discount', data)) alert('Discount saved!');
  };

  return (
    <AdminSection title="Discount / Puzzle Reward">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Discount Code">
          <AdminInput value={data.code} onChange={(v) => setData({ ...data, code: v })} />
        </AdminField>
        <AdminField label="Amount (BDT)">
          <AdminInput value={data.amount} onChange={(v) => setData({ ...data, amount: v })} />
        </AdminField>
      </div>
      <SaveButton onClick={save} />
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
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('footer', data)) alert('Footer saved!');
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── META / SEO EDITOR ──
function MetaEditor() {
  const [data, setData] = useState<MetaContent>({ title: 'POLISHED — Graphics Design Agency', desc: 'We craft refined, trust-driven visual identities for skincare brands.', gaId: '' });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'meta').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('meta', data)) alert('Meta/SEO saved!');
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── COLORS EDITOR ──
function ColorsEditor() {
  const [data, setData] = useState<ColorsContent>({ blue: '#1e3a8a', orange: '#fb923c', bg: '#f9fafb', text: '#0f172a' });

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'colors').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData((prev) => ({ ...prev, ...row.value }));
    });
  }, []);

  const save = async () => {
    if (await upsertSetting('colors', data)) alert('Colors saved! Refresh the main site to see changes.');
  };

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
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

// ── PUZZLE TEXT EDITOR ──
function PuzzleTextEditor() {
  const [data, setData] = useState<Partial<PuzzleContent>>({});

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'puzzle').maybeSingle().then(({ data: row }) => {
      if (row?.value) setData(row.value);
    });
  }, []);

  const save = async () => {
    // Merge with existing puzzle data (images) rather than overwriting
    const { data: existing } = await supabase.from('site_settings').select('value').eq('key', 'puzzle').maybeSingle();
    const merged = { ...(existing?.value ?? {}), ...data };
    if (await upsertSetting('puzzle', merged)) alert('Puzzle text saved!');
  };

  return (
    <AdminSection title="Puzzle Game Text">
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Title (EN)">
          <AdminInput value={data.titleEn ?? ''} onChange={(v) => setData({ ...data, titleEn: v })} />
        </AdminField>
        <AdminField label="Title (বাংলা)">
          <AdminInput value={data.titleBn ?? ''} onChange={(v) => setData({ ...data, titleBn: v })} />
        </AdminField>
        <AdminField label="Intro Prefix (EN)">
          <AdminInput value={data.introPrefixEn ?? ''} onChange={(v) => setData({ ...data, introPrefixEn: v })} />
        </AdminField>
        <AdminField label="Intro Prefix (বাংলা)">
          <AdminInput value={data.introPrefixBn ?? ''} onChange={(v) => setData({ ...data, introPrefixBn: v })} />
        </AdminField>
        <AdminField label="Intro Suffix (EN)">
          <AdminInput value={data.introSuffixEn ?? ''} onChange={(v) => setData({ ...data, introSuffixEn: v })} />
        </AdminField>
        <AdminField label="Intro Suffix (বাংলা)">
          <AdminInput value={data.introSuffixBn ?? ''} onChange={(v) => setData({ ...data, introSuffixBn: v })} />
        </AdminField>
        <AdminField label="Pieces Label (EN)">
          <AdminInput value={data.piecesLabelEn ?? ''} onChange={(v) => setData({ ...data, piecesLabelEn: v })} />
        </AdminField>
        <AdminField label="Pieces Label (বাংলা)">
          <AdminInput value={data.piecesLabelBn ?? ''} onChange={(v) => setData({ ...data, piecesLabelBn: v })} />
        </AdminField>
        <AdminField label="Board Label (EN)">
          <AdminInput value={data.boardLabelEn ?? ''} onChange={(v) => setData({ ...data, boardLabelEn: v })} />
        </AdminField>
        <AdminField label="Board Label (বাংলা)">
          <AdminInput value={data.boardLabelBn ?? ''} onChange={(v) => setData({ ...data, boardLabelBn: v })} />
        </AdminField>
        <AdminField label="How To Play (EN)">
          <AdminInput value={data.howToPlayLabelEn ?? ''} onChange={(v) => setData({ ...data, howToPlayLabelEn: v })} />
        </AdminField>
        <AdminField label="How To Play (বাংলা)">
          <AdminInput value={data.howToPlayLabelBn ?? ''} onChange={(v) => setData({ ...data, howToPlayLabelBn: v })} />
        </AdminField>
      </div>
      <AdminField label="Instructions (EN)">
        <AdminTextarea value={data.instructionsEn ?? ''} onChange={(v) => setData({ ...data, instructionsEn: v })} rows={2} />
      </AdminField>
      <AdminField label="Instructions (বাংলা)">
        <AdminTextarea value={data.instructionsBn ?? ''} onChange={(v) => setData({ ...data, instructionsBn: v })} rows={2} />
      </AdminField>
      <div className="grid grid-cols-2 gap-4">
        <AdminField label="Attempts Label (EN)">
          <AdminInput value={data.attemptsLabelEn ?? ''} onChange={(v) => setData({ ...data, attemptsLabelEn: v })} />
        </AdminField>
        <AdminField label="Attempts Label (বাংলা)">
          <AdminInput value={data.attemptsLabelBn ?? ''} onChange={(v) => setData({ ...data, attemptsLabelBn: v })} />
        </AdminField>
        <AdminField label="Shuffle Label (EN)">
          <AdminInput value={data.shuffleLabelEn ?? ''} onChange={(v) => setData({ ...data, shuffleLabelEn: v })} />
        </AdminField>
        <AdminField label="Shuffle Label (বাংলা)">
          <AdminInput value={data.shuffleLabelBn ?? ''} onChange={(v) => setData({ ...data, shuffleLabelBn: v })} />
        </AdminField>
        <AdminField label="Solved Title (EN)">
          <AdminInput value={data.solvedTitleEn ?? ''} onChange={(v) => setData({ ...data, solvedTitleEn: v })} />
        </AdminField>
        <AdminField label="Solved Title (বাংলা)">
          <AdminInput value={data.solvedTitleBn ?? ''} onChange={(v) => setData({ ...data, solvedTitleBn: v })} />
        </AdminField>
        <AdminField label="Solved Description (EN)">
          <AdminInput value={data.solvedDescEn ?? ''} onChange={(v) => setData({ ...data, solvedDescEn: v })} />
        </AdminField>
        <AdminField label="Solved Description (বাংলা)">
          <AdminInput value={data.solvedDescBn ?? ''} onChange={(v) => setData({ ...data, solvedDescBn: v })} />
        </AdminField>
        <AdminField label="Copied Text (EN)">
          <AdminInput value={data.copiedEn ?? ''} onChange={(v) => setData({ ...data, copiedEn: v })} />
        </AdminField>
        <AdminField label="Copied Text (বাংলা)">
          <AdminInput value={data.copiedBn ?? ''} onChange={(v) => setData({ ...data, copiedBn: v })} />
        </AdminField>
      </div>
      <SaveButton onClick={save} />
    </AdminSection>
  );
}

