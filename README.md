## 🛠️ Công nghệ sử dụng
- **Frontend & Backend**: Next.js 14 (App Router)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk (JWT + RBAC qua metadata)
- **UI**: Tailwind CSS + Shadcn UI + Radix UI
- **Internationalization**: next-intl
- **Error monitoring**: Sentry (optional)
- **Bundle analyzer**: @next/bundle-analyzer (optional)

## 📦 Yêu cầu hệ thống
- Node.js ≥ 18.x
- PostgreSQL ≥ 14.x
- npm hoặc yarn

## 🚀 Hướng dẫn cài đặt và chạy local

### 1. Clone repository

### 2. Cài đặt dependencies
npm install

### 3. Thiết lập PostgreSQL local

Cài PostgreSQL (nếu chưa có).
Tạo database:

### 4. Cấu hình môi trường
cp .env.example .env.local

### 5. Chạy migrations
npm run db:generate   # Nếu có thay đổi schema
npm run db:migrate

### 6. Seed dữ liệu mẫu (tùy chọn, khuyến khích để test)
npm run db:seed

### 7. Chạy development server
npm run dev
Mở http://localhost:3000

### 8. Thiết lập users trong Clerk
Vào Clerk Dashboard của application.
Tạo users.
Thêm metadata cho mỗi user:
{
  "role": "admin" | "manager" | "inspector" | "staff",
  "organization_id": "station_01" | "station_02" | ...
}

Roles:
admin: Full quyền, xem tất cả trạm
manager: Xem + Sửa + Phê duyệt
inspector: Xem + Sửa độ chính xác
staff: Chỉ xem

### 9. Scripts hữu ích
npm run dev               # Chạy dev server
npm run build             # Build production
npm run start             # Start production server
npm run lint              # Lint code
npm run db:generate       # Generate migration từ schema thay đổi
npm run db:migrate        # Apply migrations
npm run db:seed           # Seed dữ liệu mẫu
npm run db:studio         # Mở Drizzle Studio (nếu có)

### 10. Troubleshooting
Lỗi kết nối DB: Kiểm tra DATABASE_URL, PostgreSQL đang chạy, database tồn tại.
Lỗi Clerk: Kiểm tra keys trong .env.local, đăng nhập lại.
Migration lỗi "column already exists": Comment dòng migrate trong src/libs/DB.ts (đã làm cho local dev).
Dashboard trống: Chạy npm run db:seed để có data test.

Chúc bạn phát triển vui vẻ!
