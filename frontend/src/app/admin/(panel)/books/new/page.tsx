import BookForm from "@/components/admin/BookForm"
import { adminGetFormOptions } from "@/lib/data/admin/books"

export default async function NewBookPage() {
  const { authors, categories } = await adminGetFormOptions()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">افزودن کتاب</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          کتاب جدید به کاتالوگ نونگاران اضافه کنید
        </p>
      </header>

      <BookForm
        mode="create"
        authors={authors}
        categories={categories}
        initial={{
          title: "",
          slug: "",
          authorId: "",
          translatorId: "",
          categoryId: "",
          description: "",
          excerpt: "",
          isbn: "",
          sku: "",
          year: "",
          yearFa: "",
          pages: "",
          priceToman: "",
          bookSize: "raghi",
          coverTone: "petrol",
          status: "draft",
          inStock: "true",
          isPreorder: "false",
        }}
      />
    </div>
  )
}