'use client';
import * as Dialog from '@radix-ui/react-dialog';

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20" />
        <Dialog.Content className="fixed left-1/2 top-24 w-[90vw] max-w-xl -translate-x-1/2 rounded-2xl bg-white p-4 shadow-card">
          <input placeholder="Search customers, jobs, invoices..." className="input" />
          <p className="mt-3 text-xs text-slate-500">Global search MVP placeholder (wire to API for full-text search).</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
