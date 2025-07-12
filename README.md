# DevShare Lite

## Thông tin tác giả
- **Trường:** Trường Đại học Bách khoa - Đại học Đà Nẵng (DUT)
- **MSSV:** 102230103
- **Họ tên:** Nguyễn Thái Ngọc Thảo

## Tổng quan dự án

**DevShare Lite** là một nền tảng chia sẻ kiến thức lập trình được xây dựng dành cho cộng đồng developer Việt Nam. Dự án cung cấp một không gian để các lập trình viên có thể chia sẻ kinh nghiệm, học hỏi lẫn nhau và xây dựng cộng đồng.

### Các chức năng chính đã thực hiện:

#### Quản lý người dùng
- **Đăng ký/Đăng nhập:** Hệ thống xác thực với JWT
- **Xác thực email:** Gửi mã xác thực qua email để kích hoạt tài khoản
- **Quản lý hồ sơ:** Cập nhật thông tin cá nhân, avatar
- **Follow/Unfollow:** Theo dõi các tác giả yêu thích

#### Quản lý bài viết
- **Tạo bài viết:** Editor hỗ trợ Markdown với preview trực tiếp
- **Quản lý trạng thái:** Draft (bản nháp), Published (công khai), Archived (lưu trữ)
- **Upload hình ảnh:** Tích hợp Cloudinary để lưu trữ và tối ưu hình ảnh
- **Tag:** Phân loại bài viết theo chủ đề (JavaScript, React, Node.js, etc.)
- **Like bài viết:** Tương tác với nội dung yêu thích
- **Tìm kiếm và lọc:** Tìm bài viết theo tiêu đề

#### Hệ thống bình luận
- **Bình luận đa cấp:** Hỗ trợ trả lời bình luận (reply)
- **Vote bình luận:** Like để đánh giá chất lượng
- **CRUD bình luận:** Tạo, chỉnh sửa, xóa bình luận
- **Phân quyền:** Chỉ tác giả mới có thể chỉnh sửa/xóa bình luận của mình

#### Dashboard & Quản lý
- **Dashboard cá nhân:** Quản lý bài viết của bản thân
- **Xem profile người dùng:** Xem thông tin và bài viết của tác giả khác

## Công nghệ sử dụng

### Backend (NestJS)
- **Framework:** NestJS - Framework Node.js mạnh mẽ, hỗ trợ TypeScript native và kiến trúc module
- **Database:** MongoDB với Mongoose ODM - Database NoSQL linh hoạt, phù hợp với cấu trúc dữ liệu đa dạng
- **Authentication:** JWT + Passport.js - Bảo mật cao với JWT tokens và strategies đa dạng
- **Validation:** Class-validator + Class-transformer - Validate dữ liệu đầu vào an toàn
- **Email Service:** Nodemailer + Handlebars - Gửi email xác thực với template đẹp mắt
- **File Upload:** Multer + Cloudinary - Upload và tối ưu hình ảnh trên cloud
- **API Documentation:** Swagger - Tự động sinh documentation API
- **Configuration:** @nestjs/config - Quản lý environment variables an toàn

### Frontend (Next.js)
- **Framework:** Next.js 15 - React framework với SSR/SSG, routing tự động và optimization
- **UI Library:** Ant Design 5 - Component library chuyên nghiệp với theme system
- **Styling:** Styled-components - CSS-in-JS với dynamic styling
- **Authentication:** NextAuth.js - Giải pháp auth toàn diện cho Next.js
- **HTTP Client:** Axios - HTTP client với interceptor và error handling
- **Markdown:** React-markdown + Rehype-highlight - Render markdown với syntax highlighting
- **Date handling:** Day.js - Thư viện xử lý thời gian nhẹ và mạnh mẽ
- **State Management:** React hooks + Session management

### Lý do lựa chọn công nghệ:

1. **NestJS:** Cung cấp kiến trúc module rõ ràng, hỗ trợ TypeScript mạnh mẽ và ecosystem phong phú
2. **MongoDB:** Linh hoạt trong việc lưu trữ dữ liệu có cấu trúc phức tạp như bình luận đa cấp
3. **Next.js:** Performance tối ưu với SSR, SEO friendly và developer experience tuyệt vời
4. **Ant Design:** Component library mature với design system nhất quán
5. **JWT:** Stateless authentication phù hợp với kiến trúc microservice
6. **Cloudinary:** CDN global với tối ưu hình ảnh tự động

## Cấu trúc thư mục dự án

### Backend Structure
```
backend/
├── src/
│   ├── app.module.ts              # Module chính của ứng dụng
│   ├── main.ts                    # Entry point
│   ├── auth/                      # Module xác thực
│   │   ├── auth.controller.ts     # API endpoints cho auth
│   │   ├── auth.service.ts        # Business logic cho auth
│   │   ├── auth.module.ts         # Auth module configuration
│   │   ├── dto/                   # Data Transfer Objects
│   │   └── passport/              # Passport strategies (JWT, Local)
│   ├── modules/
│   │   ├── users/                 # Module quản lý người dùng
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── posts/                 # Module quản lý bài viết
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── posts.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   └── comments/              # Module quản lý bình luận
│   │       ├── comments.controller.ts
│   │       ├── comments.service.ts
│   │       ├── comments.module.ts
│   │       ├── dto/
│   │       └── schemas/
│   ├── decorator/                 # Custom decorators
│   ├── helpers/                   # Utility functions
│   └── mail/                      # Email templates
├── test/                          # E2E tests
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Homepage
│   │   ├── auth/                  # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify/
│   │   ├── dashboard/             # Protected dashboard pages
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── posts/             # Post detail pages
│   │   │   ├── myPosts/           # User's posts management
│   │   │   ├── editPost/          # Post editor
│   │   │   └── profile/           # User profiles
│   │   └── api/                   # API routes (NextAuth)
│   ├── components/                # Reusable components
│   │   ├── auth/                  # Auth-related components
│   │   ├── common/                # Common UI components
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   ├── CommentSection.tsx
│   │   │   ├── EditPostForm.tsx
│   │   │   ├── MyPostsList.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── input/                 # Form components
│   │   └── layout/                # Layout components
│   ├── types/                     # TypeScript type definitions
│   └── utils/                     # Utility functions and API clients
├── public/                        # Static assets
└── package.json
```

## Hướng dẫn cài đặt và khởi chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm hoặc yarn

### 1. Clone dự án
```bash
git clone <repository-url>
cd devshare-lite
```

### 2. Cài đặt Backend

#### Bước 1: Di chuyển vào thư mục backend
```bash
cd backend
```

#### Bước 2: Cài đặt dependencies
```bash
npm install
```

#### Bước 3: Cấu hình environment variables
Tạo file `.env` trong thư mục `backend` với nội dung:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/devshare-lite

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration (MailDev for development)
MAILDEV_INCOMING_HOST=localhost
MAILDEV_INCOMING_PORT=1025
MAILDEV_INCOMING_USER=
MAILDEV_INCOMING_PASS=

# Cloudinary (for image upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server
PORT=8000
```

#### Bước 4: Khởi chạy MongoDB
Đảm bảo MongoDB đang chạy trên máy local hoặc sử dụng MongoDB Atlas.

#### Bước 5: Khởi chạy MailDev (cho development)
```bash
# Cài đặt MailDev global
npm install -g maildev

# Khởi chạy MailDev
maildev
```
MailDev sẽ chạy trên http://localhost:1080 để xem email test.

#### Bước 6: Khởi chạy backend server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run start:prod
```

Backend sẽ chạy trên: http://localhost:8000

### 3. Cài đặt Frontend

#### Bước 1: Mở terminal mới và di chuyển vào thư mục frontend
```bash
cd frontend
```

#### Bước 2: Cài đặt dependencies
```bash
npm install
```

#### Bước 3: Cấu hình environment variables
Tạo file `.env.local` trong thư mục `frontend` với nội dung:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Cloudinary (for image display)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

#### Bước 4: Khởi chạy frontend server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run start
```

Frontend sẽ chạy trên: http://localhost:3000

### 4. Truy cập ứng dụng

1. **Frontend:** http://localhost:3000
2. **Backend API:** http://localhost:8000
3. **API Documentation (Swagger):** http://localhost:8000/api
4. **MailDev Interface:** http://localhost:1080

### 5. Tài khoản test

Để bắt đầu sử dụng, bạn có thể:
1. Đăng ký tài khoản mới tại http://localhost:3000/auth/register
2. Xác thực email qua MailDev interface
3. Đăng nhập và bắt đầu tạo bài viết
