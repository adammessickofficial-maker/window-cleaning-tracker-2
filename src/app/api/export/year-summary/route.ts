import { prisma } from '@/lib/prisma';
import { startOfYear } from 'date-fns';

export async function GET() {
  const yearStart = startOfYear(new Date());
  const [payments, invoices] = await Promise.all([
    prisma.payment.findMany({ where: { receivedAt: { gte: yearStart } } }),
    prisma.invoice.findMany({ where: { issuedAt: { gte: yearStart } } })
  ]);
  const cash = payments.reduce((s, p) => s + Number(p.amount) + Number(p.tipAmount), 0);
  const accrual = invoices.reduce((s, i) => s + Number(i.total), 0);
  const csv = `year,cash_basis,invoice_basis\n${new Date().getFullYear()},${cash},${accrual}`;
  return new Response(csv, { headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename=year-summary.csv' } });
}
