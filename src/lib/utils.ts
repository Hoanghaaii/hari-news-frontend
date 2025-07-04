import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Chuẩn hóa lấy message từ error object hoặc instance Error
export function extractErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Đã có lỗi xảy ra";
}

// Mở popup OAuth và set cookie khi thành công
export function openOAuthPopup(provider: "google" | "facebook") {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  const popup = window.open(
    url,
    "_blank",
    `width=${width},height=${height},left=${left},top=${top},popup=yes`
  );
  if (!popup) return;
  const timer = setInterval(() => {
    if (popup.closed) {
      clearInterval(timer);
    }
  }, 500);
  window.addEventListener("message", async function handler(event) {
    console.log("Received message:", event.data);
    console.log("Origin:", event.origin);
    if (
      event.data &&
      event.data.type === "oauth-success" &&
      event.data.accessToken &&
      event.data.refreshToken
    ) {
      window.removeEventListener("message", handler);
      // Gọi API set-cookie trực tiếp
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-cookie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          accessToken: event.data.accessToken,
          refreshToken: event.data.refreshToken,
        }),
      });
      console.log("done");
      window.location.reload();
    }
  });
}
