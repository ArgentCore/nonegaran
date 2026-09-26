import { orderTimelineSteps, orderStatusLabels, timelinePosition } from "@/lib/data/orders"
import type { OrderStatus } from "@prisma/client"

interface OrderTimelineProps {
  currentStatus: OrderStatus
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const position = timelinePosition(currentStatus)
  const isCancelled = currentStatus === "cancelled" || currentStatus === "refunded"

  if (isCancelled) {
    return (
      <div className="rounded-[var(--radius-control)] border border-[var(--color-clay)] bg-[var(--color-clay)]/10 p-4 text-center">
        <p className="text-[var(--color-clay)]">{orderStatusLabels[currentStatus]}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orderTimelineSteps.map((step, idx) => {
        const isCompleted = idx <= position
        const isCurrent = idx === position
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[var(--hairline)] bg-[var(--background)]"
                }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs">{idx + 1}</span>
                )}
              </div>
              {idx < orderTimelineSteps.length - 1 && (
                <div
                  className={`h-12 w-0.5 ${
                    idx < position ? "bg-[var(--foreground)]" : "bg-[var(--hairline)]"
                  }`}
                />
              )}
            </div>
            <div className="pb-8">
              <p className={`font-medium ${isCurrent ? "text-[var(--foreground)]" : isCompleted ? "text-[var(--text-muted)]" : "text-[var(--text-muted)]"}`}>
                {orderStatusLabels[step]}
              </p>
              {isCurrent && (
                <p className="mt-1 text-xs text-[var(--color-moss)]">← مرحله فعلی</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}