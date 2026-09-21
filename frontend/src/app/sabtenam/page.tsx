"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { registerCustomer } from "@/lib/actions/customer"

export default function SabtenamPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "")
    const password = String(fd.get("password") ?? "")

    const result = await registerCustomer(fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (loginResult?.error) {
      setError("ثبت‌نام موفق بود، ولی ورود خودکار انجام نشد. لطفاً از صفحه ورود وارد شوید.")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-8">
        <h1 className="font-display text-3xl text-center">ثبت‌نام</h1>
        <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
          برای پیگیری سفارش‌ها و نگهداری سبد خرید
        </p>

        {error && (
          <div className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-clay)] bg-[var(--color-clay)]/10 p-3 text-sm text-[var(--color-clay)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">نام (اختیاری)</label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">ایمیل</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">رمز عبور (حداقل ۸ کاراکتر)</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium">تکرار رمز عبور</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2.5 text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام و ورود"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/vorood" className="text-[var(--link)] hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  )
}