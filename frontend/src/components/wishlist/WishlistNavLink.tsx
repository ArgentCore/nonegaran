import Link from "next/link"
import { Heart } from "lucide-react"
import { auth } from "@/auth"
import { getWishlistCount } from "@/lib/data/wishlist"

export async function WishlistNavLink() {
  const session = await auth()
  const count = session?.user?.id
    ? await getWishlistCount(session.user.id)
    : 0

  return (
    <Link
      href="/alaghe-mandi-ha"
      className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--color-clay)]"
    >
      <Heart
        size={15}
        className={
          count > 0
            ? "fill-[var(--color-clay)] text-[var(--color-clay)]"
            : ""
        }
      />
      علاقه‌مندی‌ها
      {count > 0 && (
        <span className="rounded-full bg-[var(--color-clay)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-paper)] tabular-nums">
          {count.toLocaleString("fa-IR")}
        </span>
      )}
    </Link>
  )
}