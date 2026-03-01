import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  tags: z.string().optional(),
  propertyLabel: z.string().optional(),
  address1: z.string().min(3),
  address2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(3)
});

export const settingSchema = z.object({
  businessName: z.string().min(2),
  defaultTaxRate: z.coerce.number().min(0).max(1),
  invoiceFooterText: z.string().min(2),
  defaultLineItemTemplates: z.string().min(2)
});
