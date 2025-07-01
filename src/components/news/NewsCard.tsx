"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ThumbsUp, MessageCircle, ArrowUpRightFromSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState, useRef } from "react";
import "./news-card.css";

const REACTIONS = [
  { type: "like", icon: "👍", label: "Thích" },
  { type: "love", icon: "❤️", label: "Yêu thích" },
  { type: "haha", icon: "😆", label: "Haha" },
  { type: "wow", icon: "😮", label: "Wow" },
  { type: "sad", icon: "😢", label: "Buồn" },
  { type: "angry", icon: "😡", label: "Phẫn nộ" },
];

export type NewsCardProps = {
  news: {
    title: string;
    article: string;
    image?: string;
    publishedAt: string;
    source?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
    reactions?: { type: string; count: number }[]; // các reaction đã thả
    userReaction?: string; // reaction của user hiện tại
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
};

export function NewsCard({ news, onLike, onComment, onShare }: NewsCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(news.userReaction || "");
  const likeBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideReactionTimeout = useRef<NodeJS.Timeout | null>(null);
  const showReactionTimeout = useRef<NodeJS.Timeout | null>(null);
  // Long press cho mobile
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  // Giả lập data reaction đã thả
  const reactions = news.reactions || [
    { type: "like", count: 10 },
    { type: "love", count: 3 },
    { type: "haha", count: 2 },
  ];
  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

  // Số bình luận, chia sẻ
  const comments = news.comments ?? 0;
  const shares = news.shares ?? 0;

  // Popover giữ khi hover vào cả nút like hoặc popover
  const handleMouseEnterLike = () => {
    if (hideReactionTimeout.current) clearTimeout(hideReactionTimeout.current);
    showReactionTimeout.current = setTimeout(() => {
      setShowReactions(true);
    }, 350);
  };
  const handleMouseLeaveLike = () => {
    if (showReactionTimeout.current) clearTimeout(showReactionTimeout.current);
    hideReactionTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 120);
  };
  const handleMouseEnterPopover = () => {
    if (hideReactionTimeout.current) clearTimeout(hideReactionTimeout.current);
    setShowReactions(true);
  };
  const handleMouseLeavePopover = () => {
    hideReactionTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 120);
  };

  const handleReaction = (type: string) => {
    setUserReaction(type);
    setShowReactions(false);
    if (onLike) onLike();
  };

  // Bấm lại nút like sẽ huỷ reaction
  const handleLikeClick = () => {
    if (userReaction) {
      setUserReaction("");
    } else {
      handleReaction("like");
    }
  };

  // Map màu cho từng reaction
  const reactionColor = (type: string) => {
    switch (type) {
      case "like":
        return "text-blue-500";
      case "love":
        return "text-red-500";
      case "haha":
        return "text-yellow-400";
      case "wow":
        return "text-yellow-300";
      case "sad":
        return "text-blue-300";
      case "angry":
        return "text-orange-600";
      default:
        return "text-white/90";
    }
  };

  // Long press cho mobile
  const handleTouchStartLike = () => {
    isLongPress.current = false;
    longPressTimeout.current = setTimeout(() => {
      setShowReactions(true);
      isLongPress.current = true;
    }, 350);
  };
  const handleTouchEndLike = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    if (!isLongPress.current) {
      handleLikeClick(); // tap nhanh: like/bỏ like
    }
  };

  return (
    <Card className="relative overflow-visible rounded-2xl shadow-md cursor-pointer group p-0 min-h-[260px] flex transition-all duration-300 will-change-transform news-card">
      {/* Ảnh nền */}
      {news.image && (
        <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover w-full h-full rounded-2xl"
            sizes="(max-width: 600px) 100vw, 400px"
            priority={false}
          />
          {/* Overlay gradient đen mờ nhất ở dưới */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none rounded-2xl" />
          {/* Shine effect */}
          <div className="news-card-shine pointer-events-none rounded-2xl" />
        </div>
      )}
      {/* Tác giả ở góc trên trái */}
      {news.source && (
        <div className="absolute top-3 left-3 z-20 text-xs text-white/90 bg-blue-500/50 rounded px-2 py-1 select-none max-w-[60%] truncate">
          {news.source}
        </div>
      )}
      {/* Thời gian đăng ở góc trên phải */}
      <div className="absolute top-3 right-3 z-20 text-xs text-white/80 bg-black/50 rounded px-2 py-1 select-none">
        {new Date(news.publishedAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </div>
      {/* Text đè lên ảnh, căn trái, gọn lại, không overlay */}
      <div className="absolute left-0 right-0 bottom-0 z-20 p-3 flex flex-col items-start gap-1 text-left w-full">
        {/* Title */}
        <div className="w-full">
          <div className="text-white text-base font-semibold drop-shadow line-clamp-2 px-2 py-1">
            {news.title}
          </div>
        </div>
        <div className="text-white/90 text-sm line-clamp-2 w-full px-1">
          {news.article}
        </div>
        {/* Dòng chỉ số: reaction, comment, share */}
        <div className="flex items-center gap-4 w-full text-xs text-white/90">
          <div className="flex items-center gap-1">
            {reactions.map((r) => (
              <span
                key={r.type}
                className="-ml-1 first:ml-0 text-base drop-shadow"
              >
                {REACTIONS.find((x) => x.type === r.type)?.icon}
              </span>
            ))}
            {totalReactions > 0 && (
              <span className="ml-1">{totalReactions}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} className="opacity-80" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRightFromSquare size={14} className="opacity-80" />
            <span>{shares}</span>
          </div>
        </div>
        {/* Dòng button: Like, Comment, Share */}
        <div className="flex items-center gap-2 mt-1 w-full flex-nowrap">
          {/* Nút like với popover reaction */}
          <div className="relative flex-1 flex items-center justify-center">
            <button
              ref={likeBtnRef}
              className={`flex items-center gap-1 group/like relative w-full justify-center py-1 rounded hover:bg-white/10 transition-colors ${
                userReaction ? reactionColor(userReaction) : "text-white/90"
              }`}
              onMouseEnter={handleMouseEnterLike}
              onMouseLeave={handleMouseLeaveLike}
              onClick={handleLikeClick}
              onTouchStart={handleTouchStartLike}
              onTouchEnd={handleTouchEndLike}
              type="button"
            >
              {userReaction === "like" && (
                <ThumbsUp
                  size={16}
                  className="text-blue-500 transition-colors"
                />
              )}
              {userReaction === "love" && (
                <span className="text-lg leading-none">❤️</span>
              )}
              {userReaction &&
                userReaction !== "like" &&
                userReaction !== "love" && (
                  <span className="text-lg leading-none">
                    {REACTIONS.find((r) => r.type === userReaction)?.icon}
                  </span>
                )}
              {!userReaction && (
                <ThumbsUp size={16} className="transition-colors" />
              )}
              <span className="text-xs font-medium hidden md:inline whitespace-nowrap">
                {REACTIONS.find((r) => r.type === userReaction)?.label ||
                  "Thích"}
              </span>
            </button>
            {/* List reaction khi hover */}
            {showReactions && (
              <div
                ref={popoverRef}
                className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-black/80 rounded-full px-2 py-1 z-50 shadow-lg animate-fade-in overflow-visible"
                onMouseEnter={handleMouseEnterPopover}
                onMouseLeave={handleMouseLeavePopover}
              >
                <TooltipProvider>
                  {REACTIONS.map((r) => (
                    <Tooltip key={r.type}>
                      <TooltipTrigger asChild>
                        <button
                          className="text-xl hover:scale-125 transition-transform"
                          onClick={() => handleReaction(r.type)}
                          type="button"
                        >
                          {r.icon}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {r.label}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            )}
          </div>
          <button
            className="flex-1 flex items-center justify-center gap-1 group/comment py-1 rounded hover:bg-white/10 transition-colors"
            onClick={onComment}
            type="button"
          >
            <MessageCircle
              size={16}
              className="text-white/90 transition-colors"
            />
            <span className="text-xs font-medium text-white/90 hidden md:inline whitespace-nowrap">
              Bình luận
            </span>
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 group/share py-1 rounded hover:bg-white/10 transition-colors"
            onClick={onShare}
            type="button"
          >
            <ArrowUpRightFromSquare
              size={16}
              className="text-white/90 transition-colors"
            />
            <span className="text-xs font-medium text-white/90 hidden md:inline whitespace-nowrap">
              Chia sẻ
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
