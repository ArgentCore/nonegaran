export type BookSize = "رقعی" | "وزیری" | "جیبی" | "خشتی";

export interface Book {
  slug: string;
  title: string;
  author: string;
  authorSlug?: string;
  translator?: string;
  yearFa: string;
  year: number;
  priceToman: number;
  coverTone: "saffron" | "petrol" | "ink" | "moss" | "clay";
  coverImage?: string;
  category: string;
  categorySlug?: string;
  bookSize: BookSize;
  inStock: boolean;
  isPreorder?: boolean;
  description?: string;
  excerpt?: string;
  isbn?: string;
  sku?: string;
  pages?: number;
  publisher?: string;
}