import type { EmailTemplateName } from "@/lib/validations/email"

interface TemplateData {
  orderNumber?: string
  customerName: string
  totalAmount?: string
  items?: { title: string; quantity: number; subtotal: string }[]
  shippingAddress?: string
  trackingUrl?: string
  bookTitle?: string
  bookUrl?: string
  price?: string
}

const brandColors = {
  ink: "#26221b",
  paper: "#fbf7ec",
  saffron: "#d9a441",
  moss: "#3a6b3a",
  clay: "#b4552d",
  hairline: "#e2d9c3",
  muted: "#7a715d",
}

function shell(body: string): string {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; padding: 0; background: ${brandColors.paper}; font-family: Tahoma, 'Segoe UI', sans-serif; color: ${brandColors.ink}; }
  .wrap { max-width: 560px; margin: 32px auto; background: #fff; border: 1px solid ${brandColors.hairline}; border-radius: 8px; overflow: hidden; }
  .header { background: ${brandColors.ink}; color: ${brandColors.paper}; padding: 20px 28px; text-align: center; }
  .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; }
  .header p { margin: 4px 0 0; font-size: 12px; opacity: 0.7; }
  .body { padding: 28px; }
  .greeting { font-size: 16px; margin: 0 0 16px; }
  .card { background: ${brandColors.paper}; border: 1px solid ${brandColors.hairline}; border-radius: 6px; padding: 16px; margin: 16px 0; }
  .card h3 { margin: 0 0 8px; font-size: 14px; color: ${brandColors.muted}; font-weight: normal; }
  .card p { margin: 0; font-size: 15px; }
  table.items { width: 100%; border-collapse: collapse; font-size: 14px; margin: 12px 0; }
  table.items td { padding: 8px 0; border-bottom: 1px solid ${brandColors.hairline}; }
  table.items td:last-child { text-align: left; font-variant-numeric: tabular-nums; }
  .total { font-size: 18px; font-weight: bold; color: ${brandColors.clay}; }
  .cta { display: inline-block; background: ${brandColors.saffron}; color: ${brandColors.ink}; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0; }
  .footer { padding: 16px 28px; background: #f5f0e1; font-size: 11px; color: ${brandColors.muted}; text-align: center; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 11px; background: ${brandColors.moss}; color: #fff; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>نونگاران</h1>
      <p>نشر کتاب</p>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      این ایمیل به‌صورت خودکار ارسال شده است. در صورت سؤال، با پشتیبانی تماس بگیرید.
    </div>
  </div>
</body>
</html>`
}

function renderItems(data: TemplateData): string {
  const rows = (data.items ?? [])
    .map(
      (i) => `
      <tr>
        <td>${i.title} × ${i.quantity}</td>
        <td>${i.subtotal} تومان</td>
      </tr>`
    )
    .join("")
  return `<table class="items">${rows}</table>`
}

export function renderEmailTemplate(
  template: EmailTemplateName,
  data: TemplateData
): { subject: string; html: string } {
  switch (template) {
    case "order-confirmed": {
      const body = `
        <p class="greeting">سلام ${data.customerName} عزیز،</p>
        <p>سفارش شما با موفقیت ثبت شد. <span class="badge">تأیید شد</span></p>
        <div class="card">
          <h3>شماره سفارش</h3>
          <p><strong style="font-family: monospace; font-size: 18px;">${data.orderNumber}</strong></p>
        </div>
        ${renderItems(data)}
        <p class="total">مبلغ کل: ${data.totalAmount} تومان</p>
        <p>به‌زودی سفارش شما آماده ارسال خواهد شد.</p>
      `
      return {
        subject: `سفارش ${data.orderNumber} شما ثبت شد — نونگاران`,
        html: shell(body),
      }
    }

    case "order-shipped": {
      const body = `
        <p class="greeting">سلام ${data.customerName} عزیز،</p>
        <p>سفارش شما ارسال شد! <span class="badge">ارسال شد</span></p>
        <div class="card">
          <h3>شماره سفارش</h3>
          <p><strong style="font-family: monospace;">${data.orderNumber}</strong></p>
        </div>
        ${data.shippingAddress ? `<div class="card"><h3>آدرس تحویل</h3><p>${data.shippingAddress}</p></div>` : ""}
        <p>معمولاً طی ۲ تا ۴ روز کاری به دستتان می‌رسد.</p>
      `
      return {
        subject: `سفارش ${data.orderNumber} ارسال شد — نونگاران`,
        html: shell(body),
      }
    }

    case "order-delivered": {
      const body = `
        <p class="greeting">سلام ${data.customerName} عزیز،</p>
        <p>سفارش شما تحویل داده شد. <span class="badge" style="background: ${brandColors.clay};">تحویل شد</span></p>
        <div class="card">
          <h3>شماره سفارش</h3>
          <p><strong style="font-family: monospace;">${data.orderNumber}</strong></p>
        </div>
        ${renderItems(data)}
        <p>امیدواریم از خواندن این کتاب‌ها لذت ببرید. خوشحال می‌شویم نظر خود را در سایت ثبت کنید.</p>
      `
      return {
        subject: `سفارش ${data.orderNumber} تحویل داده شد — نونگاران`,
        html: shell(body),
      }
    }

    case "back-in-stock": {
      const body = `
        <p class="greeting">سلام ${data.customerName} عزیز،</p>
        <p>خبر خوب! کتابی که به علاقه‌مندی‌های خود اضافه کرده بودید دوباره موجود شد. <span class="badge">موجود شد</span></p>
        <div class="card">
          <h3>عنوان کتاب</h3>
          <p><strong>${data.bookTitle}</strong></p>
          ${data.price ? `<p class="total" style="margin-top: 8px;">${data.price} تومان</p>` : ""}
        </div>
        ${data.bookUrl ? `<a href="${data.bookUrl}" class="cta">مشاهده و خرید</a>` : ""}
        <p>تعداد محدود است، زودتر سفارش دهید!</p>
      `
      return {
        subject: `${data.bookTitle} دوباره موجود شد — نونگاران`,
        html: shell(body),
      }
    }
  }
}