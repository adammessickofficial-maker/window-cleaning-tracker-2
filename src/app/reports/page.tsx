import { startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { Money } from '@/components/shared/money';
import { SegmentedControl } from '@/components/shared/segmented-control';

async function calc(from: Date, basis: 'cash' | 'invoice') {
  if (basis === 'cash') {
    const payments = await prisma.payment.findMany({ where: { receivedAt: { gte: from } } });
    return payments.reduce((s, p) => s + Number(p.amount) + Number(p.tipAmount), 0);
  }
  const invoices = await prisma.invoice.findMany({ where: { issuedAt: { gte: from } } });
  return invoices.reduce((s, i) => s + Number(i.total), 0);
}

export default async function ReportsPage({ searchParams }: { searchParams: { basis?: 'cash' | 'invoice' } }) {
  const basis = searchParams.basis ?? 'cash';
  const [day, week, month, year] = await Promise.all([calc(startOfDay(new Date()), basis), calc(startOfWeek(new Date()), basis), calc(startOfMonth(new Date()), basis), calc(startOfYear(new Date()), basis)]);
  return <AppShell><div className="card"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Reports ({basis} basis)</h2><SegmentedControl active={basis === 'cash' ? 'Cash' : 'Invoice'} options={[{ label: 'Cash', href: '/reports?basis=cash' }, { label: 'Invoice', href: '/reports?basis=invoice' }]} /></div><div className="grid gap-3 md:grid-cols-4">{[['Day',day],['Week',week],['Month',month],['Year',year]].map(([l,v]) => <div key={String(l)} className="rounded-xl border p-3"><p className="text-sm text-slate-500">{l}</p><p className="text-xl font-semibold"><Money value={Number(v)} /></p></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><a className="btn-secondary" href="/api/export/jobs">Export Jobs CSV</a><a className="btn-secondary" href="/api/export/invoices">Export Invoices CSV</a><a className="btn-secondary" href="/api/export/payments">Export Payments CSV</a><a className="btn" href="/api/export/year-summary">Year Summary CSV</a></div></div></AppShell>;
}
