import { prisma } from '@/lib/prisma'
import type { Author, Book } from '@prisma/client'

export type AuthorWithBooks = Author & {
  books: (Book & {
    author: { id: string; slug: string; name: string }
    translator: { id: string; slug: string; name: string } | null
    category: { id: string; slug: string; name: string }
  })[]
  _count: { books: number }
}

export async function getAuthors(): Promise<AuthorWithBooks[]> {
  return prisma.author.findMany({
    include: {
      books: {
        where: { status: 'published' },
        include: {
          author: { select: { id: true, slug: true, name: true } },
          translator: { select: { id: true, slug: true, name: true } },
          category: { select: { id: true, slug: true, name: true } },
        },
        orderBy: { publishedAt: 'desc' },
      },
      _count: { select: { books: true } },
    },
    orderBy: { name: 'asc' },
  }) as Promise<AuthorWithBooks[]>
}

export async function getAuthorBySlug(slug: string): Promise<AuthorWithBooks | null> {
  return prisma.author.findUnique({
    where: { slug },
    include: {
      books: {
        where: { status: 'published' },
        include: {
          author: { select: { id: true, slug: true, name: true } },
          translator: { select: { id: true, slug: true, name: true } },
          category: { select: { id: true, slug: true, name: true } },
        },
        orderBy: { publishedAt: 'desc' },
      },
      _count: { select: { books: true } },
    },
  }) as Promise<AuthorWithBooks | null>
}