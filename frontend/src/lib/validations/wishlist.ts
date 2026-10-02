import { z } from "zod"

export const wishlistSchema = z.object({
  bookId: z.string().uuid("شناسه کتاب نامعتبر است"),
})

export type WishlistValues = z.infer<typeof wishlistSchema>