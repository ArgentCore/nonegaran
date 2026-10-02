import { describe, it, expect } from "vitest"
import { reviewSchema } from "@/lib/validations/reviews"

describe("Phase 6: Review Validations", () => {
  it("باید نظر معتبر با امتیاز ۱ تا ۵ را بپذیرد", () => {
    const validData = {
      rating: 5,
      title: "عالی بود",
      body: "کتاب بسیار خوبی بود و پیشنهاد می‌کنم.",
    }
    expect(() => reviewSchema.parse(validData)).not.toThrow()
  })

  it("باید امتیاز خارج از محدوده ۱ تا ۵ را رد کند", () => {
    const invalidData = {
      rating: 6, // نامعتبر
      body: "بد",
    }
    expect(() => reviewSchema.parse(invalidData)).toThrow()
  })

  it("باید متن نظر (body) بیش از ۱۰۰۰ کاراکتر را رد کند", () => {
    const invalidData = {
      rating: 4,
      body: "a".repeat(1001), // نامعتبر: بیش از حد مجاز
    }
    expect(() => reviewSchema.parse(invalidData)).toThrow()
  })
})