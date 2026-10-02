import { describe, it, expect } from "vitest"
import { wishlistSchema } from "@/lib/validations/wishlist"

describe("Phase 8: Wishlist Validations", () => {
  it("باید bookId معتبر (UUID) را بپذیرد", () => {
    const validData = {
      bookId: "123e4567-e89b-12d3-a456-426614174000",
    }
    expect(() => wishlistSchema.parse(validData)).not.toThrow()
  })

  it("باید bookId نامعتبر را رد کند", () => {
    const invalidData = {
      bookId: "not-a-uuid",
    }
    expect(() => wishlistSchema.parse(invalidData)).toThrow()
  })
})