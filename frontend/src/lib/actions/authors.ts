"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authorSchema, type AuthorFormValues } from "@/lib/validations/author"
import { authorDbErrorMessage } from "@/lib/db-errors"

async function requireAdmin(): Promise<{ error: string } | null> {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    return { error: "دسترسی غیرمجاز" }
  }
  return null
}

function parseAuthorInput(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    avatar: String(formData.get("avatar") ?? ""),
  }
  return authorSchema.safeParse(raw)
}

function toAuthorData(v: AuthorFormValues) {
  return {
    name: v.name,
    slug: v.slug,
    bio: v.bio || null,
    avatar: v.avatar || null,
  }
}

function revalidateAll() {
  revalidatePath("/admin/authors")
  revalidatePath("/nevisandegan")
  revalidatePath("/", "layout")
}

export async function createAuthor(formData: FormData): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  const parsed = parseAuthorInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.AuthorCreateInput = toAuthorData(parsed.data)
  try {
    await prisma.author.create({ data })
  } catch (e) {
    return { error: authorDbErrorMessage(e, "create") }
  }
  revalidateAll()
  redirect("/admin/authors")
}

export async function updateAuthor(id: string, formData: FormData): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  const parsed = parseAuthorInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.AuthorUpdateInput = toAuthorData(parsed.data)
  try {
    await prisma.author.update({ where: { id }, data })
  } catch (e) {
    return { error: authorDbErrorMessage(e, "update") }
  }
  revalidateAll()
  redirect("/admin/authors")
}

export async function deleteAuthor(id: string): Promise<{ error: string } | undefined> {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    await prisma.author.delete({ where: { id } })
  } catch (e) {
    return { error: authorDbErrorMessage(e, "delete") }
  }
  revalidateAll()
}