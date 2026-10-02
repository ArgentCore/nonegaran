import type { RatingSummary } from "@/lib/data/reviews"

interface RatingHistogramProps {
  summary: RatingSummary
}

export function RatingHistogram({ summary }: RatingHistogramProps) {
  const { average, count, distribution } = summary
  const maxCount = Math.max(...Object.values(distribution), 1)

  if (count === 0) {
    return (
      <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6 text-center">
        <p className="text-[var(--text-muted)]">هنوز نظری ثبت نشده است</p>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-4xl tabular-nums">{average.toFixed(1)}</span>
        <span className="text-sm text-[var(--text-muted)]">
          از {count.toLocaleString("fa-IR")} نظر
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const countForRating = distribution[rating as 1 | 2 | 3 | 4 | 5]
          const percent = (countForRating / maxCount) * 100
          return (
            <div key={rating} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-left tabular-nums">{rating.toLocaleString("fa-IR")}</span>
              <div className="flex-1 h-2 rounded-full bg-[var(--hairline)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-saffron)] transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-8 text-right tabular-nums text-[var(--text-muted)]">
                {countForRating.toLocaleString("fa-IR")}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}