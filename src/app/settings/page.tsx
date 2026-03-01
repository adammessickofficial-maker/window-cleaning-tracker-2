import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/app-shell';
import { updateSettingsAction } from '@/actions';

export default async function SettingsPage() {
  const s = await prisma.setting.upsert({ where: { id: 'singleton' }, update: {}, create: { id: 'singleton' } });
  return <AppShell><form action={updateSettingsAction} className="card max-w-2xl space-y-3"><h2 className="text-xl font-semibold">Settings</h2><input name="businessName" defaultValue={s.businessName} className="input" /><input name="defaultTaxRate" defaultValue={String(s.defaultTaxRate)} className="input" /><textarea name="invoiceFooterText" defaultValue={s.invoiceFooterText} className="input" /><textarea name="defaultLineItemTemplates" defaultValue={s.defaultLineItemTemplates} className="input" /><button className="btn">Save Settings</button></form></AppShell>;
}
