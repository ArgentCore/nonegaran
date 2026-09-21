import { vi, describe, it, expect } from "vitest"
import type { CartWithItems } from "../cart-core"

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}))

const { cartTotal, cartCount } = await import("../cart-core")

function fakeCart(entries: Array<{ qty: number; price: number }>): CartWithItems {
  return {
    id: "cart-1",
    items: entries.map((e, i) => ({
      id: `item-${i}`,
      quantity: e.qty,
      book: { priceToman: e.price },
    })),
  } as unknown as CartWithItems
}

describe("cartTotal", () => {
  it("سبد خالی = 0", () => {
    expect(cartTotal(fakeCart([]))).toBe(0)
  })
  it("جمع price*quantity", () => {
    expect(cartTotal(fakeCart([{ qty: 2, price: 1000 }, { qty: 1, price: 500 }]))).toBe(2500)
  })
})

describe("cartCount", () => {
  it("سبد خالی = 0", () => {
    expect(cartCount(fakeCart([]))).toBe(0)
  })
  it("جمع تعدادها", () => {
    expect(cartCount(fakeCart([{ qty: 2, price: 1 }, { qty: 3, price: 1 }]))).toBe(5)
  })
})