"use client"

import { useState } from "react"
import { ratingLabels } from "@/lib/validations/reviews"

interface StarRatingInputProps {
  name: string
  defaultValue?: number
  onChange?: (rating: number) => void
}

export function StarRatingInput({
  name,
  defaultValue = 0,
  onChange,
}: StarRatingInputProps) {
  const [rating, setRating] = useState(defaultValue)
  const [hover, setHover] = useState(0)

  function handleClick(value: number) {
    setRating(value)
    onChange?.(value)
  }

  const activeRating = hover || rating

  return (
    <div className="space-y-2">
      <div className="flex gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <svg
              className={`h-8 w-8 ${
                value <= activeRating
                  ? "fill-[var(--color-saffron)]"
                  : "fill-[var(--hairline)]"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <input type="hidden" name={name} value={rating} />
          </button>
        ))}
      </div>
      {activeRating > 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          {ratingLabels[activeRating]}
        </p>
      )}
    </div>
  )
}

interface StarRatingDisplayProps {
  rating: number
  size?: "sm" | "md" | "lg"
}

export function StarRatingDisplay({
  rating,
  size = "md",
}: StarRatingDisplayProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"

  return (
    <div className="flex gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((value) => (
        <svg
          key={value}
          className={`${sizeClass} ${
            value <= rating
              ? "fill-[var(--color-saffron)]"
              : "fill-[var(--hairline)]"
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}