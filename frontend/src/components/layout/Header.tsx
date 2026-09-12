import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const primaryNav = [
  { href: "/ketabha", label: "کتاب‌ها" },
  { href: "/darbare-ma", label: "درباره‌ی ما" },
  { href: "/pazireshe-asar", label: "پذیرش اثر" },
  { href: "/pakhsh", label: "پخش کتاب" },
  { href: "/vaghti", label: "وقتی" },
];

export default function Header() {
  return (
    <header className="border-b border-[var(--hairline)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="font-display text-2xl">
          نونگاران
        </Link>

        <nav aria-label="ناوبری اصلی" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[var(--link)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="جستجوی کتاب"
            className="p-2 rounded-[var(--radius-control)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <Search size={20} aria-hidden />
          </button>
          <Link
            href="/sabad-kharid"
            aria-label="سبد خرید"
            className="p-2 rounded-[var(--radius-control)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <ShoppingBag size={20} aria-hidden />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
