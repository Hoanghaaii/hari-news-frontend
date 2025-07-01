import { NewsCard, NewsCardProps } from "./NewsCard";

export type NewsCardListProps = {
  newsList: NewsCardProps["news"][];
  onCardClick?: (news: NewsCardProps["news"], idx: number) => void;
};

export function NewsCardList({ newsList, onCardClick }: NewsCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {newsList.map((news, idx) => (
        <NewsCard
          key={news.title + news.publishedAt + idx}
          news={news}
          onClick={onCardClick ? () => onCardClick(news, idx) : undefined}
        />
      ))}
    </div>
  );
} 