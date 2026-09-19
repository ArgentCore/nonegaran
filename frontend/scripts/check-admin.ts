import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@nonegaran.local' } })
  if (!user) {
    console.log('❌ Admin user در database پیدا نشد')
    return
  }
  console.log('✅ Admin پیدا شد:', user.email, '| role:', user.role)
  const ok = await bcrypt.compare('admin123456', user.passwordHash)
  console.log(ok ? '✅ Password verify می‌شود' : '❌ Password verify نمی‌شود')
  console.log('hash prefix:', user.passwordHash.slice(0, 7))
}

main().finally(() => prisma.$disconnect())