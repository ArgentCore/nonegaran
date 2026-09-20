import { Prisma } from "@prisma/client"

export type DbOp = "create" | "update" | "delete"

const UNIQUE_MSG = "اسلاگ قبلاً استفاده شده است. یک اسلاگ یکتا وارد کنید."
const GENERIC_MSG = "خطایی در ارتباط با پایگاه داده رخ داد. دوباره تلاش کنید."

export function bookDbErrorMessage(e: unknown, op: DbOp): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      const target = (e.meta?.target as string[] | undefined) ?? []
      if (target.includes("isbn")) return "شابک (ISBN) قبلاً برای کتاب دیگری ثبت شده است."
      if (target.includes("sku")) return "SKU قبلاً برای کتاب دیگری ثبت شده است."
      if (target.includes("slug")) return UNIQUE_MSG
      return "مقدار واردشده تکراری است."
    }
    if (e.code === "P2003") {
      if (op === "delete") return "این کتاب در سبد خرید یا سفارش‌ها استفاده شده و قابل حذف نیست."
      return "نویسنده یا دسته‌بندی انتخاب‌شده وجود ندارد."
    }
    if (e.code === "P2025") {
      if (op === "delete") return "کتاب موردنظر پیدا نشد."
      return "نویسنده، مترجم یا دسته‌بندی انتخاب‌شده وجود ندارد."
    }
  }
  return GENERIC_MSG
}

export function authorDbErrorMessage(e: unknown, op: DbOp): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return UNIQUE_MSG
    if (e.code === "P2003") {
      if (op === "delete") return "این نویسنده کتاب ثبت‌شده دارد (به‌عنوان نویسنده یا مترجم) و قابل حذف نیست."
      return "رکورد انتخاب‌شده وجود ندارد."
    }
    if (e.code === "P2025") {
      return op === "delete" ? "نویسنده موردنظر پیدا نشد." : "رکورد انتخاب‌شده وجود ندارد."
    }
  }
  return GENERIC_MSG
}

export function categoryDbErrorMessage(e: unknown, op: DbOp): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return UNIQUE_MSG
    if (e.code === "P2003") {
      if (op === "delete") return "این دسته‌بندی کتاب ثبت‌شده دارد و قابل حذف نیست."
      return "رکورد انتخاب‌شده وجود ندارد."
    }
    if (e.code === "P2025") {
      return op === "delete" ? "دسته‌بندی موردنظر پیدا نشد." : "رکورد انتخاب‌شده وجود ندارد."
    }
  }
  return GENERIC_MSG
}