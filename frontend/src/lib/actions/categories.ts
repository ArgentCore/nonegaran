"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category"

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    throw new Error("دسترسی غیرمجاز")
  }
}

function parseCategoryInput(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
  }
  return categorySchema.safeParse(raw)
}

function toCategoryData(v: CategoryFormValues) {
  return {
    name: v.name,
    slug: v.slug,
    description: v.description || null,
  }
}

function dbErrorMessage(e: unknown, op: "create" | "update" | "delete"): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      return "اسلاگ قبلاً استفاده شده است. یک اسلاگ یکتا وارد کنید."
    }
    if (e.code === "P2003") {
      if (op === "delete") {
        return "این دسته‌بندی کتاب ثبت‌شده دارد و قابل حذف نیست."
      }
      return "رکورد انتخاب‌شده وجود ندارد."
    }
    if (e.code === "P2025") {
      return op === "delete" ? "دسته‌بندی موردنظر پیدا نشد." : "رکورد انتخاب‌شده وجود ندارد."
    }
  }
  return "خطایی در ارتباط با پایگاه داده رخ داد. دوباره تلاش کنید."
}

function revalidateAll() {
  revalidatePath("/admin/categories")
  revalidatePath("/ketabha")
  revalidatePath("/", "layout")
}

export async function createCategory(formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin()
  const parsed = parseCategoryInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.CategoryCreateInput = toCategoryData(parsed.data)
  try {
    await prisma.category.create({ data })
  } catch (e) {
    return { error: dbErrorMessage(e, "create") }
  }
  revalidateAll()
  redirect("/admin/categories")
}

export async function updateCategory(id: string, formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin()
  const parsed = parseCategoryInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.CategoryUpdateInput = toCategoryData(parsed.data)
  try {
    await prisma.category.update({ where: { id }, data })
  } catch (e) {
    return { error: dbErrorMessage(e, "update") }
  }
  revalidateAll()
  redirect("/admin/categories")
}

export async function deleteCategory(id: string): Promise<{ error: string } | undefined> {
  await requireAdmin()
  try {
    await prisma.category.delete({ where: { id } })
  } catch (e) {
    return { error: dbErrorMessage(e, "delete") }
  }
  revalidateAll()
}