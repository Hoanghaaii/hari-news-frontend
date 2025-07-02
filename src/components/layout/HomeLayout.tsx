import React from "react";

export type HomeLayoutProps = {
  left?: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
};

export function HomeLayout({ left, center, right }: HomeLayoutProps) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 md:px-4 lg:px-8">
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 min-h-[calc(100vh-48px)]"
        style={{ height: "calc(100vh - 70px)" }}
      >
        {/* Sidebar trái: ẩn trên mobile, chiếm 1/6 trên desktop */}
        <aside className="hidden lg:block col-span-1 h-full overflow-y-auto overscroll-contain bg-white/80 px-2 scrollbar-none">
          {left}
        </aside>
        {/* Main feed: luôn hiện, chiếm 3/6 trên desktop, 2/3 trên tablet, full trên mobile */}
        <main className="col-span-1 md:col-span-2 lg:col-span-3 h-full overflow-y-auto overscroll-contain bg-white/90 px-2 scrollbar-none">
          {center}
        </main>
        {/* List news phải: ẩn trên mobile, chiếm 1/3 trên tablet, 2/6 trên desktop */}
        <aside className="hidden md:block col-span-1 lg:col-span-2 h-full overflow-y-auto overscroll-contain bg-white/80 px-2 scrollbar-none">
          {right}
        </aside>
      </div>
    </div>
  );
}
