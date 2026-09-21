"use client"

import { useTransition, useState } from "react"
import { addToCart } from "@/lib/actions/cart"

interface AddToCartButtonProps {
  bookId: string
  className?: string
  label?: string
}

export function AddToCartButton({
  bookId,
  className = "",
  label = "افزودن به سبد",
}: AddToCartButtonProps) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  function handleClick() {
    setMessage(null)
    const formData = new FormData()
    formData.append("bookId", bookId)
    formData.append("quantity", "1")

    startTransition(async () => {
      const result = await addToCart(formData)
      if (result.error) {
        setMessage({ type: "err", text: result.error })
      } else {
        setMessage({
          type: "ok",
          text: `به سبد اضافه شد (${(result.count ?? 0).toLocaleString("fa-IR")} آیتم)`,
        })
        window.dispatchEvent(new Event("cart-updated"))
        setTimeout(() => setMessage(null), 2500)
      }
    })
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={pending}
        className={`rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2.5 text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50 ${className}`}
      >
        {pending ? "در حال افزودن..." : label}
      </button>
      {message && (
        <p
          className={`text-xs ${
            message.type === "ok" ? "text-green-700" : "text-[var(--color-clay)]"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}