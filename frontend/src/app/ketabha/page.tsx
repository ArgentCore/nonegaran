import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CatalogView from "@/components/catalog/CatalogView";
import { allBooks } from "@/data/books";

export const metadata: Metadata = {
  title: "کتاب‌ها | نونگاران",
  description: "مرور و جستجوی کتاب‌های نشر نونگاران بر اساس موضوع، نویسنده، قیمت و قطع.",
};

export default function BookListingPage() {
  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <h1 className="font-display text-3xl">همه‌ی کتاب‌ها</h1>
        </div>
        <CatalogView books={allBooks} />
      </main>
      <Footer />
    </>
  );
}
