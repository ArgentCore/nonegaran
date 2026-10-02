import { prisma } from "@/lib/prisma"
import { DiscountForm } from "@/components/admin/DiscountForm"
import { createDiscount } from "@/lib/actions/discount"

export const metadata = {
  title: "کد تخفیف جدید | پنل ادمین",
}

export default async function NewDiscountPage() {
  const users = await prisma.user.findMany({
    where: { role: "customer" },
    select: { id: true, email: true, name: true },
    orderBy: { email: "asc" },
  })

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl">کد تخفیف جدید</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        یک بلیط طلایی برای مشتریان خود بسازید
      </p>
      <div className="mt-8 rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
        <DiscountForm users={users} submitAction={createDiscount} />
      </div>
    </div>
  )
}