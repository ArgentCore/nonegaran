import Link from "next/link"
import { getCartCount } from "@/lib/actions/cart"

export async function CartBadge() {
  const count = await getCartCount()

  return (
    <Link
      href="/sabad-kharid"
      className="relative inline-flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--hairline)] p-2 hover:bg-[var(--surface-raised)]"
      aria-label="سبد خرید"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M6 7h12l1 13H5L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -left-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--foreground)] px-1 text-[11px] text-[var(--background)] tabular-nums">
          {count.toLocaleString("fa-IR")}
        </span>
      )}
    </Link>
  )
}