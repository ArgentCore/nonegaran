import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { bookInclude, type BookWithRelations } from './books'

export const authorInclude = {
  books: {
    where: { status: 'published' },
    include: bookInclude,
    orderBy: { publishedAt: 'desc' },
  },
  translations: {
    where: { status: 'published' },
    include: bookInclude,
    orderBy: { publishedAt: 'desc' },
  },
  _count: { select: { books: true, translations: true } },
} as const

export type AuthorWithBooks = Prisma.AuthorGetPayload<{
  include: typeof authorInclude
}>

export async function getAuthors(): Promise<AuthorWithBooks[]> {
  return prisma.author.findMany({
    include: authorInclude,
    orderBy: { name: 'asc' },
  })
}

export async function getAuthorBySlug(slug: string): Promise<AuthorWithBooks | null> {
  return prisma.author.findUnique({
    where: { slug },
    include: authorInclude,
  })
}

export function authorWorks(author: AuthorWithBooks): BookWithRelations[] {
  return [...author.books, ...author.translations]
}

export function authorWorksCount(author: AuthorWithBooks): number {
  return author.books.length + author.translations.length
}