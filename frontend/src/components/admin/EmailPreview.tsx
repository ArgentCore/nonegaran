"use client"

import { useState, useTransition } from "react"
import { resendEmail } from "@/lib/actions/emails"

interface Props {
  email: {
    id: string
    to: string
    subject: string
    html: string
    template: string | null
    status: string
    attempts: number
    sentAt: Date | null
    error: string | null
    createdAt: Date
  }
}

const statusColors: Record<string, string> = {
  queued: "bg-[var(--color-saffron)]/20 text-[var(--color-saffron)]",
  sent: "bg-[var(--color-moss)]/20 text-[var(--color-moss)]",
  failed: "bg-[var(--color-clay)]/20 text-[var(--color-clay)]",
}

const statusLabels: Record<string, string> = {
  queued: "در صف",
  sent: "ارسال شد",
  failed: "ناموفق",
}

export function EmailPreview({ email }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function handleResend() {
    setError("")
    startTransition(async () => {
      const result = await resendEmail(email.id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2 py-0.5 ${statusColors[email.status] ?? ""}`}
          >
            {statusLabels[email.status] ?? email.status}
          </span>
          {email.template && (
            <span className="rounded-full border border-[var(--hairline)] px-2 py-0.5">
              {email.template}
            </span>
          )}
          <span className="text-[var(--text-muted)]">
            تلاش: {email.attempts.toLocaleString("fa-IR")}
          </span>
        </div>

        <h2 className="mt-3 font-display text-xl">{email.subject}</h2>

        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-20 text-[var(--text-muted)]">به:</dt>
            <dd className="ltr-run font-mono">{email.to}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 text-[var(--text-muted)]">ساخت:</dt>
            <dd>{new Date(email.createdAt).toLocaleString("fa-IR")}</dd>
          </div>
          {email.sentAt && (
            <div className="flex gap-2">
              <dt className="w-20 text-[var(--text-muted)]">ارسال:</dt>
              <dd>{new Date(email.sentAt).toLocaleString("fa-IR")}</dd>
            </div>
          )}
          {email.error && (
            <div className="flex gap-2">
              <dt className="w-20 text-[var(--text-muted)]">خطا:</dt>
              <dd className="text-[var(--color-clay)] ltr-run">{email.error}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleResend}
            disabled={isPending}
            className="rounded-[var(--radius-control)] bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "در حال ارسال..." : "ارسال مجدد"}
          </button>
          <a
            href="/admin/emails"
            className="rounded-[var(--radius-control)] border border-[var(--hairline)] px-4 py-2 text-sm hover:bg-[var(--surface-raised)]"
          >
            بازگشت به لیست
          </a>
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--color-clay)]">{error}</p>
        )}
      </div>

      <div className="overflow-hidden rounded-[var(--radius-control)] border border-[var(--hairline)] bg-white">
        <iframe
          title={`preview: ${email.subject}`}
          srcDoc={email.html}
          className="h-[700px] w-full"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}