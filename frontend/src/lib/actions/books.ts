"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { bookSchema, type BookFormValues } from "@/lib/validations/book"

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    throw new Error("دسترسی غیرمجاز")
  }
}

function parseBookInput(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    authorId: String(formData.get("authorId") ?? ""),
    translatorId: String(formData.get("translatorId") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    description: String(formData.get("description") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    isbn: String(formData.get("isbn") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    year: String(formData.get("year") ?? ""),
    yearFa: String(formData.get("yearFa") ?? ""),
    pages: String(formData.get("pages") ?? ""),
    priceToman: String(formData.get("priceToman") ?? ""),
    bookSize: String(formData.get("bookSize") ?? "raghi"),
    coverTone: String(formData.get("coverTone") ?? "petrol"),
    status: String(formData.get("status") ?? "draft"),
    inStock: String(formData.get("inStock") ?? "true"),
    isPreorder: String(formData.get("isPreorder") ?? "false"),
  }
  return bookSchema.safeParse(raw)
}

function toBookCreateInput(v: BookFormValues): Prisma.BookCreateInput {
  return {
    title: v.title,
    slug: v.slug,
    author: { connect: { id: v.authorId } },
    translator:
      v.translatorId && v.translatorId.length > 0
        ? { connect: { id: v.translatorId } }
        : undefined,
    category: { connect: { id: v.categoryId } },
    description: v.description || null,
    excerpt: v.excerpt || null,
    isbn: v.isbn || null,
    sku: v.sku,
    year: v.year ? parseInt(v.year, 10) : null,
    yearFa: v.yearFa || null,
    pages: v.pages ? parseInt(v.pages, 10) : null,
    priceToman: parseInt(v.priceToman, 10),
    bookSize: v.bookSize,
    coverTone: v.coverTone,
    status: v.status,
    inStock: v.inStock === "true",
    isPreorder: v.isPreorder === "true",
  }
}

function toBookUpdateInput(v: BookFormValues): Prisma.BookUpdateInput {
  return {
    title: v.title,
    slug: v.slug,
    author: { connect: { id: v.authorId } },
    translator:
      v.translatorId && v.translatorId.length > 0
        ? { connect: { id: v.translatorId } }
        : { disconnect: true },
    category: { connect: { id: v.categoryId } },
    description: v.description || null,
    excerpt: v.excerpt || null,
    isbn: v.isbn || null,
    sku: v.sku,
    year: v.year ? parseInt(v.year, 10) : null,
    yearFa: v.yearFa || null,
    pages: v.pages ? parseInt(v.pages, 10) : null,
    priceToman: parseInt(v.priceToman, 10),
    bookSize: v.bookSize,
    coverTone: v.coverTone,
    status: v.status,
    inStock: v.inStock === "true",
    isPreorder: v.isPreorder === "true",
  }
}

function dbErrorMessage(e: unknown, op: "create" | "update" | "delete"): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      const target = (e.meta?.target as string[] | undefined) ?? []
      if (target.includes("isbn")) return "شابک (ISBN) قبلاً برای کتاب دیگری ثبت شده است."
      if (target.includes("sku")) return "SKU قبلاً برای کتاب دیگری ثبت شده است."
      if (target.includes("slug")) return "اسلاگ قبلاً استفاده شده است. یک اسلاگ یکتا وارد کنید."
      return "مقدار واردشده تکراری است."
    }
    if (e.code === "P2003") {
      if (op === "delete") {
        return "این کتاب در سبد خرید یا سفارش‌ها استفاده شده و قابل حذف نیست."
      }
      return "نویسنده یا دسته‌بندی انتخاب‌شده وجود ندارد."
    }
    if (e.code === "P2025") {
      if (op === "delete") {
        return "کتاب موردنظر پیدا نشد."
      }
      return "نویسنده، مترجم یا دسته‌بندی انتخاب‌شده وجود ندارد."
    }
  }
  return "خطایی در ارتباط با پایگاه داده رخ داد. دوباره تلاش کنید."
}

function revalidateAll() {
  revalidatePath("/admin/books")
  revalidatePath("/ketabha")
  revalidatePath("/", "layout")
}

export async function createBook(formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin()
  const parsed = parseBookInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.BookCreateInput = toBookCreateInput(parsed.data)
  if (parsed.data.status === "published") {
    data.publishedAt = new Date()
  }
  try {
    await prisma.book.create({ data })
  } catch (e) {
    return { error: dbErrorMessage(e, "create") }
  }
  revalidateAll()
  redirect("/admin/books")
}

export async function updateBook(id: string, formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin()
  const parsed = parseBookInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const existing = await prisma.book.findUnique({
    where: { id },
    select: { publishedAt: true },
  })
  if (!existing) {
    return { error: "کتاب پیدا نشد." }
  }
  const data: Prisma.BookUpdateInput = toBookUpdateInput(parsed.data)
  if (parsed.data.status === "published" && !existing.publishedAt) {
    data.publishedAt = new Date()
  }
  try {
    await prisma.book.update({ where: { id }, data })
  } catch (e) {
    return { error: dbErrorMessage(e, "update") }
  }
  revalidateAll()
  redirect("/admin/books")
}

export async function deleteBook(id: string): Promise<{ error: string } | undefined> {
  await requireAdmin()
  try {
    await prisma.book.delete({ where: { id } })
  } catch (e) {
    return { error: dbErrorMessage(e, "delete") }
  }
  revalidateAll()
}