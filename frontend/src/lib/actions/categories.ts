"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category"
import { categoryDbErrorMessage } from "@/lib/db-errors"

async function requireAdmin(): Promise<{ error: string } | null> {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    return { error: "دسترسی غیرمجاز" }
  }
  return null
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

function revalidateAll() {
  revalidatePath("/admin/categories")
  revalidatePath("/ketabha")
  revalidatePath("/", "layout")
}

export async function createCategory(formData: FormData): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  const parsed = parseCategoryInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.CategoryCreateInput = toCategoryData(parsed.data)
  try {
    await prisma.category.create({ data })
  } catch (e) {
    return { error: categoryDbErrorMessage(e, "create") }
  }
  revalidateAll()
  redirect("/admin/categories")
}

export async function updateCategory(id: string, formData: FormData): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  const parsed = parseCategoryInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.CategoryUpdateInput = toCategoryData(parsed.data)
  try {
    await prisma.category.update({ where: { id }, data })
  } catch (e) {
    return { error: categoryDbErrorMessage(e, "update") }
  }
  revalidateAll()
  redirect("/admin/categories")
}

export async function deleteCategory(id: string): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    await prisma.category.delete({ where: { id } })
  } catch (e) {
    return { error: categoryDbErrorMessage(e, "delete") }
  }
  revalidateAll()
}