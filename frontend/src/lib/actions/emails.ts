"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/actions/admin"
import { deliverEmail, isMockMode } from "@/lib/email-sender"
import { renderEmailTemplate } from "@/lib/email-templates"
import type { EmailTemplateName } from "@/lib/validations/email"

export async function resendEmail(emailId: string): Promise<{ error?: string }> {
  await requireAdmin()

  const email = await prisma.emailLog.findUnique({ where: { id: emailId } })
  if (!email) return { error: "ایمیل یافت نشد." }
  if (!email.template) return { error: "این ایمیل قالب ندارد." }

  // اگر وضعیت queued یا failed است، reset کن و دوباره بفرست
  await prisma.emailLog.update({
    where: { id: emailId },
    data: { status: "queued", error: null, attempts: { increment: 1 } },
  })

  // بازخوانی داده‌های سفارش برای قالب (برای اینکه به‌روز باشد)
  let orderNumber = ""
  let customerName = "مشتری عزیز"
  let totalAmount = "۰"
  let items: { title: string; quantity: number; subtotal: string }[] = []
  let shippingAddress: string | undefined

  if (email.orderId) {
    const order = await prisma.order.findUnique({
      where: { id: email.orderId },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { book: { select: { title: true } } } },
      },
    })
    if (order) {
      orderNumber = order.id.slice(0, 8)
      customerName = order.user?.name || order.user?.email || "مشتری عزیز"
      totalAmount = order.totalAmount.toLocaleString("fa-IR")
      items = order.items.map((i) => ({
        title: i.book.title,
        quantity: i.quantity,
        subtotal: i.subtotal.toLocaleString("fa-IR"),
      }))
      const addr = order.shippingAddress as {
        recipientName?: string
        province?: string
        city?: string
      } | null
      if (addr) {
        shippingAddress = `${addr.recipientName ?? ""}، ${addr.province ?? ""} ${addr.city ?? ""}`.trim()
      }
    }
  }

  const rendered = renderEmailTemplate(email.template as EmailTemplateName, {
    orderNumber,
    customerName,
    totalAmount,
    items,
    shippingAddress,
  })

  const result = await deliverEmail(email.to, rendered.subject, rendered.html)
  const mock = isMockMode()

  await prisma.emailLog.update({
    where: { id: emailId },
    data:
      result.ok || mock
        ? {
            status: "sent",
            sentAt: new Date(),
            html: rendered.html,
            subject: rendered.subject,
            error: null,
          }
        : { status: "failed", error: result.error },
  })

  revalidatePath("/admin/emails")
  if (!result.ok && !mock) {
    return { error: result.error ?? "ارسال ناموفق" }
  }
  return {}
}