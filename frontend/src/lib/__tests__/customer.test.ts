import { describe, it, expect } from "vitest"
import { customerRegisterSchema } from "../validations/customer"

const base = {
  name: "تست",
  email: "user@example.com",
  password: "password123",
  passwordConfirm: "password123",
}

describe("customerRegisterSchema", () => {
  it("ورودی معتبر قبول می‌شود", () => {
    expect(customerRegisterSchema.safeParse(base).success).toBe(true)
  })
  it("رمز کوتاه رد می‌شود", () => {
    expect(customerRegisterSchema.safeParse({ ...base, password: "123", passwordConfirm: "123" }).success).toBe(false)
  })
  it("عدم تطابق تکرار رمز رد می‌شود", () => {
    expect(customerRegisterSchema.safeParse({ ...base, passwordConfirm: "different" }).success).toBe(false)
  })
  it("ایمیل نامعتبر رد می‌شود", () => {
    expect(customerRegisterSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false)
  })
})