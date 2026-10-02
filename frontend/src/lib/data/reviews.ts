import { prisma } from "@/lib/prisma"
import type { Prisma, ReviewStatus } from "@prisma/client"

export const reviewInclude = {
  user: {
    select: { id: true, name: true, email: true },
  },
} as const

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude
}>

export const adminReviewInclude = {
  user: {
    select: { id: true, name: true, email: true },
  },
  book: {
    select: { id: true, title: true, slug: true },
  },
} as const

export type AdminReviewWithRefs = Prisma.ReviewGetPayload<{
  include: typeof adminReviewInclude
}>

export interface RatingSummary {
  average: number
  count: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}

export async function getApprovedReviewsForBook(
  bookId: string
): Promise<ReviewWithUser[]> {
  return prisma.review.findMany({
    where: { bookId, status: "approved" },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserReviewForBook(
  userId: string,
  bookId: string
): Promise<ReviewWithUser | null> {
  return prisma.review.findUnique({
    where: { bookId_userId: { bookId, userId } },
    include: reviewInclude,
  })
}

export async function getAllReviewsForAdmin(
  status?: ReviewStatus
): Promise<AdminReviewWithRefs[]> {
  return prisma.review.findMany({
    where: status ? { status } : undefined,
    include: adminReviewInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function getRatingSummary(bookId: string): Promise<RatingSummary> {
  const reviews = await prisma.review.findMany({
    where: { bookId, status: "approved" },
    select: { rating: true },
  })

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }
  let sum = 0

  for (const review of reviews) {
    distribution[review.rating as 1 | 2 | 3 | 4 | 5] += 1
    sum += review.rating
  }

  return {
    average: reviews.length
      ? Math.round((sum / reviews.length) * 10) / 10
      : 0,
    count: reviews.length,
    distribution,
  }
}

export async function hasPurchasedBook(
  userId: string,
  bookId: string
): Promise<boolean> {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: { in: ["paid", "processing", "shipped", "delivered"] },
      items: { some: { bookId } },
    },
    select: { id: true },
  })
  return order !== null
}