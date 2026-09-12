export type BookSize = "رقعی" | "وزیری" | "جیبی" | "خشتی";

export interface Book {
  slug: string;
  title: string;
  author: string;
  translator?: string;
  /** Display year in Persian (Jalali) digits, e.g. "۱۴۰۳" */
  yearFa: string;
  /** Numeric Jalali year, for sorting/filtering. */
  year: number;
  priceToman: number;
  /** One of the curated cover tones — never an arbitrary/random color. */
  coverTone: "saffron" | "petrol" | "ink" | "moss" | "clay";
  category: string;
  bookSize: BookSize;
  inStock: boolean;
}
