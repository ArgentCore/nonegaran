import type { Book as OldBook } from '@/lib/types'
import type { BookWithRelations } from './books'

const sizeMapReverse: Record<string, OldBook['bookSize']> = {
  raghi: 'رقعی',
  vaziri: 'وزیری',
  jibi: 'جیبی',
  khashti: 'خشتی',
}

export function toOldBook(b: BookWithRelations): OldBook {
  return {
    slug: b.slug,
    title: b.title,
    author: b.author.name,
    authorSlug: b.author.slug,
    translator: b.translator?.name,
    yearFa: b.yearFa ?? '',
    year: b.year ?? 0,
    priceToman: b.priceToman,
    coverTone: (b.coverTone as OldBook['coverTone']) ?? 'petrol',
    coverImage: b.coverImage ?? undefined,
    category: b.category.name,
    categorySlug: b.category.slug,
    bookSize: sizeMapReverse[b.bookSize] ?? 'رقعی',
    inStock: b.inStock,
    isPreorder: b.isPreorder,
    description: b.description ?? undefined,
    excerpt: b.excerpt ?? undefined,
    isbn: b.isbn ?? undefined,
    sku: b.sku,
    pages: b.pages ?? undefined,
  }
}

export function toOldBooks(books: BookWithRelations[]): OldBook[] {
  return books.map(toOldBook)
}