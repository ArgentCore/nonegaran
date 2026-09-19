import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const adminAuthorInclude = {
  _count: { select: { books: true, translations: true } },
} as const

export type AdminAuthor = Prisma.AuthorGetPayload<{
  include: typeof adminAuthorInclude
}>

export async function adminGetAuthors(): Promise<AdminAuthor[]> {
  return prisma.author.findMany({
    include: adminAuthorInclude,
    orderBy: { name: 'asc' },
  })
}

export async function adminGetAuthorById(id: string): Promise<AdminAuthor | null> {
  return prisma.author.findUnique({
    where: { id },
    include: adminAuthorInclude,
  })
}