"use client"

import { useState } from "react"
import { deleteBook } from "@/lib/actions/books"

export function DeleteBookButton({ bookId, title }: { bookId: string; title: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`حذف «${title}»؟ این عمل قابل بازگشت نیست.`)) return
    setLoading(true)
    await deleteBook(bookId)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded border border-[var(--color-clay)] px-3 py-1 text-xs text-[var(--color-clay)] hover:bg-[var(--color-clay)]/10 disabled:opacity-50"
    >
      {loading ? "در حال حذف..." : "حذف"}
    </button>
  )
}