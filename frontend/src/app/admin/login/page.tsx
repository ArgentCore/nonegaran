"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است")
      } else {
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch {
      setError("خطایی رخ داد. دوباره تلاش کنید.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md space-y-8 rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-8">
        <div className="text-center">
          <h1 className="font-display text-3xl">ورود به پنل مدیریت</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            نونگاران — نشر کتاب
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[var(--radius-control)] border border-[var(--color-clay)] bg-[var(--color-clay)]/10 p-3 text-sm text-[var(--color-clay)]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
              placeholder="admin@nonegaran.local"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[var(--radius-control)] bg-[var(--foreground)] py-2 text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-muted)]">
          فقط کاربران با نقش مدیر می‌توانند وارد شوند
        </p>
      </div>
    </div>
  )
}