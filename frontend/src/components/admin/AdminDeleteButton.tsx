"use client"

import { useState } from "react"

interface AdminDeleteButtonProps {
  id: string
  title: string
  onDelete: (id: string) => Promise<{ error?: string } | undefined>
}

export function AdminDeleteButton({ id, title, onDelete }: AdminDeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    if (!confirm(`حذف «${title}»؟ این عمل قابل بازگشت نیست.`)) return
    setLoading(true)
    setError("")
    const result = await onDelete(id)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded border border-[var(--color-clay)] px-3 py-1 text-xs text-[var(--color-clay)] hover:bg-[var(--color-clay)]/10 disabled:opacity-50"
      >
        {loading ? "در حال حذف..." : "حذف"}
      </button>
      {error && <span className="text-xs text-[var(--color-clay)]">{error}</span>}
    </div>
  )
}