import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  password: z.string().min(12).max(128),
  role: z.enum(['Patient', 'Family Caregiver', 'Healthcare Proxy']).optional(),
  phone: z.string().trim().max(30).optional(),
  dob: z.string().date().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(128),
});

export const medicationCreateSchema = z.object({
  dependentId: z.string().uuid(),
  name: z.string().trim().min(1).max(160),
  genericName: z.string().trim().min(1).max(160),
  strength: z.string().trim().min(1).max(80),
  dosageInstructions: z.string().trim().min(1).max(1_000),
  frequency: z.string().trim().min(1).max(100),
  pillsRemaining: z.number().int().nonnegative(),
  totalPills: z.number().int().positive(),
  daysSupplyLeft: z.number().int().nonnegative(),
  refillsRemaining: z.number().int().nonnegative(),
});

export const doseStatusUpdateSchema = z.object({
  status: z.enum(['taken', 'skipped']),
});
