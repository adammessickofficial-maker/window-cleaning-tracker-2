'use client';

import { Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CommandMenu } from '@/components/shared/command-menu';

export function Topbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500" onClick={() => setOpen(true)}>
        <Search size={16} /> Search <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs">⌘K</span>
      </button>
      <div className="flex gap-2">
        <button className="btn-secondary"><Plus size={16} className="inline" /> New Job</button>
        <button className="btn"><Plus size={16} className="inline" /> Record Payment</button>
      </div>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </header>
  );
}
