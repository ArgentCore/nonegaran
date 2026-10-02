"use client"

import { useState, useTransition } from "react"
import { toggleDiscount, deleteDiscount } from "@/lib/actions/discount"
import type { DiscountWithUser } from "@/lib/data/discounts"

interface Props {
  discount: DiscountWithUser
}

export function DiscountTicket({ discount }: Props) {
  const [isActive, setIsActive] = useState(discount.isActive)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const usagePercent =
    discount.usageLimit && discount.usageLimit > 0
      ? Math.min(100, (discount.usageCount / discount.usageLimit) * 100)
      : 0

  function formatAmount(n: number) {
    return n.toLocaleString("fa-IR")
  }

  function formatValue() {
    return discount.type === "percentage"
      ? `${discount.value}٪`
      : `${formatAmount(discount.value)} تومان`
  }

  function countdownLabel(): string | null {
    if (!discount.expiresAt) return null
    const diff = new Date(discount.expiresAt).getTime() - Date.now()
    if (diff <= 0) return "منقضی شده"
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    if (d > 0) return `${d} روز`
    if (h > 0) return `${h} ساعت`
    const m = Math.floor((diff % 3600000) / 60000)
    return `${m} دقیقه`
  }

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleDiscount(discount.id)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsActive(!isActive)
      }
    })
  }

  function handleDelete() {
    if (!confirm(`کد "${discount.code}" حذف شود؟`)) return
    startTransition(async () => {
      const result = await deleteDiscount(discount.id)
      if (result?.error) setError(result.error)
    })
  }

  const countdown = countdownLabel()
  const sealColor = isActive ? "#3a6b3a" : "#b4552d"

  return (
    <article className="relative overflow-hidden rounded-lg border border-[#e2d9c3] bg-[#fbf7ec] text-[#26221b] shadow-sm">
      <div className="flex">
        <div className="w-2 bg-[#d9a441]" style={{ opacity: isActive ? 1 : 0.3 }} />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] text-[#7a715d]">کد تخفیف</p>
              <p className="font-mono text-2xl font-bold tracking-wider">
                {discount.code}
              </p>
              <p className="mt-1 text-sm text-[#7a715d]">
                {discount.type === "percentage" ? "درصدی" : "مبلغ ثابت"}
                {discount.userId && (
                  <span className="mr-2">
                    · اختصاصی {discount.user?.name || discount.user?.email}
                  </span>
                )}
              </p>
            </div>

            <div className="text-left">
              <p className="font-display text-3xl text-[#b4552d]">
                {formatValue()}
              </p>
              {discount.minOrderAmount ? (
                <p className="text-[11px] text-[#7a715d]">
                  حداقل {formatAmount(discount.minOrderAmount)} ت
                </p>
              ) : null}
            </div>
          </div>

          <div className="relative my-4 border-t-2 border-dashed border-[#c9bfa4]">
            <span className="absolute -top-2 right-0 bg-[#fbf7ec] px-1 text-[#7a715d]">
              ✂
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[#7a715d]">استفاده</p>
              <p className="mt-1 font-mono text-sm">
                {formatAmount(discount.usageCount)}
                {discount.usageLimit ? ` / ${formatAmount(discount.usageLimit)}` : ""}
              </p>
              {discount.usageLimit ? (
                <div className="mt-1 h-1.5 w-full rounded-full bg-[#e2d9c3]">
                  <div
                    className="h-full rounded-full bg-[#b4552d]"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <p className="text-[#7a715d]">
                {discount.expiresAt ? "مهلت" : "وضعیت"}
              </p>
              <p className="mt-1 font-mono text-sm">
                {countdown ?? (isActive ? "فعال" : "غیرفعال")}
              </p>
            </div>

            <div>
              <p className="text-[#7a715d]">سقف کاربری</p>
              <p className="mt-1 font-mono text-sm">
                {discount.userLimit ? formatAmount(discount.userLimit) : "—"}
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded bg-[#b4552d]/10 px-3 py-1 text-xs text-[#b4552d]">
              {error}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleToggle}
              disabled={isPending}
              className={`rounded px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "bg-[#26221b] text-[#fbf7ec] hover:opacity-90"
                  : "border border-[#b4552d] text-[#b4552d] hover:bg-[#b4552d]/10"
              }`}
            >
              {isActive ? "غیرفعال کردن" : "فعال کردن"}
            </button>
            <a
              href={`/admin/discounts/${discount.id}/edit`}
              className="rounded border border-[#c9bfa4] px-3 py-1.5 text-xs hover:bg-[#26221b]/5"
            >
              ویرایش
            </a>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded border border-[#c9bfa4] px-3 py-1.5 text-xs text-[#b4552d] hover:bg-[#b4552d]/10"
            >
              حذف
            </button>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute hidden items-center justify-center sm:flex"
        style={{
          top: "74px",
          left: "50%",
          marginLeft: "-34px",
          width: "68px",
          height: "68px",
          border: `2px double ${sealColor}`,
          borderRadius: "50%",
          color: sealColor,
          fontSize: "11px",
          fontWeight: 600,
          transform: "rotate(-12deg)",
          opacity: 0.8,
        }}
      >
        {isActive ? "فعال" : "غیرفعال"}
      </div>
    </article>
  )
}