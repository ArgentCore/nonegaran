"use client"

import { useState } from "react"
import { createCategory, updateCategory } from "@/lib/actions/categories"

export interface CategoryFormInitial {
  name: string
  slug: string
  description: string
}

interface CategoryFormProps {
  mode: "create" | "edit"
  categoryId?: string
  initial: CategoryFormInitial
}

const inputClass =
  "mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
const labelClass = "block text-sm font-medium text-[var(--foreground)]"

export default function CategoryForm({ mode, categoryId, initial }: CategoryFormProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    console.log("[CategoryForm] submit fired")
    setLoading(true)
    setError("")
    try {
      const result =
        mode === "create" ? await createCategory(formData) : await updateCategory(categoryId!, formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (e) {
      console.error("[CategoryForm] action error:", e)
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
        <label className={labelClass} htmlFor="description">توضیحات</label>
        <textarea id="description" name="description" rows={4} defaultValue={initial.description} className={inputClass} />
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
        {loading ? "در حال ذخیره..." : mode === "create" ? "ایجاد دسته‌بندی" : "ذخیره تغییرات"}
      </button>
    </form>
  )
}