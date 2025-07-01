import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsCardList } from "@/components/news/NewsCardList";

const demoNewsList = [
  {
    title: "OpenAI ra mắt GPT-4o: AI đa phương thức miễn phí cho mọi người",
    description: "GPT-4o có thể xử lý văn bản, hình ảnh, âm thanh và video, mang lại trải nghiệm AI toàn diện hơn bao giờ hết.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    source: "VnExpress",
    publishedAt: "2024-06-01T08:00:00Z",
    verified: true,
  },
  {
    title: "Apple công bố iOS 18 với nhiều tính năng AI mới",
    description: "iOS 18 mang đến Siri thông minh hơn, tuỳ biến giao diện sâu hơn và bảo mật nâng cao.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    source: "Tuổi Trẻ",
    publishedAt: "2024-06-02T10:30:00Z",
    verified: true,
  },
  {
    title: "Việt Nam giành 3 HCV Olympic Toán quốc tế",
    description: "Đội tuyển Việt Nam xuất sắc giành 3 huy chương vàng tại kỳ thi Olympic Toán quốc tế 2024.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
    source: "Thanh Niên",
    publishedAt: "2024-06-03T14:00:00Z",
    verified: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Chào mừng đến với <span className="text-foreground">Hari News</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ứng dụng tin tức được xây dựng với Next.js, Zustand, React Query,
            Axios, Shadcn/ui và Tailwind CSS.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>

          <div className="mt-16">
            <NewsCardList newsList={demoNewsList} />
          </div>
        </div>
      </div>
    </div>
  );
}
