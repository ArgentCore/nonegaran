import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const order = await prisma.order.findFirst({ orderBy: { createdAt: "desc" } })
  if (!order) {
    console.log("هیچ سفارشی در DB نیست")
    return
  }
  console.log("ORDER_ID=" + order.id)
  console.log("STATUS=" + order.status)
  console.log("TOTAL=" + order.totalAmount)
}

main().finally(() => prisma.$disconnect())