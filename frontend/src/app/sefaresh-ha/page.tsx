import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { getOrdersByUserId, orderStatusLabels } from "@/lib/data/orders"
import { OrderTimeline } from "@/components/orders/OrderTimeline"

export const metadata = {
  title: "سفارش‌های من | نونگاران",
  description: "تاریخچه سفارش‌ها و پیگیری وضعیت",
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/vorood")

  const orders = await getOrdersByUserId(session.user.id)

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl">سفارش‌های من</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {orders.length.toLocaleString("fa-IR")} سفارش
      </p>

      {orders.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius-control)] border border-dashed border-[var(--hairline)] p-12 text-center">
          <p className="text-[var(--text-muted)]">هنوز سفارشی ثبت نکرده‌اید.</p>
          <Link
            href="/ketabha"
            className="mt-4 inline-block rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2 text-sm text-[var(--background)] hover:opacity-90"
          >
            مشاهده کتاب‌ها
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6"
            >
              <div className="flex items-start justify-between border-b border-[var(--hairline)] pb-4">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">شماره سفارش</p>
                  <p className="font-mono text-lg">{order.id.slice(0, 8)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-[var(--text-muted)]">تاریخ</p>
                  <p>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="font-medium">اقلام سفارش</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {order.items.slice(0, 3).map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.book.title} × {item.quantity}</span>
                        <span className="tabular-nums">{item.subtotal.toLocaleString("fa-IR")} تومان</span>
                      </li>
                    ))}
                    {order.items.length > 3 && (
                      <li className="text-[var(--text-muted)]">
                        و {order.items.length - 3} مورد دیگر...
                      </li>
                    )}
                  </ul>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--hairline)] pt-3">
                    <span className="font-medium">جمع کل:</span>
                    <span className="font-display text-lg tabular-nums">
                      {order.totalAmount.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>

                <div className="w-64">
                  <h3 className="mb-3 font-medium">وضعیت سفارش</h3>
                  <OrderTimeline currentStatus={order.status} />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/sefaresh/${order.id}/receipt`}
                  className="rounded-[var(--radius-control)] border border-[var(--hairline)] px-4 py-2 text-sm hover:bg-[var(--background)]"
                >
                  چاپ رسید
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}