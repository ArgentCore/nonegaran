import { z } from "zod"

export const emailTemplateNameSchema = z.enum([
  "order-confirmed",
  "order-shipped",
  "order-delivered",
  "back-in-stock",
])

export type EmailTemplateName = z.infer<typeof emailTemplateNameSchema>

export const emailLogSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
  template: emailTemplateNameSchema.optional(),
  orderId: z.string().uuid().optional().nullable(),
})

export type EmailLogValues = z.infer<typeof emailLogSchema>