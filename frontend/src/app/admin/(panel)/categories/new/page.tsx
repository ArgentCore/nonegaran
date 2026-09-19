import CategoryForm from "@/components/admin/CategoryForm"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">افزودن دسته‌بندی</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          دسته‌بندی جدید برای کاتالوگ ثبت کنید
        </p>
      </header>

      <CategoryForm
        mode="create"
        initial={{ name: "", slug: "", description: "" }}
      />
    </div>
  )
}