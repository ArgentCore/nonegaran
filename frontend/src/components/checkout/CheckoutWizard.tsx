"use client"

import { useState, useTransition } from "react"
import { createOrder } from "@/lib/actions/order"
import { AddressForm } from "./AddressForm"
import { ReviewStep } from "./ReviewStep"
import type { CartWithItems } from "@/lib/cart-core"
import type { ShippingAddress } from "@/lib/validations/order"

interface CheckoutWizardProps {
  cart: CartWithItems
  contactEmail: string
  savedAddresses: ShippingAddress[]
}

const steps = ["آدرس", "مرور", "ثبت"]

export function CheckoutWizard({ cart, contactEmail, savedAddresses }: CheckoutWizardProps) {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<ShippingAddress | null>(null)
  const [saveAddress, setSaveAddress] = useState(false)
  const [emailState, setEmailState] = useState(contactEmail)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const isGuest = contactEmail === ""

  function handleAddressSubmit(newAddress: ShippingAddress, save: boolean, emailFromForm: string) {
    setAddress(newAddress)
    setSaveAddress(save)
    if (emailFromForm) setEmailState(emailFromForm)
    setStep(1)
  }

  function handleConfirm() {
    if (!address) return
    setError("")

    const formData = new FormData()
    formData.append("contactEmail", emailState)
    formData.append("saveAddress", saveAddress ? "on" : "")
    formData.append("recipientName", address.recipientName)
    formData.append("phone", address.phone)
    formData.append("province", address.province)
    formData.append("city", address.city)
    formData.append("addressLine", address.addressLine)
    formData.append("postalCode", address.postalCode)

    startTransition(async () => {
      const result = await createOrder(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((label, idx) => (
          <div key={label} className="flex flex-1 items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
              idx <= step
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--hairline)] text-[var(--text-muted)]"
            }`}>
              {idx + 1}
            </div>
            <span className={`mr-2 text-sm ${idx <= step ? "font-medium" : "text-[var(--text-muted)]"}`}>
              {label}
            </span>
            {idx < steps.length - 1 && (
              <div className={`mx-3 h-0.5 flex-1 ${idx < step ? "bg-[var(--foreground)]" : "bg-[var(--hairline)]"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-[var(--radius-control)] border border-[var(--color-clay)] bg-[var(--color-clay)]/10 p-3 text-sm text-[var(--color-clay)]">
          {error}
        </div>
      )}

      {step === 0 && (
        <AddressForm
          savedAddresses={savedAddresses}
          initial={address}
          isGuest={isGuest}
          onNext={handleAddressSubmit}
        />
      )}
      {step === 1 && address && (
        <ReviewStep
          cart={cart}
          address={address}
          contactEmail={emailState}
          saveAddress={saveAddress}
          onBack={() => setStep(0)}
          onConfirm={handleConfirm}
        />
      )}
      {isPending && (
        <div className="rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-4 text-center text-sm">
          در حال ثبت سفارش...
        </div>
      )}
    </div>
  )
}