"use client"

import type { CartWithItems } from "@/lib/cart-core"
import { cartTotal } from "@/lib/cart-core"
import type { ShippingAddress } from "@/lib/validations/order"

interface ReviewStepProps {
  cart: CartWithItems
  address: ShippingAddress
  contactEmail: string
  saveAddress: boolean
  onBack: () => void
  onConfirm: () => void
}

export function ReviewStep({ cart, address, contactEmail, saveAddress, onBack, onConfirm }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-control)] border border-[var(--hairline)] p-4">
        <h3 className="font-display text-lg">آدرس تحویل</h3>
        <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
          <p><strong>{address.recipientName}</strong> — {address.phone}</p>
          <p>{address.province}، {address.city}</p>
          <p>{address.addressLine}</p>
          <p>کد پستی: {address.postalCode}</p>
          <p className="ltr-run">{contactEmail}</p>
          {saveAddress && <p className="text-[var(--color-moss)]">✓ این آدرس ذخیره خواهد شد</p>}
        </div>
      </section>

      <section className="rounded-[var(--radius-control)] border border-[var(--hairline)] p-4">
        <h3 className="font-display text-lg">اقلام سفارش</h3>
        <ul className="mt-3 divide-y divide-[var(--hairline)]">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <span>{item.book.title} × {item.quantity}</span>
              <span className="tabular-nums">{(item.book.priceToman * item.quantity).toLocaleString("fa-IR")} تومان</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--hairline)] pt-4">
          <span className="font-medium">جمع کل:</span>
          <span className="font-display text-xl tabular-nums">
            {cartTotal(cart).toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-[var(--radius-control)] border border-[var(--hairline)] px-6 py-3 hover:bg-[var(--surface-raised)]"
        >
          بازگشت به آدرس
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-[var(--background)] hover:opacity-90"
        >
          ثبت نهایی سفارش
        </button>
      </div>
    </div>
  )
}