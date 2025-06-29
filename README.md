# Hari News Frontend – Hệ thống Auth hiện đại

Ứng dụng tin tức được xây dựng với Next.js, Zustand, React Query, Axios, Shadcn/ui và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **Next.js 15** - React framework với App Router
- **Zustand** - State management
- **React Query (TanStack Query)** - Data fetching và caching
- **Axios** - HTTP client
- **Shadcn/ui** - UI component library
- **Tailwind CSS** - CSS framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **React Hook Form** - Form handling

## 🔐 Authentication

Ứng dụng sử dụng **httpOnly cookies** để lưu trữ access token và refresh token, đảm bảo tính bảo mật cao hơn so với localStorage.

### Tính năng bảo mật:
- Tokens được lưu trong httpOnly cookies (không thể truy cập từ JavaScript)
- Tự động gửi cookies với mọi request
- Tự động refresh token khi cần thiết
- Xử lý logout an toàn

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout với providers
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   └── register/          # Register page
├── components/
│   ├── ui/                # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── auth/              # Auth components
│       ├── login-form.tsx
│       └── register-form.tsx
├── lib/
│   ├── api/               # API services
│   │   └── auth.ts
│   ├── hooks/             # Custom hooks
│   │   └── use-auth.ts
│   ├── providers/         # React providers
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── auth-provider.tsx
│   ├── store/             # Zustand stores
│   │   └── auth-store.ts
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utility functions
│   └── axios.ts           # Axios configuration
```

## 🛠️ Cài đặt

1. Clone dự án:
```bash
git clone <repository-url>
cd hari-news-frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file environment:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Hari News
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Chạy development server:
```bash
npm run dev
```

## 🔧 Cấu hình Backend

Backend cần hỗ trợ httpOnly cookies cho authentication:

### Login Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user"
    },
    "message": "Login successful"
  }
}
```

### Cookies cần set:
- `accessToken` - JWT access token (httpOnly, secure, sameSite)
- `refreshToken` - JWT refresh token (httpOnly, secure, sameSite)

### API Endpoints:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user
- `POST /api/auth/refresh` - Refresh token

## 📖 Sử dụng

### Auth Hook:
```tsx
import { useAuth } from '@/lib/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Sử dụng các functions và state
}
```

### Zustand Store:
```tsx
import { useAuthStore } from '@/lib/store/auth-store';

function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
}
```

### API Calls:
```tsx
import { authApi } from '@/lib/api/auth';

// Gọi API trực tiếp
const user = await authApi.getCurrentUser();
```

## 🎨 UI Components

Sử dụng Shadcn/ui components với Tailwind CSS:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

<Button variant="default" size="lg">
  Click me
</Button>

<Input placeholder="Enter text..." />
```

## 🔄 State Management

- **Zustand**: Quản lý global state (auth, user info)
- **React Query**: Quản lý server state (API data, caching)
- **Local State**: Sử dụng useState cho component-specific state

## 🚀 Deployment

1. Build dự án:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 📝 License

MIT License

## Đặc điểm nổi bật

- **Quản lý trạng thái đăng nhập**: Sử dụng Zustand để lưu trạng thái xác thực (`isAuthenticated`, `user`).
- **API call hiện đại**: Sử dụng React Query để fetch, cache, và tự động refetch thông tin user.
- **Xử lý token an toàn**: Access/refresh token được lưu ở httpOnly cookie, không lưu ở localStorage.
- **Xử lý lỗi thông minh**: Tự động lấy message lỗi từ backend để hiển thị toast, không dùng message mặc định của Axios.
- **Tự động refresh token**: Khi `/auth/me` trả về 401, hệ thống tự gọi `/auth/refresh` và thử lại.
- **UI hiện đại**: Sử dụng Shadcn/ui và Tailwind CSS cho form và toast.
- **Tách biệt logic**: API, hooks, store, và utils được tách riêng, dễ bảo trì và mở rộng.

---

## Cách sử dụng hệ thống Auth

### 1. Sử dụng hook `useAuth` trong component

```tsx
import { useAuth } from '@/lib/hooks/use-auth';

const LoginForm = () => {
  const { login, isLoginLoading } = useAuth();

  const handleSubmit = (values) => {
    login(values); // values: { email, password }
  };

  // ...
};
```

### 2. Hiển thị thông báo lỗi/success
- Khi API trả về lỗi, toast sẽ tự động hiển thị message từ backend (ví dụ: "Sai mật khẩu", "Tài khoản không tồn tại", ...).
- Khi thành công, toast sẽ hiển thị message thành công.

### 3. Kiểm tra trạng thái đăng nhập và user

```tsx
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  // Đã đăng nhập, có thể truy cập user
}
```

### 4. Logout
```tsx
const { logout } = useAuth();
logout();
```

### 5. Đổi mật khẩu, quên mật khẩu, đăng ký...
Tất cả đều dùng các hàm tương ứng trong hook `useAuth`:
```tsx
const { changePassword, forgotPassword, resetPassword, register } = useAuth();
```

---

## Cấu trúc thư mục chính

```
src/
  lib/
    api/
      auth.ts           // Gọi API auth
    hooks/
      use-auth.ts       // Hook auth chính
    store/
      auth-store.ts     // Zustand store cho auth
    utils/
      api-utils.ts      // Xử lý response, extract message, ...
```

---

## Mở rộng & Tùy biến

- **Thêm API mới**: Thêm vào `src/lib/api/auth.ts` và expose qua hook nếu cần.
- **Thay đổi UI**: Sửa các component form, toast theo ý muốn.
- **Tùy biến message**: Backend chỉ cần trả về `{ message: "..." }` trong response lỗi là frontend sẽ tự động lấy đúng message để hiển thị.

---

## Lưu ý khi phát triển

- **Không lưu token ở localStorage** để đảm bảo bảo mật.
- **Luôn dùng các hàm trong hook `useAuth`** để đảm bảo logic đồng nhất.
- **Nếu backend thay đổi format response**, chỉ cần sửa ở file `api-utils.ts` là đủ.
- **Nếu muốn mở rộng cho các API khác**, chỉ cần dùng hàm `extractErrorMessage(error)` trong `onError` của mutation.

---

## Ví dụ: Đăng nhập và xử lý lỗi

```tsx
const { login, isLoginLoading } = useAuth();

const handleLogin = (values) => {
  login(values); // Nếu sai, toast sẽ hiện đúng message từ backend
};
```

## Đóng góp

Nếu muốn mở rộng, tối ưu, hoặc sửa lỗi, hãy tuân thủ cấu trúc và style code hiện tại.
Mọi thắc mắc hoặc góp ý, liên hệ team FE.
