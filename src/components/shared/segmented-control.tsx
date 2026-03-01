import Link from 'next/link';

export function SegmentedControl({ options, active }: { options: { label: string; href: string }[]; active: string }) {
  return <div className="inline-flex rounded-xl bg-slate-100 p-1">{options.map((o) => <Link key={o.href} href={o.href} className={`rounded-lg px-3 py-1 text-sm ${active === o.label ? 'bg-white shadow' : 'text-slate-600'}`}>{o.label}</Link>)}</div>;
}
