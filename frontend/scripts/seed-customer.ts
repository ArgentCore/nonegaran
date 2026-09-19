import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('customer123456', 10)
  const user = await prisma.user.upsert({
    where: { email: 'customer@nonegaran.local' },
    update: {},
    create: {
      email: 'customer@nonegaran.local',
      passwordHash: hash,
      role: 'customer',
      name: 'مشتری تستی',
    },
  })
  console.log('✅ Customer user ensured:', user.email, '| role:', user.role, '| id:', user.id)
}

main().finally(() => prisma.$disconnect())