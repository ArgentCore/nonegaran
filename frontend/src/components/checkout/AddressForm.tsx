"use client"

import { useState } from "react"
import type { ShippingAddress } from "@/lib/validations/order"

interface AddressFormProps {
  savedAddresses: ShippingAddress[]
  initial: ShippingAddress | null
  isGuest: boolean
  onNext: (address: ShippingAddress, saveAddress: boolean, contactEmail: string) => void
}

const emptyAddress: ShippingAddress = {
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  addressLine: "",
  postalCode: "",
}

export function AddressForm({ savedAddresses, initial, isGuest, onNext }: AddressFormProps) {
  const [address, setAddress] = useState<ShippingAddress>(initial ?? emptyAddress)
  const [saveAddress, setSaveAddress] = useState(false)
  const [email, setEmail] = useState("")

  function loadSaved(idx: number) {
    const saved = savedAddresses[idx]
    if (saved) setAddress(saved)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext(address, saveAddress, email)
  }

  const inputClass = "mt-1 block w-full rounded-[var(--radius-control)] border border-[var(--hairline)] bg-[var(--background)] px-3 py-2 focus:border-[var(--link)] focus:outline-none focus:ring-1 focus:ring-[var(--link)]"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isGuest && (
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium">
            ایمیل (برای پیگیری سفارش)
          </label>
          <input
            id="contactEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={inputClass + " ltr-run"}
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            با این ایمیل می‌توانید بعداً حساب بسازید و سفارش‌هایتان را ببینید
          </p>
        </div>
      )}

      {savedAddresses.length > 0 && (
        <div>
          <label className="block text-sm font-medium">انتخاب از آدرس‌های ذخیره‌شده</label>
          <select
            onChange={(e) => loadSaved(Number(e.target.value))}
            className={inputClass}
          >
            <option value="">-- انتخاب کنید --</option>
            {savedAddresses.map((a, idx) => (
              <option key={idx} value={idx}>
                {a.recipientName} — {a.city}، {a.addressLine.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium">نام گیرنده</label>
          <input
            id="recipientName"
            value={address.recipientName}
            onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">شماره موبایل (مثال: 09123456789)</label>
          <input
            id="phone"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            required
            className={inputClass + " ltr-run"}
          />
        </div>
        <div>
          <label htmlFor="province" className="block text-sm font-medium">استان</label>
          <input
            id="province"
            value={address.province}
            onChange={(e) => setAddress({ ...address, province: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium">شهر</label>
          <input
            id="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="addressLine" className="block text-sm font-medium">آدرس کامل</label>
        <textarea
          id="addressLine"
          value={address.addressLine}
          onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
          required
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium">کد پستی (۱۰ رقم)</label>
        <input
          id="postalCode"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          required
          className={inputClass + " ltr-run"}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={saveAddress}
          onChange={(e) => setSaveAddress(e.target.checked)}
          className="h-4 w-4"
        />
        ذخیره این آدرس برای سفارش‌های بعدی
      </label>

      <button
        type="submit"
        className="w-full rounded-[var(--radius-control)] bg-[var(--foreground)] px-6 py-3 text-[var(--background)] hover:opacity-90"
      >
        ادامه — مرور سفارش
      </button>
    </form>
  )
}