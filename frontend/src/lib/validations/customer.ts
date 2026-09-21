import { z } from "zod"

export const customerRegisterSchema = z
  .object({
    name: z.string().max(100, "حداکثر ۱۰۰ کاراکتر").optional(),
    email: z
      .string()
      .min(1, "ایمیل الزامی است")
      .email("ایمیل معتبر نیست")
      .max(200, "حداکثر ۲۰۰ کاراکتر"),
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .max(100, "حداکثر ۱۰۰ کاراکتر"),
    passwordConfirm: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "رمز عبور و تکرار آن یکسان نیست",
    path: ["passwordConfirm"],
  })

export type CustomerRegisterValues = z.infer<typeof customerRegisterSchema>