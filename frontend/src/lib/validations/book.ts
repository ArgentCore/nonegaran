import { z } from "zod"

const digits = (msg: string) => z.string().regex(/^\d+$/, msg)
const intSafe = (msg: string) =>
  digits(msg).refine((v) => Number(v) <= 2147483647, "عدد واردشده خیلی بزرگ است")

export const bookSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(300, "حداکثر ۳۰۰ کاراکتر"),
  slug: z.string().min(1, "اسلاگ الزامی است").max(300),
  authorId: z.string().min(1, "نویسنده الزامی است"),
  translatorId: z.string().optional(),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  isbn: z.string().optional(),
  sku: z.string().min(1, "SKU الزامی است"),
  year: z.preprocess((v) => (v === "" ? undefined : v), intSafe("سال میلادی باید عدد باشد").optional()),
  yearFa: z.string().optional(),
  pages: z.preprocess((v) => (v === "" ? undefined : v), intSafe("تعداد صفحات باید عدد باشد").optional()),
  priceToman: intSafe("قیمت باید عدد باشد").min(1, "قیمت الزامی است"),
  bookSize: z.enum(["raghi", "vaziri", "jibi", "khashti"]),
  coverTone: z.enum(["saffron", "petrol", "ink", "moss", "clay"]),
  status: z.enum(["draft", "published", "out_of_stock", "discontinued"]),
  inStock: z.enum(["true", "false"]),
  isPreorder: z.enum(["true", "false"]),
})

export type BookFormValues = z.infer<typeof bookSchema>