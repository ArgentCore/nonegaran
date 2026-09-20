"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

const errorMessages: Record<string, string> = {
  CredentialsSignin: "ایمیل یا رمز عبور اشتباه است",
  RATE_LIMITED: "تعداد تلاش‌های ورود بیش از حد مجاز است. چند دقیقه بعد دوباره امتحان کنید.",
}

function LoginForm() {
  const searchParams = useSearchParams()
  const key = searchParams.get("code") ?? searchParams.get("error")
  const displayError = key ? (errorMessages[key] ?? "ورود ناموفق بود") : ""

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    await signIn("credentials", { email, password, callbackUrl: "/admin/dashboard" })
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-8">
        <h1 className="font-display text-3xl text-center">ورود به پنل مدیریت</h1>
        <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
          نونگاران — نشر کتاب
        </p>

        {displayError && (
          <div className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-clay)] bg-[var(--color-clay)]/10 p-3 text-sm text-[var(--color-clay)]">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">ایمیل</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@nonegaran.local"
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">رمز عبور</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2.5 text-[var(--background)] transition-opacity hover:opacity-90"
          >
            ورود
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          فقط کاربران با نقش مدیر می‌توانند وارد شوند
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">در حال بارگذاری...</div>}>
      <LoginForm />
    </Suspense>
  )
}