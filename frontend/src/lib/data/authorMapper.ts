import type { Author } from '@prisma/client'

export interface OldAuthor {
  slug: string
  name: string
  bio?: string
}

export function toOldAuthor(a: Author & { _count?: { books: number } }): OldAuthor {
  return {
    slug: a.slug,
    name: a.name,
    bio: a.bio ?? undefined,
  }
}

export function toOldAuthors(authors: (Author & { _count?: { books: number } })[]): OldAuthor[] {
  return authors.map(toOldAuthor)
}