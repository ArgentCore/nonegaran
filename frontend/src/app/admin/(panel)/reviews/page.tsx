import Link from "next/link"
import type { ReviewStatus } from "@prisma/client"
import { getAllReviewsForAdmin } from "@/lib/data/reviews"
import { ReviewModerationCard } from "@/components/admin/ReviewModerationCard"

export const metadata = {
  title: "نظرات | پنل ادمین",
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

const tabs: { value: string; label: string }[] = [
  { value: "", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "approved", label: "تأیید شده" },
  { value: "rejected", label: "رد شده" },
]

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const { status } = await searchParams
  const filter =
    status === "pending" || status === "approved" || status === "rejected"
      ? (status as ReviewStatus)
      : undefined

  const reviews = await getAllReviewsForAdmin(filter)

  return (
    <div>
      <h1 className="font-display text-3xl">نظرات خوانندگان</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {reviews.length.toLocaleString("fa-IR")} نظر
      </p>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => {
          const active = (status ?? "") === tab.value
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/reviews?status=${tab.value}` : "/admin/reviews"}
              className={`rounded-[var(--radius-control)] px-4 py-2 text-sm transition-colors ${
                active
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "border border-[var(--hairline)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-control)] border border-dashed border-[var(--hairline)] p-12 text-center text-[var(--text-muted)]">
          نظری در این دسته نیست.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewModerationCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}