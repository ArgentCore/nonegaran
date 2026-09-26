import { notFound } from "next/navigation"
import Link from "next/link"
import { getOrderById } from "@/lib/data/orders"
import { auth } from "@/auth"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ThankYouPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const order = await getOrderById(id)

  if (!order) notFound()
  if (session?.user?.id && order.userId !== session.user.id) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-moss)]">
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display text-4xl">سفارش شما ثبت شد!</h1>
      <p className="mt-4 text-[var(--text-muted)]">
        شماره سفارش: <span className="font-mono text-[var(--foreground)]">{order.id.slice(0, 8)}</span>
      </p>

      <div className="mt-8 rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6 text-right">
        <div className="flex justify-between border-b border-[var(--hairline)] pb-3">
          <span>مبلغ کل:</span>
          <span className="font-display text-2xl tabular-nums">
            {order.totalAmount.toLocaleString("fa-IR")} تومان
          </span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.book.title} × {item.quantity}</span>
              <span className="tabular-nums">{item.subtotal.toLocaleString("fa-IR")} تومان</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/sefaresh/${order.id}/receipt`}
          className="flex-1 rounded-[var(--radius-control)] border border-[var(--hairline)] px-6 py-3 text-center hover:bg-[var(--surface-raised)]"
        >
          چاپ رسید
        </Link>
        <Link
          href="/sefaresh-ha"
          className="flex-1 rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-center text-[var(--background)] hover:opacity-90"
        >
          مشاهده سفارش‌ها
        </Link>
      </div>
    </div>
  )
}