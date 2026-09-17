"use client";

import React, { useState } from "react";
import Image from "next/image";
import { sounds } from "@/lib/sounds";
import {
  X,
  Heart,
  Repeat2,
  MessageCircle,
  Share,
  Bookmark,
  BarChart2,
  Search,
  Bell,
  Mail,
  Home,
  Plus,
  MoreHorizontal,
  Wifi,
  Sparkles,
  Flame,
  Check,
  BadgeCheck,
} from "lucide-react";

interface SocialMediaPhoneModalProps {
  onClose: () => void;
}

interface Tweet {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  badgeType: "gold" | "blue";
  timeAgo: string;
  content: string;
  attachedType?: "poll" | "quote" | "stats";
  pollData?: { option1: string; pct1: number; option2: string; pct2: number; totalVotes: string };
  likes: number;
  retweets: number;
  replies: number;
  views: string;
  isLiked?: boolean;
  isRetweeted?: boolean;
}

const INITIAL_TWEETS: Tweet[] = [
  {
    id: "t1",
    authorName: "Dana White",
    authorHandle: "danawhite",
    authorAvatar: "/images/card_coach.jpg",
    badgeType: "gold",
    timeAgo: "22분",
    content:
      "오늘 파이트 캠프 스파링 영상 직접 봤는데 타격 스피드가 완전히 미쳤다. 이 컨디션 그대로 옥타곤 올라오면 155파운드 라이트급에서 저 왼손 스트레이트를 버틸 선수는 없다. 대단한 시합이 될 거야. 👊🔥 #UFC #MainEvent",
    likes: 14820,
    retweets: 1240,
    replies: 428,
    views: "284K",
  },
  {
    id: "t2",
    authorName: "Ariel Helwani",
    authorHandle: "arielhelwani",
    authorAvatar: "/images/fighter_mcgregor_clean.png",
    badgeType: "blue",
    timeAgo: "1시간",
    content:
      "속보: 헤드코치 너클스 맥켄지가 파이트 캠프 최종 페이즈 돌입을 공식 확인했습니다. 현재 캠프 소화율 96%로 최상의 피크 컨디션이며, 이번 시합에 대한 팬들의 관심도가 역대 최고조입니다.",
    attachedType: "poll",
    pollData: {
      option1: "1~2라운드 KO 피니시",
      pct1: 74,
      option2: "5라운드 판정승",
      pct2: 26,
      totalVotes: "28,491표 • 남은 시간 12시간",
    },
    likes: 9410,
    retweets: 892,
    replies: 312,
    views: "145K",
  },
  {
    id: "t3",
    authorName: "Conor McGregor",
    authorHandle: "TheNotoriousMMA",
    authorAvatar: "/images/fighter_mcgregor_side.png",
    badgeType: "blue",
    timeAgo: "3시간",
    content:
      "Precision beats power, and timing beats speed. 완벽한 준비가 끝났다. 옥타곤 문이 닫히면 주먹으로 증명할 시간이다. 벨트는 그대로 내 허리에 남는다! 🇮🇪👑 #ChampChamp #AndStill",
    likes: 52180,
    retweets: 4520,
    replies: 1840,
    views: "1.2M",
  },
  {
    id: "t4",
    authorName: "MMA Junkie",
    authorHandle: "MMAJunkie",
    authorAvatar: "/images/card_fight.jpg",
    badgeType: "gold",
    timeAgo: "5시간",
    content:
      "📊 통산 전적 50전 50승 무패 (45 KO). 옥타곤 역사상 가장 압도적인 피니시율을 기록 중인 챔피언의 이번 타이틀 방어전 최종 배당률이 -380 탑독으로 마감되었습니다.",
    attachedType: "stats",
    likes: 6840,
    retweets: 512,
    replies: 198,
    views: "92K",
  },
  {
    id: "t5",
    authorName: "UFC",
    authorHandle: "ufc",
    authorAvatar: "/images/ufc_arena_transition.jpg",
    badgeType: "gold",
    timeAgo: "8시간",
    content:
      "7 DAYS TO GO. The world will be watching. 라이트급 언디스퓨티드 챔피언십 결전이 라스베이거스 T-모바일 아레나에서 펼쳐집니다! 🏟️⚡ #UFCFightNight",
    likes: 48900,
    retweets: 6210,
    replies: 2450,
    views: "980K",
  },
];

export default function SocialMediaPhoneModal({ onClose }: SocialMediaPhoneModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"FOR_YOU" | "FOLLOWING">("FOR_YOU");
  const [tweets, setTweets] = useState<Tweet[]>(INITIAL_TWEETS);
  const [votedPollId, setVotedPollId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    sounds.playSelect();
    setTweets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isLiked = !t.isLiked;
          return {
            ...t,
            isLiked,
            likes: isLiked ? t.likes + 1 : t.likes - 1,
          };
        }
        return t;
      })
    );
  };

  const handleRetweet = (id: string) => {
    sounds.playHover();
    setTweets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isRetweeted = !t.isRetweeted;
          return {
            ...t,
            isRetweeted,
            retweets: isRetweeted ? t.retweets + 1 : t.retweets - 1,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in font-sans">
      {/* Background Dim / Close click area */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Outside Floating Close Button (Top-Right of Viewport) */}
      <button
        onClick={() => {
          sounds.playHover();
          onClose();
        }}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/20 hover:border-white/50 transition-all cursor-pointer shadow-2xl active:scale-95 flex items-center gap-1.5 text-xs font-bold font-mono"
        title="닫기 (ESC)"
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">ESC</span>
      </button>

      {/* ========================================================================= */}
      {/* SMARTPHONE DEVICE CHASSIS (TITANIUM BLACK BEZEL WITH DYNAMIC ISLAND)       */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[395px] sm:max-w-[420px] h-[780px] sm:h-[830px] max-h-[95vh] rounded-[50px] p-[10px] bg-gradient-to-b from-[#3a3a3e] via-[#1c1c1f] to-[#2d2d31] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.06)] border border-neutral-700/60 flex flex-col justify-between">
        {/* Outer Phone Bezel Sheen / Antenna Lines */}
        <div className="absolute -left-[2px] top-24 w-[3px] h-9 bg-neutral-600 rounded-l" />
        <div className="absolute -left-[2px] top-36 w-[3px] h-12 bg-neutral-600 rounded-l" />
        <div className="absolute -left-[2px] top-52 w-[3px] h-12 bg-neutral-600 rounded-l" />
        <div className="absolute -right-[2px] top-32 w-[3px] h-16 bg-neutral-600 rounded-r" />

        {/* ======================================================================= */}
        {/* SMARTPHONE OLED SCREEN (PURE BLACK 𝕏 UI)                                */}
        {/* ======================================================================= */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black text-white flex flex-col justify-between border border-white/10 shadow-inner">
          {/* 1. TOP STATUS BAR */}
          <div className="relative z-30 pt-3 px-7 pb-1 flex items-center justify-between text-xs font-semibold text-white shrink-0">
            {/* Current Time */}
            <span className="font-semibold text-[13px] tracking-tight pl-1">9:41</span>

            {/* Dynamic Island Pill Notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-6 rounded-full bg-black border border-white/15 flex items-center justify-end px-2 gap-1.5 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-white/20" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Right Status Icons: Wifi, 5G, Battery */}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              {/* Battery Icon */}
              <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
                <div className="w-full h-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* 2. 𝕏 HEADER BAR */}
          <div className="relative z-20 px-4 pt-2 pb-0 flex items-center justify-between border-b border-neutral-800 bg-black/90 backdrop-blur-md shrink-0">
            {/* User Mini Profile Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
              <Image
                src="/images/fighter_mcgregor_clean.png"
                alt="Fighter Avatar"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Official 𝕏 (X / Twitter) Center Logo */}
            <div className="font-black text-xl text-white tracking-tighter select-none font-serif">
              𝕏
            </div>

            {/* Sparkles / Hype Button */}
            <button
              onClick={() => sounds.playHover()}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="최신 타임라인"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* 3. TABS: [추천 (For You)] & [팔로우 중 (Following)] */}
          <div className="flex items-center border-b border-neutral-800 bg-black/90 text-xs font-bold shrink-0">
            <button
              onClick={() => {
                sounds.playSelect();
                setActiveSubTab("FOR_YOU");
              }}
              className="flex-1 py-3 text-center relative cursor-pointer transition-colors"
            >
              <span className={activeSubTab === "FOR_YOU" ? "text-white" : "text-neutral-500"}>
                추천 (For You)
              </span>
              {activeSubTab === "FOR_YOU" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-[#1d9bf0]" />
              )}
            </button>

            <button
              onClick={() => {
                sounds.playSelect();
                setActiveSubTab("FOLLOWING");
              }}
              className="flex-1 py-3 text-center relative cursor-pointer transition-colors"
            >
              <span className={activeSubTab === "FOLLOWING" ? "text-white" : "text-neutral-500"}>
                팔로우 중 (Following)
              </span>
              {activeSubTab === "FOLLOWING" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-[#1d9bf0]" />
              )}
            </button>
          </div>

          {/* 4. 𝕏 TWEET FEED (SCROLLABLE AREA) */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/80 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tweets.map((tweet) => (
              <article
                key={tweet.id}
                className="px-4 py-3 hover:bg-neutral-950/60 transition-colors flex gap-3 text-left cursor-default"
              >
                {/* Author Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-700 bg-neutral-900 mt-0.5">
                  <Image
                    src={tweet.authorAvatar}
                    alt={tweet.authorName}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Tweet Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Header: Name + Badge + Handle + TimeAgo + More */}
                  <div className="flex items-center justify-between gap-1 leading-none">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-bold text-[13px] text-white hover:underline cursor-pointer truncate">
                        {tweet.authorName}
                      </span>

                      {/* Verified Badge */}
                      {tweet.badgeType === "gold" ? (
                        <span
                          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#f4c300] text-black shrink-0 text-[8px] font-black"
                          title="공식 인증 계정"
                        >
                          ✓
                        </span>
                      ) : (
                        <BadgeCheck className="w-3.5 h-3.5 text-[#1d9bf0] shrink-0" />
                      )}

                      <span className="text-neutral-500 text-xs truncate">
                        @{tweet.authorHandle}
                      </span>
                      <span className="text-neutral-600 text-xs">·</span>
                      <span className="text-neutral-500 text-xs shrink-0">{tweet.timeAgo}</span>
                    </div>

                    <button className="text-neutral-600 hover:text-neutral-300 p-1">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tweet Body Text */}
                  <p className="text-[13px] text-neutral-100 leading-relaxed mt-1 whitespace-pre-line font-pretendard">
                    {tweet.content}
                  </p>

                  {/* Attached Poll if any */}
                  {tweet.attachedType === "poll" && tweet.pollData && (
                    <div className="mt-2.5 p-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 space-y-2">
                      {/* Option 1 */}
                      <button
                        onClick={() => {
                          sounds.playSelect();
                          setVotedPollId("opt1");
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          votedPollId === "opt1"
                            ? "bg-[#1d9bf0]/20 border-[#1d9bf0] text-white"
                            : "border-neutral-700/60 hover:bg-neutral-800/60 text-neutral-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {votedPollId === "opt1" && <Check className="w-3.5 h-3.5 text-[#1d9bf0]" />}
                          {tweet.pollData.option1}
                        </span>
                        <span className="font-mono font-bold text-[#1d9bf0]">
                          {tweet.pollData.pct1}%
                        </span>
                      </button>

                      {/* Option 2 */}
                      <button
                        onClick={() => {
                          sounds.playSelect();
                          setVotedPollId("opt2");
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          votedPollId === "opt2"
                            ? "bg-[#1d9bf0]/20 border-[#1d9bf0] text-white"
                            : "border-neutral-700/60 hover:bg-neutral-800/60 text-neutral-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {votedPollId === "opt2" && <Check className="w-3.5 h-3.5 text-[#1d9bf0]" />}
                          {tweet.pollData.option2}
                        </span>
                        <span className="font-mono font-bold text-neutral-400">
                          {tweet.pollData.pct2}%
                        </span>
                      </button>

                      <div className="text-[10px] text-neutral-500 pt-1">
                        {tweet.pollData.totalVotes}
                      </div>
                    </div>
                  )}

                  {/* Attached Stats Badge if any */}
                  {tweet.attachedType === "stats" && (
                    <div className="mt-2 px-3 py-2 rounded-xl bg-red-950/25 border border-red-500/30 flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-bold">오즈메이커 승리 배당률</span>
                      <span className="font-mono font-black text-red-400">-380 (압도적 탑독)</span>
                    </div>
                  )}

                  {/* Tweet Action Icons (Reply, Retweet, Like, Views, Share) */}
                  <div className="flex items-center justify-between text-neutral-500 text-xs mt-2.5 max-w-sm pr-2">
                    {/* Reply */}
                    <button
                      onClick={() => sounds.playHover()}
                      className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors group cursor-pointer"
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-mono">{tweet.replies}</span>
                    </button>

                    {/* Retweet */}
                    <button
                      onClick={() => handleRetweet(tweet.id)}
                      className={`flex items-center gap-1.5 transition-colors group cursor-pointer ${
                        tweet.isRetweeted ? "text-[#00ba7c]" : "hover:text-[#00ba7c]"
                      }`}
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-[#00ba7c]/10">
                        <Repeat2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-mono">{tweet.retweets}</span>
                    </button>

                    {/* Like */}
                    <button
                      onClick={() => handleLike(tweet.id)}
                      className={`flex items-center gap-1.5 transition-colors group cursor-pointer ${
                        tweet.isLiked ? "text-[#f91880]" : "hover:text-[#f91880]"
                      }`}
                    >
                      <div className="p-1.5 rounded-full group-hover:bg-[#f91880]/10">
                        <Heart
                          className={`w-3.5 h-3.5 ${tweet.isLiked ? "fill-[#f91880]" : ""}`}
                        />
                      </div>
                      <span className="text-[11px] font-mono">{tweet.likes}</span>
                    </button>

                    {/* Views */}
                    <button className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors group cursor-pointer">
                      <div className="p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10">
                        <BarChart2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-mono">{tweet.views}</span>
                    </button>

                    {/* Bookmark / Share */}
                    <button
                      onClick={() => sounds.playHover()}
                      className="p-1.5 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors"
                    >
                      <Share className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Floating Write Tweet Button */}
          <button
            onClick={() => sounds.playSelect()}
            className="absolute right-5 bottom-16 w-12 h-12 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-90 cursor-pointer z-30"
            title="새 포스트 작성"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* 5. 𝕏 BOTTOM NAVIGATION BAR */}
          <div className="relative z-20 px-6 py-2.5 border-t border-neutral-800 bg-black/95 flex items-center justify-between text-neutral-400 shrink-0">
            {/* Home */}
            <button
              onClick={() => sounds.playHover()}
              className="p-1.5 text-white hover:text-white"
            >
              <Home className="w-5 h-5 fill-white" />
            </button>

            {/* Search */}
            <button
              onClick={() => sounds.playHover()}
              className="p-1.5 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Grok AI / Sparkle */}
            <button
              onClick={() => sounds.playHover()}
              className="p-1.5 hover:text-white transition-colors"
            >
              <div className="w-5 h-5 border border-current rounded-md flex items-center justify-center text-[10px] font-black">
                /
              </div>
            </button>

            {/* Notifications */}
            <button
              onClick={() => sounds.playHover()}
              className="relative p-1.5 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1d9bf0]" />
            </button>

            {/* Direct Messages */}
            <button
              onClick={() => sounds.playHover()}
              className="p-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>

          {/* 6. BOTTOM IPHONE HOME BAR INDICATOR */}
          <div className="w-full pb-1 pt-0.5 bg-black flex justify-center shrink-0">
            <div className="w-32 h-1 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
