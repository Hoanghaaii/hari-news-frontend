"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { Bell, MessageCircle, UserCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { IconButtonWithBadge } from "../ui/icon-button-with-badge";

export default function Header() {
  useAuthStore();
  const [showMessenger, setShowMessenger] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto flex items-center px-4 py-1">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-3 min-w-[48px] flex-shrink-0 justify-start flex-1">
          <Link href="/" className="flex items-center">
            <span
              className="rounded-full p-1 mr-2"
              style={{ background: "var(--color-blue-600)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="var(--color-deepblue)" />
                <path
                  d="M21.5 16.5H18V27H13V16.5H10V12.5H13V10.5C13 7.73858 14.7909 6 17.5 6H21.5V10H19.5C18.9477 10 18.5 10.4477 18.5 11V12.5H21.5L21 16.5Z"
                  fill="var(--color-white)"
                />
              </svg>
            </span>
          </Link>
          {/* Search: icon on mobile, input on desktop */}
          <button
            className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full"
            style={{
              background: "var(--color-gray-100)",
              color: "var(--color-gray-500)",
            }}
          >
            <Search size={20} />
          </button>
          <div className="relative w-56 hidden sm:block">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-gray-400)" }}
            >
              <Search size={18} />
            </span>
            <Input
              type="text"
              placeholder="Tìm kiếm trên Hari News"
              className="w-full pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none border"
            />
          </div>
        </div>
        {/* Right: Action icons */}
        <div className="flex items-center gap-3 flex-shrink-0 justify-end flex-1">
          <IconButtonWithBadge
            icon={MessageCircle}
            count={3}
            label="Messenger"
            onClick={() => setShowMessenger((v) => !v)}
            active={showMessenger}
          />
          <IconButtonWithBadge icon={Bell} count={12} label="Thông báo" />
          <IconButtonWithBadge icon={UserCircle} label="Tài khoản" />
        </div>
      </div>
      {/* Messenger popup giả lập */}
      {showMessenger && (
        <div
          className="fixed top-16 right-8 w-80 border rounded-lg shadow-lg z-50 p-4"
          style={{
            background: "var(--color-white)",
            borderColor: "var(--color-gray-200)",
          }}
        >
          <div
            className="font-semibold mb-2"
            style={{ color: "var(--color-gray-900)" }}
          >
            Messenger
          </div>
          <div className="text-sm" style={{ color: "var(--color-gray-500)" }}>
            (Demo) Danh sách cuộc trò chuyện sẽ hiển thị ở đây.
          </div>
        </div>
      )}
    </header>
  );
}
