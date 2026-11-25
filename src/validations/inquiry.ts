import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, 'Enter a valid phone number (e.g. +919876543210)'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

