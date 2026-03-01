import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { Money } from '@/components/shared/money';

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({ include: { invoice: true, job: true }, orderBy: { receivedAt: 'desc' } });
  return <AppShell><div className="card"><h2 className="mb-3 text-xl font-semibold">Payments</h2>{payments.map((p) => <div key={p.id} className="mb-2 flex items-center justify-between rounded-xl border p-3"><div><p className="font-medium">{p.method} · {new Date(p.receivedAt).toLocaleDateString()}</p><p className="text-xs text-slate-500">Invoice: {p.invoice?.invoiceNumber ?? 'n/a'}</p></div><Money value={Number(p.amount) + Number(p.tipAmount)} /></div>)}</div></AppShell>;
}
