"use client"

import { useState } from "react"
import { createBook, updateBook } from "@/lib/actions/books"

export interface BookFormInitial {
  title: string
  slug: string
  authorId: string
  translatorId: string
  categoryId: string
  description: string
  excerpt: string
  isbn: string
  sku: string
  year: string
  yearFa: string
  pages: string
  priceToman: string
  bookSize: string
  coverTone: string
  status: string
  inStock: string
  isPreorder: string
}

interface BookFormProps {
  mode: "create" | "edit"
  bookId?: string
  initial: BookFormInitial
  authors: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}

const inputClass =
  "mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"
const labelClass = "block text-sm font-medium text-[var(--foreground)]"

export default function BookForm({ mode, bookId, initial, authors, categories }: BookFormProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    console.log("[BookForm] submit fired")
    setLoading(true)
    setError("")
    try {
      const result =
        mode === "create" ? await createBook(formData) : await updateBook(bookId!, formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (e) {
      console.error("[BookForm] action error:", e)
      setError("خطای غیرمنتظره‌ای رخ داد. جزئیات در کنسول مرورگر.")
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="title">عنوان *</label>
          <input id="title" name="title" required defaultValue={initial.title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">اسلاگ * (انگلیسی با خط تیره)</label>
          <input id="slug" name="slug" required defaultValue={initial.slug} dir="ltr" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="authorId">نویسنده *</label>
          <select id="authorId" name="authorId" required defaultValue={initial.authorId} className={inputClass}>
            <option value="">انتخاب نویسنده...</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="translatorId">مترجم (اختیاری)</label>
          <select id="translatorId" name="translatorId" defaultValue={initial.translatorId} className={inputClass}>
            <option value="">بدون مترجم</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="categoryId">دسته‌بندی *</label>
          <select id="categoryId" name="categoryId" required defaultValue={initial.categoryId} className={inputClass}>
            <option value="">انتخاب دسته‌بندی...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="priceToman">قیمت (تومان) *</label>
          <input id="priceToman" name="priceToman" required type="number" min="0" defaultValue={initial.priceToman} dir="ltr" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="year">سال انتشار (میلادی)</label>
          <input id="year" name="year" type="number" defaultValue={initial.year} dir="ltr" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="yearFa">سال انتشار (شمسی)</label>
          <input id="yearFa" name="yearFa" defaultValue={initial.yearFa} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="pages">تعداد صفحات</label>
          <input id="pages" name="pages" type="number" min="0" defaultValue={initial.pages} dir="ltr" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="isbn">شابک (ISBN)</label>
          <input id="isbn" name="isbn" defaultValue={initial.isbn} dir="ltr" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="sku">SKU *</label>
          <input id="sku" name="sku" required defaultValue={initial.sku} dir="ltr" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bookSize">قطع کتاب</label>
          <select id="bookSize" name="bookSize" defaultValue={initial.bookSize} className={inputClass}>
            <option value="raghi">رقعی</option>
            <option value="vaziri">وزیری</option>
            <option value="jibi">جیبی</option>
            <option value="khashti">خشتی</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="coverTone">رنگ جلد</label>
          <select id="coverTone" name="coverTone" defaultValue={initial.coverTone} className={inputClass}>
            <option value="saffron">زعفرانی</option>
            <option value="petrol">پترولی</option>
            <option value="ink">مرکبی</option>
            <option value="moss">خزه‌ای</option>
            <option value="clay">رسی</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">وضعیت</label>
          <select id="status" name="status" defaultValue={initial.status} className={inputClass}>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
            <option value="out_of_stock">ناموجود</option>
            <option value="discontinued">متوقف شده</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="inStock">موجودی انبار</label>
          <select id="inStock" name="inStock" defaultValue={initial.inStock} className={inputClass}>
            <option value="true">موجود</option>
            <option value="false">ناموجود</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="isPreorder">پیش‌فروش</label>
          <select id="isPreorder" name="isPreorder" defaultValue={initial.isPreorder} className={inputClass}>
            <option value="false">خیر</option>
            <option value="true">بله</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">توضیحات</label>
        <textarea id="description" name="description" rows={5} defaultValue={initial.description} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="excerpt">گزیده متن</label>
        <textarea id="excerpt" name="excerpt" rows={3} defaultValue={initial.excerpt} className={inputClass} />
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
        {loading ? "در حال ذخیره..." : mode === "create" ? "ایجاد کتاب" : "ذخیره تغییرات"}
      </button>
    </form>
  )
}