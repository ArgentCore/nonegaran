"use client"

import { useState } from "react"
import { createAuthor, updateAuthor } from "@/lib/actions/authors"

export interface AuthorFormInitial {
  name: string
  slug: string
  bio: string
  avatar: string
}

interface AuthorFormProps {
  mode: "create" | "edit"
  authorId?: string
  initial: AuthorFormInitial
}

const inputClass =
  "mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
const labelClass = "block text-sm font-medium text-[var(--foreground)]"

export default function AuthorForm({ mode, authorId, initial }: AuthorFormProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    console.log("[AuthorForm] submit fired")
    setLoading(true)
    setError("")
    try {
      const result =
        mode === "create" ? await createAuthor(formData) : await updateAuthor(authorId!, formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (e) {
      console.error("[AuthorForm] action error:", e)
      setError("خطای غیرمنتظره‌ای رخ داد. جزئیات در کنسول مرورگر.")
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">نام *</label>
          <input id="name" name="name" required defaultValue={initial.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">اسلاگ * (انگلیسی با خط تیره)</label>
          <input id="slug" name="slug" required defaultValue={initial.slug} dir="ltr" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="avatar">آواتار (URL یا کد رنگ) — اختیاری</label>
        <input id="avatar" name="avatar" defaultValue={initial.avatar} dir="ltr" className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="bio">بیوگرافی</label>
        <textarea id="bio" name="bio" rows={6} defaultValue={initial.bio} className={inputClass} />
      </div>

      {error && (
        <div className="rounded-[var(--radius-control)] border border-[var(--color-clay)] bg-[var(--color-clay)]/10 p-3 text-sm text-[var(--color-clay)]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-2 text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "در حال ذخیره..." : mode === "create" ? "ایجاد نویسنده" : "ذخیره تغییرات"}
      </button>
    </form>
  )
}