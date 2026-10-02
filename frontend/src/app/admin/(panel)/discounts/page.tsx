import Link from "next/link"
import { getAllDiscounts } from "@/lib/data/discounts"
import { DiscountTicket } from "@/components/admin/DiscountTicket"

export const metadata = {
  title: "کدهای تخفیف | پنل ادمین",
}

export default async function AdminDiscountsPage() {
  const discounts = await getAllDiscounts()

  const active = discounts.filter((d) => d.isActive).length
  const expired = discounts.filter(
    (d) => d.expiresAt && new Date(d.expiresAt) < new Date()
  ).length

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">کدهای تخفیف</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {discounts.length.toLocaleString("fa-IR")} کد · {active.toLocaleString("fa-IR")} فعال · {expired.toLocaleString("fa-IR")} منقضی
          </p>
        </div>
        <Link
          href="/admin/discounts/new"
          className="rounded-[var(--radius-control)] bg-[var(--foreground)] px-5 py-2.5 text-sm text-[var(--background)] hover:opacity-90"
        >
          + کد تخفیف جدید
        </Link>
      </div>

      {discounts.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius-control)] border border-dashed border-[var(--hairline)] p-12 text-center">
          <p className="text-[var(--text-muted)]">هنوز کد تخفیفی نساخته‌اید.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {discounts.map((d) => (
            <DiscountTicket key={d.id} discount={d} />
          ))}
        </div>
      )}
    </div>
  )
}