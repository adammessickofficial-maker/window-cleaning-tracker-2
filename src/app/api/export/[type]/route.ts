import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { type: string } }) {
  const type = params.type;
  let rows: Record<string, unknown>[] = [];
  if (type === 'jobs') rows = await prisma.job.findMany({ include: { property: { include: { customer: true } } } }) as unknown as Record<string, unknown>[];
  if (type === 'invoices') rows = await prisma.invoice.findMany({ include: { job: true } }) as unknown as Record<string, unknown>[];
  if (type === 'payments') rows = await prisma.payment.findMany() as unknown as Record<string, unknown>[];
  if (!rows.length) return new Response('No data', { status: 404 });
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
  return new Response(csv, { headers: { 'content-type': 'text/csv', 'content-disposition': `attachment; filename=${type}.csv` } });
}
