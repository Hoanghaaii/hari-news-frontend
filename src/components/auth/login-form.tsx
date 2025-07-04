"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoginLoading, setCookie, isSetCookieLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const handleOAuthLogin = (provider: "google" | "facebook") => {
    if (provider !== "google") return;
    const popup = window.open(
      `${BACKEND_URL}/api/auth/google`,
      "oauthPopup",
      "width=500,height=600"
    );
    const listener = async (event: MessageEvent) => {
      if (event.origin !== BACKEND_URL) return;
      const { accessToken, refreshToken, type } = event.data || {};
      if (type === "oauth-success" && accessToken && refreshToken) {
        setCookie({ accessToken, refreshToken });
        popup?.close();
        window.removeEventListener("message", listener);
      }
    };
    window.addEventListener("message", listener);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Kết nối với Hari News</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">
              Email
              {errors.email?.message && (
                <span className="text-xs text-destructive font-normal ml-1 italic">
                  ({errors.email.message})
                </span>
              )}
            </Label>
          </div>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Mật khẩu
              {errors.password?.message && (
                <span className="text-xs text-destructive font-normal ml-1 italic">
                  ({errors.password.message})
                </span>
              )}
            </Label>
          </div>
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
        </div>

        <Button type="submit" className="w-full" disabled={isLoginLoading}>
          {isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-2 text-xs text-gray-400">hoặc</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isSetCookieLoading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <g clipPath="url(#clip0_17_40)">
              <path
                d="M47.5 24.5C47.5 22.5 47.3 20.6 46.9 18.8H24V29.2H37.3C36.7 32.2 34.8 34.7 32 36.3V42H39.6C44.1 38.1 47.5 32 47.5 24.5Z"
                fill="#4285F4"
              />
              <path
                d="M24 48C30.6 48 36.1 45.9 39.6 42L32 36.3C30.2 37.5 27.9 38.3 24 38.3C17.7 38.3 12.2 34.2 10.3 28.7H2.5V34.1C6 41.1 14.3 48 24 48Z"
                fill="#34A853"
              />
              <path
                d="M10.3 28.7C9.8 27.5 9.5 26.2 9.5 24.8C9.5 23.4 9.8 22.1 10.3 20.9V15.5H2.5C0.8 18.7 0 22.2 0 24.8C0 27.4 0.8 30.9 2.5 34.1L10.3 28.7Z"
                fill="#FBBC05"
              />
              <path
                d="M24 9.7C27.7 9.7 30.3 11.2 31.7 12.5L38.1 6.1C36.1 4.2 30.6 0 24 0C14.3 0 6 6.9 2.5 15.5L10.3 20.9C12.2 15.4 17.7 9.7 24 9.7Z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Đăng nhập với Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          type="button"
          onClick={() => handleOAuthLogin("facebook")}
          disabled={isSetCookieLoading}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path
              d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 23.9782 5.85024 30.6052 13.5 31.8542V20.6562H9.4375V16H13.5V12.6562C13.5 8.65156 15.8887 6.5 19.5438 6.5C21.2938 6.5 23.125 6.8125 23.125 6.8125V10.75H21.1081C19.1162 10.75 18.5 11.9406 18.5 13.1562V16H22.9375L22.25 20.6562H18.5V31.8542C26.1498 30.6052 32 23.9782 32 16Z"
              fill="#1877F2"
            />
            <path
              d="M22.25 20.6562L22.9375 16H18.5V13.1562C18.5 11.9406 19.1162 10.75 21.1081 10.75H23.125V6.8125C23.125 6.8125 21.2938 6.5 19.5438 6.5C15.8887 6.5 13.5 8.65156 13.5 12.6562V16H9.4375V20.6562H13.5V31.8542C14.3232 31.9514 15.1572 32 16 32C16.8428 32 17.6768 31.9514 18.5 31.8542V20.6562H22.25Z"
              fill="white"
            />
          </svg>
          Đăng nhập với Facebook
        </Button>
      </div>
    </div>
  );
}
