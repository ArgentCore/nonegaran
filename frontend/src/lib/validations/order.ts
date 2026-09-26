import { z } from "zod"

export const shippingAddressSchema = z.object({
  recipientName: z
    .string()
    .min(2, "نام گیرنده باید حداقل ۲ کاراکتر باشد")
    .max(100, "حداکثر ۱۰۰ کاراکتر"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
  province: z.string().min(2, "استان الزامی است").max(50, "حداکثر ۵۰ کاراکتر"),
  city: z.string().min(2, "شهر الزامی است").max(50, "حداکثر ۵۰ کاراکتر"),
  addressLine: z
    .string()
    .min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "حداکثر ۵۰۰ کاراکتر"),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
})

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export const checkoutSchema = z.object({
  contactEmail: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("ایمیل معتبر نیست")
    .max(200, "حداکثر ۲۰۰ کاراکتر"),
  shippingAddress: shippingAddressSchema,
  saveAddress: z.boolean().optional(),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>