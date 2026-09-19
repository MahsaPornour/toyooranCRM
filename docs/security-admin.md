# راه‌اندازی امن پنل مدیریت

## متغیرهای محیطی

فایل `.env.example` را به `.env` خارج از Git تبدیل کنید و مقدارهای واقعی را وارد کنید. در production، `ADMIN_BOOTSTRAP_PASSWORD` باید حداقل ۱۶ کاراکتر، تصادفی و فقط یک‌بارمصرف برای ایجاد مدیر اولیه باشد. مقدارهای `TURNSTILE_SECRET_KEY` و `VITE_TURNSTILE_SITE_KEY` را از Cloudflare Turnstile دریافت کنید؛ بدون کلید secret، CAPTCHA در production پذیرفته نمی‌شود.

سرور باید با `npm run build` و سپس `npm start` اجرا شود، نه با Vite development server. داده‌ها در `DATA_DIR/toyooran.sqlite` ذخیره می‌شوند و این مسیر باید persistent و backup‌شده باشد.

## ورود مدیر

پس از تنظیم متغیرهای محیطی و اجرای سرور، به `/admin` بروید و با مقدارهای `ADMIN_USERNAME` و `ADMIN_BOOTSTRAP_PASSWORD` وارد شوید. رمز در مرورگر یا Git ذخیره نمی‌شود؛ backend آن را با bcrypt ذخیره می‌کند و نشست با cookie `HttpOnly`, `Secure` در production و `SameSite=Strict` نگهداری می‌شود.

اگر مدیر از قبل در SQLite وجود داشته باشد، تغییر `ADMIN_BOOTSTRAP_PASSWORD` رمز او را عوض نمی‌کند. برای تغییر رمز باید endpoint مدیریتی تغییر رمز اضافه یا رکورد مدیر در یک migration کنترل‌شده تغییر داده شود؛ حذف database بدون backup توصیه نمی‌شود.

## MFA

MFA با TOTP در backend فراهم شده است. پس از ورود، از endpointهای `/api/auth/mfa/setup` و `/api/auth/mfa/confirm` برای ساخت secret و تأیید کد برنامه Authenticator استفاده کنید. secret را فقط در password manager نگه دارید. قبل از فعال‌سازی MFA در محیط اصلی، backup امن database تهیه کنید.

در پاسخ endpoint `mfa/setup`، ده recovery code یک‌بارمصرف نیز برگردانده می‌شود. آن‌ها را فقط یک‌بار، به‌صورت آفلاین و در password manager ذخیره کنید. هر کد پس از یک بار استفاده حذف منطقی می‌شود و دوباره قابل استفاده نیست. recovery code جایگزین کد TOTP در مرحله ورود است و پس از مصرف باید یک MFA setup جدید یا دستگاه پشتیبان تنظیم شود.

## نکات عملیاتی

فقط HTTPS استفاده کنید، دسترسی فایل SQLite را محدود کنید، `DATA_DIR` را خارج از web root قرار دهید، backup رمزنگاری‌شده و rotation کلیدها داشته باشید، و لاگ‌های ورود ناموفق و rate-limit را در سامانه مانیتورینگ ثبت کنید. هرگز `.env`، database یا مقدار secret را commit نکنید.
