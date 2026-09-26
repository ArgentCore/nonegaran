import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { cartInclude, type CartWithItems } from "./cart-core"

export type { CartWithItems }
export { cartInclude }

const COOKIE_NAME = "cart_session_id"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
}

function emptyCart(): CartWithItems {
  return { id: "", items: [] } as CartWithItems
}

async function getOrCreateGuestCart(): Promise<CartWithItems> {
  let sessionId = await getSessionId()
  if (!sessionId) {
    sessionId = globalThis.crypto.randomUUID()
    await setSessionCookie(sessionId)
  }
  return prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
    include: cartInclude,
  })
}

async function getOrCreateUserCart(userId: string): Promise<CartWithItems> {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  })
}

export async function getActiveCart(userId?: string | null): Promise<CartWithItems> {
  if (userId) {
    return getOrCreateUserCart(userId)
  }
  return getOrCreateGuestCart()
}

export async function getActiveCartForRender(userId?: string | null): Promise<CartWithItems> {
  if (userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    })
    return cart ?? emptyCart()
  }
  const sessionId = await getSessionId()
  if (!sessionId) return emptyCart()
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: cartInclude,
  })
  return cart ?? emptyCart()
}

export async function mergeGuestCartToUser(userId: string): Promise<void> {
  const sessionId = await getSessionId()
  if (!sessionId) return

  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })
  if (!guestCart || guestCart.items.length === 0) return

  const userCart = await getOrCreateUserCart(userId)

  for (const guestItem of guestCart.items) {
    await prisma.cartItem.upsert({
      where: {
        cartId_bookId: { cartId: userCart.id, bookId: guestItem.bookId },
      },
      update: { quantity: { increment: guestItem.quantity } },
      create: {
        cartId: userCart.id,
        bookId: guestItem.bookId,
        quantity: guestItem.quantity,
      },
    })
  }

  await prisma.cart.delete({ where: { id: guestCart.id } })
}