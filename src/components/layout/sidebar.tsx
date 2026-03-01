import Link from 'next/link';
import { LayoutDashboard, Briefcase, Users, Receipt, Wallet, BarChart3, Settings } from 'lucide-react';

const links = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['Jobs', '/jobs', Briefcase],
  ['Customers', '/customers', Users],
  ['Invoices', '/invoices', Receipt],
  ['Payments', '/payments', Wallet],
  ['Reports', '/reports', BarChart3],
  ['Settings', '/settings', Settings]
] as const;

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-2 md:border-r md:border-slate-200 md:bg-white md:p-4">
      <h1 className="mb-4 text-xl font-semibold">ClearPane</h1>
      {links.map(([label, href, Icon]) => (
        <Link key={href} href={href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
          <Icon size={16} /> {label}
        </Link>
      ))}
    </aside>
  );
}
