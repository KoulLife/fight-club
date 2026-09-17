"use client";

import React, { useState } from "react";
import Image from "next/image";
import { sounds } from "@/lib/sounds";
import {
  X,
  Shield,
  Zap,
  Target,
  Swords,
  ChevronRight,
  Sparkles,
  Award,
  Activity,
  CheckCircle2,
  Calendar,
  Flame,
  Dumbbell,
  Compass,
  FileText,
  UserCheck,
} from "lucide-react";

interface HeadCoachModalProps {
  onClose: () => void;
  onSelectFight?: (boutId: string) => void;
}

type CoachTab = "DNA" | "PLAN" | "MATCHMAKING";

interface MenuOption {
  id: CoachTab;
  title: string;
  badge: string;
  image: string;
  subtitle: string;
  description: string;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    id: "DNA",
    title: "FIGHT DNA",
    badge: "FIGHTER PROFILE & STYLE",
    image: "/images/card_fight.jpg",
    subtitle: "전투 본능 & 파이팅 성향 분석",
    description: "타격/그래플링 밸런스, 피니시 본능, 파이터 고유 특성 진단",
  },
  {
    id: "PLAN",
    title: "GAME PLAN",
    badge: "TACTICAL STRATEGY",
    image: "/images/card_camp.jpg",
    subtitle: "라운드별 결전 전술 & 전략",
    description: "상대 맞춤형 거리 싸움, 5라운드 체력 페이스, 카운터 설계",
  },
  {
    id: "MATCHMAKING",
    title: "MATCHMAKING",
    badge: "BOUT NEGOTIATION",
    image: "/images/ufc_arena_transition.jpg",
    subtitle: "차기 시합 주선 & 랭커 매치업",
    description: "가상의 적(목표) 선정, 계약 체중, 타이틀전 일정 확정",
  },
];

export default function HeadCoachModal({ onClose, onSelectFight }: HeadCoachModalProps) {
  const [activeTab, setActiveTab] = useState<CoachTab>("DNA");

  const handleTabChange = (tab: CoachTab) => {
    sounds.playSelect();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#06080d] text-neutral-100 select-none animate-fade-in flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC BACKGROUND (UFC TRAINING FACILITY & LOCKER ROOM)           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Background Gym Texture */}
        <div className="absolute inset-0 opacity-25 filter contrast-125 brightness-75 scale-105">
          <Image
            src="/images/gym_bg.jpg"
            alt="UFC Gym Facility"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Amber & Crimson Volumetric Spotlights (Coach Corner Theme) */}
        <div
          className="absolute -left-10 top-1/4 w-[650px] h-[650px] rounded-full pointer-events-none opacity-35 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.2) 45%, transparent 70%)",
          }}
        />

        <div
          className="absolute right-0 top-1/3 w-[700px] h-[700px] rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(220, 38, 38, 0.35) 0%, rgba(153, 27, 27, 0.1) 50%, transparent 75%)",
          }}
        />

        {/* Center Ground Light Spotlight */}
        <div
          className="absolute left-1/3 bottom-0 w-[900px] h-[300px] rounded-[50%] pointer-events-none opacity-25 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.3) 0%, transparent 75%)",
          }}
        />

        {/* High-Tech Octagon Decal Overlay */}
        <svg
          className="absolute -right-24 bottom-10 w-[700px] h-[700px] opacity-10 pointer-events-none text-neutral-400 stroke-current"
          viewBox="0 0 100 100"
          fill="none"
        >
          <polygon
            points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
            strokeWidth="0.5"
            strokeDasharray="2 1"
          />
          <circle cx="50" cy="50" r="35" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
        </svg>

        {/* Vignettes */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#06080d] via-[#06080d]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06080d] via-[#06080d]/90 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP HUD (HEAD COACH COMMAND CENTER)                                    */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-6 lg:px-12 pt-4 pb-3 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-sm">
        {/* Left: Coach Credential Header */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-500/30 to-black border border-amber-500/50 flex items-center justify-center p-1 shadow-lg shrink-0">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-black font-teko text-white uppercase tracking-widest leading-none drop-shadow">
                HEAD COACH
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                TACTICAL COMMAND
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">
              코치 <strong className="text-amber-400">"너클스" 맥켄지</strong> // 타이탄 파이트 팀 수석 코치
            </div>
          </div>
        </div>

        {/* Right: Status & Close */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-black/60 border border-white/10 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-neutral-400">캠프 집중도:</span>
            <span className="font-teko font-bold text-base text-emerald-400">96% (최상위 피크)</span>
          </div>

          <button
            onClick={() => {
              sounds.playHover();
              onClose();
            }}
            className="p-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/20 hover:border-white/50 transition-all cursor-pointer shadow-xl active:scale-90"
            title="닫기 (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN STAGE: LEFT COACH FIGURE & RIGHT 3-BUTTON MENU HUB                 */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN (5 Cols): Authentic Head Coach Figure (head_coach1.png)     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-end h-full min-h-[500px] lg:min-h-[640px]">
          {/* Ground Radial Shadow under Coach */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[340px] md:w-[420px] h-16 rounded-[50%] blur-md pointer-events-none bg-black/80" />

          {/* Coach Figure Image with Breathing Motion */}
          <div className="relative w-full h-[460px] md:h-[540px] lg:h-[600px] flex items-end justify-center pointer-events-none z-10">
            <div className="relative w-full h-full animate-idle-breathe">
              <Image
                src="/images/head_coach1.png"
                alt="Head Coach Knuckles Mackenzie"
                fill
                priority
                className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>

          {/* Coach Speech & Persona Box */}
          <div className="relative z-20 w-full max-w-md bg-black/85 border border-amber-500/40 p-3.5 rounded backdrop-blur-md shadow-2xl mt-[-24px]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 font-teko">
                  COACH'S DIRECTIVE // 현장 브리핑
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                LIVE CORNERMAN
              </span>
            </div>

            <p className="text-xs text-neutral-200 leading-relaxed font-medium">
              {activeTab === "DNA" &&
                `"자네의 파이트 스타일은 완벽한 정밀 타격가야. 레프트 카운터의 궤적은 예술이지만, 경기 후반 체력 분배와 서브미션 가드 디펜스를 잊지 마라."`}
              {activeTab === "PLAN" &&
                `"시합에서 무작정 주먹을 휘두르면 카운터를 맞는다. 1라운드는 탐색전, 2라운드는 늑골 타격, 3라운드에 피니시를 노리는 3단계 게임 플랜을 완벽히 숙지해라."`}
              {activeTab === "MATCHMAKING" &&
                `"매치메이커들이 보낸 오퍼 중 자네의 다음 목표에 가장 걸맞은 적을 골라라. 목표를 명확히 조준해야 옥타곤에서 흔들리지 않는 법이다."`}
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN (7 Cols): 3 Strategy Buttons (Fight DNA, Game Plan, Matchmaking) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 flex flex-col gap-4 justify-center">
          {/* Section Sub-heading (without '// 세부 전술을 선택하세요') */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-teko uppercase tracking-wider text-neutral-100 leading-none">
              HEAD COACH STRATEGY DECK
            </h2>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline-block">
              SELECT STRATEGY CARD
            </span>
          </div>

          {/* 3 MENU BUTTON CARDS (Fight DNA, Game Plan, Matchmaking) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {MENU_OPTIONS.map((menu) => {
              const isSelected = activeTab === menu.id;

              return (
                <div
                  key={menu.id}
                  onClick={() => handleTabChange(menu.id)}
                  onMouseEnter={() => sounds.playHover()}
                  className={`group relative h-[380px] sm:h-[440px] md:h-[480px] rounded-sm cursor-pointer overflow-hidden transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md select-none ${
                    isSelected
                      ? "border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] scale-[1.02] z-10 bg-black/90"
                      : "border border-white/15 hover:border-white/40 opacity-85 hover:opacity-100 hover:scale-[1.01] bg-black/75"
                  }`}
                >
                  {/* Background Artwork */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={menu.image}
                      alt={menu.title}
                      fill
                      priority
                      className="object-cover object-center filter brightness-45 contrast-125 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 transition-opacity ${
                        isSelected
                          ? "bg-gradient-to-t from-black via-black/70 to-amber-950/40"
                          : "bg-gradient-to-t from-black via-black/80 to-black/40"
                      }`}
                    />
                  </div>

                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isSelected
                          ? "bg-amber-500 text-black border-amber-400 font-bold"
                          : "bg-black/70 text-neutral-300 border-white/10"
                      }`}
                    >
                      {menu.badge}
                    </span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] animate-pulse" />
                    )}
                  </div>

                  {/* Middle Content: Title, Subtitle, Bullet Points */}
                  <div className="relative z-10 my-auto">
                    <h3
                      className={`font-teko font-black text-3xl sm:text-4xl uppercase tracking-wider leading-none transition-colors ${
                        isSelected ? "text-amber-300" : "text-white group-hover:text-amber-200"
                      }`}
                    >
                      {menu.title}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-semibold mt-1">
                      {menu.subtitle}
                    </p>
                    <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed font-pretendard">
                      {menu.description}
                    </p>

                    {/* Key Tactical Bullet Points */}
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-neutral-400 font-medium">
                      {menu.id === "DNA" && (
                        <>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>스트라이킹 & 그래플링 성향</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Flame className="w-3 h-3 text-red-400 shrink-0" />
                            <span>카운터 넉아웃 피니시 본능</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Shield className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>시그니처 무브 & 약점 진단</span>
                          </div>
                        </>
                      )}
                      {menu.id === "PLAN" && (
                        <>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Target className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>1~5라운드 옥타곤 페이스 조율</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>상대 맞춤형 거리 싸움 전략</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>테이크다운 방어 & 카운터 셋업</span>
                          </div>
                        </>
                      )}
                      {menu.id === "MATCHMAKING" && (
                        <>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Swords className="w-3 h-3 text-red-400 shrink-0" />
                            <span>랭킹 1위 컨텐더 대진 주선</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Award className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>메인 이벤트 공식 시합 계약</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>파이트머니 & 승리 보너스 조율</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer inside Card */}
                  <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                      {isSelected ? "ACTIVE STRATEGY" : "CLICK TO VIEW"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors uppercase flex items-center gap-1 ${
                        isSelected
                          ? "bg-amber-400 text-black font-black"
                          : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
                      }`}
                    >
                      <span>{isSelected ? "선택됨" : "전술 선택"}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER CONTROLS BAR                                                    */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-3 bg-black/90 border-t border-white/15 backdrop-blur-md flex items-center justify-between text-xs font-bold text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-neutral-500 font-mono">
            TITAN FIGHT LAB // HEAD CORNERMAN BRIEFING SYSTEM
          </span>
        </div>

        <div className="flex items-center gap-5 text-[11px]">
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
            onClick={() => {
              sounds.playSelect();
              if (activeTab === "DNA") setActiveTab("PLAN");
              else if (activeTab === "PLAN") setActiveTab("MATCHMAKING");
              else setActiveTab("DNA");
            }}
            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
          >
            <span className="w-4 h-4 rounded-full border border-neutral-600 bg-neutral-800 text-[9px] flex items-center justify-center text-white">
              Y
            </span>
            <span className="text-amber-400">NEXT STRATEGY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
