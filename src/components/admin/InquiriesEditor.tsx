import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Inquiry } from '@/types/database';

const BUDGET_LABEL: Record<string, string> = {
  'below-20k': 'Below 20k BDT',
  '20k-50k': '20k – 50k BDT',
  '50k-plus': '50k+ BDT',
  'not-sure': 'Not sure',
};

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

export default function InquiriesEditor() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      if ((error as { code?: string }).code === '42P01') setMissingTable(true);
      setLoading(false);
      return;
    }
    setItems((data ?? []) as Inquiry[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const setStatus = async (id: string, status: Inquiry['status']) => {
    const session = await ensureSession();
    if (!session) return;
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) { alert('Update failed: ' + error.message); return; }
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  };

  const removeItem = async (id: string) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    const session = await ensureSession();
    if (!session) return;
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) { alert('Delete failed: ' + error.message); return; }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const filtered = items.filter((it) => filter === 'all' ? true : it.status === filter);
  const newCount = items.filter((it) => it.status === 'new').length;

  return (
    <div className="mb-10 bg-primary-foreground/[0.03] border border-primary-foreground/[0.07] rounded p-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-heading text-xl text-primary-foreground font-normal tracking-wider flex items-center gap-3">
          Inquiries Inbox
          {newCount > 0 && (
            <span className="text-[10px] tracking-[2px] uppercase px-2 py-1 bg-accent text-accent-foreground rounded-sm">
              {newCount} new
            </span>
          )}
        </h3>
        <button onClick={fetchAll} className="text-[11px] tracking-[2px] uppercase text-primary-foreground/50 hover:text-accent transition-colors">
          Refresh
        </button>
      </div>

      {missingTable && (
        <div className="mb-5 p-4 border border-accent/40 bg-accent/10 rounded text-primary-foreground/80 text-sm leading-relaxed">
          The <code className="text-accent">inquiries</code> table doesn't exist yet. Run the SQL provided in the chat, then refresh.
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {(['all', 'new', 'contacted'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] tracking-[2px] uppercase rounded-sm transition ${
              filter === f
                ? 'bg-accent text-accent-foreground'
                : 'border border-primary-foreground/15 text-primary-foreground/60 hover:border-accent hover:text-accent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-primary-foreground/40 text-sm">Loading inbox…</p>
      ) : filtered.length === 0 ? (
        <p className="text-primary-foreground/40 text-sm italic">No inquiries to show.</p>
      ) : (
        <div className="border border-primary-foreground/[0.07] rounded overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_auto] gap-3 px-4 py-3 bg-primary-foreground/[0.04] text-[10px] tracking-[2px] uppercase text-primary-foreground/40">
            <span>Brand</span>
            <span>Client</span>
            <span>Email</span>
            <span>Budget</span>
            <span>Status</span>
            <span></span>
          </div>

          {filtered.map((it) => {
            const isOpen = openId === it.id;
            const isNew = it.status === 'new';
            return (
              <div
                key={it.id}
                className={`border-t border-primary-foreground/[0.07] ${isNew ? 'bg-accent/[0.06]' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : it.id)}
                  className="w-full text-left grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_auto] gap-3 px-4 py-4 items-center hover:bg-primary-foreground/[0.04] transition"
                >
                  <span className="text-primary-foreground text-sm font-medium flex items-center gap-2">
                    {isNew && <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />}
                    {it.brand_name || '—'}
                  </span>
                  <span className="text-primary-foreground/70 text-sm">{it.client_name || '—'}</span>
                  <span className="text-primary-foreground/60 text-xs truncate">{it.email}</span>
                  <span className="text-primary-foreground/60 text-xs">{BUDGET_LABEL[it.budget_range] ?? it.budget_range}</span>
                  <span className={`text-[10px] tracking-[2px] uppercase ${isNew ? 'text-accent' : 'text-primary-foreground/50'}`}>
                    {it.status}
                  </span>
                  <span className="text-primary-foreground/40 text-xs">{isOpen ? '−' : '+'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 grid md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                          <p className="text-[10px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">Project details</p>
                          <p className="text-primary-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                            {it.project_details || <em className="text-primary-foreground/30">No details provided</em>}
                          </p>
                          {it.store_url && (
                            <p className="text-[12px] mt-3">
                              <span className="text-primary-foreground/40 mr-2">Store / IG:</span>
                              <a href={it.store_url.startsWith('http') ? it.store_url : `https://${it.store_url}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                                {it.store_url}
                              </a>
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="text-[10px] tracking-[2px] uppercase text-primary-foreground/40">Received</p>
                          <p className="text-primary-foreground/70 text-sm">
                            {it.created_at ? new Date(it.created_at).toLocaleString() : '—'}
                          </p>
                          <div className="flex flex-col gap-2 mt-2">
                            <a
                              href={`mailto:${it.email}?subject=Re: Inquiry from ${it.brand_name}`}
                              className="text-center px-4 py-2.5 bg-accent text-accent-foreground text-[10px] tracking-[2px] uppercase rounded-sm hover:opacity-90 transition"
                            >
                              Reply by email
                            </a>
                            {it.status !== 'contacted' ? (
                              <button
                                onClick={() => setStatus(it.id, 'contacted')}
                                className="px-4 py-2.5 border border-primary-foreground/20 text-primary-foreground/70 text-[10px] tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition"
                              >
                                Mark as contacted
                              </button>
                            ) : (
                              <button
                                onClick={() => setStatus(it.id, 'new')}
                                className="px-4 py-2.5 border border-primary-foreground/20 text-primary-foreground/70 text-[10px] tracking-[2px] uppercase rounded-sm hover:border-accent hover:text-accent transition"
                              >
                                Mark as new
                              </button>
                            )}
                            <button
                              onClick={() => removeItem(it.id)}
                              className="px-4 py-2.5 text-destructive/70 text-[10px] tracking-[2px] uppercase hover:text-destructive transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
