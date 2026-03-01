'use server';

import { Prisma, InvoiceStatus, JobStatus, PaymentMethod } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { customerSchema, settingSchema } from '@/lib/schemas';
import { login, logout } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function loginAction(_: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const ok = await login(email, password);
  if (!ok) return { error: 'Invalid credentials' };
  redirect('/dashboard');
}

export async function logoutAction() { await logout(); redirect('/login'); }

export async function createCustomerAction(_: unknown, formData: FormData) {
  const parsed = customerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;
  await prisma.customer.create({
    data: {
      name: v.name,
      email: v.email || null,
      phone: v.phone || null,
      tags: (v.tags ?? '').split(',').map((x) => x.trim()).filter(Boolean),
      properties: { create: { label: v.propertyLabel || null, address1: v.address1, address2: v.address2 || null, city: v.city, state: v.state, zip: v.zip } }
    }
  });
  revalidatePath('/customers');
}

export async function updateJobStatusAction(jobId: string, status: JobStatus) {
  const data: Prisma.JobUpdateInput = { status };
  if (status === JobStatus.Completed) data.completedAt = new Date();
  await prisma.job.update({ where: { id: jobId }, data });
  revalidatePath('/jobs');
}

export async function createInvoiceFromJobAction(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { lineItems: true } });
  if (!job) return;
  const setting = await prisma.setting.findUnique({ where: { id: 'singleton' } });
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({ where: { issuedAt: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } } });
  const invoiceNumber = `${year}-${String(count + 1).padStart(3, '0')}`;
  const subtotalNum = job.lineItems.reduce((sum, li) => sum + Number(li.quantity) * Number(li.unitPrice), 0);
  const taxableNum = job.lineItems.filter((li) => li.taxable).reduce((sum, li) => sum + Number(li.quantity) * Number(li.unitPrice), 0);
  const taxNum = taxableNum * Number(setting?.defaultTaxRate ?? 0.08);
  const totalNum = subtotalNum + taxNum;

  await prisma.invoice.create({
    data: {
      jobId,
      invoiceNumber,
      issuedAt: new Date(),
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      status: InvoiceStatus.Sent,
      subtotal: new Prisma.Decimal(subtotalNum),
      tax: new Prisma.Decimal(taxNum),
      total: new Prisma.Decimal(totalNum)
    }
  });
  await prisma.job.update({ where: { id: jobId }, data: { status: JobStatus.Invoiced } });
  revalidatePath('/jobs');
  revalidatePath('/invoices');
}

export async function createPaymentAction(_: unknown, formData: FormData) {
  const invoiceId = String(formData.get('invoiceId') || '');
  const jobId = String(formData.get('jobId') || '') || null;
  const amount = Number(formData.get('amount') || 0);
  const tipAmount = Number(formData.get('tipAmount') || 0);
  const method = (String(formData.get('method') || 'Cash') as PaymentMethod);
  await prisma.payment.create({ data: { invoiceId: invoiceId || null, jobId, amount: new Prisma.Decimal(amount), tipAmount: new Prisma.Decimal(tipAmount), method, receivedAt: new Date(), memo: String(formData.get('memo') || '') || null } });
  if (invoiceId) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
    if (invoice) {
      const paid = invoice.payments.reduce((s, p) => s + Number(p.amount) + Number(p.tipAmount), 0) + amount + tipAmount;
      if (paid >= Number(invoice.total)) {
        await prisma.invoice.update({ where: { id: invoice.id }, data: { status: InvoiceStatus.Paid } });
        await prisma.job.update({ where: { id: invoice.jobId }, data: { status: JobStatus.Paid } });
      }
    }
  }
  revalidatePath('/payments');
  revalidatePath('/invoices');
  revalidatePath('/dashboard');
}

export async function updateSettingsAction(_: unknown, formData: FormData) {
  const parsed = settingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;
  await prisma.setting.upsert({ where: { id: 'singleton' }, update: { ...v }, create: { id: 'singleton', ...v } });
  revalidatePath('/settings');
}
