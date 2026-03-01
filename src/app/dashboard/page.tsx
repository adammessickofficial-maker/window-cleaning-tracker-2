import { startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { Money } from '@/components/shared/money';
import { StatusChip } from '@/components/shared/status-chip';

async function sumPayments(from: Date) {
  const payments = await prisma.payment.findMany({ where: { receivedAt: { gte: from } } });
  return payments.reduce((s, p) => s + Number(p.amount) + Number(p.tipAmount), 0);
}

export default async function DashboardPage() {
  const [today, week, month, ytd, outstanding, upcoming] = await Promise.all([
    sumPayments(startOfDay(new Date())),
    sumPayments(startOfWeek(new Date())),
    sumPayments(startOfMonth(new Date())),
    sumPayments(startOfYear(new Date())),
    prisma.invoice.findMany({ where: { status: { in: ['Sent', 'Overdue'] } }, include: { job: true } }),
    prisma.job.findMany({ where: { scheduledAt: { gte: new Date() } }, include: { property: { include: { customer: true } } }, take: 5 })
  ]);

  return <AppShell>
    <div className="grid gap-4 md:grid-cols-4">{[['Today', today], ['Week', week], ['Month', month], ['YTD', ytd]].map(([l,v]) => <div key={String(l)} className="card"><p className="text-sm text-slate-500">{l}</p><p className="text-2xl font-semibold"><Money value={Number(v)} /></p></div>)}</div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="card"><h2 className="mb-3 font-semibold">Outstanding Invoices</h2>{outstanding.map(i => <div key={i.id} className="mb-2 flex items-center justify-between"><span>{i.invoiceNumber}</span><div className="flex items-center gap-2"><StatusChip status={i.status} /><Money value={Number(i.total)} /></div></div>)}</div>
      <div className="card"><h2 className="mb-3 font-semibold">Upcoming Jobs</h2>{upcoming.map(j => <div key={j.id} className="mb-2 flex items-center justify-between"><span>{j.property.customer.name}</span><StatusChip status={j.status} /></div>)}</div>
    </div>
  </AppShell>;
}
