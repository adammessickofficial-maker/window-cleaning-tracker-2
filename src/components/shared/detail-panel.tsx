import { ReactNode } from 'react';

export function DetailPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="card"><h2 className="mb-3 text-lg font-semibold">{title}</h2>{children}</section>;
}
