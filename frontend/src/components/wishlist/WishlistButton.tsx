"use client"

import { useState, useTransition } from "react"
import { toggleWishlist } from "@/lib/actions/wishlist"
import { Heart } from "lucide-react"

interface WishlistButtonProps {
  bookId: string
  initialInWishlist: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

export function WishlistButton({
  bookId,
  initialInWishlist,
  className = "",
  size = "md",
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist)
  const [isPending, startTransition] = useTransition()

  const sizeClass =
    size === "sm" ? "h-8 w-8" : size === "md" ? "h-10 w-10" : "h-12 w-12"
  const iconSize =
    size === "sm" ? 16 : size === "md" ? 18 : 22

  function handleClick() {
    const formData = new FormData()
    formData.append("bookId", bookId)
    startTransition(async () => {
      const result = await toggleWishlist(formData)
      if (result.error) {
        alert(result.error)
      } else {
        setInWishlist(result.added)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={
        inWishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
      }
      className={`${sizeClass} flex items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-raised)] transition-all hover:scale-110 hover:border-[var(--color-clay)] disabled:opacity-60 ${className}`}
    >
      <Heart
        size={iconSize}
        className={`transition-colors ${
          inWishlist
            ? "fill-[var(--color-clay)] text-[var(--color-clay)]"
            : "text-[var(--text-muted)]"
        }`}
      />
    </button>
  )
}