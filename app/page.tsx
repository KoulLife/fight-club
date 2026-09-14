"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sounds } from "@/lib/sounds";
import {
  Volume2,
  VolumeX,
  Swords,
  Trophy,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Zap,
  Activity,
  Award,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  X,
  Flame,
  Dumbbell,
  Clock,
  Sparkles,
  Share2,
  Sliders,
  TrendingUp,
  User,
  Trash2,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

interface FightProject {
  id: string;
  badge: "MAIN EVENT" | "CO-MAIN" | "TITLE BOUT" | "BOUT";
  title: string;
  shortName: string;
  dDay: string;
  color: "red" | "amber" | "blue" | "purple";
}

interface WorkoutItem {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
}

export default function CareerHubPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"HOME" | "CAMP" | "FIGHTS" | "CAREER">("HOME");
  const [isShaking, setIsShaking] = useState(false);
  const [punchFlash, setPunchFlash] = useState(false);
  const [fighterOutfit, setFighterOutfit] = useState<"MCGREGOR" | "TATTED" | "RASHGUARD">("MCGREGOR");

  // Active Modal State: null | "FIGHT" | "COACH" | "HISTORY" | "CALENDAR" | "EVOLUTION" | "SOCIAL" | "SETTINGS"
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Projects State (Project = Fight / 경기)
  const [projects, setProjects] = useState<FightProject[]>([
    {
      id: "proj-1",
      badge: "MAIN EVENT",
      title: "VS. CHAOXIANG TSANG (나태함 & 코테)",
      shortName: "VS. TSANG (코테)",
      dDay: "D-7",
      color: "red",
    },
    {
      id: "proj-2",
      badge: "CO-MAIN",
      title: "VS. SQLD 데이터 자격증 올패스",
      shortName: "VS. SQLD",
      dDay: "D-14",
      color: "amber",
    },
    {
      id: "proj-3",
      badge: "BOUT",
      title: "VS. 백엔드 클라우드 무중단 배포",
      shortName: "VS. 클라우드 배포",
      dDay: "D-3",
      color: "blue",
    },
  ]);

  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("ALL");
  const [newWorkoutTitle, setNewWorkoutTitle] = useState("");
  const [newWorkoutProjectId, setNewWorkoutProjectId] = useState<string>("proj-1");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectBadge, setNewProjectBadge] = useState<"MAIN EVENT" | "CO-MAIN" | "TITLE BOUT" | "BOUT">("BOUT");
  const [newProjectDDay, setNewProjectDDay] = useState("D-10");

  // Workouts State (contained inside TRAINING CAMP modal & screen)
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([
    {
      id: "w-1",
      projectId: "proj-1",
      title: "알고리즘 고난도 문제 2개 격파 (집중 스프린트)",
      completed: false,
    },
    {
      id: "w-2",
      projectId: "proj-1",
      title: "동적 계획법(DP) & 그래프 탐색 핵심 오답 노트 정리",
      completed: true,
    },
    {
      id: "w-3",
      projectId: "proj-2",
      title: "SQLD 2과목 SQL 기본 및 활용 모의고사 1회 풀이",
      completed: true,
    },
    {
      id: "w-4",
      projectId: "proj-3",
      title: "Docker Compose 환경 및 PostgreSQL 마이그레이션 검증",
      completed: false,
    },
    {
      id: "w-5",
      projectId: "proj-1",
      title: "UFC 커리어 모드 스타일 UI 인터랙션 리팩토링",
      completed: true,
    },
  ]);

  // Fighter Attributes (for Fighter Evolution)
  const [fighterStats, setFighterStats] = useState({
    striking: 88,
    grappling: 84,
    stamina: 92,
    health: 90,
  });

  const [availablePoints, setAvailablePoints] = useState(15);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
    if (next) sounds.playSelect();
  };

  const toggleOutfit = () => {
    sounds.playSelect();
    setFighterOutfit((prev) => {
      if (prev === "MCGREGOR") return "TATTED";
      if (prev === "TATTED") return "RASHGUARD";
      return "MCGREGOR";
    });
  };

  // Sports Game Broadcast Arena Cinematic Transition State (Fade-In -> Peak -> Fade-Out)
  const [arenaTransition, setArenaTransition] = useState<{
    visible: boolean;
    stage: "FADE_IN" | "PEAK" | "FADE_OUT";
    label?: string;
  }>({
    visible: true,
    stage: "FADE_IN",
    label: "LIVE FROM T-MOBILE ARENA, LAS VEGAS",
  });

  // Sports Game Unified Cinematic Transition Trigger (~1.1s total)
  const executeArenaTransition = (label: string, onMidpoint: () => void) => {
    sounds.playWhoosh();
    setArenaTransition({
      visible: true,
      stage: "FADE_IN",
      label,
    });

    // Step 1: Smoothly Fade-In & zoom to Peak (0.0s -> 0.38s)
    const t1 = setTimeout(() => {
      setArenaTransition((prev) => ({ ...prev, stage: "PEAK" }));
    }, 40);

    // Step 2: Swap content at transition peak while covered (0.42s)
    const t2 = setTimeout(() => {
      onMidpoint();
    }, 420);

    // Step 3: Smoothly Fade-Out & reveal new screen (0.70s -> 1.08s)
    const t3 = setTimeout(() => {
      setArenaTransition((prev) => ({ ...prev, stage: "FADE_OUT" }));
    }, 700);

    // Step 4: Hide transition overlay (1.10s)
    const t4 = setTimeout(() => {
      setArenaTransition((prev) => ({ ...prev, visible: false, stage: "FADE_IN" }));
    }, 1100);
  };

  // F5 / Initial Load: 1.1s sports game cinematic entrance
  useEffect(() => {
    const t1 = setTimeout(() => {
      setArenaTransition((prev) => ({ ...prev, stage: "PEAK" }));
    }, 50);

    const t2 = setTimeout(() => {
      setArenaTransition((prev) => ({ ...prev, stage: "FADE_OUT" }));
    }, 720);

    const t3 = setTimeout(() => {
      setArenaTransition((prev) => ({ ...prev, visible: false, stage: "FADE_IN" }));
    }, 1120);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const openModal = (modalName: string) => {
    if (modalName === "CAMP") {
      triggerTabTransition("CAMP");
      return;
    }

    const label =
      modalName === "FIGHT"
        ? "UFC 300 // MAIN EVENT FIGHT"
        : modalName === "COACH"
        ? "HEAD COACH BRIEFING"
        : modalName === "HISTORY"
        ? "FIGHT HISTORY ARCHIVE"
        : modalName === "CALENDAR"
        ? "OCTAGON FIGHT SCHEDULE"
        : modalName === "EVOLUTION"
        ? "FIGHTER EVOLUTION & ATTRIBUTES"
        : modalName === "PROMOTION"
        ? "UFC CONTRACT PROMOTION"
        : modalName === "SETTINGS"
        ? "SYSTEM & AUDIO SETTINGS"
        : modalName === "SOCIAL"
        ? "FIGHT NEWS & SOCIAL BUZZ"
        : "OCTAGON BROADCAST FEED";

    executeArenaTransition(label, () => {
      setActiveModal(modalName);
    });
  };

  const triggerTabTransition = (tabId: "HOME" | "CAMP" | "FIGHTS" | "CAREER") => {
    if (activeTab === tabId && !activeModal) return;
    const label = tabId === "CAMP" ? "UFC TRAINING CAMP" : "OCTAGON CAREER HUB";
    executeArenaTransition(label, () => {
      setActiveTab(tabId);
      setActiveModal(null);
    });
  };

  const closeModal = () => {
    sounds.playHover();
    setActiveModal(null);
  };

  const handleToggleWorkout = (id: string) => {
    const target = workouts.find((w) => w.id === id);
    const willBeCompleted = target ? !target.completed : false;

    if (willBeCompleted) {
      sounds.playPunch();
      setIsShaking(true);
      setPunchFlash(true);
      setTimeout(() => {
        setIsShaking(false);
        setPunchFlash(false);
      }, 250);
    } else {
      sounds.playHover();
    }

    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  };

  const handleDeleteWorkout = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playHover();
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleFighterPunch = () => {
    sounds.playPunch();
    setIsShaking(true);
    setPunchFlash(true);
    setTimeout(() => {
      setIsShaking(false);
      setPunchFlash(false);
    }, 250);
  };

  const handleAddWorkout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newWorkoutTitle.trim()) return;

    sounds.playPunch();
    setIsShaking(true);
    setPunchFlash(true);
    setTimeout(() => {
      setIsShaking(false);
      setPunchFlash(false);
    }, 250);

    const targetProject = activeProjectFilter !== "ALL" ? activeProjectFilter : newWorkoutProjectId;

    const newItem: WorkoutItem = {
      id: `w-${Date.now()}`,
      projectId: targetProject,
      title: newWorkoutTitle.trim(),
      completed: false,
    };

    setWorkouts((prev) => [newItem, ...prev]);
    setNewWorkoutTitle("");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    sounds.playSelect();
    const newProj: FightProject = {
      id: `proj-${Date.now()}`,
      badge: newProjectBadge,
      title: newProjectTitle.trim(),
      shortName: newProjectTitle.trim().slice(0, 14),
      dDay: newProjectDDay.trim() || "D-7",
      color: newProjectBadge === "MAIN EVENT" ? "red" : newProjectBadge === "CO-MAIN" ? "amber" : "blue",
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectFilter(newProj.id);
    setNewWorkoutProjectId(newProj.id);
    setNewProjectTitle("");
    setShowNewProjectModal(false);
  };

  const handleStatUpgrade = (statKey: keyof typeof fighterStats) => {
    if (availablePoints > 0 && fighterStats[statKey] < 100) {
      sounds.playPunch();
      setAvailablePoints((p) => p - 1);
      setFighterStats((prev) => ({ ...prev, [statKey]: prev[statKey] + 1 }));
    }
  };

  const completedWorkouts = workouts.filter((w) => w.completed).length;

  return (
    <main
      className={`relative min-h-screen w-full bg-[#080a0f] text-neutral-100 overflow-hidden flex flex-col justify-between select-none ${
        isShaking ? "screen-shake" : ""
      }`}
    >
      {/* 1. Background UFC Cage & Canvas Mat / Training Gym with Dark Cinematic Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-700">
        <Image
          src={activeTab === "CAMP" ? "/images/ufc_training_gym_v2.jpg" : "/images/cage_canvas_bg.jpg"}
          alt={activeTab === "CAMP" ? "UFC Training Gym Background" : "UFC Cage & Canvas Background"}
          fill
          priority
          className="object-cover object-bottom scale-100 opacity-90 transition-opacity duration-500"
        />
        {/* Left side dark scrim so menu tiles or to-do list pop with crisp contrast */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            activeTab === "CAMP"
              ? "bg-gradient-to-r from-black/95 via-black/80 to-transparent w-full md:w-[65%]"
              : "bg-gradient-to-r from-[#05070a] via-[#05070a]/85 to-transparent w-full md:w-[65%]"
          }`}
        />
        {/* Top bar vignette */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        {/* Bottom floor vignette */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* 2. Top HUD Bar (EA Sports UFC Style) */}
      <header className="relative z-20 w-full px-6 py-2.5 border-b border-white/10 bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs (LB / RB) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerTabTransition("HOME")}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-bold text-neutral-400 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
            title="이전 탭 (HOME)"
          >
            <span>LB</span>
          </button>

          <nav className="flex items-center gap-1">
            {[
              { id: "HOME", label: "HOME" },
              { id: "CAMP", label: "TRAINING CAMP" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  triggerTabTransition(tab.id as any);
                }}
                className={`relative px-4 py-1 text-sm font-bold tracking-wider uppercase transition-all ${
                  activeTab === tab.id
                    ? "text-white bg-red-600/30 border-b-2 border-red-600"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => triggerTabTransition("CAMP")}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-bold text-neutral-400 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
            title="다음 탭 (TRAINING CAMP)"
          >
            <span>RB</span>
          </button>
        </div>

        {/* Status Metrics (Top Right HUD) */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          {/* Notifications */}
          <div
            onClick={() => openModal("COACH")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-900/80 border border-white/10 text-neutral-300 cursor-pointer hover:border-red-500 transition-colors"
            title="코치 메시지"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">250</span>
          </div>

          {/* XP / Points */}
          <div
            onClick={() => openModal("EVOLUTION")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-900/80 border border-white/10 text-emerald-400 cursor-pointer hover:border-emerald-500 transition-colors"
            title="파이터 진화 포인트"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="font-bold font-teko text-sm tracking-wide">310.34M</span>
          </div>

          {/* Calendar D-Day */}
          <div
            onClick={() => openModal("CALENDAR")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-900/80 border border-white/10 text-neutral-300 cursor-pointer hover:border-amber-500 transition-colors"
            title="경기 일정"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-red-500" />
            <span className="font-bold">D-7</span>
          </div>

          {/* Purse */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-900/80 border border-white/10 text-yellow-400">
            <Award className="w-3.5 h-3.5" />
            <span className="font-bold font-teko text-sm tracking-wide">$75M</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1 rounded-sm bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-300 transition-colors"
            title={soundEnabled ? "SFX 켜짐" : "SFX 음소거"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-red-500" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>
        </div>
      </header>

      {/* 3. Main Stage: HOME (Career Hub Grid) OR CAMP (Training Camp Gym & To-Do List) */}
      {activeTab === "HOME" ? (
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-6 max-w-[1800px] w-full mx-auto items-center">
        {/* Left Section: 2 Columns of Game Hub Cards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch h-[440px]">
            {/* COLUMN 1: Fight Card & Head Coach Card */}
            <div className="flex flex-col gap-3.5 h-full">
              {/* CARD 1: Fight (Formerly RETIRED) */}
              <div
                onClick={() => openModal("FIGHT")}
                onMouseEnter={() => sounds.playHover()}
                className="group relative h-[215px] rounded-sm border-2 border-red-600 hover:border-red-500 cursor-pointer overflow-hidden transition-all duration-200 shadow-2xl flex flex-col justify-between p-4 glow-red hover:scale-[1.01]"
              >
                {/* Background Art: UFC Gloves clenching fist against red graffiti */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/card_fight.jpg"
                    alt="Fight Glove Artwork"
                    fill
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-0 left-0 w-full h-full bg-red-950/20 mix-blend-color-dodge" />
                </div>

                {/* Top Badge: Fight Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xl font-black font-teko uppercase tracking-wider text-white bg-red-600 px-3 py-0.5 rounded-sm shadow-md">
                    Fight
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/70 text-red-400 border border-red-600/40">
                    TITLE BOUT
                  </span>
                </div>

                {/* Bottom Bout Details */}
                <div className="relative z-10">
                  <div className="text-xs text-neutral-300 font-semibold mb-0.5">
                    MAIN EVENT VS.
                  </div>
                  <h3 className="text-2xl font-black font-teko uppercase text-white tracking-wide leading-none drop-shadow-md group-hover:text-red-400 transition-colors">
                    CHAOXIANG TSANG
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-neutral-300 mt-1 font-medium">
                    <span>가상의 적: <strong>나태함 & 코테</strong></span>
                    <span className="text-red-400 font-bold flex items-center gap-0.5">
                      시합 상세 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 2: HEAD COACH (Formerly G.O.A.T. ACHIEVED) */}
              <div
                onClick={() => openModal("COACH")}
                onMouseEnter={() => sounds.playHover()}
                className="group relative flex-1 rounded-sm border border-white/20 hover:border-amber-500/80 cursor-pointer overflow-hidden transition-all duration-200 shadow-2xl flex flex-col justify-between p-4 bg-[#0e1219]/90 hover:scale-[1.01]"
              >
                {/* Background Art: Veteran Coach in Hoodie */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/card_coach.jpg"
                    alt="Head Coach Artwork"
                    fill
                    priority
                    className="object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    HEAD COACH
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ONLINE BRIEFING
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10">
                  <p className="text-xs text-neutral-200 font-medium line-clamp-2 bg-black/60 p-2 rounded backdrop-blur-sm border border-white/10">
                    "오늘 스트라이킹 훈련 빼먹으면 옥타곤에서 가드 내려간다. 완벽히 끝내라!"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                    <span>코치: <strong>맥켄지 헤드코치</strong></span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      락커룸 진입 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Training Camp, Fight History & Calendar */}
            <div className="flex flex-col gap-3.5 h-full">
              {/* CARD 3: TRAINING CAMP (Formerly CONTRACT BONUSES) */}
              <div
                onClick={() => triggerTabTransition("CAMP")}
                onMouseEnter={() => sounds.playHover()}
                className="group relative h-[215px] rounded-sm border border-white/20 hover:border-red-500/80 cursor-pointer overflow-hidden transition-all duration-200 shadow-2xl flex flex-col justify-between p-4 bg-[#0e1219]/90 hover:scale-[1.01]"
              >
                {/* Background Art: MMA Training Gym & Heavy Bag */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/card_camp.jpg"
                    alt="Training Camp Equipment"
                    fill
                    priority
                    className="object-cover object-center opacity-65 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Dumbbell className="w-4 h-4 text-red-500" />
                    TRAINING CAMP
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-600/40">
                    WEEK 4 OF 6
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-neutral-300">오늘의 훈련 진척도</span>
                    <span className="text-emerald-400">{completedWorkouts} / {workouts.length} 완수</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden border border-white/10 mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                      style={{ width: `${(completedWorkouts / workouts.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-neutral-400 flex justify-between items-center">
                    <span>훈련 목록 및 체크인</span>
                    <span className="text-red-400 font-bold flex items-center gap-0.5">
                      캠프 열기 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* ROW 2 IN COL 2: split evenly into Fight History & Calendar */}
              <div className="flex-1 flex flex-col gap-3.5">
                {/* CARD 4: FIGHT HISTORY */}
                <div
                  onClick={() => openModal("HISTORY")}
                  onMouseEnter={() => sounds.playHover()}
                  className="group relative flex-1 rounded-sm border border-white/20 hover:border-neutral-400 cursor-pointer overflow-hidden transition-all duration-200 shadow-xl flex flex-col justify-between p-3 bg-gradient-to-r from-[#0e1219] to-[#141a24] hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                      FIGHT HISTORY
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      100% FINISH
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-auto">
                    <div className="text-2xl font-black font-teko tracking-wider text-white leading-none">
                      50 W - 0 L - 0 D (45 KO)
                    </div>
                    <span className="text-[10px] text-neutral-400 font-bold group-hover:text-red-400 flex items-center">
                      자세히 보기 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* CARD 5: CALENDAR (Formerly MY RANK) */}
                <div
                  onClick={() => openModal("CALENDAR")}
                  onMouseEnter={() => sounds.playHover()}
                  className="group relative flex-1 rounded-sm border border-white/20 hover:border-amber-500 cursor-pointer overflow-hidden transition-all duration-200 shadow-xl flex items-center justify-between p-3 bg-gradient-to-r from-[#0e1219] to-[#161d28] hover:scale-[1.01]"
                >
                  <div className="flex flex-col justify-between h-full">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                      CALENDAR
                    </span>
                    <div>
                      <div className="text-xs font-bold text-neutral-200">
                        시합일: <span className="text-red-400 font-black">2026. 09. 21 (D-7)</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">웨이트 체중 계체 & 스파링 스케줄</span>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 bg-amber-500 text-black font-black font-teko text-2xl rounded-sm tracking-wider shadow-md flex items-center justify-center">
                    D-7
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Faint Horizontal Divider Line (희미한 수평선) */}
          <div className="w-full border-t border-white/10 mt-1 mb-1" />

          {/* Sub-menu 2x2 Grid (Matching Reference Screenshot) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Row 1 - Left: PROMOTION */}
            <button
              onClick={() => openModal("PROMOTION")}
              onMouseEnter={() => sounds.playHover()}
              className="px-4 py-2 bg-[#0e1219]/80 hover:bg-[#151c27] border border-white/10 hover:border-red-600/50 rounded-sm text-left text-xs font-bold tracking-wider uppercase text-neutral-300 hover:text-white transition-all flex items-center justify-between group shadow-md"
            >
              <span>PROMOTION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
            </button>

            {/* Row 1 - Right: EDIT APPEARANCE */}
            <button
              onClick={toggleOutfit}
              onMouseEnter={() => sounds.playHover()}
              className="px-4 py-2 bg-[#0e1219]/80 hover:bg-[#151c27] border border-white/10 hover:border-amber-500/50 rounded-sm text-left text-xs font-bold tracking-wider uppercase text-neutral-300 hover:text-white transition-all flex items-center justify-between group shadow-md"
            >
              <span>EDIT APPEARANCE</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {fighterOutfit === "MCGREGOR" ? "맥그리거" : fighterOutfit === "TATTED" ? "시합용 쇼츠" : "래쉬가드"}
              </span>
            </button>

            {/* Row 2 - Left: SETTING */}
            <button
              onClick={() => openModal("SETTINGS")}
              onMouseEnter={() => sounds.playHover()}
              className="px-4 py-2 bg-[#0e1219]/80 hover:bg-[#151c27] border border-white/10 hover:border-white/30 rounded-sm text-left text-xs font-bold tracking-wider uppercase text-neutral-300 hover:text-white transition-all flex items-center justify-between group shadow-md"
            >
              <span>SETTING</span>
              <Sliders className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors" />
            </button>

            {/* Row 2 - Right: SOCIAL MEDIA */}
            <button
              onClick={() => openModal("SOCIAL")}
              onMouseEnter={() => sounds.playHover()}
              className="px-4 py-2 bg-[#0e1219]/80 hover:bg-[#151c27] border border-white/10 hover:border-red-600/50 rounded-sm text-left text-xs font-bold tracking-wider uppercase text-neutral-300 hover:text-white transition-all flex items-center justify-between group shadow-md"
            >
              <span>SOCIAL MEDIA</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">9.6K HYPE</span>
            </button>
          </div>
        </div>

        {/* Right Section: 3D Fighter Standing on the Canvas Mat (5 Cols) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-end min-h-[640px] lg:min-h-[760px]">
          {/* Canvas Floor Branding Graphics / Decals under feet */}
          <div className="absolute bottom-6 right-4 pointer-events-none select-none opacity-20 z-10">
            <div className="font-teko text-6xl font-black text-red-600/60 tracking-widest italic leading-none">
              OCTAGON CANVAS
            </div>
            <div className="text-[10px] font-black text-neutral-400 tracking-[0.25em] -mt-1 text-right">
              FIGHTWEEK • LAS VEGAS CAGE BOUT
            </div>
          </div>

          {/* 3D Standing Fighter Asset with Feet Grounded on Canvas */}
          <div className="relative w-full h-[580px] lg:h-[700px] flex items-end justify-center pointer-events-none z-15">
            {/* Single Large Enveloping Curved Ground Shadow (캐릭터 앞쪽으로 자연스럽게 뻗어 나오는 소프트 블러 반원 섀도우) */}
            <div className="absolute -bottom-6 lg:-bottom-8 flex items-center justify-center w-full pointer-events-none z-0">
              <div
                className="w-[460px] md:w-[520px] lg:w-[600px] h-24 lg:h-30 rounded-[50%] blur-sm pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 65% 50% at 50% 36%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.18) 70%, transparent 88%)",
                }}
              />
            </div>

            <div className="relative w-full h-full animate-idle-breathe z-10">
              <Image
                src={
                  fighterOutfit === "MCGREGOR"
                    ? "/images/fighter_mcgregor_clean.png"
                    : fighterOutfit === "TATTED"
                    ? "/images/fighter_tatted_transparent.png"
                    : "/images/fighter_transparent.png"
                }
                alt="3D Fighter Model on Canvas"
                fill
                priority
                className="object-contain object-bottom"
              />
            </div>
          </div>

          {/* UFC Fighter Typography Overlay (Minimal Obstruction, Matching Reference) */}
          <div className="absolute bottom-3 right-2 lg:right-6 z-20 pointer-events-none flex flex-col items-end text-right select-none">
            {/* Red Brush Style Nickname (NOTORIOUS) */}
            <div className="font-teko font-black italic uppercase text-red-600 text-3xl md:text-4xl tracking-widest leading-none drop-shadow-[0_2px_8px_rgba(220,38,38,0.7)] -mb-1 transform -skew-x-6">
              {fighterOutfit === "MCGREGOR" ? "NOTORIOUS" : fighterOutfit === "TATTED" ? "IRON" : "PHANTOM"}
            </div>

            {/* Bold White Character Name */}
            <div className="font-teko font-black text-3xl md:text-5xl uppercase text-white tracking-wider leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)] mb-2">
              {fighterOutfit === "MCGREGOR" ? "CONOR MCGREGOR" : fighterOutfit === "TATTED" ? "YOOYOO FERRARI" : "J. SMITH"}
            </div>

            {/* Compact Stat Stack Bars */}
            <div className="flex flex-col gap-1 w-fit">
              {/* 1. Weight Class & Stars Bar */}
              <div className="bg-black/80 backdrop-blur-sm border-l-2 border-red-600 px-3 py-1 flex items-center justify-between gap-4 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg">
                <span className="text-neutral-200">
                  {fighterOutfit === "MCGREGOR" ? "LIGHTWEIGHT" : fighterOutfit === "TATTED" ? "LIGHT HEAVYWEIGHT" : "MIDDLEWEIGHT"}
                </span>
                <span className="text-amber-400">
                  {fighterOutfit === "MCGREGOR" ? "★★★★★" : fighterOutfit === "TATTED" ? "★★★★☆" : "★★★★☆"}
                </span>
              </div>

              {/* 2. Title Count Bar */}
              <div className="bg-black/90 backdrop-blur-sm border border-white/10 px-3 py-1 flex items-center justify-between gap-4 text-[10px] md:text-xs font-black uppercase tracking-wider text-white shadow-lg">
                <span className="text-neutral-400 text-[9px] md:text-[10px]">TITLES</span>
                <span className="text-amber-300 font-bold">
                  {fighterOutfit === "MCGREGOR" ? "2 DIVISION CHAMPION" : fighterOutfit === "TATTED" ? "33 TITLE DEFENSES" : "CONTENDER #1"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        /* TRAINING CAMP GYM STAGE (Matching User Reference Image wmux-paste-1789361831455.png) */
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 max-w-[1800px] w-full mx-auto items-center">
          {/* LEFT SECTION (6 Cols): UFC Training Camp To-Do List Dashboard */}
          <div className="lg:col-span-6 flex flex-col w-full">
            {/* Unified EA Sports UFC Fight Camp Command Center Card */}
            <div className="bg-[#0b0f17]/90 border border-white/15 rounded-sm p-5 md:p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col gap-4 before:absolute before:top-0 before:left-0 before:w-1.5 before:h-full before:bg-gradient-to-b before:from-red-600 before:via-amber-500 before:to-transparent">
              {/* 1. Header & Camp Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-red-600/20 border border-red-500/40 text-red-500 shadow-[0_0_12px_rgba(220,38,38,0.3)]">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-[10px] font-mono tracking-widest text-red-400 font-bold uppercase">
                        CAMP COMMAND // FIGHT PREPARATION
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black font-teko text-white tracking-wide uppercase leading-tight">
                      UFC TRAINING CAMP // FIGHT-BASED WORKOUTS
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => triggerTabTransition("HOME")}
                  onMouseEnter={() => sounds.playHover()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900/90 border border-white/15 hover:border-red-500 text-neutral-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>OCTAGON HUB</span>
                </button>
              </div>

              {/* 2. Overall Camp Readiness Progress Bar */}
              <div className="space-y-2 bg-neutral-950/60 p-3 rounded border border-white/5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-300 flex items-center gap-2">
                    <span>캠프 완수율 (CAMP READINESS)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30">
                      WEEK 4 OF 6
                    </span>
                  </span>
                  <span className="text-emerald-400 font-mono text-sm font-black">
                    {Math.round((completedWorkouts / (workouts.length || 1)) * 100)}% ({completedWorkouts}/{workouts.length} 완료)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(completedWorkouts / (workouts.length || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 3. Fight / Project Selector Filter Tabs */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>목표 경기 (FIGHT PROJECTS)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setShowNewProjectModal(true);
                    }}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>새 경기 등록</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setActiveProjectFilter("ALL");
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
                      activeProjectFilter === "ALL"
                        ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        : "bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/10"
                    }`}
                  >
                    전체 경기 ({workouts.length})
                  </button>

                  {projects.map((proj) => {
                    const count = workouts.filter((w) => w.projectId === proj.id).length;
                    const doneCount = workouts.filter((w) => w.projectId === proj.id && w.completed).length;
                    const isSelected = activeProjectFilter === proj.id;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setActiveProjectFilter(proj.id);
                          setNewWorkoutProjectId(proj.id);
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                          isSelected
                            ? proj.color === "red"
                              ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                              : proj.color === "amber"
                              ? "bg-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.5)]"
                              : "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                            : "bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/10"
                        }`}
                      >
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded font-mono ${
                            isSelected ? "bg-black/30 text-white" : "bg-neutral-800 text-neutral-300"
                          }`}
                        >
                          {proj.dDay}
                        </span>
                        <span>{proj.shortName}</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          ({doneCount}/{count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Direct Inline Workout Input (사용자 요청: 바로 추가할 수 있도록) */}
              <form
                onSubmit={handleAddWorkout}
                className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#121722]/90 p-2.5 rounded border border-white/15 shadow-inner"
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase hidden sm:inline">경기:</span>
                  <select
                    value={activeProjectFilter !== "ALL" ? activeProjectFilter : newWorkoutProjectId}
                    onChange={(e) => setNewWorkoutProjectId(e.target.value)}
                    disabled={activeProjectFilter !== "ALL"}
                    className="bg-neutral-900 border border-white/15 text-xs text-neutral-200 px-2.5 py-2 rounded focus:outline-none focus:border-red-500 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed max-w-[140px]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="새 훈련 과제 입력 후 [Enter] 또는 [등록]... (예: 알고리즘 실전 풀이)"
                  value={newWorkoutTitle}
                  onChange={(e) => setNewWorkoutTitle(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 px-3 py-2 rounded focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />

                <button
                  type="submit"
                  disabled={!newWorkoutTitle.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-bold tracking-wider rounded uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-md hover:shadow-red-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>등록</span>
                </button>
              </form>

              {/* 5. Scrollable Project-Based Workout List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {workouts
                  .filter((w) => activeProjectFilter === "ALL" || w.projectId === activeProjectFilter)
                  .map((workout) => {
                    const proj = projects.find((p) => p.id === workout.projectId) || projects[0];
                    return (
                      <div
                        key={workout.id}
                        onClick={() => handleToggleWorkout(workout.id)}
                        className={`flex items-center justify-between p-3 rounded border transition-all cursor-pointer select-none group ${
                          workout.completed
                            ? "bg-black/45 border-neutral-800 text-neutral-500 opacity-65"
                            : "bg-[#131924]/95 hover:bg-[#192230] border-white/10 hover:border-red-600/60 text-neutral-100 shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {workout.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-neutral-500 group-hover:text-red-400 shrink-0 transition-colors" />
                          )}
                          <div className="min-w-0">
                            {/* Project Badge (경기 정보 배지 - Striking/High 태그 제거) */}
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${
                                  proj.color === "red"
                                    ? "bg-red-950/80 text-red-400 border border-red-800/50"
                                    : proj.color === "amber"
                                    ? "bg-amber-950/80 text-amber-400 border border-amber-800/50"
                                    : "bg-blue-950/80 text-blue-400 border border-blue-800/50"
                                }`}
                              >
                                <span className="font-mono">{proj.badge}</span>
                                <span>•</span>
                                <span className="truncate max-w-[160px]">{proj.shortName}</span>
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400 px-1 py-0.5 rounded bg-neutral-900 border border-white/5">
                                {proj.dDay}
                              </span>
                            </div>

                            <p
                              className={`text-xs font-medium truncate ${
                                workout.completed ? "line-through text-neutral-500" : "text-white"
                              }`}
                            >
                              {workout.title}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span
                            className={`text-xs font-bold font-mono ${
                              workout.completed ? "text-emerald-400" : "text-neutral-400"
                            }`}
                          >
                            {workout.completed ? "KO 완수 🥊" : "미완료"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteWorkout(workout.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-600/30 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                            title="과제 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {workouts.filter((w) => activeProjectFilter === "ALL" || w.projectId === activeProjectFilter).length === 0 && (
                  <div className="py-10 text-center text-neutral-400 text-xs border border-dashed border-white/10 rounded">
                    등록된 훈련 과제가 없습니다. 위 입력창에서 바로 새 훈련 과제를 추가해보세요! 🥊
                  </div>
                )}
              </div>

              {/* 6. List Footer */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-neutral-400">
                <span className="text-[11px] text-neutral-400">
                  남은 과제: <strong className="text-white">{workouts.length - completedWorkouts}</strong>개 (전체 {workouts.length}개)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setWorkouts((prev) => prev.map((w) => ({ ...w, completed: true })));
                    }}
                    className="text-[11px] font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    모두 완료
                  </button>
                  <span className="text-neutral-700">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setWorkouts((prev) => prev.map((w) => ({ ...w, completed: false })));
                    }}
                    className="text-[11px] font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    모두 초기화
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION (6 Cols): Heavy Punching Bag + Training Fighter Conor McGregor Grounded on Gym Mat */}
          <div className="lg:col-span-6 relative flex flex-col items-end justify-end min-h-[640px] lg:min-h-[760px] w-full select-none">
            {/* Gym Floor Decal */}
            <div className="absolute bottom-6 right-6 pointer-events-none select-none opacity-20 z-10 text-right">
              <div className="font-teko text-6xl font-black text-red-600/60 tracking-widest italic leading-none">
                UFC GYM FACILITY
              </div>
              <div className="text-[10px] font-black text-neutral-400 tracking-[0.25em] -mt-1">
                LAS VEGAS WAREHOUSE • HEAVY BAG WORKOUT
              </div>
            </div>

            {/* Interactive Heavy Bag & Striking Fighter Stage */}
            <div
              onClick={handleFighterPunch}
              className="relative w-full h-[580px] lg:h-[720px] flex items-end justify-end cursor-pointer z-15 group pr-2 lg:pr-6"
              title="클릭하여 샌드백 타격하기 🥊"
            >
              {/* 1. Heavy Punching Bag (Positioned directly in front of Conor's punching glove) */}
              <div
                className={`absolute bottom-16 sm:bottom-18 lg:bottom-20 right-[270px] sm:right-[330px] md:right-[390px] lg:right-[450px] w-[125px] sm:w-[145px] md:w-[160px] lg:w-[175px] h-[480px] sm:h-[560px] md:h-[620px] lg:h-[680px] z-14 transition-all duration-200 origin-top ${
                  punchFlash ? "-rotate-6 -translate-x-2 brightness-110" : "rotate-0 translate-x-0 brightness-100"
                }`}
              >
                {/* Ceiling Chain attachment visual extending up to beams */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-1.5 h-36 bg-gradient-to-b from-neutral-600 via-neutral-400 to-neutral-700 opacity-80" />

                {/* Heavy Bag PNG (Authentic Black Leather from User sandbag.png) */}
                <div className="relative w-full h-full">
                  <Image
                    src="/images/sandbag_clean.png"
                    alt="Authentic Heavy Punching Bag"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                  />
                </div>

                {/* Ground shadow under heavy bag on gym mat */}
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-32 h-10 rounded-[50%] blur-md pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 50%, transparent 80%)",
                  }}
                />
              </div>

              {/* 2. Punch Strike Impact Spark / Flare (Appears right between glove and heavy bag) */}
              {punchFlash && (
                <div className="absolute top-[31%] lg:top-[30%] right-[260px] sm:right-[320px] md:right-[380px] lg:right-[445px] z-30 pointer-events-none animate-ping">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-amber-400 blur-sm shadow-[0_0_24px_rgba(239,68,68,0.9)]" />
                </div>
              )}

              {/* 3. Conor McGregor Grounded on Gym Mat Floor (Shifted to the right) */}
              <div className="relative w-[340px] sm:w-[410px] md:w-[470px] lg:w-[530px] h-full flex items-end justify-center z-15">
                {/* Single Large Enveloping Curved Ground Shadow under McGregor's feet */}
                <div className="absolute -bottom-6 lg:-bottom-8 flex items-center justify-center w-full pointer-events-none z-0">
                  <div
                    className="w-[420px] md:w-[480px] lg:w-[540px] h-24 lg:h-28 rounded-[50%] blur-sm pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 65% 50% at 50% 36%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.58) 38%, rgba(0,0,0,0.2) 70%, transparent 88%)",
                    }}
                  />
                </div>

                {/* Fighter Image with idle breathe and punch interaction */}
                <div
                  className={`relative w-full h-full animate-idle-breathe z-10 flex items-end justify-center transition-transform ${
                    punchFlash ? "scale-[1.02] -translate-x-1" : "scale-100"
                  }`}
                >
                  <Image
                    src="/images/fighter_mcgregor_training.png"
                    alt="Conor McGregor Training in Gym"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)] filter contrast-105"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Fighter Attributes Strip */}
            <div className="relative z-20 w-full max-w-sm flex flex-col gap-1.5 mt-2 pointer-events-auto pr-2 lg:pr-6">
              <div className="bg-black/80 backdrop-blur-sm border-l-2 border-red-600 px-3 py-1 flex items-center justify-between gap-4 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg">
                <span className="text-neutral-200">TRAINING FOCUS: HEAVY BAG STRIKING</span>
                <span className="text-amber-400">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Controller Navigation & Help Bar */}
      <footer className="relative z-20 w-full px-6 py-2 bg-black/80 border-t border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-neutral-400">
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
            FIGHTWEEK CAREER HUB // UFC EDITION
          </span>
        </div>

        {/* Gamepad / Controller Hints */}
        <div className="flex items-center gap-4 text-[11px] font-bold text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full border border-neutral-600 bg-neutral-800 text-[9px] flex items-center justify-center text-white">
              B
            </span>
            <span>QUIT CAREER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full border border-neutral-600 bg-neutral-800 text-[9px] flex items-center justify-center text-white">
              A
            </span>
            <span className="text-white">SELECT / INTERACT</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE MODALS FOR EVERY ACTIVE BUTTON                             */}
      {/* ========================================================================= */}

      {/* MODAL 1: Fight Modal */}
      {activeModal === "FIGHT" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0e1219] border-2 border-red-600 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  UFC TITLE BOUT STRATEGY & DETAILS
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-red-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-neutral-300">
              <div className="p-4 bg-black/60 rounded border border-red-600/30">
                <div className="text-xs text-red-400 font-bold uppercase mb-1">MAIN EVENT FIGHT CARD</div>
                <div className="text-2xl font-black font-teko text-white">VS. CHAOXIANG TSANG</div>
                <p className="text-xs text-neutral-400">
                  이번 경기의 가상 적: <strong>나태함 & 정보처리기사 실기</strong>
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-xs text-center">
                  <div>
                    <span className="text-neutral-500 block">D-DAY</span>
                    <span className="font-bold text-red-400">2026. 09. 21 (D-7)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">WEIGHT</span>
                    <span className="font-bold text-white">205 LBS (LIGHT HEAVY)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">HYPE</span>
                    <span className="font-bold text-emerald-400">VERY HIGH</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/60 p-3 rounded border border-white/10">
                <h4 className="text-xs font-bold text-neutral-300 uppercase mb-1">코치의 전략 지시서</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  "상대는 집중력이 흐트러지는 후반 라운드에 기습 테이크다운(스마트폰/유튜브)을 시도할 것이다. 
                  전반 3개 라운드 동안 90분 단위 고강도 스프린트 훈련으로 승기를 굳혀라."
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => {
                    sounds.playPunch();
                    closeModal();
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-lg"
                >
                  시합 준비 훈련 즉시 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Head Coach Locker Room */}
      {activeModal === "COACH" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#0e1219] border border-amber-500/60 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  AI HEAD COACH LOCKER ROOM
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-amber-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-black/60 rounded border border-white/10">
                <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 border border-amber-500/40">
                  <Image
                    src="/images/card_coach.jpg"
                    alt="Coach"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-black uppercase text-white font-teko tracking-wide">
                    COACH "KNUCKLES" MACKENZIE
                  </div>
                  <div className="text-xs text-amber-400 font-medium">MMA 헤드코치 / 전략 진단관</div>
                  <div className="text-[11px] text-neutral-400">캠프 성실도: 94% (최적 컨디션 유지 중)</div>
                </div>
              </div>

              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded text-xs text-neutral-200 leading-relaxed space-y-2">
                <p className="font-bold text-amber-300">오늘의 코칭 브리핑:</p>
                <p>
                  "지금 시점에서 가장 경계해야 할 건 조급함이다. 남은 D-7 동안 새로운 걸 무리하게 벌리지 말고,
                  스트라이킹(알고리즘) 기본 패턴을 손에 익히고 컨디셔닝 수면을 7시간 이상 확보해라."
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    sounds.playSelect();
                    closeModal();
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
                >
                  지시 사항 접수 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Fight History Archive */}
      {activeModal === "HISTORY" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0e1219] border border-white/20 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  TALE OF THE TAPE // 통산 전적실
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-black/60 p-3 rounded border border-white/10">
                <span className="text-[10px] text-neutral-400 block">TOTAL RECORD</span>
                <span className="text-2xl font-black font-teko text-white">50 W - 0 L</span>
              </div>
              <div className="bg-black/60 p-3 rounded border border-white/10">
                <span className="text-[10px] text-neutral-400 block">FINISH RATE</span>
                <span className="text-2xl font-black font-teko text-red-400">90% (45 KO)</span>
              </div>
              <div className="bg-black/60 p-3 rounded border border-white/10">
                <span className="text-[10px] text-neutral-400 block">TITLE DEFENSES</span>
                <span className="text-2xl font-black font-teko text-amber-400">33 연속 방어</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 text-xs">
              {[
                { opponent: "게으름 및 무기력증", result: "WIN", type: "KO (Rd 2)", date: "2026.08.15" },
                { opponent: "SQLD 자격증 취득", result: "WIN", type: "DECISION", date: "2026.07.20" },
                { opponent: "알고리즘 코딩테스트", result: "WIN", type: "TKO (Rd 1)", date: "2026.06.10" },
              ].map((fight, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-neutral-900/80 rounded border border-white/10">
                  <div>
                    <span className="font-bold text-white mr-2">{fight.opponent}</span>
                    <span className="text-neutral-500 text-[11px]">{fight.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold text-[10px]">
                      {fight.result}
                    </span>
                    <span className="text-red-400 font-bold">{fight.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Calendar Modal */}
      {activeModal === "CALENDAR" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#0e1219] border border-amber-500/60 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  FIGHT CAMP SCHEDULE & CALENDAR
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-950/30 border border-red-600/40 rounded flex items-center justify-between">
                <div>
                  <div className="text-red-400 font-bold uppercase">UFC MAIN EVENT FIGHT NIGHT</div>
                  <div className="text-white font-bold text-sm">2026년 9월 21일 (D-7)</div>
                </div>
                <span className="px-2.5 py-1 bg-red-600 text-white font-bold rounded">시합일</span>
              </div>

              <div className="p-3 bg-neutral-900/80 border border-white/10 rounded space-y-2">
                <div className="font-bold text-neutral-300">캠프 주간 일정:</div>
                <div className="flex justify-between text-neutral-400 border-b border-white/5 pb-1">
                  <span>D-5: 고강도 실전 스파링</span>
                  <span className="text-amber-400">스트라이킹 스프린트</span>
                </div>
                <div className="flex justify-between text-neutral-400 border-b border-white/5 pb-1">
                  <span>D-2: 공식 체중 계체량(Weigh-in)</span>
                  <span className="text-emerald-400">컨디션 조율 & 감량 완료</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>D-Day: 옥타곤 입장</span>
                  <span className="text-red-400 font-bold">승리 달성</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Fighter Evolution Modal */}
      {activeModal === "EVOLUTION" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0e1219] border border-red-600/60 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  FIGHTER EVOLUTION // 능숙도 분배
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between p-2.5 bg-black/60 rounded border border-white/10 text-xs">
              <span className="text-neutral-400">사용 가능한 진화 포인트:</span>
              <span className="text-lg font-bold font-teko text-amber-400">{availablePoints} PT</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { key: "striking", label: "STRIKING (집중 몰입력)", val: fighterStats.striking },
                { key: "grappling", label: "GRAPPLING (자료/정리력)", val: fighterStats.grappling },
                { key: "stamina", label: "STAMINA (지속 훈련력)", val: fighterStats.stamina },
                { key: "health", label: "HEALTH (회복 & 컨디션)", val: fighterStats.health },
              ].map((stat) => (
                <div key={stat.key} className="flex items-center justify-between p-2.5 bg-neutral-900 rounded border border-white/5">
                  <span className="font-bold text-neutral-200">{stat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-teko text-lg text-white font-bold">{stat.val} / 100</span>
                    <button
                      onClick={() => handleStatUpgrade(stat.key as any)}
                      disabled={availablePoints <= 0 || stat.val >= 100}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white rounded text-[10px] font-bold"
                    >
                      +1 강화
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Social Media Modal */}
      {activeModal === "SOCIAL" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0e1219] border border-white/20 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-rose-500" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  SOCIAL MEDIA // 팬 반응 & 화제성
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black/60 rounded border border-white/10">
                <div className="text-neutral-400 font-semibold mb-1">@mma_junkie</div>
                <p className="text-neutral-200">"YOOYOO FERRARI의 33차 타이틀 방어전은 UFC 역사상 가장 위대한 순간이 될 것이다!"</p>
              </div>
              <div className="p-3 bg-black/60 rounded border border-white/10">
                <div className="text-neutral-400 font-semibold mb-1">@dana_white_official</div>
                <p className="text-neutral-200">"이 선수의 훈련 캠프 소화율은 100%다. 시합 당일 파이트머니 보너스가 기대된다."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: Settings Modal */}
      {activeModal === "SETTINGS" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0e1219] border border-white/20 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-neutral-400" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  SETTINGS // 환경 설정
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-neutral-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-white/10">
                <span>사운드 효과음 (SFX)</span>
                <button
                  onClick={toggleSound}
                  className="px-3 py-1 bg-neutral-800 rounded font-bold text-white hover:bg-neutral-700"
                >
                  {soundEnabled ? "켜짐 (ON)" : "꺼짐 (OFF)"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-white/10">
                <span>파이터 복장 선택</span>
                <button
                  onClick={toggleOutfit}
                  className="px-3 py-1 bg-neutral-800 rounded font-bold text-amber-400 hover:bg-neutral-700"
                >
                  {fighterOutfit === "TATTED" ? "시합용 쇼츠 (타투)" : "래쉬가드"}
                </button>
              </div>

              <div className="p-3 bg-black/60 rounded border border-white/10 text-[11px] text-neutral-400">
                버전: FightWeek v1.0.0 (UFC Theme Edition)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: Promotion Modal */}
      {activeModal === "PROMOTION" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0e1219] border border-red-600/60 rounded-sm shadow-2xl overflow-hidden p-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-black font-teko uppercase text-white tracking-wide">
                  FIGHT PROMOTION // 미디어 & 스폰서십
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded bg-neutral-800 hover:bg-red-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-950/30 border border-red-600/40 rounded flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 block font-semibold">CURRENT FIGHT HYPE</span>
                  <span className="text-xl font-black font-teko text-white">9,631 HYPE (VERY HIGH)</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-[10px]">
                  BOUT PAY: +25% BONUS
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-neutral-900/80 rounded border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">UFC 310 공식 프레스 컨퍼런스</div>
                    <div className="text-neutral-400 text-[11px]">기자회견 설전으로 파이트 관심도 15% 상승</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playSelect();
                      closeModal();
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] rounded uppercase"
                  >
                    진행 완료
                  </button>
                </div>

                <div className="p-3 bg-neutral-900/80 rounded border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Venum 공식 스폰서 촬영</div>
                    <div className="text-neutral-400 text-[11px]">스폰서십 파이트머니 $10,000 확보</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playSelect();
                      closeModal();
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-[10px] rounded uppercase"
                  >
                    체결됨
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW FIGHT PROJECT MODAL (새 경기/프로젝트 등록 모달) */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f17] border border-white/20 rounded-sm max-w-lg w-full p-6 shadow-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-red-600 via-amber-500 before:to-red-600">
            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playHover();
                setShowNewProjectModal(false);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-red-600/20 border border-red-500/40 text-red-500">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-red-400 font-bold uppercase">
                  UFC MATCHMAKING // NEW BOUT
                </div>
                <h3 className="text-2xl font-black font-teko uppercase text-white tracking-wide">
                  새 경기(프로젝트) 등록
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  경기 등급 (BOUT TIER)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["MAIN EVENT", "CO-MAIN", "TITLE BOUT", "BOUT"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        setNewProjectBadge(tier);
                      }}
                      className={`px-2 py-2 rounded text-[11px] font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                        newProjectBadge === tier
                          ? tier === "MAIN EVENT" || tier === "TITLE BOUT"
                            ? "bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            : tier === "CO-MAIN"
                            ? "bg-amber-600 text-white border-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.5)]"
                            : "bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                          : "bg-neutral-900 text-neutral-400 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  경기 명칭 / 상대 목표 (BOUT TITLE)
                </label>
                <input
                  type="text"
                  placeholder="예: VS. 정보처리기사 실기 or VS. 최종 프로젝트 릴리즈"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 px-3 py-2.5 rounded focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  결전 디데이 (FIGHT D-DAY)
                </label>
                <input
                  type="text"
                  placeholder="예: D-7, D-14, D-30"
                  value={newProjectDDay}
                  onChange={(e) => setNewProjectDDay(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 px-3 py-2.5 rounded focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playHover();
                    setShowNewProjectModal(false);
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded uppercase cursor-pointer transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider rounded uppercase cursor-pointer transition-all shadow-md hover:shadow-red-600/40"
                >
                  경기 확정 (CONFIRM BOUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. EA Sports UFC Style Cinematic Arena Transition Overlay (Fade-In -> Peak -> Fade-Out) */}
      {arenaTransition.visible && (
        <div
          className={`fixed inset-0 z-[100] pointer-events-none flex flex-col justify-between overflow-hidden transition-all ease-in-out ${
            arenaTransition.stage === "FADE_IN"
              ? "opacity-0 scale-95 blur-sm"
              : arenaTransition.stage === "PEAK"
              ? "opacity-100 scale-100 blur-0"
              : "opacity-0 scale-105 blur-sm"
          }`}
          style={{
            transitionDuration: arenaTransition.stage === "PEAK" ? "380ms" : "420ms",
            transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {/* Background Arena Image with cinematic sports lighting */}
          <div className="absolute inset-0 z-0 bg-black">
            <Image
              src="/images/ufc_arena_transition.jpg"
              alt="UFC Arena Transition Feed"
              fill
              priority
              className={`object-cover object-center transition-transform duration-1000 ease-out ${
                arenaTransition.stage === "FADE_IN"
                  ? "scale-105"
                  : arenaTransition.stage === "PEAK"
                  ? "scale-100"
                  : "scale-110"
              }`}
            />
            {/* Cinematic vignette scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/90" />
            <div className="absolute inset-0 bg-red-950/20 mix-blend-color" />
            {/* CRT TV scanlines effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.45)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />
          </div>

          {/* Diagonal Red Sports Light Wipe / Sheen Slash */}
          <div
            className={`absolute inset-0 z-5 pointer-events-none transition-all duration-700 ease-out overflow-hidden ${
              arenaTransition.stage === "FADE_IN"
                ? "-translate-x-full opacity-0"
                : arenaTransition.stage === "PEAK"
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="w-[180%] h-full -rotate-12 -translate-y-16 bg-gradient-to-r from-transparent via-red-600/30 to-transparent blur-xl" />
            <div className="w-[140%] h-full -rotate-12 -translate-y-16 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md -ml-12" />
          </div>

          {/* Corner Frame Markers (Sports Camera Viewfinder HUD) */}
          <div className="absolute top-16 left-6 w-8 h-8 border-t-2 border-l-2 border-red-500/70 z-10 pointer-events-none" />
          <div className="absolute top-16 right-6 w-8 h-8 border-t-2 border-r-2 border-red-500/70 z-10 pointer-events-none" />
          <div className="absolute bottom-16 left-6 w-8 h-8 border-b-2 border-l-2 border-red-500/70 z-10 pointer-events-none" />
          <div className="absolute bottom-16 right-6 w-8 h-8 border-b-2 border-r-2 border-red-500/70 z-10 pointer-events-none" />

          {/* Top Cinema Letterbox Bar & Broadcast Info */}
          <div
            className={`relative z-10 w-full h-14 md:h-18 bg-black/95 border-b border-red-600/40 px-6 md:px-10 flex items-center justify-between transition-transform duration-400 ease-out ${
              arenaTransition.stage === "FADE_IN" ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 -ml-5.5" />
              <span className="font-teko text-xl font-bold tracking-widest text-red-500 uppercase">
                EA SPORTS UFC // LIVE BROADCAST
              </span>
            </div>
            <div className="text-[10px] md:text-xs font-mono tracking-widest text-neutral-300 flex items-center gap-3">
              <span className="text-red-400 font-bold animate-pulse">● ON-AIR</span>
              <span>FEED 01 • 1080P 60FPS // LAS VEGAS NV</span>
            </div>
          </div>

          {/* Center Title Card */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/25 border border-red-500/50 mb-3 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-teko text-base md:text-lg tracking-[0.35em] uppercase font-bold">
                MAIN BROADCAST FEED
              </span>
            </div>
            <h1 className="font-teko text-5xl md:text-8xl font-black text-white tracking-widest uppercase italic drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
              {arenaTransition.label || "T-MOBILE ARENA"}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="h-0.5 w-16 md:w-28 bg-gradient-to-r from-transparent to-red-600" />
              <span className="text-[11px] md:text-xs font-mono tracking-[0.4em] text-neutral-300 uppercase">
                OCTAGON CAREER HUB
              </span>
              <div className="h-0.5 w-16 md:w-28 bg-gradient-to-l from-transparent to-red-600" />
            </div>
          </div>

          {/* Bottom Cinema Letterbox Bar */}
          <div
            className={`relative z-10 w-full h-14 md:h-18 bg-black/95 border-t border-red-600/40 px-6 md:px-10 flex items-center justify-between text-xs text-neutral-400 font-semibold font-teko tracking-wider transition-transform duration-400 ease-out ${
              arenaTransition.stage === "FADE_IN" ? "translate-y-full" : "translate-y-0"
            }`}
          >
            <span>LAS VEGAS, NEVADA</span>
            <span className="text-neutral-400 tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              OCTAGON CAGE BOUT // LIVE TRANSITION
            </span>
            <span>UFC 300 • WORLD CHAMPIONSHIP</span>
          </div>
        </div>
      )}
    </main>
  );
}
