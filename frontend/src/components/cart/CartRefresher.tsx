"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function CartRefresher() {
  const router = useRouter()

  useEffect(() => {
    const handler = () => router.refresh()
    window.addEventListener("cart-updated", handler)
    return () => window.removeEventListener("cart-updated", handler)
  }, [router])

  return null
}