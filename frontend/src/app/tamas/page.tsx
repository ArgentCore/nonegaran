import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl mb-8">تماس با ما</h1>
      <div className="flex flex-col gap-6 text-lg leading-8">
        <p className="font-display text-3xl leading-[1.7] mb-8">
          صدای شما برای ما مهم است.
        </p>
        <div className="space-y-4 text-[var(--foreground)] max-w-[65ch]">
          <p>برای پیگیری سفارشات، پیشنهادات یا سوالات کلی، می‌توانید از طریق ایمیل با ما در ارتباط باشید.</p>
          <p className="ltr-run text-[var(--link)]">
          info@nonegaran.example
          <span className="text-sm text-[var(--text-muted)] mr-2">(موقت)</span>
    </p>
        </div>
      </div>
    </div>
  );
}
