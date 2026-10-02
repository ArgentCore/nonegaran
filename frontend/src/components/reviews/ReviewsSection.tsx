import { auth } from "@/auth"
import {
  getApprovedReviewsForBook,
  getRatingSummary,
  getUserReviewForBook,
  hasPurchasedBook,
} from "@/lib/data/reviews"
import { RatingHistogram } from "./RatingHistogram"
import { ReviewCard } from "./ReviewCard"
import { ReviewForm } from "./ReviewForm"
import Link from "next/link"

interface ReviewsSectionProps {
  bookId: string
}

export async function ReviewsSection({ bookId }: ReviewsSectionProps) {
  const session = await auth()
  const userId = session?.user?.id ?? null

  const [reviews, summary, userReview, hasPurchased] = await Promise.all([
    getApprovedReviewsForBook(bookId),
    getRatingSummary(bookId),
    userId ? getUserReviewForBook(userId, bookId) : Promise.resolve(null),
    userId ? hasPurchasedBook(userId, bookId) : Promise.resolve(false),
  ])

  return (
    <section className="mt-12 space-y-8">
      <h2 className="font-display text-2xl">نظرات خوانندگان</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <RatingHistogram summary={summary} />
        <div>
          {userId ? (
            userReview ? (
              <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
                <p className="text-sm text-[var(--text-muted)]">
                  شما قبلاً نظر خود را ثبت کرده‌اید
                  {userReview.status === "pending" && " (در انتظار تأیید)"}
                </p>
              </div>
            ) : (
              <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6">
                <h3 className="font-display text-lg">نظر خود را بنویسید</h3>
                <div className="mt-4">
                  <ReviewForm bookId={bookId} />
                </div>
              </div>
            )
          ) : (
            <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-6 text-center">
              <p className="text-[var(--text-muted)]">
                برای ثبت نظر{" "}
                <Link href="/vorood" className="text-[var(--link)] hover:underline">
                  وارد شوید
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              hasPurchased={hasPurchased && review.userId === userId}
            />
          ))}
        </div>
      )}
    </section>
  )
}