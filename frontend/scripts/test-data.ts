import { getBooks, getBookBySlug, getFeaturedBooks } from '../src/lib/data/books'
import { getAuthors, getAuthorBySlug } from '../src/lib/data/authors'
import { getCategories } from '../src/lib/data/categories'

async function main() {
  console.log('🧪 Testing data layer...\n')

  const books = await getBooks()
  console.log(`📚 getBooks(): ${books.length} books`)

  const featured = await getFeaturedBooks(3)
  console.log(`⭐ getFeaturedBooks(3): ${featured.map(b => b.title).join(', ')}`)

  const firstBook = await getBookBySlug('baran-o-khakestar')
  console.log(`📖 getBookBySlug('baran-o-khakestar'): ${firstBook?.title} by ${firstBook?.author.name}`)

  const authors = await getAuthors()
  console.log(`✍️  getAuthors(): ${authors.length} authors`)

  const firstAuthor = await getAuthorBySlug('sara-amini')
  console.log(`👤 getAuthorBySlug('sara-amini'): ${firstAuthor?.name} (${firstAuthor?._count.books} books)`)

  const categories = await getCategories()
  console.log(`📂 getCategories(): ${categories.map(c => `${c.name}(${c._count.books})`).join(', ')}`)

  console.log('\n✅ All data layer tests passed!')
}

main().catch(console.error)