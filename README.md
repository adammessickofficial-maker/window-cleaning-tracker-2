# ClearPane MVP

Production-ready MVP for a window cleaning business to manage customers, properties, jobs, invoices, payments, and reports.

## Stack
- Next.js App Router + TypeScript
- Prisma ORM + SQLite (dev)
- TailwindCSS + Radix UI
- Zod, date-fns

## Features
- Cookie-based auth + route protection
- CRUD core entities (customers/properties/jobs/invoices/payments)
- Job status workflow + invoice generation
- Revenue reports with cash/invoice basis toggles
- CSV exports (jobs/invoices/payments/year summary)
- Apple-like clean UI shell with sidebar, topbar, quick actions, status chips, master-detail customer module
- Invoice print view placeholder for PDF workflow

## Run locally
1. Install dependencies
   ```bash
   npm install
   ```
2. Prepare DB
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run prisma:seed
   ```
3. Start app
   ```bash
   npm run dev
   ```
4. Login
   - Email: `owner@clearpane.app`
   - Password: `password123`

## Notes
- Prisma schema is Postgres-ready (enum/decimal relations modeled for easy provider switch).
- For production, replace cookie id session with signed/JWT session store and secure secret rotation.
