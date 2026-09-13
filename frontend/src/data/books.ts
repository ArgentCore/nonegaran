import type { Book } from "@/lib/types";

/**
 * Placeholder catalog data. Titles/authors below are invented for layout
 * and content-design purposes only — replace with the client's real
 * catalog before launch.
 */
export const allBooks: Book[] = [
  {
    slug: "baran-o-khakestar",
    title: "باران و خاکستر",
    author: "سارا امینی",
    authorSlug: "sara-amini",
    yearFa: "۱۴۰۳",
    year: 1403,
    priceToman: 285000,
    coverTone: "saffron",
    category: "رمان",
    categorySlug: "roman",
    bookSize: "رقعی",
    inStock: true,
    description: "داستانی درباره‌ی بازگشت به روستایی که در حافظه‌ی خاک دفن شده است. سارا امینی در این رمان، تقابل سنت و مدرنیته را از دریچه‌ی چشم زنی روایت می‌کند که پس از سال‌ها به زادگاهش بازمی‌گردد.",
    pages: 240,
  },
  {
    slug: "sokoot-e-marmar",
    title: "سکوت مرمر",
    author: "فرهاد نجفی",
    authorSlug: "farhad-najafi",
    yearFa: "۱۴۰۳",
    year: 1403,
    priceToman: 210000,
    coverTone: "petrol",
    category: "شعر",
    categorySlug: "sher",
    bookSize: "رقعی",
    inStock: true,
    description: "مجموعه‌شعری که در آن زبان، از بار اضافی تهی می‌شود تا تنها سکوتِ معنا باقی بماند.",
    pages: 112,
  },
  {
    slug: "shahre-bi-name",
    title: "شهر بی‌نام",
    author: "لیلا کاظمی",
    authorSlug: "leila-kazemi",
    yearFa: "۱۴۰۲",
    year: 1402,
    priceToman: 320000,
    coverTone: "ink",
    category: "رمان",
    categorySlug: "roman",
    bookSize: "وزیری",
    inStock: false,
    description: "روایتی دیستوپیایی از شهری که نامش را از دست داده است.",
  },
  {
    slug: "falsafeye-nan",
    title: "فلسفه‌ی نان",
    author: "امیر رستمی",
    authorSlug: "amir-rostami",
    yearFa: "۱۴۰۳",
    year: 1403,
    priceToman: 195000,
    coverTone: "moss",
    category: "اندیشه",
    categorySlug: "andisheh",
    bookSize: "رقعی",
    inStock: true,
    description: "تأملی در باب نان به‌عنوان نماد برکت و رنج انسانی.",
    pages: 180,
  },
  {
    slug: "safar-be-darun",
    title: "سفر به درون",
    author: "مریم حیدری",
    authorSlug: "maryam-heidari",
    yearFa: "۱۴۰۲",
    year: 1402,
    priceToman: 250000,
    coverTone: "clay",
    category: "روان‌شناسی",
    categorySlug: "ravan-shenasi",
    bookSize: "جیبی",
    inStock: true,
  },
  {
    slug: "avaze-baad",
    title: "آواز باد",
    author: "هاروکی موراکامی",
    authorSlug: "haruki-murakami",
    translator: "نگار حسینی",
    yearFa: "۱۴۰۱",
    year: 1401,
    priceToman: 275000,
    coverTone: "petrol",
    category: "رمان",
    categorySlug: "roman",
    bookSize: "وزیری",
    inStock: true,
    description: "ترجمه‌ای روان از شاهکار موراکامی که مرز میان واقعیت و رویا را درمی‌نوردد.",
    pages: 340,
  },
  {
    slug: "khate-sevvom",
    title: "خط سوم",
    author: "بهرام توکلی",
    authorSlug: "bahram-tavakoli",
    yearFa: "۱۴۰۲",
    year: 1402,
    priceToman: 165000,
    coverTone: "saffron",
    category: "شعر",
    categorySlug: "sher",
    bookSize: "جیبی",
    inStock: false,
  },
  {
    slug: "zire-aseman-e-khakestari",
    title: "زیر آسمان خاکستری",
    author: "نیلوفر عزیزی",
    authorSlug: "niloofar-azizi",
    yearFa: "۱۴۰۰",
    year: 1400,
    priceToman: 230000,
    coverTone: "ink",
    category: "رمان",
    categorySlug: "roman",
    bookSize: "رقعی",
    inStock: true,
  },
  {
    slug: "chera-mikhanim",
    title: "چرا می‌خوانیم",
    author: "رضا کیانی",
    authorSlug: "reza-kiani",
    yearFa: "۱۴۰۳",
    year: 1403,
    priceToman: 175000,
    coverTone: "moss",
    category: "اندیشه",
    categorySlug: "andisheh",
    bookSize: "جیبی",
    inStock: true,
  },
  {
    slug: "otagh-e-khali",
    title: "اتاق خالی",
    author: "شیوا مرادی",
    authorSlug: "shiva-moradi",
    yearFa: "۱۴۰۱",
    year: 1401,
    priceToman: 240000,
    coverTone: "clay",
    category: "روان‌شناسی",
    categorySlug: "ravan-shenasi",
    bookSize: "وزیری",
    inStock: true,
  },
];

export const featuredBooks: Book[] = allBooks.slice(0, 5);

export function getBookBySlug(slug: string): Book | undefined {
  return allBooks.find((b) => b.slug === slug);
}

export function getBooksByAuthor(authorSlug: string): Book[] {
  return allBooks.filter((b) => b.authorSlug === authorSlug);
}

export function getUniqueAuthors(): { name: string; slug: string }[] {
  const authors = new Map<string, string>();
  allBooks.forEach((b) => {
    if (b.authorSlug && !authors.has(b.authorSlug)) {
      authors.set(b.authorSlug, b.author);
    }
  });
  return Array.from(authors.entries()).map(([slug, name]) => ({ slug, name }));
}