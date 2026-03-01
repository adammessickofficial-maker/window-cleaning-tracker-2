import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { StatusChip } from '@/components/shared/status-chip';
import { createInvoiceFromJobAction, updateJobStatusAction } from '@/actions';

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({ include: { property: { include: { customer: true } }, lineItems: true, invoice: true }, orderBy: { scheduledAt: 'desc' } });
  return <AppShell><div className="card"><h2 className="mb-3 text-xl font-semibold">Jobs</h2><div className="space-y-3">{jobs.map((j) => <div key={j.id} className="rounded-xl border p-3"><div className="flex items-center justify-between"><div><p className="font-medium">{j.property.customer.name} — {j.property.label ?? j.property.address1}</p><p className="text-xs text-slate-500">{new Date(j.scheduledAt).toLocaleString()} · Assigned: {j.assignedTo ?? 'Unassigned'}</p></div><StatusChip status={j.status} /></div><p className="mt-2 text-sm">Line items: {j.lineItems.map((li) => li.name).join(', ')}</p><div className="mt-3 flex flex-wrap gap-2"><form action={updateJobStatusAction.bind(null, j.id, 'Completed')}><button className="btn-secondary">Complete</button></form><form action={createInvoiceFromJobAction.bind(null, j.id)}><button className="btn-secondary">Create Invoice</button></form></div></div>)}</div></div></AppShell>;
}
