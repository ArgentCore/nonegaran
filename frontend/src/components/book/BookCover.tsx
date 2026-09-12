import Link from "next/link";
import type { Book } from "@/lib/types";
import { formatToman } from "@/lib/format";

const toneMap: Record<Book["coverTone"], string> = {
  saffron: "var(--color-saffron)",
  petrol: "var(--color-petrol)",
  ink: "var(--color-ink)",
  moss: "var(--color-moss)",
  clay: "var(--color-clay)",
};

// Cover text always uses paper/ink for contrast, independent of theme —
// these tones are dark/saturated enough that paper text stays readable
// (verified: all >= 4.5:1 against --color-paper, see docs/design-system.md).
const toneTextMap: Record<Book["coverTone"], string> = {
  saffron: "var(--color-ink)",
  petrol: "var(--color-paper)",
  ink: "var(--color-paper)",
  moss: "var(--color-paper)",
  clay: "var(--color-paper)",
};

interface BookCoverProps {
  book: Book;
  /** Controls type scale inside the placeholder cover — larger for hero-weight items. */
  emphasis?: "default" | "large";
  className?: string;
}

/**
 * Placeholder book cover: a typographic treatment standing in for real
 * cover artwork (not yet supplied by the client). Renders the title and
 * author directly on a curated brand tone so the layout can be reviewed
 * today, and swaps to <Image> once real covers exist — see
 * docs/architecture.md "Content & CMS" for the swap plan.
 */
export default function BookCover({
  book,
  emphasis = "default",
  className = "",
}: BookCoverProps) {
  return (
    <Link
      href={`/ketab/${book.slug}`}
      className={`group flex flex-col gap-3 ${className}`}
    >
      <span
        className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[var(--radius-control)] p-5 transition-transform duration-200 group-hover:-translate-y-1"
        style={{ background: toneMap[book.coverTone], color: toneTextMap[book.coverTone] }}
      >
        <span className="text-xs opacity-80">{book.category}</span>
        <span
          className={`font-display leading-snug ${
            emphasis === "large" ? "text-3xl" : "text-xl"
          }`}
        >
          {book.title}
        </span>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-medium group-hover:text-[var(--link)] transition-colors">
          {book.title}
        </span>
        <span className="text-sm text-[var(--text-muted)]">
          {book.author}
          {book.translator ? ` · ترجمه‌ی ${book.translator}` : ""}
        </span>
        <span className="text-sm">
          <span className="ltr-run">{formatToman(book.priceToman)}</span>{" "}
          تومان
        </span>
      </span>
    </Link>
  );
}
