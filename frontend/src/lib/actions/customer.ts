"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { customerRegisterSchema } from "@/lib/validations/customer"

export async function registerCustomer(
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = customerRegisterSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10)

  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        name: parsed.data.name || null,
        role: "customer",
      },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "این ایمیل قبلاً ثبت شده است. وارد شوید." }
    }
    return { error: "خطایی در ثبت‌نام رخ داد. دوباره تلاش کنید." }
  }

  return {}
}