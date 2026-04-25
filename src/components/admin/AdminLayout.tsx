import { ReactNode, useState } from 'react';
import { Inbox, FileText, LogOut, Menu, X } from 'lucide-react';

export type AdminModuleId = 'inquiries' | 'content';

export const ADMIN_MODULES: {
  id: AdminModuleId;
  label: string;
  description: string;
  icon: typeof Inbox;
  legacy?: boolean;
}[] = [
  {
    id: 'inquiries',
    label: 'Inquiries',
    description: 'Lead inbox',
    icon: Inbox,
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Site copy & assets',
    icon: FileText,
    legacy: true,
  },
];

interface Props {
  active: AdminModuleId;
  onSelect: (id: AdminModuleId) => void;
  onLogout: () => void;
  userEmail?: string | null;
  children: ReactNode;
}

export default function AdminLayout({ active, onSelect, onLogout, userEmail, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = (
    <aside className="w-[240px] shrink-0 bg-[hsl(224,70%,14%)] border-r border-primary-foreground/10 flex flex-col">
      <div className="px-6 pt-8 pb-10">
        <h1 className="font-heading text-xl text-primary-foreground font-light tracking-[4px]">
          POLISHED<span className="text-accent">.</span>
        </h1>
        <p className="text-[9px] tracking-[3px] uppercase text-primary-foreground/35 mt-2">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 px-3">
        {ADMIN_MODULES.map((m) => {
          const Icon = m.icon;
          const isActive = m.id === active;
          return (
            <button
              key={m.id}
              onClick={() => {
                onSelect(m.id);
                setMobileOpen(false);
              }}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-sm text-left transition-all duration-200 ${
                isActive
                  ? 'bg-primary-foreground/[0.06] text-primary-foreground'
                  : 'text-primary-foreground/55 hover:text-primary-foreground hover:bg-primary-foreground/[0.03]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-accent rounded-r-sm" />
              )}
              <Icon className="!size-4 shrink-0" />
              <span className="text-[12px] tracking-[2px] uppercase font-medium">
                {m.label}
              </span>
              {m.legacy && (
                <span className="ml-auto text-[8px] tracking-[1.5px] uppercase text-primary-foreground/30 border border-primary-foreground/15 rounded-sm px-1.5 py-0.5">
                  legacy
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-primary-foreground/10">
        {userEmail && (
          <p className="px-3 pb-2 text-[10px] tracking-[1px] text-primary-foreground/35 truncate">
            {userEmail}
          </p>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-primary-foreground/55 hover:text-accent hover:bg-primary-foreground/[0.03] transition-colors"
        >
          <LogOut className="!size-4" />
          <span className="text-[11px] tracking-[2px] uppercase">Sign out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-polished-dark-blue text-primary-foreground flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{Sidebar}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between border-b border-primary-foreground/10 px-4 py-3 bg-[hsl(224,70%,14%)]">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-primary-foreground/70 hover:text-accent p-2"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="font-heading text-lg tracking-[3px]">
            POLISHED<span className="text-accent">.</span>
          </span>
          <span className="w-9" />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
