import { notFound } from "next/navigation"
import CategoryForm from "@/components/admin/CategoryForm"
import { adminGetCategoryById } from "@/lib/data/admin/categories"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const category = await adminGetCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">ویرایش دسته‌بندی</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{category.name}</p>
      </header>

      <CategoryForm
        mode="edit"
        categoryId={category.id}
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
        }}
      />
    </div>
  )
}