"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authorSchema, type AuthorFormValues } from "@/lib/validations/author"

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== "admin") {
    throw new Error("دسترسی غیرمجاز")
  }
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

function dbErrorMessage(e: unknown, op: "create" | "update" | "delete"): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      return "اسلاگ قبلاً استفاده شده است. یک اسلاگ یکتا وارد کنید."
    }
    if (e.code === "P2003") {
      if (op === "delete") {
        return "این نویسنده کتاب ثبت‌شده دارد (به‌عنوان نویسنده یا مترجم) و قابل حذف نیست."
      }
      return "رکورد انتخاب‌شده وجود ندارد."
    }
    if (e.code === "P2025") {
      return op === "delete" ? "نویسنده موردنظر پیدا نشد." : "رکورد انتخاب‌شده وجود ندارد."
    }
  }
  return "خطایی در ارتباط با پایگاه داده رخ داد. دوباره تلاش کنید."
}

function revalidateAll() {
  revalidatePath("/admin/authors")
  revalidatePath("/nevisandegan")
  revalidatePath("/", "layout")
}

export async function createAuthor(formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin()
  const parsed = parseAuthorInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.AuthorCreateInput = toAuthorData(parsed.data)
  try {
    await prisma.author.create({ data })
  } catch (e) {
    return { error: dbErrorMessage(e, "create") }
  }
  revalidateAll()
  redirect("/admin/authors")
}

export async function updateAuthor(id: string, formData: FormData): Promise<{ error: string } | undefined> {
  await requireAdmin()
  const parsed = parseAuthorInput(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  const data: Prisma.AuthorUpdateInput = toAuthorData(parsed.data)
  try {
    await prisma.author.update({ where: { id }, data })
  } catch (e) {
    return { error: dbErrorMessage(e, "update") }
  }
  revalidateAll()
  redirect("/admin/authors")
}

export async function deleteAuthor(id: string): Promise<{ error: string } | undefined> {
  await requireAdmin()
  try {
    await prisma.author.delete({ where: { id } })
  } catch (e) {
    return { error: dbErrorMessage(e, "delete") }
  }
  revalidateAll()
}