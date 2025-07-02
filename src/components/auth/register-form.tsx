"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    token: z.string().length(6, "Mã xác minh phải có 6 chữ số"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register: registerUser,
    isRegisterLoading,
    sendEmailVerification,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleSendEmailVerification = () => {
    const email = getValues("email");
    setOtpError("");
    if (!email || errors.email) {
      setOtpError("Vui lòng nhập email hợp lệ trước khi gửi mã");
      return;
    }
    sendEmailVerification.mutate(email, {
      onSuccess: () => setOtpCooldown(60),
    });
  };

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setInterval(() => {
        setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpCooldown]);

  const onSubmit = (data: RegisterFormData) => {
    const { name, email, password, token } = data;
    registerUser({ name, email, password, token });
  };

  return (
    <div className="w-full max-w-md space-y-1">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <div className="space-y-1">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nhập họ và tên"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
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

        <div className="space-y-1">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Ẩn" : "Hiện"}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="token">Mã xác minh email</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <InputOTP
                maxLength={6}
                value={getValues("token") || ""}
                onChange={(val) =>
                  setValue("token", val, { shouldValidate: true })
                }
                containerClassName="w-full"
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, idx) => (
                    <InputOTPSlot key={idx} index={idx} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2 whitespace-no1rap flex items-center justify-center min-w-[90px]"
                      disabled={
                        sendEmailVerification.isPending || otpCooldown > 0
                      }
                      onClick={handleSendEmailVerification}
                    >
                      {sendEmailVerification.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : otpCooldown > 0 ? (
                        `Gửi lại (${otpCooldown}s)`
                      ) : (
                        "Gửi mã"
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {otpCooldown > 0 && (
                  <TooltipContent side="top">
                    Có thể gửi lại sau {otpCooldown} giây
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          {otpError && (
            <p className="text-sm text-destructive mt-1">{otpError}</p>
          )}
          {errors.token && (
            <p className="text-sm text-destructive">{errors.token.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isRegisterLoading}>
          {isRegisterLoading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
}
