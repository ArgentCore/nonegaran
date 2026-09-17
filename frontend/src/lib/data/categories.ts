import { prisma } from '@/lib/prisma'
import type { Category } from '@prisma/client'

export type CategoryWithCount = Category & {
  _count: { books: number }
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    include: {
      _count: { select: { books: true } },
    },
    orderBy: { name: 'asc' },
  }) as Promise<CategoryWithCount[]>
}