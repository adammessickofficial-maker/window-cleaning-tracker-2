import { prisma } from '@/lib/prisma';
import { Money } from '@/components/shared/money';

export default async function PrintInvoice({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({ where: { id: params.id }, include: { job: { include: { lineItems: true, property: { include: { customer: true } } } } } });
  if (!invoice) return null;
  return <div className="mx-auto max-w-3xl bg-white p-8"><h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1><p>{invoice.job.property.customer.name}</p><table className="mt-6 w-full text-left"><thead><tr><th>Item</th><th>Qty</th><th>Unit</th></tr></thead><tbody>{invoice.job.lineItems.map((li) => <tr key={li.id}><td>{li.name}</td><td>{String(li.quantity)}</td><td><Money value={String(li.unitPrice)} /></td></tr>)}</tbody></table><div className="mt-8 text-right"><p>Subtotal: <Money value={String(invoice.subtotal)} /></p><p>Tax: <Money value={String(invoice.tax)} /></p><p className="text-xl">Total: <Money value={String(invoice.total)} /></p></div></div>;
}
