import Link from "next/link"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login")
  }

  const pendingOrdersCount = await prisma.order.count({
    where: { status: "pending" },
  })

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <aside className="w-64 border-l border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl">پنل مدیریت</h1>
          <p className="text-sm text-[var(--text-muted)]">نونگاران — نشر کتاب</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block rounded-[var(--radius-control)] px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
          >
            داشبورد
          </Link>
          <Link
            href="/admin/books"
            className="block rounded-[var(--radius-control)] px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
          >
            کتاب‌ها
          </Link>
          <Link
            href="/admin/authors"
            className="block rounded-[var(--radius-control)] px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
          >
            نویسندگان
          </Link>
          <Link
            href="/admin/categories"
            className="block rounded-[var(--radius-control)] px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
          >
            دسته‌بندی‌ها
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center justify-between rounded-[var(--radius-control)] px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
          >
            سفارش‌ها
            {pendingOrdersCount > 0 && (
              <span className="rounded-full bg-[var(--color-saffron)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-ink)] tabular-nums">
                {pendingOrdersCount.toLocaleString("fa-IR")}
              </span>
            )}
          </Link>
        </nav>

        <div className="mt-8 border-t border-[var(--hairline)] pt-4">
          <p className="text-xs text-[var(--text-muted)] mb-2">
            {session.user?.email}
          </p>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/admin/login" })
            }}
          >
            <button
              type="submit"
              className="w-full rounded-[var(--radius-control)] border border-[var(--hairline)] px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
            >
              خروج
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}