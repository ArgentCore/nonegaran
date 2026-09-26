import { prisma } from "@/lib/prisma"
import type { OrderStatus, Prisma } from "@prisma/client"

export const orderInclude = {
  items: {
    include: {
      book: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverTone: true,
        },
      },
    },
  },
} as const

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: typeof orderInclude
}>

export const adminOrderInclude = {
  items: {
    include: {
      book: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverTone: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
} as const

export type AdminOrderWithItems = Prisma.OrderGetPayload<{
  include: typeof adminOrderInclude
}>

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال‌شده",
  delivered: "تحویل‌شده",
  cancelled: "لغوشده",
  refunded: "مرجوع‌شده",
}

export const orderTimelineSteps: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
]

export function timelinePosition(status: OrderStatus): number {
  if (status === "cancelled" || status === "refunded") return -1
  return orderTimelineSteps.indexOf(status)
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  })
}

export async function getOrderByIdForAdmin(orderId: string): Promise<AdminOrderWithItems | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: adminOrderInclude,
  })
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllOrdersForAdmin(): Promise<AdminOrderWithItems[]> {
  return prisma.order.findMany({
    include: adminOrderInclude,
    orderBy: { createdAt: "desc" },
  })
}