import { PrismaClient, Prisma, JobStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.adjustment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.job.deleteMany();
  await prisma.property.deleteMany();
  await prisma.customer.deleteMany();

  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'owner@clearpane.app' },
    update: { passwordHash: hash },
    create: { email: 'owner@clearpane.app', passwordHash: hash, name: 'Owner' }
  });

  await prisma.setting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' }
  });

  const c = await prisma.customer.create({
    data: {
      name: 'Rivera Family',
      email: 'rivera@example.com',
      phone: '555-111-2222',
      tags: ['residential', 'vip'],
      properties: {
        create: {
          label: 'Home',
          address1: '123 Ocean View Rd',
          city: 'Monterey',
          state: 'CA',
          zip: '93940'
        }
      }
    },
    include: { properties: true }
  });

  const job = await prisma.job.create({
    data: {
      propertyId: c.properties[0].id,
      scheduledAt: subDays(new Date(), 2),
      completedAt: subDays(new Date(), 1),
      status: JobStatus.Invoiced,
      assignedTo: 'Alex',
      lineItems: {
        create: [
          { name: 'Exterior Windows', quantity: new Prisma.Decimal(1), unitPrice: new Prisma.Decimal(250), taxable: true },
          { name: 'Tracks & Sills', quantity: new Prisma.Decimal(1), unitPrice: new Prisma.Decimal(80), taxable: false }
        ]
      }
    }
  });

  const invoice = await prisma.invoice.create({
    data: {
      jobId: job.id,
      invoiceNumber: `${new Date().getFullYear()}-001`,
      issuedAt: subDays(new Date(), 1),
      dueAt: addDays(new Date(), 7),
      status: InvoiceStatus.Sent,
      subtotal: new Prisma.Decimal(330),
      tax: new Prisma.Decimal(20),
      total: new Prisma.Decimal(350)
    }
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      jobId: job.id,
      receivedAt: new Date(),
      amount: new Prisma.Decimal(150),
      method: PaymentMethod.Card,
      tipAmount: new Prisma.Decimal(20)
    }
  });
}

main().finally(async () => prisma.$disconnect());
