import { describe, it, expect } from "vitest"
import { bookSchema } from "../validations/book"
import { authorSchema } from "../validations/author"
import { categorySchema } from "../validations/category"

const validBook: Record<string, unknown> = {
  title: "تست",
  slug: "test",
  authorId: "a1",
  categoryId: "c1",
  sku: "S1",
  priceToman: "100000",
  bookSize: "raghi",
  coverTone: "petrol",
  status: "draft",
  inStock: "true",
  isPreorder: "false",
}

describe("bookSchema", () => {
  it("valid input passes", () => expect(bookSchema.safeParse(validBook).success).toBe(true))
  it("empty title fails", () => expect(bookSchema.safeParse({ ...validBook, title: "" }).success).toBe(false))
  it("huge price fails (int cap)", () => expect(bookSchema.safeParse({ ...validBook, priceToman: "99999999999" }).success).toBe(false))
  it("non-digit price fails", () => expect(bookSchema.safeParse({ ...validBook, priceToman: "abc" }).success).toBe(false))
  it("empty year is ok", () => expect(bookSchema.safeParse({ ...validBook, year: "" }).success).toBe(true))
})

describe("authorSchema", () => {
  it("valid", () => expect(authorSchema.safeParse({ name: "ن", slug: "n" }).success).toBe(true))
  it("empty name fails", () => expect(authorSchema.safeParse({ name: "", slug: "n" }).success).toBe(false))
})

describe("categorySchema", () => {
  it("empty slug fails", () => expect(categorySchema.safeParse({ name: "ن", slug: "" }).success).toBe(false))
})