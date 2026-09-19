import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const bookInclude = {
  author: { select: { id: true, slug: true, name: true } },
  translator: { select: { id: true, slug: true, name: true } },
  category: { select: { id: true, slug: true, name: true } },
} as const

export type BookWithRelations = Prisma.BookGetPayload<{
  include: typeof bookInclude
}>

export async function getBooks(filters?: {
  categorySlug?: string
  authorSlug?: string
  status?: 'published' | 'out_of_stock'
  take?: number
  skip?: number
}): Promise<BookWithRelations[]> {
  const where: Prisma.BookWhereInput = {
    status: filters?.status ?? 'published',
  }

  if (filters?.categorySlug) {
    where.category = { slug: filters.categorySlug }
  }

  if (filters?.authorSlug) {
    where.author = { slug: filters.authorSlug }
  }

  return prisma.book.findMany({
    where,
    include: bookInclude,
    orderBy: { publishedAt: 'desc' },
    take: filters?.take,
    skip: filters?.skip,
  })
}

export async function getBookBySlug(slug: string): Promise<BookWithRelations | null> {
  return prisma.book.findUnique({
    where: { slug },
    include: bookInclude,
  })
}

export async function getFeaturedBooks(take = 4): Promise<BookWithRelations[]> {
  return getBooks({ status: 'published', take })
}