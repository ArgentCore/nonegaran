# HANDOFF — نونگاران Frontend

سند انتقال دانش پروژه به ایجنت‌های جدید (Qwen Code) و توسعه‌دهندگان آینده.
قبل از هر تغییر، این سند و SECURITY.md را کامل بخوان.

## ۱) هویت پروژه
- نام: نونگاران (nonegaran) — سایت نشر کتاب فارسی
- Stack: Next.js 16 App Router (Turbopack) + TypeScript + Prisma/PostgreSQL (Docker) + NextAuth v5 (JWT) + Tailwind + Zod + vitest
- ساختار repo: ریشه شامل docker-compose.yml و prisma/؛ اپ Next در frontend/
- UI کاملاً فارسی و RTL (dir="rtl" روی html)

## ۲) قرارداد پیام‌های خطا (فارسی)
- هیچ خطای خام (Prisma / stack / انگلیسی) به کاربر نمایش داده نمی‌شود.
- نگاشت خطاهای DB فقط در src/lib/db-errors.ts:
  - P2002 → پیام یکتابودن (اسلاگ / ISBN / SKU)
  - P2003 → «کتاب ثبت‌شده دارد / در سبد خرید استفاده شده و قابل حذف نیست»
  - P2025 → «موردنظر پیدا نشد»
  - سایر → «خطایی در ارتباط با پایگاه داده رخ داد. دوباره تلاش کنید.»
- پیام‌های Zod فارسی و فقط در src/lib/validations/*.ts تعریف می‌شوند.
- خطاهای auth در صفحه login از کوئری‌پارامتر code نگاشت می‌شوند (نه فقط error):
  RATE_LIMITED → پیام محدودیت نرخ؛ CredentialsSignin → «ایمیل یا رمز عبور اشتباه است»
- Server Actionها هرگز throw نمی‌کنند؛ همیشه { error: "..." } برمی‌گردانند.

## ۳) قانون Encoding (بسیار مهم)
- همه فایل‌های .ts و .tsx: UTF-8 بدون BOM.
- نوشتن فایل در PowerShell فقط با:
  [System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))
- خواندن برای ویرایش: حتماً با Get-Content -Encoding UTF8
  (بدون آن، PowerShell 5.1 با ANSI می‌خواند و فارسی mojibake می‌شود).
- ترجیح قوی: بازنویسی کامل فایل با here-string به‌جای read-modify-write.
- فایل‌های .md: BOM بی‌ضرر است ولی ترجیح بدون BOM.

## ۴) معماری امنیتی (۳ لایه + rate limit)
1. src/middleware.ts — محافظ /admin/* به‌جز /admin/login؛ بدون session → redirect به login
2. src/app/admin/(panel)/layout.tsx — بررسی سمت سرور؛ غیرadmin → redirect("/")
   نکته: صفحه login بیرون route group یعنی (panel) است تا redirect loop نشود
3. requireAdmin() در ابتدای هر Server Action؛ در صورت نقص → return { error: "دسترسی غیرمجاز" }
- Rate limit: ۵ تلاش ناموفق در ۱۵ دقیقه per email، in-memory در src/auth.ts؛
  خطای سفارشی RateLimitSignin با code = "RATE_LIMITED"
- Session: JWT با maxAge هفت روز
- جزئیات تهدیدها و محدودیت‌های پذیرفته‌شده: SECURITY.md

## ۵) ساختار فایل‌ها
- src/lib/actions/*.ts → "use server"؛ ترتیب ثابت:
  requireAdmin → parse(Zod) → try/catch(DB) → revalidatePath → redirect
- src/lib/validations/*.ts → Zod با پیام فارسی + سقف عددی 2147483647
- src/lib/data/admin/*.ts → کوئری‌های admin با Prisma.GetPayload و include/_count (هرگز as any)
- src/lib/data/*.ts → کوئری‌های بخش عمومی
- src/lib/db-errors.ts → توابع خالص نگاشت خطا (تست‌شده با vitest)
- src/components/admin/*.tsx → فرم‌های "use client"؛ باکس خطا بالای دکمه submit
- src/app/admin/(panel)/... → صفحات پنل؛ (panel) route group است و در URL دیده نمی‌شود
- scripts/*.ts → ابزارهای tsx (seed, check-admin, change-admin-password, cleanup-test-data, test-data)
- src/lib/__tests__/*.test.ts → تست‌های vitest

## ۶) Routeهای فارسی
- عمومی: / و /ketabha و /ketab/[slug] و /nevisandegan و /nevisandegan/[slug] و /darbare-ma و /vaghti و /pakhsh و /pazireshe-asar و /tamas و /sabad-kharid و /design-system
- ادمین: /admin/login و /admin/dashboard و /admin/books (+ new و [id]/edit) و همین الگو برای authors و categories
- API: /api/auth/[...nextauth]
- قاعده: هرگز رکورد تستی (slugهایی مثل test یا daste-test) را در DB نگه ندار؛ با scripts/cleanup-test-data.ts پاک کن.

## ۷) تاریخچه باگ‌های مهم (درس‌ها)
1. Seed جعلی / محتوای ناصادق (فاز 2.5): فرم newsletter با action="#" و وعده‌های ساختگی → حذف و جایگزینی با اطلاعیه صادقانه.
   قانون: UI هیچ وعده‌ای نمی‌دهد که پشتش عملکرد واقعی نباشد.
2. فیلتر ناهماهنگ با Database: فیلتر status=published در لایه صفحه اعمال شد نه در کوئری Prisma → داده draft در بخش عمومی دیده شد.
   قانون: فیلترها فقط در where Prisma؛ و با داده واقعی تست شوند.
3. Redirect loop بی‌نهایت: layout محافظ روی کل /admin/* شامل خود /admin/login بود → loop.
   راه‌حل: route group (panel) تا login بیرون layout محافظ بماند.
4. Mojibake / Encoding: ویرایش فایل با Get-Content -Raw بدون -Encoding UTF8 → متن فارسی خراب شد.
   راه‌حل: قانون بخش ۳.
5. رمز افشاشده در تاریخچه Git: admin123456 داخل prisma/seed.ts از commit bc9413e در تاریخچه ذخیره شده.
   پذیرفته‌شده برای portfolio و مستند در SECURITY.md؛ قبل از هر استفاده production:
   پاکسازی تاریخچه (BFG یا git filter-repo) + rotate همه رمزها و کلیدها.

### درس‌های تکمیلی
6. NextAuth v5 کد خطای سفارشی را در کوئری‌پارامتر code می‌فرستد (نه error)؛ صفحه login باید هر دو را بخواند.
7. bundle قدیمی dev می‌تواند Server Action را بی‌پاسخ بگذارد؛ قبل از دیباگ عمیق: Ctrl+F5 یا ری‌استارت dev server.
8. as any روی include Prisma باعث نبود فیلد در runtime شد درحالی‌که TypeScript سبز بود؛ فقط Prisma.GetPayload.
9. در تست‌های vitest برای db-errors باید نمونه واقعی ساخت:
   new Prisma.PrismaClientKnownRequestError("mock", { code, clientVersion, meta })
   چون توابع با instanceof بررسی می‌کنند.
10. vitest 5 با @types/node 20 ناسازگار است؛ نسخه نصب‌شده vitest@3 است. با npm install -D vitest (بدون نسخه) آن را ارتقا نده.

## ۸) قوانین Commit
- Conventional Commits: feat / fix / docs / chore / refactor / security / content + scope داخل پرانتز مثل feat(admin):
- بدنه چندخطی با بولت برای commitهای بزرگ
- هر commit یک تغییر منطقی؛ قبل از commit حتماً npm run build و npm test سبز باشند
- پیام commit انگلیسی؛ متن UI فارسی
- هرگز .env یا رمز commit نشود؛ اسکریپت‌های تغییر رمز خروجی هشدار می‌دهند
- بعد از commit: git status باید clean باشد
- push فقط با تأیید انسان؛ ایجنت push نمی‌کند

## ۹) پروتکل کار با ایجنت (Qwen Code)
- هر جلسه فقط یک راننده (ایجنت یا چت)؛ ویرایش همزمان ممنوع
- ایجنت commit و push نمی‌کند؛ فقط گزارش می‌دهد: git status --short + خروجی تست‌ها + لیست فایل‌های تغییر یافته
- قبل از کار: Docker روشن باشد (docker exec nonegaran-postgres pg_isready -U nonegaran)
- بعد از تغییر کد: npm run build و npm test اجرا و گزارش شود
- منبع حقیقت در تعارض‌ها: همین HANDOFF.md و SECURITY.md

## ۱۰) وضعیت فازها
- فاز 1 Design System: کامل
- فاز 2 محتوا و صفحات استاتیک: کامل
- فاز 2.5 صداقت محتوا: کامل
- فاز 3A زیرساخت + Seed + Data Layer: کامل
- فاز 3B پنل ادمین + Hardening: کامل (روی origin/main)
- فاز 4 سبد خرید / Checkout / سفارش‌ها: بعدی
- فاز 5 ادمین submissions و newsletter: آینده
- فاز 6 پرداخت واقعی، polish، deploy: آینده