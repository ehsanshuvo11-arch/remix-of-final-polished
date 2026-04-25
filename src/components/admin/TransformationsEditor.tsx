import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useSaveRegistration } from '@/components/admin/SaveAllContext';
import type { Transformation, TransformationsMetaContent } from '@/types/database';
import { BeforeAfterSlider } from '@/components/landing/Transformations';

// Local helpers (mirror Admin.tsx patterns) ------------------------------------
async function ensureSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) { alert(`Auth error: ${error.message}`); return null; }
  let session = data.session;
  if (session?.expires_at && session.expires_at * 1000 <= Date.now() + 60_000) {
    const { data: r, error: rerr } = await supabase.auth.refreshSession();
    if (rerr) { alert(`Session refresh failed: ${rerr.message}`); return null; }
    session = r.session;
  }
  if (!session) { alert('Your admin session expired. Please sign in again.'); return null; }
  return session;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-3">
    <label className="block text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-4 py-3 text-sm outline-none rounded-sm focus:border-accent transition-colors"
  />
);

// Section component ----------------------------------------------------------
export default function TransformationsEditor() {
  const qc = useQueryClient();
  const [items, setItems] = useState<Transformation[]>([]);
  const [meta, setMeta] = useState<TransformationsMetaContent>({});
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const beforeRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const afterRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    (async () => {
      const [{ data: rows, error }, { data: metaRow }] = await Promise.all([
        supabase.from('transformations').select('*').order('sort_order', { ascending: true, nullsFirst: false }),
        supabase.from('site_settings').select('value').eq('key', 'transformations-meta').maybeSingle(),
      ]);
      if (error && (error as { code?: string }).code === '42P01') {
        setMissingTable(true);
      } else if (rows) {
        setItems(rows as Transformation[]);
        itemsBaseline.current = JSON.stringify(rows);
      }
      if (metaRow?.value) {
        setMeta(metaRow.value as TransformationsMetaContent);
        metaBaseline.current = JSON.stringify(metaRow.value);
      } else {
        metaBaseline.current = JSON.stringify({});
      }
      setLoading(false);
    })();
  }, []);

  const itemsBaseline = useRef<string | null>(null);
  const metaBaseline = useRef<string | null>(null);
  const itemsDirty = itemsBaseline.current !== null && JSON.stringify(items) !== itemsBaseline.current;
  const metaDirty = metaBaseline.current !== null && JSON.stringify(meta) !== metaBaseline.current;

  useSaveRegistration({
    key: 'transformations-meta',
    label: 'Transformations Labels',
    isDirty: metaDirty,
    save: async () => {
      const session = await ensureSession();
      if (!session) return false;
      const { error } = await supabase.from('site_settings').upsert({ key: 'transformations-meta', value: meta }, { onConflict: 'key' });
      if (error) { alert('Meta save failed: ' + error.message); return false; }
      qc.invalidateQueries({ queryKey: ['site-setting', 'transformations-meta'] });
      metaBaseline.current = JSON.stringify(meta);
      return true;
    },
  });

  useSaveRegistration({
    key: 'transformations-items',
    label: 'Transformations',
    isDirty: itemsDirty,
    save: async () => {
      const session = await ensureSession();
      if (!session) return false;
      for (const it of items) {
        const { error } = await supabase
          .from('transformations')
          .update({
            project_name: it.project_name,
            before_image_url: it.before_image_url,
            after_image_url: it.after_image_url,
            is_active: it.is_active,
            sort_order: it.sort_order,
          })
          .eq('id', it.id);
        if (error) { alert('Save failed: ' + error.message); return false; }
      }
      itemsBaseline.current = JSON.stringify(items);
      qc.invalidateQueries({ queryKey: ['transformations'] });
      return true;
    },
  });


  const refresh = () => qc.invalidateQueries({ queryKey: ['transformations'] });

  const addItem = async () => {
    const session = await ensureSession();
    if (!session) return;
    const payload = {
      project_name: 'New Transformation',
      before_image_url: '',
      after_image_url: '',
      is_active: false,
      sort_order: items.length + 1,
    };
    const { data, error } = await supabase.from('transformations').insert(payload).select().single();
    if (error) { alert('Add failed: ' + error.message); return; }
    setItems((p) => [...p, data as Transformation]);
  };

  const updateField = (idx: number, field: keyof Transformation, value: string | boolean | number) => {
    setItems((p) => p.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const persistRow = async (idx: number) => {
    const session = await ensureSession();
    if (!session) return;
    const it = items[idx];
    const { error } = await supabase
      .from('transformations')
      .update({
        project_name: it.project_name,
        before_image_url: it.before_image_url,
        after_image_url: it.after_image_url,
        is_active: it.is_active,
        sort_order: it.sort_order ?? idx + 1,
      })
      .eq('id', it.id);
    if (error) { alert('Save failed: ' + error.message); return; }
    refresh();
  };

  const togglePublish = async (idx: number) => {
    const next = !items[idx].is_active;
    updateField(idx, 'is_active', next);
    const session = await ensureSession();
    if (!session) return;
    const { error } = await supabase.from('transformations').update({ is_active: next }).eq('id', items[idx].id);
    if (error) { alert('Toggle failed: ' + error.message); updateField(idx, 'is_active', !next); return; }
    refresh();
  };

  const removeItem = async (idx: number) => {
    const it = items[idx];
    if (!confirm(`Delete "${it.project_name}"?`)) return;
    const session = await ensureSession();
    if (!session) return;
    const { error } = await supabase.from('transformations').delete().eq('id', it.id);
    if (error) { alert('Delete failed: ' + error.message); return; }
    setItems((p) => p.filter((_, i) => i !== idx));
    refresh();
  };

  const uploadImage = async (idx: number, file: File, kind: 'before' | 'after') => {
    const session = await ensureSession();
    if (!session) return;
    const ext = file.name.split('.').pop();
    const path = `transformations/${items[idx].id}_${kind}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('polished-assets').upload(path, file, { upsert: true });
    if (error) { alert('Upload error: ' + error.message); return; }
    const { data } = supabase.storage.from('polished-assets').getPublicUrl(path);
    const field = kind === 'before' ? 'before_image_url' : 'after_image_url';
    updateField(idx, field, data.publicUrl);
    // auto-persist this single field
    const { error: uerr } = await supabase.from('transformations').update({ [field]: data.publicUrl }).eq('id', items[idx].id);
    if (uerr) alert('Save failed: ' + uerr.message);
    refresh();
  };

  const saveMeta = async () => {
    const session = await ensureSession();
    if (!session) return;
    const { error } = await supabase.from('site_settings').upsert({ key: 'transformations-meta', value: meta }, { onConflict: 'key' });
    if (error) { alert('Meta save failed: ' + error.message); return; }
    qc.invalidateQueries({ queryKey: ['site-setting', 'transformations-meta'] });
    alert('Section labels saved.');
  };

  return (
    <div className="mb-10 bg-primary-foreground/[0.03] border border-primary-foreground/[0.07] rounded p-7">
      <h3 className="font-heading text-xl text-primary-foreground font-normal mb-5 tracking-wider">
        Transformations (Before / After)
      </h3>

      {missingTable && (
        <div className="mb-5 p-4 border border-accent/40 bg-accent/10 rounded text-primary-foreground/80 text-sm leading-relaxed">
          The <code className="text-accent">transformations</code> table doesn't exist yet. Run the SQL provided in the chat to create it, then reload this page.
        </div>
      )}

      {/* Section labels */}
      <div className="mb-6 p-4 border border-primary-foreground/[0.07] rounded">
        <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-3">Section labels</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Eyebrow (EN)"><Input value={meta.labelEn ?? ''} onChange={(v) => setMeta((m) => ({ ...m, labelEn: v }))} placeholder="Transformations" /></Field>
          <Field label="Eyebrow (BN)"><Input value={meta.labelBn ?? ''} onChange={(v) => setMeta((m) => ({ ...m, labelBn: v }))} placeholder="রূপান্তর" /></Field>
          <Field label="Title line 1 (EN)"><Input value={meta.titleLine1En ?? ''} onChange={(v) => setMeta((m) => ({ ...m, titleLine1En: v }))} placeholder="Before" /></Field>
          <Field label="Title line 2 (EN, italic)"><Input value={meta.titleLine2En ?? ''} onChange={(v) => setMeta((m) => ({ ...m, titleLine2En: v }))} placeholder="& after." /></Field>
          <Field label="Before label (EN)"><Input value={meta.beforeLabelEn ?? ''} onChange={(v) => setMeta((m) => ({ ...m, beforeLabelEn: v }))} placeholder="Before" /></Field>
          <Field label="After label (EN)"><Input value={meta.afterLabelEn ?? ''} onChange={(v) => setMeta((m) => ({ ...m, afterLabelEn: v }))} placeholder="After" /></Field>
        </div>
        
      </div>

      {/* Items */}
      {loading ? (
        <p className="text-primary-foreground/40 text-sm">Loading…</p>
      ) : (
        items.map((it, i) => (
          <div key={it.id} className="border border-primary-foreground/[0.07] rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-3 gap-3">
              <span className="text-[11px] tracking-[2px] text-primary-foreground/40 uppercase">Item {i + 1}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePublish(i)}
                  className={`px-3 py-1.5 text-[10px] tracking-[2px] uppercase rounded-sm transition ${
                    it.is_active ? 'bg-accent text-accent-foreground' : 'border border-primary-foreground/20 text-primary-foreground/60 hover:border-accent'
                  }`}
                >
                  {it.is_active ? 'Live' : 'Draft'}
                </button>
                <button onClick={() => setPreviewIdx(previewIdx === i ? null : i)} className="text-primary-foreground/60 text-xs hover:text-accent transition-colors">
                  {previewIdx === i ? 'Hide preview' : 'Preview'}
                </button>
                <button onClick={() => removeItem(i)} className="text-destructive/70 text-xs hover:text-destructive transition-colors">Delete</button>
              </div>
            </div>

            <Field label="Project name">
              <Input value={it.project_name ?? ''} onChange={(v) => updateField(i, 'project_name', v)} />
            </Field>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">Before image</p>
                {it.before_image_url ? (
                  <img src={it.before_image_url} alt="Before" className="w-full aspect-[16/10] object-cover rounded-sm mb-2 border border-primary-foreground/10" />
                ) : (
                  <div className="w-full aspect-[16/10] border border-dashed border-primary-foreground/15 rounded-sm mb-2 flex items-center justify-center text-primary-foreground/30 text-xs">No image</div>
                )}
                <input ref={(el) => (beforeRefs.current[i] = el)} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(i, e.target.files[0], 'before')} />
                <button onClick={() => beforeRefs.current[i]?.click()} className="w-full px-4 py-2 border border-primary-foreground/20 text-primary-foreground/70 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition">Upload before</button>
              </div>
              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">After image</p>
                {it.after_image_url ? (
                  <img src={it.after_image_url} alt="After" className="w-full aspect-[16/10] object-cover rounded-sm mb-2 border border-primary-foreground/10" />
                ) : (
                  <div className="w-full aspect-[16/10] border border-dashed border-primary-foreground/15 rounded-sm mb-2 flex items-center justify-center text-primary-foreground/30 text-xs">No image</div>
                )}
                <input ref={(el) => (afterRefs.current[i] = el)} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(i, e.target.files[0], 'after')} />
                <button onClick={() => afterRefs.current[i]?.click()} className="w-full px-4 py-2 border border-primary-foreground/20 text-primary-foreground/70 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition">Upload after</button>
              </div>
            </div>

            {previewIdx === i && it.before_image_url && it.after_image_url && (
              <div className="mt-4 p-4 bg-primary-foreground/[0.04] rounded">
                <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40 mb-3">Live preview (drag the handle)</p>
                <div className="bg-background p-4 rounded">
                  <BeforeAfterSlider
                    before={it.before_image_url}
                    after={it.after_image_url}
                    beforeLabel={meta.beforeLabelEn || 'Before'}
                    afterLabel={meta.afterLabelEn || 'After'}
                  />
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {!missingTable && (
        <button onClick={addItem} className="mt-2 px-6 py-3 border border-primary-foreground/20 text-primary-foreground/60 text-xs tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition-colors">
          + Add transformation
        </button>
      )}
    </div>
  );
}
