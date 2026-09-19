import { prisma } from '@/lib/prisma'
import { bookInclude, type BookWithRelations } from '../books'

export type AdminBook = BookWithRelations

export async function adminGetBooks(): Promise<AdminBook[]> {
  return prisma.book.findMany({
    include: bookInclude,
    orderBy: { createdAt: 'desc' },
  })
}

export async function adminGetBookById(id: string): Promise<AdminBook | null> {
  return prisma.book.findUnique({
    where: { id },
    include: bookInclude,
  })
}

export async function adminGetFormOptions() {
  const [authors, categories] = await Promise.all([
    prisma.author.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])
  return { authors, categories }
}