import Link from "next/link";

const columns = [
  {
    title: "نونگاران",
    links: [
      { href: "/darbare-ma", label: "درباره‌ی ما" },
      { href: "/vaghti", label: "وقتی" },
      { href: "/tamas", label: "تماس با ما" },
    ],
  },
  {
    title: "همکاری",
    links: [
      { href: "/pazireshe-asar", label: "پذیرش اثر" },
      { href: "/pakhsh", label: "پخش و همکاری" },
    ],
  },
  {
    title: "خرید",
    links: [
      { href: "/ketabha", label: "همه‌ی کتاب‌ها" },
      { href: "/nevisandegan", label: "نویسندگان" },
      { href: "/sabad-kharid", label: "سبد خرید" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="font-display text-2xl">نونگاران</span>
          <p className="text-sm text-[var(--text-muted)] max-w-[32ch]">
            نانِ روز را از نانوایی می‌گیرید؛ نانِ ذهن را از اینجا.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm text-[var(--text-muted)] mb-3">{col.title}</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[var(--link)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-[var(--hairline)]">
        <p className="mx-auto max-w-6xl px-6 py-5 text-sm text-[var(--text-muted)]">
          تمام حقوق برای نشر نونگاران محفوظ است — <span className="ltr-run">{new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}
