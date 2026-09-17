"use client";

import React, { useState } from "react";
import Image from "next/image";
import { sounds } from "@/lib/sounds";
import {
  X,
  Trophy,
  Award,
  Zap,
  Swords,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle2,
  Sparkles,
  Flame,
  Globe,
  Sliders,
  DollarSign,
  Star,
} from "lucide-react";

interface PromotionModalProps {
  onClose: () => void;
  onAcceptContract?: (promotionName: string) => void;
}

interface PromotionOffer {
  id: "UFC" | "ONE" | "RIZIN";
  name: string;
  fullName: string;
  tagline: string;
  division: string;
  location: string;
  pointsBadge: string;
  overallStars: number;
  standupStars: number;
  grapplingStars: number;
  healthStars: number;
  prestigeTier: string;
  purse: string;
  winBonus: string;
  specialRules: string;
  perk: string;
  colorTheme: {
    primary: string; // Tailwind color class or hex
    border: string;
    glow: string;
    badgeBg: string;
    accentText: string;
  };
}

const PROMOTIONS: PromotionOffer[] = [
  {
    id: "UFC",
    name: "UFC",
    fullName: "ULTIMATE FIGHTING CHAMPIONSHIP",
    tagline: "WORLD TITLE CONTENDER // APEX & PPV",
    division: "MEN'S LIGHTWEIGHT",
    location: "LAS VEGAS • T-MOBILE ARENA",
    pointsBadge: "3,950 / 3,000",
    overallStars: 5.0,
    standupStars: 5,
    grapplingStars: 4,
    healthStars: 5,
    prestigeTier: "PRESTIGE V",
    purse: "$500,000",
    winBonus: "$250,000 + PPV 쉐어",
    specialRules: "5분 5라운드 / 엘보우 & 서브미션 무제한",
    perk: "Performance of the Night $50K 보너스",
    colorTheme: {
      primary: "from-amber-500/30 via-yellow-600/20 to-black",
      border: "border-amber-500/70",
      glow: "shadow-[0_0_35px_rgba(245,158,11,0.35)]",
      badgeBg: "bg-amber-500/20 border-amber-500/40 text-amber-300",
      accentText: "text-amber-400",
    },
  },
  {
    id: "ONE",
    name: "ONE CHAMPIONSHIP",
    fullName: "ONE CHAMPIONSHIP",
    tagline: "GLOBAL HEROES // ASIA MEGA BOUT",
    division: "MEN'S FEATHERWEIGHT",
    location: "SINGAPORE INDOOR STADIUM",
    pointsBadge: "2,690 / 2,600",
    overallStars: 4.5,
    standupStars: 5,
    grapplingStars: 3,
    healthStars: 4,
    prestigeTier: "PRESTIGE IV",
    purse: "$350,000",
    winBonus: "$150,000 (총 $500K 캡)",
    specialRules: "4온스 오픈핑거 글러브 무에타이 & MMA 하이브리드",
    perk: "경기 명승부 피니시 보너스 $50K 즉시 지급",
    colorTheme: {
      primary: "from-cyan-500/30 via-blue-600/20 to-black",
      border: "border-cyan-400/70",
      glow: "shadow-[0_0_35px_rgba(6,182,212,0.35)]",
      badgeBg: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
      accentText: "text-cyan-400",
    },
  },
  {
    id: "RIZIN",
    name: "RIZIN FF",
    fullName: "RIZIN FIGHTING FEDERATION",
    tagline: "SAITAMA GRAND PRIX // TOURNAMENT CALL",
    division: "OPENWEIGHT TOURNAMENT",
    location: "SAITAMA SUPER ARENA • TOKYO",
    pointsBadge: "2,100 / 2,000",
    overallStars: 4.0,
    standupStars: 4,
    grapplingStars: 4,
    healthStars: 3,
    prestigeTier: "PRESTIGE III",
    purse: "$280,000",
    winBonus: "$100,000 + GP 4강 진출",
    specialRules: "1R 10분 / 4점 스탬핑 & 사커킥 전면 허용 룰",
    perk: "토너먼트 우승 시 황금 트로피 & 1,000만 엔 수여",
    colorTheme: {
      primary: "from-red-600/30 via-rose-700/20 to-black",
      border: "border-red-500/70",
      glow: "shadow-[0_0_35px_rgba(239,68,68,0.35)]",
      badgeBg: "bg-red-500/20 border-red-500/40 text-red-300",
      accentText: "text-red-400",
    },
  },
];

export default function PromotionModal({ onClose, onAcceptContract }: PromotionModalProps) {
  const [selectedPromotion, setSelectedPromotion] = useState<"UFC" | "ONE" | "RIZIN">("UFC");
  const [signedSuccess, setSignedSuccess] = useState<string | null>(null);

  const currentOffer = PROMOTIONS.find((p) => p.id === selectedPromotion) || PROMOTIONS[0];

  const handleSelectCard = (id: "UFC" | "ONE" | "RIZIN") => {
    sounds.playSelect();
    setSelectedPromotion(id);
  };

  const handleSignContract = () => {
    sounds.playPunch();
    sounds.playBell();
    setSignedSuccess(currentOffer.name);
    if (onAcceptContract) {
      onAcceptContract(currentOffer.name);
    }
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  const renderStars = (count: number, max: number = 5, accentColor: string = "text-amber-400") => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`text-xs ${i < count ? accentColor : "text-neutral-600"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#06080d] text-neutral-100 select-none animate-fade-in flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC BACKGROUND (EA SPORTS UFC PROSPECT ARENA STAGE)             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Arena Octagon Background Silhouette */}
        <div className="absolute inset-0 opacity-20 filter contrast-125 brightness-75 scale-105">
          <Image
            src="/images/ufc_arena_transition.jpg"
            alt="UFC Arena Atmosphere"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Dynamic Studio Stage Spotlights (Purple Neon Right + Cyan Left + Gold Center) */}
        {/* Right Purple Spotlight (Matching Reference Screenshot) */}
        <div
          className="absolute -right-20 top-1/4 w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)",
          }}
        />

        {/* Left Cyan Spotlight */}
        <div
          className="absolute -left-20 top-1/3 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(14, 116, 144, 0.15) 45%, transparent 70%)",
          }}
        />

        {/* Center Ground Light Spotlight */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[1000px] h-[350px] rounded-[50%] pointer-events-none opacity-30 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(192, 132, 252, 0.3) 0%, rgba(79, 70, 229, 0.15) 50%, transparent 80%)",
          }}
        />

        {/* High-Tech Latitude/Longitude Globe Wireframe (Matching Reference Image Watermark) */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] opacity-10 pointer-events-none text-neutral-400 stroke-current"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Globe Outer Circle */}
          <circle cx="50" cy="50" r="46" strokeWidth="0.35" />
          {/* Latitude Ellipses */}
          <ellipse cx="50" cy="50" rx="46" ry="16" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
          <ellipse cx="50" cy="50" rx="46" ry="32" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
          {/* Longitude Ellipses */}
          <ellipse cx="50" cy="50" rx="16" ry="46" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
          <ellipse cx="50" cy="50" rx="32" ry="46" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
          {/* Octagon Core Lattice */}
          <polygon
            points="36.5,15 63.5,15 85,36.5 85,63.5 63.5,85 36.5,85 15,63.5 15,36.5"
            strokeWidth="0.4"
            strokeDasharray="2 1"
          />
          <polygon
            points="40,24 60,24 76,40 76,60 60,76 40,76 24,60 24,40"
            strokeWidth="0.25"
          />
        </svg>

        {/* Top Vignette & Bottom Floor Fade */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#06080d] via-[#06080d]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06080d] via-[#06080d]/90 to-transparent" />

        {/* Reflective Ground Floor Line */}
        <div className="absolute inset-x-0 bottom-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP HUD (EA SPORTS UFC ONLINE CAREER / PROSPECT TITLE CHASE)           */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-6 lg:px-12 pt-5 pb-3 flex flex-wrap items-center justify-between gap-6 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        {/* Left: Season Wreath Medal + PROSPECT Header + Chase Nodes + Division */}
        <div className="flex items-center gap-6">
          {/* Season 15 Wreath Crest */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-600/30 to-black flex items-center justify-center p-1 shadow-lg shrink-0">
              <div className="w-full h-full rounded-full border border-amber-400/30 flex flex-col items-center justify-center text-center">
                <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[7px] font-black uppercase text-amber-300 font-teko tracking-wider leading-none">
                  ONLINE CAREER
                </span>
                <span className="text-[9px] font-black font-teko text-white leading-none">
                  SEASON 15
                </span>
              </div>
              <div className="absolute -bottom-1.5 px-1.5 py-0.2 bg-black/90 border border-white/20 rounded text-[8px] text-neutral-400 font-mono">
                16d 남음
              </div>
            </div>

            {/* Big Typography Header */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl lg:text-4xl font-black font-teko text-white uppercase tracking-widest leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  PROSPECT
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-600/40 uppercase">
                  OFFICIAL INVITATIONS
                </span>
              </div>

              {/* Chase Nodes & Division Rank */}
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-teko">
                    TITLE CHASE
                  </span>
                  {/* 3 Nodes */}
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-transparent border border-white/40" />
                    <span className="w-3.5 h-3.5 rounded-full bg-transparent border border-white/40 flex items-center justify-center">
                      <Star className="w-2 h-2 text-white/40" />
                    </span>
                  </div>
                </div>

                {/* Vertical Separator */}
                <div className="w-[1px] h-4 bg-white/20" />

                {/* Division Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-teko">
                    DIVISION
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-white/30 font-teko font-black text-xs text-white">
                      18
                    </span>
                    <span className="font-teko font-black text-base text-white tracking-wide">
                      1,789
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Right: Currency & Evolution Points & Close Button */}
        <div className="flex items-center gap-3">
          {/* Cyan Gem */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-xs">
            <span className="text-cyan-400 text-sm">◆</span>
            <span className="font-teko font-bold text-sm text-white">50</span>
          </div>

          {/* Gold Coin */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-xs">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-teko font-bold text-sm text-white">1,319</span>
          </div>

          {/* Evolution Points */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-emerald-500/30 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[7px] text-neutral-400 uppercase font-semibold">EVOLUTION POINTS</span>
              <span className="font-teko font-bold text-sm text-emerald-400">2,895</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playHover();
              onClose();
            }}
            className="p-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/20 hover:border-white/50 transition-all cursor-pointer shadow-xl active:scale-90 ml-2"
            title="닫기 (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTER STAGE: 3 MARTIAL ARTS PROMOTION CARDS                           */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-4">
        {/* Section Sub-heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-teko uppercase tracking-wider text-neutral-200">
              OFFICIAL CONTRACT OFFERS // 격투기 단체 초청장
            </h2>
            <p className="text-xs text-neutral-400">
              전세계 주요 격투기 단체에서 귀하의 훈련 성과를 검토하고 공식 오퍼를 발송했습니다.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 hidden sm:flex items-center gap-2">
            <span>선택 단체: <strong className="text-white">{currentOffer.name}</strong></span>
            <span className="text-amber-400 font-bold font-mono">[{currentOffer.prestigeTier}]</span>
          </div>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {PROMOTIONS.map((promo) => {
            const isSelected = selectedPromotion === promo.id;

            return (
              <div
                key={promo.id}
                onClick={() => handleSelectCard(promo.id)}
                onMouseEnter={() => sounds.playHover()}
                className={`group relative rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md ${
                  isSelected
                    ? `border-2 ${promo.colorTheme.border} ${promo.colorTheme.glow} scale-[1.02] bg-[#0d121c]/95 z-20`
                    : "border border-white/15 hover:border-white/40 bg-[#0a0e16]/80 hover:scale-[1.01] opacity-85 hover:opacity-100 z-10"
                }`}
                style={{ minHeight: "510px" }}
              >
                {/* Background Card Atmosphere & Noise Gradient */}
                <div
                  className={`absolute inset-0 z-0 bg-gradient-to-b ${promo.colorTheme.primary} opacity-60 group-hover:opacity-80 transition-opacity`}
                />

                {/* Subtle Geometric Graphic Decal */}
                <div className="absolute top-0 right-0 w-36 h-36 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
                  <div className="w-full h-full border-4 border-white rotate-45" />
                </div>

                {/* Selected Indicator Outline Glow */}
                {isSelected && (
                  <div className="absolute inset-0 border border-white/40 pointer-events-none rounded-sm" />
                )}

                {/* ------------------------------------------------------------- */}
                {/* Card Top: Points Used / Requirements Badge                    */}
                {/* ------------------------------------------------------------- */}
                <div className="relative z-10 p-4 pb-2 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    <span className="text-emerald-400 text-xs">◆</span>
                    <span className="text-neutral-400 font-teko uppercase tracking-wider text-xs">
                      POINTS USED
                    </span>
                    <span className="text-white font-mono text-xs">{promo.pointsBadge}</span>
                  </div>

                  {/* Status Pip */}
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      isSelected
                        ? `${promo.colorTheme.badgeBg} animate-pulse`
                        : "bg-black/60 border-white/15 text-neutral-400"
                    }`}
                  >
                    {isSelected ? "SELECTED OFFER" : "OFFER ACTIVE"}
                  </span>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Card Art Banner: Organization Identity & Division Typography   */}
                {/* ------------------------------------------------------------- */}
                <div className="relative z-10 px-5 pt-3 pb-2 flex flex-col justify-center">
                  {/* Division Tag */}
                  <span className="text-[11px] font-black tracking-widest uppercase text-neutral-300 font-teko">
                    {promo.division}
                  </span>

                  {/* Big Stylized Org Name */}
                  <h3
                    className={`text-3xl lg:text-4xl font-black font-teko uppercase tracking-wider leading-none mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${promo.colorTheme.accentText}`}
                  >
                    {promo.name}
                  </h3>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5 truncate">
                    {promo.tagline}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 font-mono">
                    <Globe className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{promo.location}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative z-10 w-full px-5">
                  <div className="w-full border-t border-white/10" />
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Card Stats: Overall Stars & Breakdown (STAND-UP, GRAPPLING..) */}
                {/* ------------------------------------------------------------- */}
                <div className="relative z-10 px-5 py-3 flex flex-col gap-2.5 bg-black/40 backdrop-blur-sm mx-3 rounded my-2 border border-white/5">
                  {/* Overall Star Rating */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="text-xs font-bold text-neutral-300 font-teko tracking-wider uppercase">
                      OVERALL RATING
                    </span>
                    <div className="flex items-center gap-1.5">
                      {renderStars(
                        Math.round(promo.overallStars),
                        5,
                        promo.colorTheme.accentText
                      )}
                      <span className="font-teko font-black text-sm text-white ml-1">
                        {promo.overallStars.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* 1. STAND-UP */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-300">STAND-UP (타격력)</span>
                    {renderStars(promo.standupStars, 5, promo.colorTheme.accentText)}
                  </div>

                  {/* 2. GRAPPLING */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-300">GRAPPLING (그라운드)</span>
                    {renderStars(promo.grapplingStars, 5, promo.colorTheme.accentText)}
                  </div>

                  {/* 3. HEALTH */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-300">HEALTH (체력/회복)</span>
                    {renderStars(promo.healthStars, 5, promo.colorTheme.accentText)}
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Contract Specs: Purse, Win Bonus, Special Rule Perks           */}
                {/* ------------------------------------------------------------- */}
                <div className="relative z-10 px-5 py-2 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-black/50 border border-white/10">
                    <span className="text-neutral-400">기본 파이트머니</span>
                    <span className="font-teko font-black text-base text-emerald-400 tracking-wide">
                      {promo.purse}
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px] text-neutral-300">
                    <div className="flex items-start gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        <strong>승리 보너스:</strong> {promo.winBonus}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Shield className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-tight truncate">
                        <strong>룰셋:</strong> {promo.specialRules}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Card Footer: Prestige Ribbon & Select Status                  */}
                {/* ------------------------------------------------------------- */}
                <div className="relative z-10 mt-2 border-t border-white/10 p-3 bg-black/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Trophy className={`w-3.5 h-3.5 ${promo.colorTheme.accentText}`} />
                    <span className="font-teko font-black text-sm tracking-wider uppercase text-white">
                      {promo.prestigeTier}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors uppercase ${
                      isSelected
                        ? "bg-white text-black font-black"
                        : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
                    }`}
                  >
                    {isSelected ? "수락 대기중" : "오퍼 선택"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ACTION & CONTROLS BAR (EA SPORTS UFC BROADCAST BAR)             */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-3.5 bg-black/90 border-t border-white/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Left: EA Sports Sub-Action Buttons */}
        <div className="flex items-center gap-5 text-xs font-bold text-neutral-400">
          <button
            onClick={() => sounds.playSelect()}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            GET MORE IN THE STORE
          </button>
          <span className="text-neutral-600">|</span>
          <button
            onClick={() => sounds.playSelect()}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            LEADERBOARD
          </button>
          <span className="text-neutral-600">|</span>
          <button
            onClick={() => sounds.playSelect()}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            FIGHT HISTORY
          </button>
        </div>

        {/* Right: Controller & ESC Hints */}
        <div className="flex items-center gap-5 text-[11px] font-bold text-neutral-400">
          <div
            onClick={() => {
              sounds.playHover();
              onClose();
            }}
            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
          >
            <span className="w-4 h-4 rounded-full border border-neutral-600 bg-neutral-800 text-[9px] flex items-center justify-center text-white">
              B
            </span>
            <span>BACK (ESC)</span>
          </div>
          <div
            onClick={handleSignContract}
            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
          >
            <span className="w-4 h-4 rounded-full border border-neutral-600 bg-neutral-800 text-[9px] flex items-center justify-center text-white">
              A
            </span>
            <span className="text-white">SELECT (ENTER)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
