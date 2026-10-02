"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"

export function UserMenu() {
  const sessionData = useSession()
  
  // Safety check برای زمان build (prerendering)
  if (!sessionData) {
    return (
      <Link href="/vorood" className="text-sm hover:text-[var(--link)] transition-colors">
        ورود / ثبت‌نام
      </Link>
    )
  }

  const { data: session, status } = sessionData

  if (status === "loading") {
    return <div className="h-5 w-20 animate-pulse rounded bg-[var(--hairline)]" />
  }

  if (!session) {
    return (
      <Link href="/vorood" className="text-sm hover:text-[var(--link)] transition-colors">
        ورود / ثبت‌نام
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/alaghe-mandi-ha" className="flex items-center gap-1.5 text-sm hover:text-[var(--color-clay)] transition-colors">
        <Heart size={15} />
        <span>علاقه‌مندی‌ها</span>
      </Link>
      <Link href="/sefaresh-ha" className="text-sm hover:text-[var(--link)] transition-colors">
        سفارش‌های من
      </Link>
    </div>
  )
}