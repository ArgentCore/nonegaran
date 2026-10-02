"use client"

import { useState, useTransition } from "react"
import { createReview } from "@/lib/actions/reviews"
import { StarRatingInput } from "./StarRating"

interface ReviewFormProps {
  bookId: string
  onSuccess?: () => void
}

export function ReviewForm({ bookId, onSuccess }: ReviewFormProps) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError("")
    startTransition(async () => {
      const result = await createReview(bookId, formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
        onSuccess?.()
      }
    })
  }

  if (success) {
    return (
      <div className="rounded-[var(--radius-control)] border border-[var(--color-moss)] bg-[var(--color-moss)]/10 p-4 text-center">
        <p className="text-[var(--color-moss)]">
          ✓ نظر شما ثبت شد و پس از تأیید نمایش داده خواهد شد.
        </p>
      </div>
    )
  }

  const inputClass =
    "mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded border border-[var(--color-clay)]/30 bg-[var(--color-clay)]/10 p-3 text-sm text-[var(--color-clay)]">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">امتیاز شما</label>
        <div className="mt-2">
          <StarRatingInput name="rating" />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          عنوان (اختیاری)
        </label>
        <input
          id="title"
          name="title"
          maxLength={80}
          className={inputClass}
          placeholder="مثلاً: کتابی که زندگی‌ام را تغییر داد"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium">
          متن نظر (اختیاری)
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          maxLength={1000}
          className={inputClass}
          placeholder="نظر خود را درباره این کتاب بنویسید..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-[var(--background)] hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "در حال ثبت..." : "ثبت نظر"}
      </button>
    </form>
  )
}