import { describe, it, expect } from "vitest"
import { emailLogSchema, emailTemplateNameSchema } from "@/lib/validations/email"

describe("Phase 7: Email Validations", () => {
  it("باید نام قالب‌های ایمیل معتبر را بپذیرد", () => {
    expect(() => emailTemplateNameSchema.parse("order-confirmed")).not.toThrow()
    expect(() => emailTemplateNameSchema.parse("back-in-stock")).not.toThrow()
  })

  it("باید نام قالب نامعتبر را رد کند", () => {
    expect(() => emailTemplateNameSchema.parse("invalid-template")).toThrow()
  })

  it("باید ساختار EmailLog را اعتبارسنجی کند", () => {
    const validData = {
      to: "test@example.com",
      subject: "سفارش شما ثبت شد",
      html: "<p>سلام</p>",
      template: "order-confirmed",
    }
    expect(() => emailLogSchema.parse(validData)).not.toThrow()
  })
})