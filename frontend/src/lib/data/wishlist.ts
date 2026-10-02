import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const wishlistInclude = {
  book: {
    select: {
      id: true,
      slug: true,
      title: true,
      priceToman: true,
      inStock: true,
      status: true,
      coverImage: true,
      author: { select: { name: true } },
    },
  },
} as const

export type WishlistWithBook = Prisma.WishlistGetPayload<{
  include: typeof wishlistInclude
}>

export async function getWishlistForUser(
  userId: string
): Promise<WishlistWithBook[]> {
  return prisma.wishlist.findMany({
    where: { userId },
    include: wishlistInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function isBookInWishlist(
  userId: string,
  bookId: string
): Promise<boolean> {
  const count = await prisma.wishlist.count({
    where: { userId, bookId },
  })
  return count > 0
}

export async function getWishlistCount(userId: string): Promise<number> {
  return prisma.wishlist.count({ where: { userId } })
}

export async function getUsersWishlistingBook(
  bookId: string
): Promise<{ userId: string; email: string; name: string | null }[]> {
  const wishlists = await prisma.wishlist.findMany({
    where: { bookId },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  })
  return wishlists.map((w) => ({
    userId: w.user.id,
    email: w.user.email,
    name: w.user.name,
  }))
}

export async function removeFromWishlist(
  userId: string,
  bookId: string
): Promise<void> {
  await prisma.wishlist.delete({
    where: { userId_bookId: { userId, bookId } },
  })
}