import { z } from 'zod'

export const addServiceSchema = z.object({
  label: z.string().min(1, 'Service name is required').max(120, 'Name too long'),
  iconId: z.string().min(1, 'Please select an icon'),
})

export type AddServiceFormValues = z.infer<typeof addServiceSchema>
