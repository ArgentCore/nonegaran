# نونگاران (Nonegaran)

پلتفرم فروش و معرفی کتاب برای نشر «نونگاران». این مخزن به‌صورت
Monorepo با دو بخش `frontend` (Next.js) و `backend` (Laravel — در حال
ساخت) سازمان‌دهی شده است.

> وضعیت فعلی: **Design System** (فاز ۱ از ۱۷) تکمیل شده است.
> جزئیات کامل تصمیم‌های طراحی در [`docs/design-system.md`](./docs/design-system.md).

## ساختار مخزن

```
nonegaran/
├── frontend/   # Next.js + TypeScript + Tailwind CSS
├── backend/    # Laravel API (به‌زودی)
└── docs/       # مستندات معماری و سیستم طراحی
```

## اجرای محلی (Frontend)

```bash
cd frontend
npm install
npm run dev
```

سپس http://localhost:3000 را باز کنید — صفحه‌ی فعلی یک **پیش‌نمایش زنده‌ی
سیستم طراحی** است (رنگ، تایپوگرافی، دکمه‌ها، Dark/Light)، نه صفحه‌ی
اصلی نهایی. صفحه‌ی اصلی واقعی در فاز بعدی جایگزین می‌شود.

## چرا فونت‌ها Self-hosted هستند

محیط توسعه‌ی فعلی امکان دسترسی به `fonts.googleapis.com` را ندارد، پس
فونت‌های Vazirmatn و Noto Naskh Arabic مستقیماً از مخازن رسمی‌شان
(rastikerdar/vazirmatn و google/fonts) دانلود و در `frontend/src/fonts/`
قرار گرفته‌اند و با `next/font/local` بارگذاری می‌شوند. این روش سریع‌تر
هم هست (بدون درخواست خارجی در Runtime).
