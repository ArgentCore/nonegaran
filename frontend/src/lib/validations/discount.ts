import { z } from "zod"

export const discountTypeSchema = z.enum(["percentage", "fixed"])

export const adminDiscountSchema = z
  .object({
    code: z
      .string()
      .min(3, "کد باید حداقل ۳ کاراکتر باشد")
      .max(30, "حداکثر ۳۰ کاراکتر")
      .regex(/^[A-Z0-9_-]+$/, "فقط حروف بزرگ انگلیسی، اعداد، - و _ مجاز است"),
    type: discountTypeSchema,
    value: z.coerce
      .number()
      .int("عدد صحیح وارد کنید")
      .positive("عدد باید مثبت باشد"),
    minOrderAmount: z.coerce.number().int().nonnegative().optional().nullable(),
    maxDiscount: z.coerce.number().int().nonnegative().optional().nullable(),
    usageLimit: z.coerce.number().int().positive().optional().nullable(),
    userLimit: z.coerce.number().int().positive().optional().nullable(),
    userId: z.string().uuid().optional().nullable().or(z.literal("")),
    startsAt: z.string().optional().nullable(),
    expiresAt: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (d) => {
      if (d.type === "percentage" && (d.value < 1 || d.value > 90)) return false
      return true
    },
    { message: "درصد تخفیف باید بین ۱ تا ۹۰ باشد", path: ["value"] }
  )
  .refine(
    (d) => {
      if (!d.startsAt || !d.expiresAt) return true
      return new Date(d.startsAt) < new Date(d.expiresAt)
    },
    { message: "تاریخ پایان باید بعد از شروع باشد", path: ["expiresAt"] }
  )

export type AdminDiscountValues = z.infer<typeof adminDiscountSchema>

export const applyDiscountSchema = z.object({
  code: z
    .string()
    .min(1, "کد تخفیف الزامی است")
    .max(50)
    .transform((s) => s.trim().toUpperCase()),
})