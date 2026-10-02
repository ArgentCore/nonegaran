"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { OrderStatus } from "@prisma/client"
import { requireAdmin } from "@/lib/actions/admin"
import { sendOrderStatusEmail } from "@/lib/email-sender"

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
    
    if (newStatus === "shipped" || newStatus === "delivered") {
      notifyOrderStatusChange(orderId, newStatus as "shipped" | "delivered")
    }return {}
  } catch {
    return { error: "خطا در به‌روزرسانی وضعیت." }
  }
}

export async function notifyOrderStatusChange(
  orderId: string,
  newStatus: "shipped" | "delivered"
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { email: true, name: true } },
      items: { include: { book: { select: { title: true } } } },
    },
  })
  if (!order || !order.user?.email) return

  const addr = order.shippingAddress as {
    recipientName?: string
    province?: string
    city?: string
  } | null
  const shippingAddress = addr
    ? `${addr.recipientName ?? ""}، ${addr.province ?? ""} ${addr.city ?? ""}`.trim()
    : undefined

  const template: "order-shipped" | "order-delivered" =
    newStatus === "shipped" ? "order-shipped" : "order-delivered"

  await sendOrderStatusEmail({
    to: order.user.email,
    orderId: order.id,
    orderNumber: order.id.slice(0, 8),
    customerName: order.user.name || "مشتری عزیز",
    totalAmount: order.totalAmount.toLocaleString("fa-IR"),
    items: order.items.map((i) => ({
      title: i.book.title,
      quantity: i.quantity,
      subtotal: i.subtotal.toLocaleString("fa-IR"),
    })),
    shippingAddress,
    template,
  })
}