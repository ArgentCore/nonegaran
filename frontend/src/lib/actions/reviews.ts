"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { reviewSchema } from "@/lib/validations/reviews"
import { requireAdmin } from "@/lib/actions/admin"

export async function createReview(
  bookId: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "برای ثبت نظر باید وارد شوید." }
  }

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await prisma.review.create({
      data: {
        bookId,
        userId: session.user.id,
        rating: parsed.data.rating,
        title: parsed.data.title || null,
        body: parsed.data.body || null,
        status: "pending",
      },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "شما قبلاً برای این کتاب نظر ثبت کرده‌اید." }
    }
    return { error: "خطا در ثبت نظر." }
  }

  revalidatePath(`/ketab/[slug]`, "page")
  return { success: true }
}

export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "rejected"
): Promise<{ error?: string }> {
  await requireAdmin()

  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    })
  } catch {
    return { error: "خطا در به‌روزرسانی وضعیت." }
  }

  revalidatePath("/admin/reviews")
  revalidatePath(`/ketab/[slug]`, "page")
  return {}
}