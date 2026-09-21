import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const items = await prisma.cartItem.deleteMany()
  const carts = await prisma.cart.deleteMany()
  console.log(`✅ آیتم‌های سبد حذف شدند: ${items.count}`)
  console.log(`✅ سبدها حذف شدند: ${carts.count}`)
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())