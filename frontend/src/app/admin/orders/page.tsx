import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { getAllOrdersForAdmin, orderStatusLabels } from "@/lib/data/orders"

export const metadata = {
  title: "مدیریت سفارش‌ها | پنل ادمین",
}

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/")

  const orders = await getAllOrdersForAdmin()

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-display text-3xl">مدیریت سفارش‌ها</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {orders.length.toLocaleString("fa-IR")} سفارش
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hairline)] text-right">
              <th className="py-3 font-medium">شماره</th>
              <th className="py-3 font-medium">مشتری</th>
              <th className="py-3 font-medium">تاریخ</th>
              <th className="py-3 font-medium">مبلغ</th>
              <th className="py-3 font-medium">وضعیت</th>
              <th className="py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--hairline)]">
                <td className="py-4 font-mono">{order.id.slice(0, 8)}</td>
                <td className="py-4">
                  <div>
                    <p className="font-medium">{order.user.name || order.user.email}</p>
                    <p className="text-xs text-[var(--text-muted)] ltr-run">{order.user.email}</p>
                  </div>
                </td>
                <td className="py-4">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>
                <td className="py-4 tabular-nums">{order.totalAmount.toLocaleString("fa-IR")} تومان</td>
                <td className="py-4">
                  <span className="rounded-full bg-[var(--surface-raised)] px-3 py-1 text-xs">
                    {orderStatusLabels[order.status]}
                  </span>
                </td>
                <td className="py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-[var(--link)] hover:underline"
                  >
                    مشاهده
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}