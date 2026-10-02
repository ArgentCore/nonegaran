import { prisma } from "@/lib/prisma"
import { renderEmailTemplate } from "@/lib/email-templates"
import type { EmailTemplateName } from "@/lib/validations/email"

interface TemplateCall {
  template: EmailTemplateName
  to: string
  orderId?: string
  data: Parameters<typeof renderEmailTemplate>[1]
}

interface SendResult {
  id: string
  status: "sent" | "failed" | "queued"
  mock: boolean
  error?: string
}

export async function deliverEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not set (mock mode)" }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Nonegaran <no-reply@nonegaran.local>",
        to: [to],
        subject,
        html,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" }
  }
}

export function isMockMode(): boolean {
  return !process.env.RESEND_API_KEY
}

export async function sendTransactionalEmail(
  call: TemplateCall
): Promise<SendResult> {
  const { subject, html } = renderEmailTemplate(call.template, call.data)

  const log = await prisma.emailLog.create({
    data: {
      to: call.to,
      subject,
      html,
      template: call.template,
      orderId: call.orderId ?? null,
      status: "queued",
      attempts: 1,
    },
  })

  const result = await deliverEmail(call.to, subject, html)
  const mock = isMockMode()

  if (result.ok || mock) {
    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: "sent", sentAt: new Date() },
    })
    return { id: log.id, status: "sent", mock, error: mock ? result.ok ? undefined : result.error : undefined }
  }

  await prisma.emailLog.update({
    where: { id: log.id },
    data: { status: "failed", error: result.error },
  })
  return { id: log.id, status: "failed", mock: false, error: result.error }
}

export async function sendOrderConfirmedEmail(params: {
  to: string
  orderId: string
  orderNumber: string
  customerName: string
  totalAmount: string
  items: { title: string; quantity: number; subtotal: string }[]
}): Promise<SendResult | null> {
  try {
    return await sendTransactionalEmail({
      template: "order-confirmed",
      to: params.to,
      orderId: params.orderId,
      data: {
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        totalAmount: params.totalAmount,
        items: params.items,
      },
    })
  } catch (e) {
    console.error("[email] order-confirmed failed:", e)
    return null
  }
}

export async function sendOrderStatusEmail(params: {
  to: string
  orderId: string
  orderNumber: string
  customerName: string
  totalAmount: string
  items: { title: string; quantity: number; subtotal: string }[]
  shippingAddress?: string
  template: "order-shipped" | "order-delivered"
}): Promise<SendResult | null> {
  try {
    return await sendTransactionalEmail({
      template: params.template,
      to: params.to,
      orderId: params.orderId,
      data: {
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        totalAmount: params.totalAmount,
        items: params.items,
        shippingAddress: params.shippingAddress,
      },
    })
  } catch (e) {
    console.error("[email] status email failed:", e)
    return null
  }
}