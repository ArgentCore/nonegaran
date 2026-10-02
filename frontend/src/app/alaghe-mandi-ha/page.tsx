import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getWishlistForUser } from "@/lib/data/wishlist"
import { Heart } from "lucide-react"

export const metadata = {
  title: "علاقه‌مندی‌های من — نونگاران",
}

export default async function WishlistPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/vorood")

  const wishlist = await getWishlistForUser(session.user.id)

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl">
          ❤️ علاقه‌مندی‌های من
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {wishlist.length.toLocaleString("fa-IR")} کتاب در لیست شما
        </p>
      </header>

      {wishlist.length === 0 ? (
        <div className="rounded-[var(--radius-control)] border border-dashed border-[var(--hairline)] p-16 text-center">
          <Heart
            size={48}
            className="mx-auto text-[var(--hairline)]"
            strokeWidth={1}
          />
          <p className="mt-4 text-[var(--text-muted)]">
            هنوز کتابی به علاقه‌مندی‌هایتان اضافه نکرده‌اید.
          </p>
          <Link
            href="/ketabha"
            className="mt-4 inline-block rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2 text-[var(--background)]"
          >
            مشاهده همه کتاب‌ها
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => {
            const book = item.book
            const isAvailable = book.inStock && book.status === "published"
            return (
              <article
                key={item.id}
                className="flex flex-col rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] overflow-hidden"
              >
                <Link
                  href={`/ketab/${book.slug}`}
                  className="relative aspect-[3/4] bg-[var(--hairline)]"
                >
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      📖
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <Link href={`/ketab/${book.slug}`}>
                    <h2 className="font-display text-lg leading-tight hover:text-[var(--color-clay)]">
                      {book.title}
                    </h2>
                  </Link>
                  {book.author?.name && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {book.author.name}
                    </p>
                  )}
                  <p className="mt-2 font-display text-lg tabular-nums">
                    {book.priceToman.toLocaleString("fa-IR")} تومان
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        isAvailable
                          ? "bg-[var(--color-moss)]/10 text-[var(--color-moss)]"
                          : "bg-[var(--color-clay)]/10 text-[var(--color-clay)]"
                      }`}
                    >
                      {isAvailable ? "✓ موجود" : "ناموجود"}
                    </span>
                    {isAvailable && (
                      <Link
                        href={`/ketab/${book.slug}`}
                        className="rounded-[var(--radius-control)] border border-[var(--foreground)] px-3 py-1.5 text-xs hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                      >
                        مشاهده و خرید
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}