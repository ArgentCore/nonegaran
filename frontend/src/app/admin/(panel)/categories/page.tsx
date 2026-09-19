import Link from "next/link"
import { adminGetCategories } from "@/lib/data/admin/categories"
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton"
import { deleteCategory } from "@/lib/actions/categories"

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories()

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">دسته‌بندی‌ها</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{categories.length} دسته</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-[var(--radius-control)] bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] hover:opacity-90"
        >
          افزودن دسته‌بندی
        </Link>
      </header>

      <div className="overflow-x-auto rounded-[var(--radius-control)] border border-[var(--hairline)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-raised)] text-right">
            <tr>
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">اسلاگ</th>
              <th className="px-4 py-3 font-medium">کتاب‌ها</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{c.slug}</td>
                <td className="px-4 py-3 ltr-run">{c._count.books}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="rounded border border-[var(--hairline)] px-3 py-1 text-xs hover:bg-[var(--surface-raised)]"
                    >
                      ویرایش
                    </Link>
                    <AdminDeleteButton id={c.id} title={c.name} onDelete={deleteCategory} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}