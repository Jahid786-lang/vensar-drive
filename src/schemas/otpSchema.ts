import { z } from 'zod'

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Enter 6-digit OTP')
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),
})

export type OtpFormValues = z.infer<typeof otpSchema>
