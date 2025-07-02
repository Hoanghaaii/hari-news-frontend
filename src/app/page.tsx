import { NewsCardList } from "@/components/news/NewsCardList";
import { HomeLayout } from "@/components/layout/HomeLayout";

const demoNewsList = [
  {
    title: "OpenAI ra mắt GPT-4o: AI đa phương thức miễn phí cho mọi người",
    article: "GPT-4o có thể xử lý văn bản, hình ảnh, âm thanh và video, mang lại trải nghiệm AI toàn diện hơn bao giờ hết.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    source: "VnExpress",
    publishedAt: "2024-06-01T08:00:00Z",
    verified: true,
  },
  {
    title: "Apple công bố iOS 18 với nhiều tính năng AI mới",
    article: "iOS 18 mang đến Siri thông minh hơn, tuỳ biến giao diện sâu hơn và bảo mật nâng cao.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    source: "Tuổi Trẻ",
    publishedAt: "2024-06-02T10:30:00Z",
    verified: true,
  },
  {
    title: "Việt Nam giành 3 HCV Olympic Toán quốc tế",
    article: "Đội tuyển Việt Nam xuất sắc giành 3 huy chương vàng tại kỳ thi Olympic Toán quốc tế 2024.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
    source: "Thanh Niên",
    publishedAt: "2024-06-03T14:00:00Z",
    verified: true,
  },
  {
    title: "Giá xăng dầu đồng loạt giảm mạnh từ hôm nay",
    article: "Bộ Công Thương điều chỉnh giá xăng dầu giảm hơn 1.000 đồng/lít từ 15h ngày 5/6.",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=600&q=80",
    source: "Dân Trí",
    publishedAt: "2024-06-05T15:00:00Z",
    verified: false,
  },
];

function SidebarDemo() {
  return (
    <nav className="flex flex-col gap-2 text-sm font-medium">
      <a href="#" className="px-3 py-2 rounded hover:bg-gray-100">Trang chủ</a>
      <a href="#" className="px-3 py-2 rounded hover:bg-gray-100">Khám phá</a>
      <a href="#" className="px-3 py-2 rounded hover:bg-gray-100">Chủ đề</a>
      <a href="#" className="px-3 py-2 rounded hover:bg-gray-100">Cài đặt</a>
    </nav>
  );
}

function MainFeedDemo() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold mb-4">Feed chính</div>
      <div className="bg-white/80 rounded-xl p-6 text-center text-gray-500">Đây là nơi hiển thị các bài đăng, bài viết, status, ...</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeLayout
      left={<SidebarDemo />}
      center={<MainFeedDemo />}
      right={<NewsCardList newsList={demoNewsList} gridClass="grid-cols-1" />}
    />
  );
}
