"use client"

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print mb-6 rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-[var(--background)] hover:opacity-90"
    >
      چاپ رسید
    </button>
  )
}