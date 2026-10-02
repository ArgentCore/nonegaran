import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getDiscountById } from "@/lib/data/discounts"
import { DiscountForm } from "@/components/admin/DiscountForm"
import { updateDiscount } from "@/lib/actions/discount"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditDiscountPage({ params }: PageProps) {
  const { id } = await params
  const discount = await getDiscountById(id)
  if (!discount) notFound()

  const users = await prisma.user.findMany({
    where: { role: "customer" },
    select: { id: true, email: true, name: true },
    orderBy: { email: "asc" },
  })

  const boundUpdate = updateDiscount.bind(null, id)

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl">
        ویرایش <span className="font-mono">{discount.code}</span>
      </h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {discount.usageCount.toLocaleString("fa-IR")} بار استفاده شده
      </p>
      <div className="mt-8 rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
        <DiscountForm
          initial={discount}
          users={users}
          submitAction={boundUpdate}
        />
      </div>
    </div>
  )
}