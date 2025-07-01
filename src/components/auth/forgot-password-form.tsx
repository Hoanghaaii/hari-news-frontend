"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";

const forgotSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });
  const onSubmit = (data: ForgotFormData) => {
    forgotPassword(data.email);
  };
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
        <p className="text-muted-foreground">Nhập email để nhận link đặt lại mật khẩu</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isForgotPasswordLoading}>
          {isForgotPasswordLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
        </Button>
      </form>
    </div>
  );
} 