import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) {
    return <div className="text-center mt-10">Bạn chưa đăng nhập.</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 border rounded-lg p-8 bg-white shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Thông tin tài khoản</h1>
        <div className="space-y-2">
          <div><b>ID:</b> {user.id}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Tên:</b> {user.name || 'Chưa cập nhật'}</div>
          <div><b>Vai trò:</b> {user.role}</div>
          <div><b>Trạng thái:</b> {user.status}</div>
        </div>
        <Button className="w-full mt-6" onClick={() => router.push('/change-password')}>
          Đổi mật khẩu
        </Button>
      </div>
    </div>
  );
} 