"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isAuthenticated, logout, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Bạn chưa đăng nhập</h1>
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để truy cập dashboard
          </p>
          <Button asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Chào mừng bạn trở lại, {user?.name || user?.email}!
            </p>
          </div>
          <Button onClick={() => logout()} variant="outline">
            Đăng xuất
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Thông tin cá nhân</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Tên:</strong> {user?.name || 'Chưa cập nhật'}</p>
              <p><strong>Vai trò:</strong> {user?.role}</p>
              <p><strong>Trạng thái:</strong> {user?.status}</p>
              <p><strong>Ngày tạo:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Số lần đăng nhập:</strong> {user?.loginCount || 0}</p>
              <p><strong>Trạng thái tài khoản:</strong> {user?.isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
              <p><strong>Xác thực email:</strong> {user?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
              <p><strong>Lần đăng nhập cuối:</strong> {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Hành động nhanh</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">Cập nhật hồ sơ</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings">Cài đặt</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Debug info - có thể xóa sau */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
