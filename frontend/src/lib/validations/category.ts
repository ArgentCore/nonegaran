import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "نام الزامی است").max(200, "حداکثر ۲۰۰ کاراکتر"),
  slug: z.string().min(1, "اسلاگ الزامی است").max(200),
  description: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>