# Hari News Frontend

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
