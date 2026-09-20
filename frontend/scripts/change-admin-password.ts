import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

const prisma = new PrismaClient()

async function main() {
  const rl = readline.createInterface({ input, output })
  const newPassword = await rl.question("رمز جدید admin (حداقل ۸ کاراکتر): ")
  rl.close()

  if (newPassword.length < 8) {
    console.error("❌ رمز باید حداقل ۸ کاراکتر باشد.")
    return
  }

  const hash = await bcrypt.hash(newPassword, 10)
  const user = await prisma.user.update({
    where: { email: "admin@nonegaran.local" },
    data: { passwordHash: hash },
  })

  console.log("✅ رمز admin با موفقیت تغییر کرد:", user.email)
  console.log("⚠️  رمز جدید را جای امن ذخیره کن؛ در commit ثبت نمی‌شود.")
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())