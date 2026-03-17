# 💊 MedAI Pro — Nền tảng Tra cứu Thuốc Thông minh

Ứng dụng web tra cứu thuốc, dược phẩm và tin tức y tế được xây dựng với **Next.js 16** và **Supabase**.

## ✨ Tính năng

- 🔍 **Tra cứu thuốc** — Tìm kiếm theo tên, danh mục chuyên khoa
- 📰 **Tin tức Y tế** — Cập nhật thông tin y khoa mới nhất
- 👤 **Xác thực người dùng** — Đăng ký / đăng nhập (Supabase Auth)
- 🛡️ **Admin Portal** — Quản lý thuốc, danh mục, tin tức
- 🤖 **Trợ lý AI** — Gợi ý thuốc theo triệu chứng

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deploy | Netlify / Vercel |

## 🚀 Chạy local

### 1. Clone & cài đặt
```bash
git clone https://github.com/nguyenhainam2502/Medicine-Web.git
cd Medicine-Web
npm install
```

### 2. Cấu hình môi trường
Tạo file `apps/web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> ⚠️ Lấy các key này từ **Supabase Dashboard → Settings → API**

### 3. Khởi tạo Database
Chạy các file SQL trong thư mục `supabase/` theo thứ tự:
```
1. migrations/20260304071402_init_core_tables.sql
2. admin_setup.sql
3. add_image_url.sql
4. add_news_table.sql
```

### 4. Chạy dev server
```bash
cd apps/web
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc Project

```
Medicine-Web/
├── apps/
│   └── web/                  # Next.js app
│       └── src/
│           ├── app/
│           │   ├── admin/    # Admin portal
│           │   ├── news/     # Tin tức y tế
│           │   ├── products/ # Danh sách thuốc
│           │   └── profile/  # Trang cá nhân
│           ├── components/   # React components
│           └── lib/          # Supabase client
└── supabase/                 # Database migrations & SQL
```

## 🔐 Environment Variables

| Variable | Mô tả | Có thể public? |
|----------|-------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project | ✅ Có |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (read-only) | ✅ Có |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | ❌ **Bí mật** |

## 📄 License

MIT © 2026 MedAI Pro
