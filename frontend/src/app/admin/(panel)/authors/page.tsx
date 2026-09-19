import Link from "next/link"
import { adminGetAuthors } from "@/lib/data/admin/authors"
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton"
import { deleteAuthor } from "@/lib/actions/authors"

export default async function AdminAuthorsPage() {
  const authors = await adminGetAuthors()

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">نویسندگان</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{authors.length} نفر</p>
        </div>
        <Link
          href="/admin/authors/new"
          className="rounded-[var(--radius-control)] bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] hover:opacity-90"
        >
          افزودن نویسنده
        </Link>
      </header>

      <div className="overflow-x-auto rounded-[var(--radius-control)] border border-[var(--hairline)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-raised)] text-right">
            <tr>
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">اسلاگ</th>
              <th className="px-4 py-3 font-medium">آثار</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]">
            {authors.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{a.slug}</td>
                <td className="px-4 py-3 ltr-run">{a._count.books + a._count.translations}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/authors/${a.id}/edit`}
                      className="rounded border border-[var(--hairline)] px-3 py-1 text-xs hover:bg-[var(--surface-raised)]"
                    >
                      ویرایش
                    </Link>
                    <AdminDeleteButton id={a.id} title={a.name} onDelete={deleteAuthor} />
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