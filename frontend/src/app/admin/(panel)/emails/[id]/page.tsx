import { notFound } from "next/navigation"
import { getEmailLogById } from "@/lib/data/emails"
import { EmailPreview } from "@/components/admin/EmailPreview"

export const metadata = { title: "جزئیات ایمیل | پنل ادمین" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEmailDetailPage({ params }: PageProps) {
  const { id } = await params
  const email = await getEmailLogById(id)
  if (!email) notFound()

  return <EmailPreview email={email} />
}