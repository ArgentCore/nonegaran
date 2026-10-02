import Link from "next/link"
import type { EmailStatus } from "@prisma/client"
import { getEmailLogs } from "@/lib/data/emails"

export const metadata = { title: "صندوق خروجی ایمیل | پنل ادمین" }

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

const tabs: { value: string; label: string }[] = [
  { value: "", label: "همه" },
  { value: "queued", label: "در صف" },
  { value: "sent", label: "ارسال شده" },
  { value: "failed", label: "ناموفق" },
]

const statusStyles: Record<string, string> = {
  queued: "bg-[var(--color-saffron)]/20 text-[var(--color-saffron)]",
  sent: "bg-[var(--color-moss)]/20 text-[var(--color-moss)]",
  failed: "bg-[var(--color-clay)]/20 text-[var(--color-clay)]",
}

const statusLabels: Record<string, string> = {
  queued: "در صف",
  sent: "ارسال شد",
  failed: "ناموفق",
}

export default async function AdminEmailsPage({ searchParams }: PageProps) {
  const { status } = await searchParams
  const filter: EmailStatus | undefined =
    status === "queued" || status === "sent" || status === "failed"
      ? (status as EmailStatus)
      : undefined

  const emails = await getEmailLogs({ status: filter })

  return (
    <div>
      <h1 className="font-display text-3xl">صندوق خروجی ایمیل</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {emails.length.toLocaleString("fa-IR")} ایمیل
        {!process.env.RESEND_API_KEY && (
          <span className="mr-2 rounded-full border border-[var(--color-saffron)] px-2 py-0.5 text-xs text-[var(--color-saffron)]">
            حالت Mock (بدون API Key)
          </span>
        )}
      </p>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => {
          const active = (status ?? "") === tab.value
          return (
            <Link
              key={tab.value}
              href={
                tab.value ? `/admin/emails?status=${tab.value}` : "/admin/emails"
              }
              className={`rounded-[var(--radius-control)] px-4 py-2 text-sm transition-colors ${
                active
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "border border-[var(--hairline)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {emails.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-control)] border border-dashed border-[var(--hairline)] p-12 text-center text-[var(--text-muted)]">
          ایمیلی ثبت نشده است.
        </div>
      ) : (
        <div className="mt-6 divide-y divide-[var(--hairline)] rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)]">
          {emails.map((email) => (
            <Link
              key={email.id}
              href={`/admin/emails/${email.id}`}
              className="flex items-center gap-4 p-4 hover:bg-[var(--background)]"
            >
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${statusStyles[email.status] ?? ""}`}
              >
                {statusLabels[email.status] ?? email.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{email.subject}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)] ltr-run">
                  {email.to}
                  {email.template && ` · ${email.template}`}
                </p>
              </div>
              <time className="text-xs text-[var(--text-muted)] tabular-nums">
                {new Date(email.createdAt).toLocaleDateString("fa-IR")}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}