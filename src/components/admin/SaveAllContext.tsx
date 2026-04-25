import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type Saver = () => Promise<boolean> | boolean;

type Registration = {
  key: string;
  label: string;
  isDirty: boolean;
  save: Saver;
};

type Ctx = {
  register: (reg: Registration) => void;
  unregister: (key: string) => void;
  dirtyKeys: string[];
  saving: boolean;
  saveAll: () => Promise<void>;
};

const SaveAllCtx = createContext<Ctx | null>(null);

export function SaveAllProvider({ children }: { children: React.ReactNode }) {
  const registry = useRef<Map<string, Registration>>(new Map());
  const [dirtyKeys, setDirtyKeys] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const recomputeDirty = useCallback(() => {
    const next: string[] = [];
    registry.current.forEach((reg) => {
      if (reg.isDirty) next.push(reg.key);
    });
    setDirtyKeys((prev) =>
      prev.length === next.length && prev.every((k, i) => k === next[i]) ? prev : next,
    );
  }, []);

  const register = useCallback((reg: Registration) => {
    registry.current.set(reg.key, reg);
    recomputeDirty();
  }, [recomputeDirty]);

  const unregister = useCallback((key: string) => {
    registry.current.delete(key);
    recomputeDirty();
  }, [recomputeDirty]);

  const saveAll = useCallback(async () => {
    if (saving) return;
    const dirty = Array.from(registry.current.values()).filter((r) => r.isDirty);
    if (dirty.length === 0) {
      toast('Everything is already up to date.');
      return;
    }
    setSaving(true);
    const t = toast.loading(`Saving ${dirty.length} section${dirty.length === 1 ? '' : 's'}…`);
    let succeeded = 0;
    const failed: string[] = [];
    for (const reg of dirty) {
      try {
        const ok = await reg.save();
        if (ok !== false) succeeded += 1;
        else failed.push(reg.label);
      } catch (err) {
        failed.push(reg.label);
        console.error(`[SaveAll] ${reg.key} failed:`, err);
      }
    }
    setSaving(false);
    toast.dismiss(t);
    if (failed.length === 0) {
      toast.success(`Saved ${succeeded} section${succeeded === 1 ? '' : 's'}.`, {
        description: 'All changes are now live.',
      });
    } else {
      toast.error(`${failed.length} section${failed.length === 1 ? '' : 's'} failed to save`, {
        description: failed.join(', '),
      });
    }
    recomputeDirty();
  }, [saving, recomputeDirty]);

  const value = useMemo<Ctx>(() => ({
    register, unregister, dirtyKeys, saving, saveAll,
  }), [register, unregister, dirtyKeys, saving, saveAll]);

  return <SaveAllCtx.Provider value={value}>{children}</SaveAllCtx.Provider>;
}

function useSaveAllCtx() {
  const ctx = useContext(SaveAllCtx);
  if (!ctx) throw new Error('useSaveAll must be used within SaveAllProvider');
  return ctx;
}

/**
 * Register a section with the global Save All bar.
 * Pass a stable `key`, the human-readable `label`, the current `isDirty`
 * flag, and an async `save` handler that performs the actual upsert.
 */
export function useSaveRegistration(opts: {
  key: string;
  label: string;
  isDirty: boolean;
  save: Saver;
}) {
  const { register, unregister } = useSaveAllCtx();
  const saveRef = useRef(opts.save);
  saveRef.current = opts.save;

  useEffect(() => {
    register({
      key: opts.key,
      label: opts.label,
      isDirty: opts.isDirty,
      save: () => saveRef.current(),
    });
  }, [opts.key, opts.label, opts.isDirty, register]);

  useEffect(() => () => unregister(opts.key), [opts.key, unregister]);
}

export function SaveAllBar() {
  const { dirtyKeys, saving, saveAll } = useSaveAllCtx();
  const count = dirtyKeys.length;
  const hasDirty = count > 0;

  return (
    <div
      className="fixed bottom-24 right-6 z-50 pointer-events-none"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={saveAll}
        disabled={saving}
        className={[
          'pointer-events-auto group relative inline-flex items-center gap-3 px-7 py-4 rounded-full',
          'bg-accent text-accent-foreground text-[11px] tracking-[3px] uppercase font-medium',
          'border border-accent/70 shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
          'transition-all duration-300 ease-in-out',
          hasDirty
            ? 'hover:shadow-[0_0_28px_rgba(251,146,60,0.55)] hover:-translate-y-0.5'
            : 'opacity-60 hover:opacity-80',
          saving ? 'cursor-wait' : 'cursor-pointer',
        ].join(' ')}
      >
        {hasDirty && !saving && (
          <span className="absolute -inset-px rounded-full ring-1 ring-accent/40 animate-pulse pointer-events-none" />
        )}
        {saving ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          <span
            className={[
              'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[10px] tracking-normal',
              hasDirty ? 'bg-accent-foreground/15 text-accent-foreground' : 'bg-accent-foreground/10 text-accent-foreground/70',
            ].join(' ')}
          >
            {count}
          </span>
        )}
        <span>{saving ? 'Saving…' : hasDirty ? 'Save All Changes' : 'All Saved'}</span>
      </button>
    </div>
  );
}
