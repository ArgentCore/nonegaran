"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { bookSchema, type BookFormValues } from "@/lib/validations/book"
import { bookDbErrorMessage } from "@/lib/db-errors"

async function requireAdmin(): Promise<{ error: string } | null> {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    return { error: "دسترسی غیرمجاز" }
  }
  return null
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

function revalidateAll() {
  revalidatePath("/admin/books")
  revalidatePath("/ketabha")
  revalidatePath("/", "layout")
}

export async function createBook(formData: FormData): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
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
    return { error: bookDbErrorMessage(e, "create") }
  }
  revalidateAll()
  redirect("/admin/books")
}

export async function updateBook(id: string, formData: FormData): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
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
    return { error: bookDbErrorMessage(e, "update") }
  }
  revalidateAll()
  redirect("/admin/books")
}

export async function deleteBook(id: string): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    await prisma.book.delete({ where: { id } })
  } catch (e) {
    return { error: bookDbErrorMessage(e, "delete") }
  }
  revalidateAll()
}