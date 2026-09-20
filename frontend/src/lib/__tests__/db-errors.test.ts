import { describe, it, expect } from "vitest"
import { Prisma } from "@prisma/client"
import { bookDbErrorMessage, authorDbErrorMessage, categoryDbErrorMessage } from "../db-errors"

function prismaError(code: string, target?: string[]) {
  return new Prisma.PrismaClientKnownRequestError("mock", {
    code,
    clientVersion: "6.12.0",
    meta: target ? { target } : undefined,
  })
}

describe("bookDbErrorMessage", () => {
  it("P2002 slug", () => expect(bookDbErrorMessage(prismaError("P2002", ["slug"]), "create")).toContain("اسلاگ"))
  it("P2002 isbn", () => expect(bookDbErrorMessage(prismaError("P2002", ["isbn"]), "create")).toContain("شابک"))
  it("P2002 sku", () => expect(bookDbErrorMessage(prismaError("P2002", ["sku"]), "create")).toContain("SKU"))
  it("P2003 delete", () => expect(bookDbErrorMessage(prismaError("P2003"), "delete")).toContain("سبد خرید"))
  it("P2003 update", () => expect(bookDbErrorMessage(prismaError("P2003"), "update")).toContain("نویسنده یا دسته‌بندی"))
  it("P2025 delete", () => expect(bookDbErrorMessage(prismaError("P2025"), "delete")).toContain("پیدا نشد"))
  it("unknown error", () => expect(bookDbErrorMessage(new Error("x"), "create")).toContain("پایگاه داده"))
})

describe("authorDbErrorMessage", () => {
  it("P2002", () => expect(authorDbErrorMessage(prismaError("P2002"), "create")).toContain("اسلاگ"))
  it("P2003 delete", () => expect(authorDbErrorMessage(prismaError("P2003"), "delete")).toContain("کتاب ثبت‌شده"))
  it("P2025 delete", () => expect(authorDbErrorMessage(prismaError("P2025"), "delete")).toContain("پیدا نشد"))
})

describe("categoryDbErrorMessage", () => {
  it("P2002", () => expect(categoryDbErrorMessage(prismaError("P2002"), "create")).toContain("اسلاگ"))
  it("P2003 delete", () => expect(categoryDbErrorMessage(prismaError("P2003"), "delete")).toContain("کتاب ثبت‌شده"))
})