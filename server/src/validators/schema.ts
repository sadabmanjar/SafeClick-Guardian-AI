import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createScanSchema = z.object({
  content: z.string()
    .min(1, 'Scan content payload cannot be empty')
    .max(20000, 'Payload size exceeded (maximum 20,000 characters allowed)'),
  contentType: z.enum(['text', 'url', 'image']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export const triggerAlertSchema = z.object({
  alertType: z.enum(['SOS_BUTTON', 'SMS_DISPATCH', 'MANUAL_TRIGGER']),
  contactsNotified: z.array(z.string()).default([]),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
  }).optional(),
});

export const createComplaintSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  incidentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid incident date format',
  }),
  platform: z.string().min(1, 'Platform is required'),
  lossAmount: z.number().optional(),
  transactionId: z.string().optional(),
  bankName: z.string().optional(),
  victimDetails: z.object({
    name: z.string().min(1, 'Victim name is required'),
    phone: z.string().min(5, 'Victim contact number is required'),
    email: z.preprocess((val) => (val === '' || val === null || (typeof val === 'string' && val.trim() === '') ? undefined : val), z.string().optional()),
    address: z.string().optional(),
  }),
  suspectDetails: z.object({
    phone: z.string().optional(),
    upiId: z.string().optional(),
    bankAccount: z.string().optional(),
    websiteUrl: z.string().optional(),
    otherDetails: z.string().optional(),
  }).optional(),
  narrative: z.string().min(10, 'Details narrative must be at least 10 characters'),
  evidenceFiles: z.array(
    z.object({
      fileName: z.string(),
      fileType: z.string(),
      fileSize: z.string(),
      hashKey: z.string().optional(),
    })
  ).default([]),
});
