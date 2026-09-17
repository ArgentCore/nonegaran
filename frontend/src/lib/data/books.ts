import { prisma } from '@/lib/prisma'
import type { Book, Prisma } from '@prisma/client'

export type BookWithRelations = Book & {
  author: { id: string; slug: string; name: string }
  translator: { id: string; slug: string; name: string } | null
  category: { id: string; slug: string; name: string }
}

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
    include: {
      author: { select: { id: true, slug: true, name: true } },
      translator: { select: { id: true, slug: true, name: true } },
      category: { select: { id: true, slug: true, name: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: filters?.take,
    skip: filters?.skip,
  }) as Promise<BookWithRelations[]>
}

export async function getBookBySlug(slug: string): Promise<BookWithRelations | null> {
  return prisma.book.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, slug: true, name: true } },
      translator: { select: { id: true, slug: true, name: true } },
      category: { select: { id: true, slug: true, name: true } },
    },
  }) as Promise<BookWithRelations | null>
}

export async function getFeaturedBooks(take = 4): Promise<BookWithRelations[]> {
  return getBooks({ status: 'published', take })
}