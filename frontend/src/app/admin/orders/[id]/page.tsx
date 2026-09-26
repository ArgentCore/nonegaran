import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { getOrderByIdForAdmin, orderStatusLabels } from "@/lib/data/orders"
import { OrderTimeline } from "@/components/orders/OrderTimeline"
import { updateOrderStatus } from "@/lib/actions/admin-order"
import type { ShippingAddress } from "@/lib/validations/order"
import type { OrderStatus } from "@prisma/client"

interface PageProps {
  params: Promise<{ id: string }>
}

const allStatuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/")

  const order = await getOrderByIdForAdmin(id)
  if (!order) notFound()

  const address = order.shippingAddress as ShippingAddress

  async function handleStatusChange(formData: FormData) {
    "use server"
    await updateOrderStatus(id, String(formData.get("status") ?? ""))
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link href="/admin/orders" className="text-sm text-[var(--link)] hover:underline">
        ← بازگشت به لیست سفارش‌ها
      </Link>

      <h1 className="mt-4 font-display text-3xl">سفارش {order.id.slice(0, 8)}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
            <h2 className="font-display text-lg">اطلاعات مشتری</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>ایمیل:</dt>
                <dd className="ltr-run">{order.user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt>نام:</dt>
                <dd>{order.user.name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>تاریخ سفارش:</dt>
                <dd>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
            <h2 className="font-display text-lg">آدرس تحویل</h2>
            <div className="mt-4 text-sm leading-7">
              <p><strong>{address.recipientName}</strong></p>
              <p className="ltr-run">{address.phone}</p>
              <p>{address.province}، {address.city}</p>
              <p>{address.addressLine}</p>
              <p>کد پستی: {address.postalCode}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
          <h2 className="font-display text-lg">وضعیت سفارش</h2>
          <div className="mt-4">
            <OrderTimeline currentStatus={order.status} />
          </div>
          <form action={handleStatusChange} className="mt-6 space-y-3">
            <label htmlFor="status" className="block text-sm font-medium">تغییر وضعیت:</label>
            <select
              id="status"
              key={order.status}
              name="status"
              defaultValue={order.status}
              className="block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {orderStatusLabels[s]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2 text-[var(--background)] hover:opacity-90"
            >
              به‌روزرسانی وضعیت
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
        <h2 className="font-display text-lg">اقلام سفارش</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hairline)]">
              <th className="py-2 text-right">کتاب</th>
              <th className="py-2 text-center">تعداد</th>
              <th className="py-2 text-right">قیمت واحد</th>
              <th className="py-2 text-right">جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--hairline)]">
                <td className="py-3">{item.book.title}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right tabular-nums">{item.unitPrice.toLocaleString("fa-IR")}</td>
                <td className="py-3 text-right tabular-nums">{item.subtotal.toLocaleString("fa-IR")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--foreground)]">
              <td colSpan={3} className="py-4 text-right font-medium">جمع کل:</td>
              <td className="py-4 text-right font-display text-xl tabular-nums">
                {order.totalAmount.toLocaleString("fa-IR")} تومان
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}