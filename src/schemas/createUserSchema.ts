import { z } from 'zod'
import { ROLES } from '@/constants/roles'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  mobile: z.string().optional(),
  role: z.enum(ROLES as [string, ...string[]]),
  address: z.string().optional(),
  designation: z.string().optional(),
})

export const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  role: z.enum(ROLES as [string, ...string[]]),
  address: z.string().optional(),
  designation: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type EditUserFormValues = z.infer<typeof editUserSchema>
