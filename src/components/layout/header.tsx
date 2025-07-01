"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  Home,
  Video,
  Users,
  Store,
  Gamepad2,
  AppWindow,
  Bell,
  MessageCircle,
  UserCircle,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const menuIcons = [
  { icon: Home, href: "/", label: "Trang chủ" },
  { icon: Video, href: "/video", label: "Video" },
  { icon: Store, href: "/market", label: "Marketplace" },
  { icon: Users, href: "/groups", label: "Nhóm" },
  { icon: Gamepad2, href: "/games", label: "Trò chơi" },
];

const actionIcons = [
  { icon: AppWindow, label: "Ứng dụng" },
  { icon: MessageCircle, label: "Messenger" },
  { icon: Bell, label: "Thông báo" },
  { icon: UserCircle, label: "Tài khoản" },
];

export default function Header() {
  useAuthStore();
  const [activeMenu, setActiveMenu] = useState("/");
  const [showMessenger, setShowMessenger] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto flex items-center px-4 py-2">
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
            <input
              type="text"
              placeholder="Tìm kiếm trên Hari News"
              className="w-full pl-9 pr-3 py-2 rounded-full text-sm placeholder:text-gray-400 focus:outline-none border"
              style={{
                background: "var(--color-gray-100)",
                color: "var(--color-gray-900)",
                borderColor: "var(--color-gray-200)",
              }}
            />
          </div>
          {/* ChevronDown: chỉ hiện trên mobile, nằm cùng nhóm với logo/search */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full sm:hidden"
            style={{
              background: "var(--color-gray-100)",
              color: "var(--color-gray-500)",
            }}
            onClick={() => setShowMenuDropdown((v) => !v)}
            aria-label="Mở menu"
          >
            <ChevronDown size={22} />
          </button>
        </div>
        {/* Center: Menu icons (hidden on mobile) */}
        <nav className="hidden sm:flex flex-1 items-center justify-center gap-8">
          {menuIcons.map(({ icon: Icon, href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center px-3 py-1 rounded-md transition-colors duration-150
                ${
                  activeMenu === href
                    ? "text-blue-600"
                    : "hover:bg-gray-100 hover:text-gray-900"
                }`}
              style={
                activeMenu === href
                  ? { color: "var(--color-blue-600)" }
                  : { color: "var(--color-gray-500)" }
              }
              onClick={() => setActiveMenu(href)}
              title={label}
            >
              <Icon size={26} />
              {activeMenu === href && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full"
                  style={{ background: "var(--color-blue-600)" }}
                />
              )}
            </Link>
          ))}
        </nav>
        {/* Right: Action icons */}
        <div className="flex items-center gap-3 flex-shrink-0 justify-end flex-1">
          {actionIcons.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150
                hover:text-gray-900`}
              style={
                label === "Messenger" && showMessenger
                  ? {
                      background: "var(--color-gray-100)",
                      color: "var(--color-blue-600)",
                      boxShadow: "0 0 0 2px var(--color-blue-600)",
                    }
                  : {
                      background: "var(--color-gray-100)",
                      color: "var(--color-gray-500)",
                    }
              }
              title={label}
              onClick={() => {
                if (label === "Messenger") setShowMessenger((v) => !v);
              }}
            >
              <Icon size={22} />
            </button>
          ))}
        </div>
      </div>
      {/* Dropdown menu center on mobile */}
      {showMenuDropdown && (
        <div
          className="sm:hidden fixed top-[56px] left-0 w-full border-t border-b shadow z-40 flex justify-center py-2 gap-2"
          style={{
            background: "var(--color-white)",
            borderColor: "var(--color-gray-200)",
          }}
        >
          {menuIcons.map(({ icon: Icon, href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-150
                hover:bg-gray-100 hover:text-gray-900`}
              style={
                activeMenu === href
                  ? { color: "var(--color-blue-600)" }
                  : { color: "var(--color-gray-500)" }
              }
              onClick={() => {
                setActiveMenu(href);
                setShowMenuDropdown(false);
              }}
              title={label}
            >
              <Icon size={22} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      )}
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
