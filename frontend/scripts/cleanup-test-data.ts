import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const deletedAuthor = await prisma.author.deleteMany({
    where: { slug: { in: ["nevisandeh-test", "daste-test"] } },
  })
  console.log(`✅ نویسنده تستی حذف‌شده: ${deletedAuthor.count}`)

  const deletedUser = await prisma.user.deleteMany({
    where: { email: "customer@nonegaran.local" },
  })
  console.log(`✅ کاربر customer حذف‌شده: ${deletedUser.count}`)

  const authorsCount = await prisma.author.count()
  const usersCount = await prisma.user.count()
  console.log("")
  console.log("📊 وضعیت نهایی DB:")
  console.log(`   نویسندگان: ${authorsCount} (باید 11 باشد)`)
  console.log(`   کاربران: ${usersCount} (باید 1 باشد - فقط admin)`)
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())