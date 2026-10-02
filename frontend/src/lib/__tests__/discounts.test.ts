import { describe, it, expect } from "vitest"
import { adminDiscountSchema } from "@/lib/validations/discount"

describe("Phase 5: Discount Validations", () => {
  it("باید کد تخفیف معتبر را بپذیرد", () => {
    const validData = {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
    expect(() => adminDiscountSchema.parse(validData)).not.toThrow()
  })

  it("باید درصد تخفیف خارج از محدوده ۱ تا ۹۰ را رد کند", () => {
    const invalidData = {
      code: "BAD_PERCENT",
      type: "percentage",
      value: 150, // نامعتبر
      usageLimit: 10,
    }
    expect(() => adminDiscountSchema.parse(invalidData)).toThrow()
  })

  it("باید فرمت کد نامعتبر (حروف کوچک) را رد کند", () => {
    const invalidData = {
      code: "welcome10", // فقط حروف بزرگ، اعداد، - و _ مجاز است
      type: "percentage",
      value: 10,
    }
    expect(() => adminDiscountSchema.parse(invalidData)).toThrow()
  })
})