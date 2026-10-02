"use client"

import { useState } from "react"
import type { DiscountWithUser } from "@/lib/data/discounts"

interface Props {
  initial?: DiscountWithUser | null
  users: { id: string; email: string; name: string | null }[]
  submitAction: (formData: FormData) => Promise<void | { error?: string }>
}

function toLocalDatetime(value: Date | string | null | undefined): string {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function DiscountForm({ initial, users, submitAction }: Props) {
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError("")
    setPending(true)
    try {
      const result = await submitAction(formData)
      if (result?.error) setError(result.error)
    } finally {
      setPending(false)
    }
  }

  const input =
    "mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded border border-[#b4552d]/30 bg-[#b4552d]/10 p-3 text-sm text-[#b4552d]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className="block text-sm font-medium">
            کد تخفیف (حروف بزرگ انگلیسی)
          </label>
          <input
            id="code"
            name="code"
            defaultValue={initial?.code ?? ""}
            required
            className={input + " ltr-run uppercase"}
            placeholder="WELCOME10"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            نوع
          </label>
          <select
            id="type"
            name="type"
            defaultValue={initial?.type ?? "percentage"}
            className={input}
          >
            <option value="percentage">درصدی</option>
            <option value="fixed">مبلغ ثابت (تومان)</option>
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium">
            مقدار (درصد یا تومان)
          </label>
          <input
            id="value"
            name="value"
            type="number"
            min={1}
            defaultValue={initial?.value ?? ""}
            required
            className={input}
          />
        </div>

        <div>
          <label htmlFor="minOrderAmount" className="block text-sm font-medium">
            حداقل مبلغ سفارش (اختیاری)
          </label>
          <input
            id="minOrderAmount"
            name="minOrderAmount"
            type="number"
            min={0}
            defaultValue={initial?.minOrderAmount ?? ""}
            className={input}
          />
        </div>

        <div>
          <label htmlFor="maxDiscount" className="block text-sm font-medium">
            سقف تخفیف (فقط درصدی — اختیاری)
          </label>
          <input
            id="maxDiscount"
            name="maxDiscount"
            type="number"
            min={0}
            defaultValue={initial?.maxDiscount ?? ""}
            className={input}
          />
        </div>

        <div>
          <label htmlFor="usageLimit" className="block text-sm font-medium">
            سقف استفاده کلی (اختیاری)
          </label>
          <input
            id="usageLimit"
            name="usageLimit"
            type="number"
            min={1}
            defaultValue={initial?.usageLimit ?? ""}
            className={input}
          />
        </div>

        <div>
          <label htmlFor="userLimit" className="block text-sm font-medium">
            سقف استفاده هر کاربر (اختیاری)
          </label>
          <input
            id="userLimit"
            name="userLimit"
            type="number"
            min={1}
            defaultValue={initial?.userLimit ?? ""}
            className={input}
          />
        </div>

        <div>
          <label htmlFor="userId" className="block text-sm font-medium">
            اختصاصی برای کاربر (اختیاری)
          </label>
          <select
            id="userId"
            name="userId"
            defaultValue={initial?.userId ?? ""}
            className={input}
          >
            <option value="">— همه کاربران —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startsAt" className="block text-sm font-medium">
            شروع اعتبار
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toLocalDatetime(initial?.startsAt)}
            className={input}
          />
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium">
            پایان اعتبار
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="datetime-local"
            defaultValue={toLocalDatetime(initial?.expiresAt)}
            className={input}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
          className="h-4 w-4"
        />
        فعال
      </label>

      <div className="flex gap-3">
        <a
          href="/admin/discounts"
          className="flex-1 rounded-[var(--radius-control)] border border-[var(--hairline)] px-6 py-3 text-center hover:bg-[var(--surface-raised)]"
        >
          انصراف
        </a>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-[var(--background)] hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </form>
  )
}