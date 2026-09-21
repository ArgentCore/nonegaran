"use client"

import { useTransition, useState } from "react"
import Link from "next/link"
import { updateCartItemQuantity, removeCartItem } from "@/lib/actions/cart"
import type { CartWithItems } from "@/lib/cart-core"
import { cartTotal } from "@/lib/cart-core"

interface CartItemListProps {
  cart: CartWithItems
}

function formatToman(n: number): string {
  return n.toLocaleString("fa-IR")
}

export function CartItemList({ cart }: CartItemListProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function notify() {
    window.dispatchEvent(new Event("cart-updated"))
  }

  async function handleUpdate(itemId: string, newQuantity: number) {
    setPendingId(itemId)
    startTransition(async () => {
      await updateCartItemQuantity(itemId, newQuantity)
      notify()
      setPendingId(null)
    })
  }

  async function handleRemove(itemId: string) {
    if (!confirm("این آیتم از سبد حذف شود؟")) return
    setPendingId(itemId)
    startTransition(async () => {
      await removeCartItem(itemId)
      notify()
      setPendingId(null)
    })
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-[var(--radius-control)] border border-dashed border-[var(--hairline)] p-12 text-center">
        <p className="text-[var(--text-muted)]">سبد خرید شما خالی است.</p>
        <Link
          href="/ketabha"
          className="mt-4 inline-block rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2 text-sm text-[var(--background)] hover:opacity-90"
        >
          مشاهده کتاب‌ها
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-[var(--hairline)] rounded-[var(--radius-control)] border border-[var(--hairline)]">
        {cart.items.map((item) => {
          const busy = pendingId === item.id || isPending
          return (
            <li key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <Link
                  href={`/ketab/${item.book.slug}`}
                  className="font-medium hover:text-[var(--link)]"
                >
                  {item.book.title}
                </Link>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {formatToman(item.book.priceToman)} تومان
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdate(item.id, Math.max(1, item.quantity - 1))}
                  disabled={busy || item.quantity <= 1}
                  className="h-8 w-8 rounded border border-[var(--hairline)] disabled:opacity-40"
                  aria-label="کاهش تعداد"
                >
                  −
                </button>
                <span className="w-8 text-center tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => handleUpdate(item.id, item.quantity + 1)}
                  disabled={busy || item.quantity >= 99}
                  className="h-8 w-8 rounded border border-[var(--hairline)] disabled:opacity-40"
                  aria-label="افزایش تعداد"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={busy}
                  className="mr-2 text-xs text-[var(--color-clay)] hover:underline disabled:opacity-40"
                >
                  حذف
                </button>
              </div>

              <div className="w-28 text-left tabular-nums sm:text-right">
                {formatToman(item.book.priceToman * item.quantity)} تومان
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center justify-between rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-4">
        <span className="text-sm">جمع کل:</span>
        <span className="font-display text-2xl tabular-nums">
          {formatToman(cartTotal(cart))} تومان
        </span>
      </div>

      <Link
        href="/checkout"
        className="block w-full rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-center text-[var(--background)] transition-opacity hover:opacity-90"
      >
        ادامه و پرداخت
      </Link>
    </div>
  )
}