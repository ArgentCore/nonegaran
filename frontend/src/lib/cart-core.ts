import type { Prisma } from "@prisma/client"

export const cartInclude = {
  items: {
    include: {
      book: {
        select: {
          id: true,
          title: true,
          slug: true,
          priceToman: true,
          coverTone: true,
          inStock: true,
        },
      },
    },
    orderBy: { addedAt: "desc" as const },
  },
} as const

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartInclude
}>

export function cartTotal(cart: CartWithItems): number {
  return cart.items.reduce((sum, item) => sum + item.book.priceToman * item.quantity, 0)
}

export function cartCount(cart: CartWithItems): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}