import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getActiveCartForRender } from "@/lib/cart-server"
import { getSavedAddresses } from "@/lib/actions/order"
import { CheckoutWizard } from "@/components/checkout/CheckoutWizard"
import type { ShippingAddress } from "@/lib/validations/order"

export const metadata = {
  title: "پرداخت | نونگاران",
  description: "تکمیل سفارش و پرداخت",
}

export default async function CheckoutPage() {
  const session = await auth()
  const cart = await getActiveCartForRender(session?.user?.id ?? null)

  if (cart.items.length === 0) {
    redirect("/sabad-kharid")
  }

  const savedAddresses = (await getSavedAddresses()) as ShippingAddress[]
  const contactEmail = session?.user?.email ?? ""

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl">تکمیل سفارش</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {cart.items.length.toLocaleString("fa-IR")} عنوان در سبد شما
      </p>
      <div className="mt-8">
        <CheckoutWizard
          cart={cart}
          contactEmail={contactEmail}
          savedAddresses={savedAddresses}
        />
      </div>
    </div>
  )
}