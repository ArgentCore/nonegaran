import type { ReviewWithUser } from "@/lib/data/reviews"
import { StarRatingDisplay } from "./StarRating"

interface ReviewCardProps {
  review: ReviewWithUser
  hasPurchased?: boolean
}

export function ReviewCard({ review, hasPurchased }: ReviewCardProps) {
  return (
    <article className="relative rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-5">
      <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--background)]" style={{
        clipPath: "polygon(100% 0, 0 0, 100% 100%)",
      }} />
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <StarRatingDisplay rating={review.rating} size="sm" />
            {hasPurchased && (
              <span className="rounded-full bg-[var(--color-moss)]/10 px-2 py-0.5 text-[10px] text-[var(--color-moss)]">
                ✓ خرید ثبت‌شده
              </span>
            )}
          </div>
          {review.title && (
            <h3 className="mt-2 font-medium">{review.title}</h3>
          )}
        </div>
      </header>
      {review.body && (
        <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
          {review.body}
        </p>
      )}
      <footer className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span>{review.user.name || "کاربر ناشناس"}</span>
        <span>·</span>
        <time>{new Date(review.createdAt).toLocaleDateString("fa-IR")}</time>
      </footer>
    </article>
  )
}