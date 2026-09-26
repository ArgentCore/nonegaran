"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { checkoutSchema } from "@/lib/validations/order"
import { getActiveCart } from "@/lib/cart-server"

export async function createOrder(formData: FormData) {
  const parsed = checkoutSchema.safeParse({
    contactEmail: String(formData.get("contactEmail") ?? ""),
    saveAddress: formData.get("saveAddress") === "on",
    shippingAddress: {
      recipientName: String(formData.get("recipientName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      province: String(formData.get("province") ?? ""),
      city: String(formData.get("city") ?? ""),
      addressLine: String(formData.get("addressLine") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
    },
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const session = await auth()
  const cart = await getActiveCart(session?.user?.id ?? null)

  if (cart.items.length === 0) {
    return { error: "سبد خرید شما خالی است." }
  }

  const bookIds = cart.items.map((item) => item.bookId)
  const books = await prisma.book.findMany({
    where: { id: { in: bookIds } },
    select: { id: true, title: true, priceToman: true, inStock: true, status: true },
  })

  const booksMap = new Map(books.map((b) => [b.id, b]))
  const orderItems: Array<{ bookId: string; quantity: number; unitPrice: number; subtotal: number }> = []
  let totalAmount = 0

  for (const item of cart.items) {
    const book = booksMap.get(item.bookId)
    if (!book) {
      return { error: `کتاب "${item.book.title}" دیگر موجود نیست.` }
    }
    if (book.status !== "published") {
      return { error: `کتاب "${book.title}" دیگر قابل خرید نیست.` }
    }
    if (!book.inStock) {
      return { error: `کتاب "${book.title}" ناموجود است.` }
    }
    const subtotal = book.priceToman * item.quantity
    orderItems.push({
      bookId: book.id,
      quantity: item.quantity,
      unitPrice: book.priceToman,
      subtotal,
    })
    totalAmount += subtotal
  }

  let userId = session?.user?.id

  if (!userId) {
    const guest = await getOrCreateGuestUser(parsed.data.contactEmail)
    userId = guest.id
  }

  let orderId = ""

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        status: "pending",
        totalAmount,
        paymentMethod: "mock",
        shippingAddress: parsed.data.shippingAddress,
        items: { create: orderItems },
      },
    })
    orderId = order.id

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    if (parsed.data.saveAddress) {
      await saveUserAddress(userId, parsed.data.shippingAddress)
    }
  } catch {
    return { error: "خطایی در ثبت سفارش رخ داد. دوباره تلاش کنید." }
  }

  revalidatePath("/")
  revalidatePath("/sefaresh-ha")
  redirect(`/sefaresh/thank-you/${orderId}`)
}

async function getOrCreateGuestUser(email: string) {
  const normalized = email.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email: normalized } })
  if (existing) return existing
  return prisma.user.create({
    data: {
      email: normalized,
      passwordHash: "!unactivated",
      role: "customer",
      name: "مهمان",
    },
  })
}

async function saveUserAddress(userId: string, address: object) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const existing = (user?.savedAddresses as object[] | null) ?? []
  const isDuplicate = existing.some((a) => JSON.stringify(a) === JSON.stringify(address))
  if (isDuplicate) return
  await prisma.user.update({
    where: { id: userId },
    data: { savedAddresses: [...existing, address] },
  })
}

export async function getSavedAddresses(): Promise<object[]> {
  const session = await auth()
  if (!session?.user?.id) return []
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  return (user?.savedAddresses as object[]) ?? []
}