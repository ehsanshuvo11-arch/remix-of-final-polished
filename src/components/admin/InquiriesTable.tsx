import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Inquiry } from '@/types/database';

const BUDGET_LABEL: Record<string, string> = {
  'below-20k': 'Below 20k BDT',
  '20k-50k': '20k – 50k BDT',
  '50k-plus': '50k+ BDT',
  'not-sure': 'Not sure',
};

type StatusFilter = 'all' | 'new' | 'contacted' | 'archived';

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'archived', label: 'Archived' },
];

function formatDate(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-accent/15 text-accent border-accent/30',
    contacted: 'bg-primary-foreground/10 text-primary-foreground/70 border-primary-foreground/15',
    archived: 'bg-primary-foreground/[0.04] text-primary-foreground/40 border-primary-foreground/10',
  };
  const cls = styles[status] ?? styles.contacted;
  return (
    <span className={`inline-flex items-center text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-sm border ${cls}`}>
      {status}
    </span>
  );
}

export default function InquiriesTable() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingTable, setMissingTable] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      if ((error as { code?: string }).code === '42P01') {
        setMissingTable(true);
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }
    setItems((data ?? []) as Inquiry[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const setStatus = async (id: string, status: Inquiry['status']) => {
    const prev = items;
    setItems((p) => p.map((it) => (it.id === id ? { ...it, status } : it)));
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) {
      setItems(prev);
      alert('Update failed: ' + error.message);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    const prev = items;
    setItems((p) => p.filter((it) => it.id !== id));
    if (openId === id) setOpenId(null);
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) {
      setItems(prev);
      alert('Delete failed: ' + error.message);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (filter !== 'all' && it.status !== filter) return false;
      if (!q) return true;
      return (
        it.client_name?.toLowerCase().includes(q) ||
        it.brand_name?.toLowerCase().includes(q) ||
        it.email?.toLowerCase().includes(q) ||
        it.project_details?.toLowerCase().includes(q)
      );
    });
  }, [items, filter, search]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      new: items.filter((i) => i.status === 'new').length,
      contacted: items.filter((i) => i.status === 'contacted').length,
      archived: items.filter((i) => i.status === 'archived').length,
    };
  }, [items]);

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40 mb-2">
            Module
          </p>
          <h2 className="font-heading text-3xl text-primary-foreground font-light tracking-[2px]">
            Inquiries
          </h2>
          <p className="text-[12px] text-primary-foreground/40 mt-2">
            Contact form submissions captured from the public site.
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="text-[10px] tracking-[3px] uppercase text-primary-foreground/50 hover:text-accent transition-colors border border-primary-foreground/15 hover:border-accent/50 px-4 py-2 rounded-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = filter === tab.id;
            const count = counts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`text-[10px] tracking-[3px] uppercase px-3.5 py-2 rounded-sm border transition-all duration-200 ${
                  active
                    ? 'bg-accent text-primary border-accent'
                    : 'text-primary-foreground/55 border-primary-foreground/12 hover:text-primary-foreground hover:border-primary-foreground/25'
                }`}
              >
                {tab.label}
                <span className={`ml-2 ${active ? 'text-primary/70' : 'text-primary-foreground/35'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, brand, email…"
          className="bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground/90 text-sm px-4 py-2 rounded-sm outline-none placeholder:text-primary-foreground/25 focus:border-accent/60 transition-colors min-w-[260px]"
        />
      </div>

      {/* States */}
      {missingTable && (
        <div className="rounded-sm border border-accent/30 bg-accent/5 p-6 text-sm text-primary-foreground/70">
          The <code className="text-accent">inquiries</code> table doesn't exist yet. Submit the contact form once or create the table to see entries here.
        </div>
      )}

      {error && !missingTable && (
        <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-6 text-sm text-primary-foreground/80">
          {error}
        </div>
      )}

      {!missingTable && !error && (
        <div className="border border-primary-foreground/10 rounded-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1.4fr_1.4fr_1.6fr_0.9fr_0.9fr_0.6fr] gap-4 px-5 py-3 text-[9px] tracking-[2px] uppercase text-primary-foreground/40 bg-primary-foreground/[0.03] border-b border-primary-foreground/10">
            <div>Client</div>
            <div>Brand</div>
            <div>Email</div>
            <div>Budget</div>
            <div>Received</div>
            <div className="text-right">Status</div>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-[11px] tracking-[3px] uppercase text-primary-foreground/30">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-[11px] tracking-[3px] uppercase text-primary-foreground/35">
                No inquiries {filter !== 'all' ? `in “${filter}”` : 'yet'}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((it) => {
                const open = openId === it.id;
                return (
                  <div key={it.id} className="border-b border-primary-foreground/[0.06] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : it.id)}
                      className="w-full grid grid-cols-[1.4fr_1.4fr_1.6fr_0.9fr_0.9fr_0.6fr] gap-4 px-5 py-4 text-left items-center hover:bg-primary-foreground/[0.03] transition-colors"
                    >
                      <div className="text-sm text-primary-foreground truncate">{it.client_name}</div>
                      <div className="text-sm text-primary-foreground/80 truncate">{it.brand_name}</div>
                      <div className="text-[12px] text-primary-foreground/60 truncate">{it.email}</div>
                      <div className="text-[11px] text-primary-foreground/55">
                        {BUDGET_LABEL[it.budget_range] ?? it.budget_range}
                      </div>
                      <div className="text-[11px] text-primary-foreground/45">{formatDate(it.created_at)}</div>
                      <div className="flex justify-end">
                        <StatusPill status={it.status} />
                      </div>
                    </button>

                    {open && (
                      <div className="px-5 pb-6 pt-1 bg-primary-foreground/[0.02]">
                        <div className="grid md:grid-cols-2 gap-6 mb-5">
                          <div>
                            <p className="text-[9px] tracking-[2px] uppercase text-primary-foreground/35 mb-1.5">Store URL</p>
                            <p className="text-sm text-primary-foreground/80 break-all">
                              {it.store_url ? (
                                <a
                                  href={it.store_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-accent hover:underline"
                                >
                                  {it.store_url}
                                </a>
                              ) : (
                                <span className="text-primary-foreground/30">—</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] tracking-[2px] uppercase text-primary-foreground/35 mb-1.5">Email</p>
                            <a
                              href={`mailto:${it.email}`}
                              className="text-sm text-accent hover:underline break-all"
                            >
                              {it.email}
                            </a>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-[9px] tracking-[2px] uppercase text-primary-foreground/35 mb-1.5">
                            Project Details
                          </p>
                          <p className="text-sm text-primary-foreground/85 leading-relaxed whitespace-pre-wrap">
                            {it.project_details}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(['new', 'contacted', 'archived'] as const).map((s) => {
                            const active = it.status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => setStatus(it.id, s)}
                                className={`text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-sm border transition-colors ${
                                  active
                                    ? 'bg-accent text-primary border-accent'
                                    : 'text-primary-foreground/60 border-primary-foreground/15 hover:border-accent/50 hover:text-accent'
                                }`}
                              >
                                Mark {s}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => removeItem(it.id)}
                            className="ml-auto text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-sm border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
