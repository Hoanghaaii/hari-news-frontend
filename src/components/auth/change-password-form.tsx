"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from '@/lib/store/auth-store';

const changeSchema = z
  .object({
    oldPassword: z.string().min(6, "Mật khẩu cũ không hợp lệ"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ChangeFormData = z.infer<typeof changeSchema>;

export function ChangePasswordForm() {
  const { changePassword, isChangePasswordLoading, forgotPassword, isForgotPasswordLoading } = useAuth();
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeFormData>({
    resolver: zodResolver(changeSchema),
  });
  const onSubmit = (data: ChangeFormData) => {
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
        <p className="text-muted-foreground">
          Cập nhật mật khẩu mới cho tài khoản của bạn
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="Nhập mật khẩu cũ"
            {...register("oldPassword")}
            className={errors.oldPassword ? "border-destructive" : ""}
          />
          {errors.oldPassword && (
            <p className="text-sm text-destructive">
              {errors.oldPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Nhập mật khẩu mới"
            {...register("newPassword")}
            className={errors.newPassword ? "border-destructive" : ""}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-destructive" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <Button
            type="submit"
            className="w-1/2"
            disabled={isChangePasswordLoading}
          >
            {isChangePasswordLoading ? "Đang đổi..." : "Đổi mật khẩu"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-1/2 text-right"
            disabled={isForgotPasswordLoading || !user?.email}
            onClick={() => user?.email && forgotPassword(user.email)}
          >
            {isForgotPasswordLoading ? "Đang gửi..." : "Quên mật khẩu?"}
          </Button>
        </div>
      </form>
    </div>
  );
}
