import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // /admin/login نیاز به auth ندارد
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // بقیه /admin/* نیاز به admin auth دارند
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    if (req.auth.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}