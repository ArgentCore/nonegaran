import Link from "next/link";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartRefresher } from "@/components/cart/CartRefresher";
import { auth, signOut } from "@/auth";

const primaryNav = [
  { href: "/ketabha", label: "کتاب‌ها" },
  { href: "/nevisandegan", label: "نویسندگان" },
  { href: "/darbare-ma", label: "درباره‌ی ما" },
  { href: "/vaghti", label: "وقتی" },
];

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--hairline)] bg-[var(--background)] sticky top-0 z-40">
      <CartRefresher />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="font-display text-2xl hover:text-[var(--link)] transition-colors">
          نونگاران
        </Link>
        <nav aria-label="ناوبری اصلی" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--link)] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
            {session?.user && (
              <li>
                <Link href="/sefaresh-ha" className="hover:text-[var(--link)] transition-colors">
                  سفارش‌های من
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/ketabha"
            aria-label="جستجوی کتاب"
            className="p-2 rounded-[var(--radius-control)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <Search size={20} aria-hidden />
          </Link>
          <CartBadge />
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-[var(--radius-control)] border border-[var(--hairline)] px-3 py-1.5 text-xs hover:bg-[var(--surface-raised)] transition-colors"
              >
                خروج ({session.user.name ?? session.user.email ?? "کاربر"})
              </button>
            </form>
          ) : (
            <Link
              href="/vorood"
              className="rounded-[var(--radius-control)] border border-[var(--hairline)] px-3 py-1.5 text-xs hover:bg-[var(--surface-raised)] transition-colors"
            >
              ورود / ثبت‌نام
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}