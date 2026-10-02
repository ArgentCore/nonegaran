"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/actions/admin"
import { adminDiscountSchema } from "@/lib/validations/discount"
import {
  calculateDiscount,
  getDiscountByCode,
  getUserUsageCount,
  type DiscountCalculation,
} from "@/lib/data/discounts"

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

export async function createDiscount(formData: FormData) {
  await requireAdmin()

  const raw = {
    code: String(formData.get("code") ?? "").trim().toUpperCase(),
    type: String(formData.get("type") ?? "percentage") as "percentage" | "fixed",
    value: formData.get("value"),
    minOrderAmount: formData.get("minOrderAmount") || null,
    maxDiscount: formData.get("maxDiscount") || null,
    usageLimit: formData.get("usageLimit") || null,
    userLimit: formData.get("userLimit") || null,
    userId: String(formData.get("userId") ?? "") || null,
    startsAt: String(formData.get("startsAt") ?? "") || null,
    expiresAt: String(formData.get("expiresAt") ?? "") || null,
    isActive: formData.get("isActive") === "on",
  }

  const parsed = adminDiscountSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = {
    code: parsed.data.code,
    type: parsed.data.type,
    value: parsed.data.value,
    minOrderAmount: parsed.data.minOrderAmount ?? null,
    maxDiscount: parsed.data.maxDiscount ?? null,
    usageLimit: parsed.data.usageLimit ?? null,
    userLimit: parsed.data.userLimit ?? null,
    userId: parsed.data.userId || null,
    startsAt: parseDate(parsed.data.startsAt),
    expiresAt: parseDate(parsed.data.expiresAt),
    isActive: parsed.data.isActive ?? true,
  }

  try {
    await prisma.discountCode.create({ data })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "این کد از قبل وجود دارد." }
    }
    return { error: "خطا در ساخت کد تخفیف." }
  }

  revalidatePath("/admin/discounts")
  redirect("/admin/discounts")
}

export async function updateDiscount(id: string, formData: FormData) {
  await requireAdmin()

  const raw = {
    code: String(formData.get("code") ?? "").trim().toUpperCase(),
    type: String(formData.get("type") ?? "percentage") as "percentage" | "fixed",
    value: formData.get("value"),
    minOrderAmount: formData.get("minOrderAmount") || null,
    maxDiscount: formData.get("maxDiscount") || null,
    usageLimit: formData.get("usageLimit") || null,
    userLimit: formData.get("userLimit") || null,
    userId: String(formData.get("userId") ?? "") || null,
    startsAt: String(formData.get("startsAt") ?? "") || null,
    expiresAt: String(formData.get("expiresAt") ?? "") || null,
    isActive: formData.get("isActive") === "on",
  }

  const parsed = adminDiscountSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = {
    code: parsed.data.code,
    type: parsed.data.type,
    value: parsed.data.value,
    minOrderAmount: parsed.data.minOrderAmount ?? null,
    maxDiscount: parsed.data.maxDiscount ?? null,
    usageLimit: parsed.data.usageLimit ?? null,
    userLimit: parsed.data.userLimit ?? null,
    userId: parsed.data.userId || null,
    startsAt: parseDate(parsed.data.startsAt),
    expiresAt: parseDate(parsed.data.expiresAt),
    isActive: parsed.data.isActive ?? true,
  }

  try {
    await prisma.discountCode.update({ where: { id }, data })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "این کد از قبل وجود دارد." }
    }
    return { error: "خطا در به‌روزرسانی کد." }
  }

  revalidatePath("/admin/discounts")
  redirect("/admin/discounts")
}

export async function toggleDiscount(id: string) {
  await requireAdmin()
  const current = await prisma.discountCode.findUnique({ where: { id } })
  if (!current) return { error: "کد یافت نشد." }
  await prisma.discountCode.update({
    where: { id },
    data: { isActive: !current.isActive },
  })
  revalidatePath("/admin/discounts")
  return {}
}

export async function deleteDiscount(id: string) {
  await requireAdmin()
  try {
    await prisma.discountCode.delete({ where: { id } })
  } catch {
    return { error: "این کد در سفارش‌های قبلی استفاده شده و قابل حذف نیست." }
  }
  revalidatePath("/admin/discounts")
  return {}
}

export async function validateDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountCalculation> {
  const normalized = code.trim().toUpperCase()
  if (!normalized) {
    return { valid: false, error: "کد تخفیف را وارد کنید." }
  }

  const discount = await getDiscountByCode(normalized)
  if (!discount) {
    return { valid: false, error: "کد تخفیف یافت نشد." }
  }

  const session = await auth()
  const userId = session?.user?.id ?? null

  if (discount.userId && discount.userId !== userId) {
    return { valid: false, error: "این کد اختصاصی است و برای حساب شما نیست." }
  }

  const userUsage = userId
    ? await getUserUsageCount(discount.id, userId)
    : undefined

  return calculateDiscount(discount, subtotal, userUsage)
}

export async function issueGiftCoupon(orderId: string): Promise<void> {
  const code = `GIFT-${orderId.slice(0, 8).toUpperCase()}`
  const expiresAt = new Date(Date.now() + 14 * 86400000)
  try {
    await prisma.discountCode.create({
      data: {
        code,
        type: "percentage",
        value: 10,
        usageLimit: 1,
        expiresAt,
        isActive: true,
      },
    })
  } catch {
    return
  }
}