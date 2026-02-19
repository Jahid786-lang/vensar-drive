import { z } from 'zod'

export const loginSchema = z.object({
  userId: z
    .string()
    .min(1, 'User name or mobile number is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
