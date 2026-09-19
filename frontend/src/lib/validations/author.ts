import { z } from "zod"

export const authorSchema = z.object({
  name: z.string().min(1, "نام الزامی است").max(200, "حداکثر ۲۰۰ کاراکتر"),
  slug: z.string().min(1, "اسلاگ الزامی است").max(200),
  bio: z.string().optional(),
  avatar: z.string().optional(),
})

export type AuthorFormValues = z.infer<typeof authorSchema>