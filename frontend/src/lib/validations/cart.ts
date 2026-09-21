import { z } from "zod"

export const cartItemSchema = z.object({
  bookId: z.string().min(1, "کتاب الزامی است"),
  quantity: z
    .string()
    .regex(/^\d+$/, "تعداد باید عدد باشد")
    .transform(Number)
    .pipe(z.number().int().min(1, "حداقل ۱ عدد").max(99, "حداکثر ۹۹ عدد")),
})

export type CartItemFormValues = z.infer<typeof cartItemSchema>