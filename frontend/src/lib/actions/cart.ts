"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getActiveCart, getSessionId } from "@/lib/cart-server"
import { cartItemSchema } from "@/lib/validations/cart"

function revalidateCart() {
  revalidatePath("/sabad-kharid")
  revalidatePath("/", "layout")
}

async function countFor(cartId: string): Promise<number> {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  })
  return cart ? cart.items.reduce((s, i) => s + i.quantity, 0) : 0
}

export async function addToCart(
  formData: FormData
): Promise<{ error?: string; count?: number }> {
  const parsed = cartItemSchema.safeParse({
    bookId: String(formData.get("bookId") ?? ""),
    quantity: String(formData.get("quantity") ?? "1"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const book = await prisma.book.findUnique({
    where: { id: parsed.data.bookId },
    select: { id: true, status: true, inStock: true },
  })
  if (!book) {
    return { error: "کتاب موردنظر پیدا نشد." }
  }
  if (book.status !== "published") {
    return { error: "این کتاب در حال حاضر قابل خرید نیست." }
  }
  if (!book.inStock) {
    return { error: "این کتاب فعلاً ناموجود است." }
  }

  const session = await auth()
  const cart = await getActiveCart(session?.user?.id ?? null)

  await prisma.cartItem.upsert({
    where: {
      cartId_bookId: { cartId: cart.id, bookId: parsed.data.bookId },
    },
    update: { quantity: { increment: parsed.data.quantity } },
    create: {
      cartId: cart.id,
      bookId: parsed.data.bookId,
      quantity: parsed.data.quantity,
    },
  })

  const count = await countFor(cart.id)
  revalidateCart()
  return { count }
}

export async function updateCartItemQuantity(
  itemId: string,
  newQuantity: number
): Promise<{ error?: string }> {
  if (!Number.isInteger(newQuantity) || newQuantity < 1) {
    return { error: "تعداد باید حداقل ۱ باشد." }
  }
  if (newQuantity > 99) {
    return { error: "حداکثر ۹۹ عدد از هر کتاب." }
  }

  const session = await auth()
  const cart = await getActiveCart(session?.user?.id ?? null)

  const result = await prisma.cartItem.updateMany({
    where: { id: itemId, cartId: cart.id },
    data: { quantity: newQuantity },
  })
  if (result.count === 0) {
    return { error: "آیتم موردنظر در سبد شما پیدا نشد." }
  }

  revalidateCart()
  return {}
}

export async function removeCartItem(itemId: string): Promise<{ error?: string }> {
  const session = await auth()
  const cart = await getActiveCart(session?.user?.id ?? null)

  const result = await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id },
  })
  if (result.count === 0) {
    return { error: "آیتم موردنظر در سبد شما پیدا نشد." }
  }

  revalidateCart()
  return {}
}

export async function getCartCount(): Promise<number> {
  const session = await auth()
  if (session?.user?.id) {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    })
    return cart ? cart.items.reduce((s, i) => s + i.quantity, 0) : 0
  }
  const sessionId = await getSessionId()
  if (!sessionId) return 0
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })
  return cart ? cart.items.reduce((s, i) => s + i.quantity, 0) : 0
}