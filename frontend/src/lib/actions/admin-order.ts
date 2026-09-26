"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { OrderStatus } from "@prisma/client"
import { requireAdmin } from "@/lib/actions/admin"

const validStatuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]

export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ error?: string }> {
  await requireAdmin()

  if (!validStatuses.includes(newStatus as OrderStatus)) {
    return { error: "وضعیت نامعتبر است." }
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus as OrderStatus,
        paidAt: newStatus === "paid" ? new Date() : undefined,
      },
    })
    revalidatePath("/admin/orders")
    revalidatePath("/sefaresh-ha")
    return {}
  } catch {
    return { error: "خطا در به‌روزرسانی وضعیت." }
  }
}