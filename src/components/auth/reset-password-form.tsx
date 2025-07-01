"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";

const resetSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const { resetPassword, isResetPasswordLoading } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });
  const onSubmit = (data: ResetFormData) => {
    resetPassword({ token, newPassword: data.newPassword });
  };
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
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
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isResetPasswordLoading}>
          {isResetPasswordLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </Button>
      </form>
    </div>
  );
} 