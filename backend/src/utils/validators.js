import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'institution', 'employer', 'admin']),
  institution: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const certificateUploadSchema = z.object({
  studentId: z.number(),
  institutionId: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  issueDate: z.string(),
  expiryDate: z.string().optional()
});
