import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { StatusChip } from '@/components/shared/status-chip';
import { Money } from '@/components/shared/money';
import { createPaymentAction } from '@/actions';

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({ include: { job: { include: { property: { include: { customer: true } } } }, payments: true }, orderBy: { issuedAt: 'desc' } });
  return <AppShell><div className="card"><h2 className="mb-4 text-xl font-semibold">Invoices</h2>{invoices.map((i) => <div key={i.id} className="mb-3 rounded-xl border p-3"><div className="flex items-center justify-between"><div><p className="font-medium">{i.invoiceNumber} · {i.job.property.customer.name}</p><p className="text-xs text-slate-500">Issued {new Date(i.issuedAt).toLocaleDateString()}</p></div><div className="flex items-center gap-2"><StatusChip status={i.status} /><Money value={Number(i.total)} /></div></div><div className="mt-2 flex items-center gap-2"><Link className="btn-secondary" href={`/invoices/${i.id}/print`}>Print View</Link><form action={createPaymentAction} className="flex gap-2"><input type="hidden" name="invoiceId" value={i.id} /><input type="hidden" name="jobId" value={i.jobId} /><input className="input" name="amount" placeholder="Amount" /><select name="method" className="input"><option>Cash</option><option>Check</option><option>Card</option><option>ACH</option><option>Zelle</option><option>Venmo</option><option>Other</option></select><button className="btn">Record Payment</button></form></div></div>)}</div></AppShell>;
}
