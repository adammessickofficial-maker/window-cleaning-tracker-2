import { JobStatus, InvoiceStatus } from '@prisma/client';

const colorMap: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Invoiced: 'bg-violet-50 text-violet-700',
  Paid: 'bg-green-50 text-green-700',
  Overdue: 'bg-red-50 text-red-700',
  Draft: 'bg-gray-50 text-gray-700',
  Sent: 'bg-indigo-50 text-indigo-700'
};

export function StatusChip({ status }: { status: JobStatus | InvoiceStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs ${colorMap[status] ?? 'bg-slate-50 text-slate-700'}`}>{status}</span>;
}
