import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const [booksCount, authorsCount, categoriesCount, usersCount] = await Promise.all([
    prisma.book.count(),
    prisma.author.count(),
    prisma.category.count(),
    prisma.user.count(),
  ])

  const stats = [
    { label: "کتاب‌ها", value: booksCount, href: "/admin/books" },
    { label: "نویسندگان", value: authorsCount, href: "/admin/authors" },
    { label: "دسته‌بندی‌ها", value: categoriesCount, href: "/admin/categories" },
    { label: "کاربران", value: usersCount, href: "#" },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">داشبورد</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          خلاصه‌ای از وضعیت نشر نونگاران
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6 transition-colors hover:border-[var(--link)]"
          >
            <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
            <p className="mt-2 font-display text-4xl">{stat.value}</p>
          </a>
        ))}
      </div>

      <section className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
        <h2 className="font-display text-xl mb-4">راهنمای سریع</h2>
        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
          <li>• برای افزودن کتاب جدید، به بخش «کتاب‌ها» بروید</li>
          <li>• برای مدیریت نویسندگان، به بخش «نویسندگان» بروید</li>
          <li>• برای ایجاد دسته‌بندی جدید، به بخش «دسته‌بندی‌ها» بروید</li>
        </ul>
      </section>
    </div>
  )
}