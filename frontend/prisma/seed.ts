import { PrismaClient, BookStatus, BookSize, CoverTone, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { allBooks } from '../src/data/books'

const prisma = new PrismaClient()

const sizeMap: Record<string, BookSize> = {
  'رقعی': BookSize.raghi,
  'وزیری': BookSize.vaziri,
  'جیبی': BookSize.jibi,
  'خشتی': BookSize.khashti,
}

const coverToneMap: Record<string, CoverTone> = {
  saffron: CoverTone.saffron,
  petrol: CoverTone.petrol,
  ink: CoverTone.ink,
  moss: CoverTone.moss,
  clay: CoverTone.clay,
}

function slugifyFa(name: string): string {
  return name.trim().replace(/\s+/g, '-').replace(/[؟?!.,،:؛"'()]/g, '')
}

async function main() {
  console.log('🌱 Seeding from src/data/books.ts (single source of truth)...')
  console.log(`   Source catalog: ${allBooks.length} books`)

  const authorMap = new Map<string, { slug: string; name: string }>()
  const categoryMap = new Map<string, { slug: string; name: string }>()

  for (const b of allBooks) {
    const aSlug = b.authorSlug ?? slugifyFa(b.author)
    authorMap.set(aSlug, { slug: aSlug, name: b.author })
    const cSlug = b.categorySlug ?? slugifyFa(b.category)
    categoryMap.set(cSlug, { slug: cSlug, name: b.category })
    if (b.translator) {
      const tSlug = slugifyFa(b.translator)
      authorMap.set(tSlug, { slug: tSlug, name: b.translator })
    }
  }

  for (const c of categoryMap.values()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    })
  }
  console.log(`✅ Upserted ${categoryMap.size} categories`)

  for (const a of authorMap.values()) {
    await prisma.author.upsert({
      where: { slug: a.slug },
      update: { name: a.name },
      create: { slug: a.slug, name: a.name },
    })
  }
  console.log(`✅ Upserted ${authorMap.size} authors (incl. translators)`)

  for (const b of allBooks) {
    const aSlug = b.authorSlug ?? slugifyFa(b.author)
    const cSlug = b.categorySlug ?? slugifyFa(b.category)
    const tSlug = b.translator ? slugifyFa(b.translator) : null

    await prisma.book.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        year: b.year,
        yearFa: b.yearFa,
        priceToman: b.priceToman,
        bookSize: sizeMap[b.bookSize] ?? BookSize.raghi,
        coverTone: coverToneMap[b.coverTone] ?? CoverTone.petrol,
        pages: b.pages ?? null,
        description: b.description ?? null,
        excerpt: b.excerpt ?? null,
        isbn: b.isbn ?? null,
        sku: b.sku ?? `SKU-${b.slug.toUpperCase()}`,
        inStock: b.inStock,
        isPreorder: b.isPreorder ?? false,
        status: BookStatus.published,
      },
      create: {
        slug: b.slug,
        title: b.title,
        author: { connect: { slug: aSlug } },
        translator: tSlug ? { connect: { slug: tSlug } } : undefined,
        category: { connect: { slug: cSlug } },
        year: b.year,
        yearFa: b.yearFa,
        priceToman: b.priceToman,
        bookSize: sizeMap[b.bookSize] ?? BookSize.raghi,
        coverTone: coverToneMap[b.coverTone] ?? CoverTone.petrol,
        pages: b.pages ?? null,
        description: b.description ?? null,
        excerpt: b.excerpt ?? null,
        isbn: b.isbn ?? null,
        sku: b.sku ?? `SKU-${b.slug.toUpperCase()}`,
        inStock: b.inStock,
        isPreorder: b.isPreorder ?? false,
        status: BookStatus.published,
        publishedAt: new Date(),
      },
    })
  }
  console.log(`✅ Upserted ${allBooks.length} books (exact match with src/data/books.ts)`)

  const passwordHash = await bcrypt.hash('admin123456', 10)
  await prisma.user.upsert({
    where: { email: 'admin@nonegaran.local' },
    update: {},
    create: {
      email: 'admin@nonegaran.local',
      passwordHash,
      role: UserRole.admin,
      name: 'مدیر نونگاران',
    },
  })
  console.log('✅ Admin user ensured')

  console.log('🎉 Seed completed from single source of truth!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })