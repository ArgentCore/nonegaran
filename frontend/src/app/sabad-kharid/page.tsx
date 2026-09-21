import { auth } from "@/auth"
import { getActiveCart } from "@/lib/cart-server"
import { CartItemList } from "@/components/cart/CartItemList"

export const metadata = {
  title: "سبد خرید | نونگاران",
  description: "مدیریت سبد خرید و ادامه فرآیند خرید",
}

export default async function CartPage() {
  const session = await auth()
  const cart = await getActiveCart(session?.user?.id ?? null)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl">سبد خرید</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {cart.items.length === 0
          ? "هنوز کتابی انتخاب نکرده‌اید"
          : `${cart.items.length.toLocaleString("fa-IR")} عنوان در سبد شما`}
      </p>
      <div className="mt-8">
        <CartItemList cart={cart} />
      </div>
    </div>
  )
}