import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class RateLimitSignin extends CredentialsSignin {
  code = "RATE_LIMITED"
}

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(email)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(email, { count: 0, resetAt: now + WINDOW_MS })
    return true
  }
  return entry.count < MAX_ATTEMPTS
}

function recordFailure(email: string) {
  const entry = rateLimit.get(email)
  if (entry) {
    entry.count += 1
  }
}

function resetRateLimit(email: string) {
  rateLimit.delete(email)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        if (!checkRateLimit(email)) {
          throw new RateLimitSignin()
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          recordFailure(email)
          return null
        }

        if (!user.passwordHash.startsWith("$2")) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
          recordFailure(email)
          return null
        }

        resetRateLimit(email)

        // lazy import — فقط در authorize (Node runtime) اجرا می‌شود، نه middleware (Edge)
        try {
          const { mergeGuestCartToUser } = await import("@/lib/cart-server")
          await mergeGuestCartToUser(user.id)
        } catch (e) {
          console.error("[auth] cart merge failed:", e)
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})