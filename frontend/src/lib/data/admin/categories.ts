import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const adminCategoryInclude = {
  _count: { select: { books: true } },
} as const

export type AdminCategory = Prisma.CategoryGetPayload<{
  include: typeof adminCategoryInclude
}>

export async function adminGetCategories(): Promise<AdminCategory[]> {
  return prisma.category.findMany({
    include: adminCategoryInclude,
    orderBy: { name: 'asc' },
  })
}

export async function adminGetCategoryById(id: string): Promise<AdminCategory | null> {
  return prisma.category.findUnique({
    where: { id },
    include: adminCategoryInclude,
  })
}