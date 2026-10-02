"use client"

import { useEffect, useState, useTransition } from "react"
import type { DiscountCalculation } from "@/lib/data/discounts"

interface DiscountBoxProps {
  applied: DiscountCalculation | null
  onApply: (code: string) => Promise<DiscountCalculation>
  onRemove: () => void
}

function formatRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "منقضی شده"
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days} روز و ${hours} ساعت`
  if (hours > 0) return `${hours} ساعت و ${minutes} دقیقه`
  return `${minutes} دقیقه و ${seconds} ثانیه`
}

export function DiscountBox({ applied, onApply, onRemove }: DiscountBoxProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!applied?.countdown) {
      setRemaining(null)
      return
    }
    setRemaining(applied.countdown.seconds)
    const timer = setInterval(() => {
      setRemaining((prev) => (prev === null ? null : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [applied])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      const result = await onApply(code)
      if (!result.valid) {
        setError(result.error ?? "کد نامعتبر است.")
      } else {
        setCode("")
      }
    })
  }

  if (applied?.valid) {
    return (
      <div className="rounded-[var(--radius-control)] border-2 border-dashed border-[var(--color-saffron)] bg-[var(--color-saffron)]/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-lg font-bold tracking-wider">
              {applied.code}
            </p>
            <p className="mt-1 text-sm text-[var(--color-moss)]">
              − {(applied.discountAmount ?? 0).toLocaleString("fa-IR")} تومان تخفیف
            </p>
            {remaining !== null && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                ⏳ {formatRemaining(remaining)} تا انقضا
              </p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="rounded border border-[var(--hairline)] px-3 py-1.5 text-xs hover:bg-[var(--surface-raised)]"
          >
            حذف کد
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="کد تخفیف دارید؟"
          className="ltr-run flex-1 rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
        />
        <button
          type="submit"
          disabled={isPending || !code}
          className="rounded-[var(--radius-control)] border border-[var(--color-saffron)] px-4 py-2 text-sm text-[var(--color-saffron)] hover:bg-[var(--color-saffron)]/10 disabled:opacity-40"
        >
          {isPending ? "بررسی..." : "اعمال کد"}
        </button>
      </form>
      {error && (
        <p className="text-xs text-[var(--color-clay)]">{error}</p>
      )}
    </div>
  )
}