import { prisma } from "@/lib/prisma"
import type { Prisma, DiscountType } from "@prisma/client"

export const discountInclude = {
  user: {
    select: { id: true, email: true, name: true },
  },
} as const

export type DiscountWithUser = Prisma.DiscountCodeGetPayload<{
  include: typeof discountInclude
}>

export interface DiscountCalculation {
  valid: boolean
  error?: string
  discountAmount?: number
  code?: string
  countdown?: { seconds: number; label: string }
}

export async function getDiscountById(id: string): Promise<DiscountWithUser | null> {
  return prisma.discountCode.findUnique({
    where: { id },
    include: discountInclude,
  })
}

export async function getDiscountByCode(code: string): Promise<DiscountWithUser | null> {
  return prisma.discountCode.findUnique({
    where: { code: code.toUpperCase() },
    include: discountInclude,
  })
}

export async function getAllDiscounts(): Promise<DiscountWithUser[]> {
  return prisma.discountCode.findMany({
    include: discountInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserUsageCount(
  discountId: string,
  userId: string
): Promise<number> {
  return prisma.order.count({
    where: { appliedDiscountId: discountId, userId },
  })
}

export function calculateDiscount(
  discount: DiscountWithUser,
  orderSubtotal: number,
  userUsage?: number
): DiscountCalculation {
  const now = new Date()

  if (!discount.isActive) {
    return { valid: false, error: "این کد تخفیف غیرفعال شده است." }
  }

  if (discount.startsAt && now < new Date(discount.startsAt)) {
    return { valid: false, error: "این کد هنوز فعال نشده است." }
  }

  if (discount.expiresAt && now > new Date(discount.expiresAt)) {
    return { valid: false, error: "مهلت این کد به پایان رسیده است." }
  }

  if (discount.minOrderAmount && orderSubtotal < discount.minOrderAmount) {
    return {
      valid: false,
      error: `حداقل مبلغ سفارش برای این کد ${discount.minOrderAmount.toLocaleString("fa-IR")} تومان است.`,
    }
  }

  if (discount.usageLimit !== null && discount.usageCount >= (discount.usageLimit ?? Infinity)) {
    return { valid: false, error: "سقف استفاده از این کد تکمیل شده است." }
  }

  if (userUsage !== undefined && discount.userLimit !== null && userUsage >= discount.userLimit) {
    return { valid: false, error: "شما از این کد به سقف استفاده خود رسیده‌اید." }
  }

  let discountAmount = 0
  if (discount.type === "percentage") {
    discountAmount = Math.round((orderSubtotal * discount.value) / 100)
    if (discount.maxDiscount) {
      discountAmount = Math.min(discountAmount, discount.maxDiscount)
    }
  } else {
    discountAmount = Math.min(discount.value, orderSubtotal)
  }

  discountAmount = Math.min(discountAmount, orderSubtotal)

  const countdown = buildCountdown(discount.expiresAt)

  return {
    valid: true,
    discountAmount,
    code: discount.code,
    countdown,
  }
}

function buildCountdown(expiresAt: Date | null): DiscountCalculation["countdown"] {
  if (!expiresAt) return undefined
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) return undefined
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  let label = ""
  if (days > 0) label = `${days} روز`
  else if (hours > 0) label = `${hours} ساعت`
  else label = `${minutes} دقیقه`

  return { seconds: totalSeconds, label }
}