import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center flex flex-col gap-6">
      <h1 className="font-display text-6xl text-[var(--color-clay)]">۴۰۴</h1>
      <p className="font-display text-2xl">این صفحه در کتابخانه‌ی ما یافت نشد.</p>
      <p className="text-[var(--text-muted)] leading-8">
        ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه جابه‌جا شده باشد.
      </p>
      <div className="pt-4">
        <Link 
          href="/" 
          className="bg-[var(--accent)] text-[var(--color-ink)] px-6 py-3 rounded-[var(--radius-control)] hover:bg-[var(--accent-strong)] transition-colors inline-block"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}