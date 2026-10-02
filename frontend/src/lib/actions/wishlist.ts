"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { wishlistSchema } from "@/lib/validations/wishlist"
import { getUsersWishlistingBook } from "@/lib/data/wishlist"
import { sendTransactionalEmail } from "@/lib/email-sender"

export async function toggleWishlist(
  formData: FormData
): Promise<{ added: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { added: false, error: "برای افزودن به علاقه‌مندی‌ها باید وارد شوید." }
  }

  const parsed = wishlistSchema.safeParse({
    bookId: formData.get("bookId"),
  })

  if (!parsed.success) {
    return { added: false, error: parsed.error.issues[0].message }
  }

  const { bookId } = parsed.data
  const userId = session.user.id

  const existing = await prisma.wishlist.findUnique({
    where: { userId_bookId: { userId, bookId } },
  })

  if (existing) {
    await prisma.wishlist.delete({
      where: { id: existing.id },
    })
    revalidatePath("/alaghe-mandi-ha")
    return { added: false }
  }

  await prisma.wishlist.create({
    data: { userId, bookId },
  })

  revalidatePath("/alaghe-mandi-ha")
  revalidatePath(`/ketab/[slug]`, "page")
  return { added: true }
}

export async function notifyBackInStock(bookId: string): Promise<number> {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true, title: true, slug: true, priceToman: true },
  })
  if (!book) return 0

  const users = await getUsersWishlistingBook(bookId)
  let sentCount = 0

  for (const user of users) {
    const result = await sendTransactionalEmail({
      template: "back-in-stock",
      to: user.email,
      data: {
        customerName: user.name || "مشتری عزیز",
        bookTitle: book.title,
        bookUrl: `/ketab/${book.slug}`,
        price: book.priceToman.toLocaleString("fa-IR"),
      },
    })
    if (result.status === "sent") sentCount++
  }

  return sentCount
}