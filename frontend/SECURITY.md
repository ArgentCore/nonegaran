# Security - Nonegaran Frontend

## Rate Limiting
- 5 تلاش ناموفق در 15 دقیقه per email (in-memory)
- پیاده‌سازی: src/auth.ts - شمارنده per-process
- پس از ری‌استارت سرور، شمارنده پاک می‌شود
- برای production: Redis یا rate limit در reverse proxy (nginx/Cloudflare)

## Authentication
- NextAuth v5 + JWT
- Session maxAge: 7 روز
- JWT قبل از expiry قابل‌ابطال نیست (trade-off آگاهانه)

## Admin Protection (3 لایه)
1. middleware - redirect به /admin/login اگر session نداشته باشد
2. layout (panel) - redirect به / برای غیرadmin
3. Server Actions - requireAdmin() در هر action

## FK Protection (P2003)
- پیام فارسی «قابل حذف نیست» برای حذف نویسنده/دسته/کتاب دارای وابستگی
- داده خراب نمی‌شود
- پیاده‌سازی: src/lib/db-errors.ts

## Validation
- Zod schemas با پیام فارسی در src/lib/validations/
- سقف عددی 2,147,483,647 روی price/year/pages
- طول حداکثر برای string fields

## Known Limitations (Acceptance Risk)
- JWT غیرقابل‌ابطال قبل از expiry (نیاز به session DB)
- بدون pagination در admin lists (تعداد رکوردها فعلاً کم)
- بدون تست E2E خودکار (manual testing کافی)
- Rate limit in-memory (برای single-instance کافی)
- بدون image upload (خارج از scope)
- بدون audit log (خارج از scope)

## Changing Admin Password
`bash
npx tsx scripts/change-admin-password.ts
`

هشدار: اگر seed را دوباره اجرا کنی (npx tsx prisma/seed.ts)، رمز admin به admin123456 برمی‌گردد.

## Reporting Security Issues
این پروژه یک نمونه کار (portfolio) است. برای پروژه production:
- Rate limit: Redis + sliding window
- JWT revocation: session table در DB
- Audit log: middleware + DB
- CSP headers + HSTS در next.config
