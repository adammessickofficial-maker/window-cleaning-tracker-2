import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { createCustomerAction } from '@/actions';

export default async function CustomersPage({ searchParams }: { searchParams: { q?: string; id?: string } }) {
  const q = searchParams.q ?? '';
  const customers = await prisma.customer.findMany({
    where: q ? { name: { contains: q, mode: 'insensitive' } } : {},
    include: { properties: true },
    orderBy: { createdAt: 'desc' }
  });
  const active = customers.find((c) => c.id === searchParams.id) ?? customers[0];
  const jobs = active ? await prisma.job.findMany({ where: { property: { customerId: active.id } }, include: { invoice: true }, orderBy: { scheduledAt: 'desc' } }) : [];

  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-[360px_1fr]">
        <section className="space-y-4">
          <form className="card" action={createCustomerAction}>
            <h2 className="mb-2 font-semibold">Add Customer</h2>
            <div className="space-y-2">
              <input className="input" name="name" placeholder="Full name" required />
              <input className="input" name="email" placeholder="Email" />
              <input className="input" name="phone" placeholder="Phone" />
              <input className="input" name="tags" placeholder="Tags (comma separated)" />
              <input className="input" name="propertyLabel" placeholder="Property Label" />
              <input className="input" name="address1" placeholder="Address 1" required />
              <input className="input" name="address2" placeholder="Address 2" />
              <div className="grid grid-cols-3 gap-2"><input className="input" name="city" placeholder="City" required /><input className="input" name="state" placeholder="State" required /><input className="input" name="zip" placeholder="ZIP" required /></div>
              <button className="btn w-full">Save Customer</button>
            </div>
          </form>
          <div className="card">
            <h2 className="mb-2 font-semibold">Customers</h2>
            <form><input name="q" defaultValue={q} className="input mb-3" placeholder="Search customers" /></form>
            <div className="space-y-2">{customers.map((c) => <a key={c.id} href={`/customers?id=${c.id}`} className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50"><p className="font-medium">{c.name}</p><p className="text-xs text-slate-500">{c.email ?? c.phone}</p></a>)}</div>
          </div>
        </section>
        <section className="card min-h-[400px]">
          {active ? (
            <>
              <h2 className="text-xl font-semibold">{active.name}</h2>
              <p className="text-sm text-slate-500">{active.email} · {active.phone}</p>
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold">Properties</h3>
                {active.properties.map((p) => <div key={p.id} className="mb-2 rounded-xl border p-3 text-sm">{p.label ?? 'Property'}: {p.address1}, {p.city}, {p.state} {p.zip}</div>)}
              </div>
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold">Job History</h3>
                {jobs.map((j) => <div key={j.id} className="mb-2 rounded-xl border p-3 text-sm">{new Date(j.scheduledAt).toLocaleDateString()} · {j.status} {j.invoice ? `· Invoice ${j.invoice.invoiceNumber}` : ''}</div>)}
              </div>
            </>
          ) : <p className="text-slate-500">No customers yet.</p>}
        </section>
      </div>
    </AppShell>
  );
}
