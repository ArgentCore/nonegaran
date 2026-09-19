import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const categoryInclude = {
  _count: { select: { books: true } },
} as const

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: typeof categoryInclude
}>

export async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    include: categoryInclude,
    orderBy: { name: 'asc' },
  })
}