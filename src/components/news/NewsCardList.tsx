import { NewsCard, NewsCardProps } from "./NewsCard";

export type NewsCardListProps = {
  newsList: NewsCardProps["news"][];
  gridClass?: string;
};

export function NewsCardList({ newsList, gridClass }: NewsCardListProps) {
  return (
    <div className={`grid gap-6 ${gridClass || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
      {newsList.map((news, idx) => (
        <NewsCard
          key={news.title + news.publishedAt + idx}
          news={news}
        />
      ))}
    </div>
  );
} 