import { z } from "zod"

export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("امتیاز باید عدد صحیح باشد")
    .min(1, "حداقل ۱ ستاره")
    .max(5, "حداکثر ۵ ستاره"),
  title: z
    .string()
    .max(80, "عنوان حداکثر ۸۰ کاراکتر")
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .max(1000, "متن حداکثر ۱۰۰۰ کاراکتر")
    .optional()
    .or(z.literal("")),
})

export const ratingLabels: Record<number, string> = {
  1: "ضعیف",
  2: "متوسط",
  3: "خوب",
  4: "خیلی خوب",
  5: "عالی",
}