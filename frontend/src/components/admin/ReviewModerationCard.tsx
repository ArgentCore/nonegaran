"use client"

import { useTransition } from "react"
import { updateReviewStatus } from "@/lib/actions/reviews"
import { StarRatingDisplay } from "@/components/reviews/StarRating"
import type { AdminReviewWithRefs } from "@/lib/data/reviews"

interface Props {
  review: AdminReviewWithRefs
}

const statusStyles: Record<string, string> = {
  pending: "border-[var(--color-saffron)] text-[var(--color-saffron)]",
  approved: "border-[var(--color-moss)] text-[var(--color-moss)]",
  rejected: "border-[var(--color-clay)] text-[var(--color-clay)]",
}

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  approved: "تأیید شده",
  rejected: "رد شده",
}

export function ReviewModerationCard({ review }: Props) {
  const [isPending, startTransition] = useTransition()

  function handle(status: "approved" | "rejected") {
    startTransition(() => {
      updateReviewStatus(review.id, status)
    })
  }

  return (
    <article className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{review.book.title}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {review.user.name || review.user.email} ·{" "}
            {new Date(review.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] ${statusStyles[review.status]}`}
        >
          {statusLabels[review.status]}
        </span>
      </header>

      <div className="mt-3">
        <StarRatingDisplay rating={review.rating} size="sm" />
      </div>
      {review.title && <h3 className="mt-2 font-medium">{review.title}</h3>}
      {review.body && (
        <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
          {review.body}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        {review.status !== "approved" && (
          <button
            onClick={() => handle("approved")}
            disabled={isPending}
            className="rounded border border-[var(--color-moss)] px-3 py-1.5 text-xs text-[var(--color-moss)] hover:bg-[var(--color-moss)]/10 disabled:opacity-50"
          >
            تأیید
          </button>
        )}
        {review.status !== "rejected" && (
          <button
            onClick={() => handle("rejected")}
            disabled={isPending}
            className="rounded border border-[var(--color-clay)] px-3 py-1.5 text-xs text-[var(--color-clay)] hover:bg-[var(--color-clay)]/10 disabled:opacity-50"
          >
            رد
          </button>
        )}
      </div>
    </article>
  )
}