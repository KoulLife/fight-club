"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sounds } from "@/lib/sounds";
import {
  X,
  CheckCircle2,
  Sparkles,
  Edit3,
  Check,
} from "lucide-react";

export interface TimerTask {
  id?: string;
  title: string;
  isFromWorkout: boolean;
}

export interface WorkoutItem {
  id: string;
  projectId: string;
  category: "STAND-UP" | "GRAPPLING" | "HEALTH";
  title: string;
  completed: boolean;
}

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerMode: "INTERVAL" | "CARDIO";
  setTimerMode: (mode: "INTERVAL" | "CARDIO") => void;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  intervalTotalSeconds: number;
  setIntervalTotalSeconds: (sec: number) => void;
  intervalSecondsLeft: number;
  setIntervalSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  cardioSeconds: number;
  setCardioSeconds: React.Dispatch<React.SetStateAction<number>>;
  activeTask: TimerTask | null;
  setActiveTask: (task: TimerTask | null) => void;
  workouts: WorkoutItem[];
  onToggleWorkout?: (id: string) => void;
  onAddWorkout?: (title: string) => void;
}

export default function FocusTimerModal({
  isOpen,
  onClose,
  timerMode,
  setTimerMode,
  isTimerRunning,
  setIsTimerRunning,
  intervalTotalSeconds,
  setIntervalTotalSeconds,
  intervalSecondsLeft,
  setIntervalSecondsLeft,
  cardioSeconds,
  setCardioSeconds,
  activeTask,
  setActiveTask,
  workouts,
  onToggleWorkout,
  onAddWorkout,
}: FocusTimerModalProps) {
  // Input State for cool single input bar
  const [taskInputValue, setTaskInputValue] = useState(activeTask?.title || "");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [completionCelebration, setCompletionCelebration] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Close todo dropdown when clicking outside (e.g. on stopwatch or background)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(e.target as Node)) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Time Click Edit State (LCD 시간 클릭 변경)
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutesInput, setEditMinutesInput] = useState("25");
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Fast Milliseconds Tick Animation (1/100s)
  const [centiseconds, setCentiseconds] = useState(0);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const updateCentis = (now: number) => {
      if (isTimerRunning) {
        const delta = now - lastTime;
        if (delta >= 10) {
          setCentiseconds((prev) => (prev + Math.floor(delta / 10)) % 100);
          lastTime = now;
        }
        animId = requestAnimationFrame(updateCentis);
      }
    };

    if (isTimerRunning) {
      lastTime = performance.now();
      animId = requestAnimationFrame(updateCentis);
    } else {
      setCentiseconds(0);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isTimerRunning]);

  // Sync task input when activeTask changes externally
  useEffect(() => {
    if (activeTask) {
      setTaskInputValue(activeTask.title);
    }
  }, [activeTask]);

  if (!isOpen) return null;

  // Format Helper: 항상 시:분:초 (hh:mm:ss)
  const formatDigitalTime = (totalSecs: number) => {
    const h = String(Math.floor(totalSecs / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, "0");
    const s = String(totalSecs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Physical Stopwatch Button Handlers
  const handleLapReset = () => {
    sounds.playSelect();
    setIsTimerRunning(false);
    setCentiseconds(0);
    if (timerMode === "INTERVAL") {
      setIntervalSecondsLeft(intervalTotalSeconds);
    } else {
      setCardioSeconds(0);
    }
  };

  const handleModeSwitch = () => {
    sounds.playSelect();
    setTimerMode(timerMode === "INTERVAL" ? "CARDIO" : "INTERVAL");
  };

  const handleStartStop = () => {
    if (isEditingTime) {
      setIsEditingTime(false);
    }
    if (!isTimerRunning) {
      sounds.playBell();
    } else {
      sounds.playSelect();
    }
    setIsTimerRunning((prev) => !prev);
  };

  // Time Edit Handlers (초시계 LCD 시간 클릭 시 변경)
  const handleStartEditTime = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    }
    sounds.playSelect();
    const currentMins = Math.max(1, Math.round((timerMode === "INTERVAL" ? intervalSecondsLeft : cardioSeconds) / 60));
    setEditMinutesInput(String(currentMins));
    setIsEditingTime(true);
    setTimeout(() => {
      timeInputRef.current?.focus();
      timeInputRef.current?.select();
    }, 50);
  };

  const handleSaveEditTime = (customSecs?: number) => {
    sounds.playPunch();
    let totalSecs = customSecs;

    if (totalSecs === undefined) {
      // Parse user input (supports "25" or "25:30")
      const trimmed = editMinutesInput.trim();
      if (trimmed.includes(":")) {
        const parts = trimmed.split(":");
        const m = parseInt(parts[0], 10) || 0;
        const s = parseInt(parts[1], 10) || 0;
        totalSecs = Math.max(10, m * 60 + s);
      } else {
        const m = parseInt(trimmed, 10) || 25;
        totalSecs = Math.max(10, m * 60);
      }
    }

    if (timerMode === "INTERVAL") {
      setIntervalTotalSeconds(totalSecs);
      setIntervalSecondsLeft(totalSecs);
    } else {
      setCardioSeconds(totalSecs);
    }

    setIsEditingTime(false);
  };

  // Cool Single Input Bar Handlers
  const handleTaskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = taskInputValue.trim();
    if (!trimmed) {
      setActiveTask(null);
      return;
    }
    sounds.playSelect();
    // Check if matches an existing workout
    const matched = workouts.find((w) => w.title.toLowerCase() === trimmed.toLowerCase());
    if (matched) {
      setActiveTask({
        id: matched.id,
        title: matched.title,
        isFromWorkout: true,
      });
    } else {
      setActiveTask({
        title: trimmed,
        isFromWorkout: false,
      });
      if (onAddWorkout) {
        onAddWorkout(trimmed);
      }
    }
    setIsInputFocused(false);
  };

  const handleSelectTodoItem = (workout: WorkoutItem) => {
    sounds.playSelect();
    setTaskInputValue(workout.title);
    setActiveTask({
      id: workout.id,
      title: workout.title,
      isFromWorkout: true,
    });
    setIsInputFocused(false);
  };

  const handleCompleteCurrentTask = () => {
    sounds.playBell();
    setCompletionCelebration(true);
    setTimeout(() => setCompletionCelebration(false), 3000);

    if (activeTask?.id && onToggleWorkout) {
      onToggleWorkout(activeTask.id);
    }
  };

  const pendingWorkouts = workouts.filter((w) => !w.completed);
  const currentTimeDisplay =
    timerMode === "INTERVAL"
      ? formatDigitalTime(intervalSecondsLeft)
      : formatDigitalTime(cardioSeconds);

  const intervalProgress =
    intervalTotalSeconds > 0
      ? Math.max(0, Math.min(100, ((intervalTotalSeconds - intervalSecondsLeft) / intervalTotalSeconds) * 100))
      : 0;

  const QUICK_MINUTES = [10, 15, 20, 25, 30, 45, 60];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playSelect();
          onClose();
        }
      }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
    >
      {/* Subtle Background Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
          isTimerRunning
            ? timerMode === "INTERVAL"
              ? "bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.18)_0%,_transparent_60%)]"
              : "bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.18)_0%,_transparent_60%)]"
            : "bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]"
        }`}
      />

      {/* Top Right Minimal Close Button */}
      <button
        onClick={() => {
          sounds.playSelect();
          onClose();
        }}
        className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all cursor-pointer z-30"
        title="닫기 (ESC)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* ========================================================= */}
      {/* COOL MINIMAL SINGLE INPUT BAR (투두 선택 or 직접 입력 통합) */}
      {/* ========================================================= */}
      <div ref={inputContainerRef} className="relative w-full max-w-lg mb-6 z-20">
        <form
          onSubmit={handleTaskSubmit}
          className={`relative flex items-center bg-neutral-950/80 backdrop-blur-xl border rounded-xl shadow-2xl transition-all ${
            isInputFocused
              ? "border-red-500/80 ring-1 ring-red-500/50 bg-neutral-900/90"
              : "border-white/15 hover:border-white/30"
          }`}
        >
          <input
            type="text"
            value={taskInputValue}
            onChange={(e) => setTaskInputValue(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            placeholder="어떤 목표를 박살낼 것인가? (입력 또는 투두 선택)..."
            className="flex-1 py-3 px-4 bg-transparent text-xs sm:text-sm font-semibold text-white placeholder-neutral-500 focus:outline-none tracking-wide"
          />

          {/* Quick Action in Input: Task Completion or Clear */}
          <div className="pr-3 flex items-center gap-1.5">
            {activeTask && (
              <button
                type="button"
                onClick={handleCompleteCurrentTask}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="목표 완수 체크"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">완수!</span>
              </button>
            )}

            {taskInputValue && (
              <button
                type="button"
                onClick={() => {
                  setTaskInputValue("");
                  setActiveTask(null);
                }}
                className="p-1 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                title="목표 지우기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Dropdown: Cool Todo Chips/List when input is focused */}
        {isInputFocused && pendingWorkouts.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-neutral-900/95 border border-white/10 rounded-xl shadow-2xl p-2 z-30 backdrop-blur-md animate-fade-in max-h-52 overflow-y-auto divide-y divide-white/5">
            <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase flex items-center justify-between">
              <span>오늘의 남은 훈련 목록 ({pendingWorkouts.length})</span>
              <span className="text-neutral-500">클릭하여 선택</span>
            </div>
            {pendingWorkouts.map((w) => (
              <div
                key={w.id}
                onMouseDown={() => handleSelectTodoItem(w)}
                className="px-3 py-2 hover:bg-white/10 cursor-pointer rounded-lg flex items-center justify-between text-xs text-neutral-200 transition-colors group"
              >
                <span className="truncate pr-2 group-hover:text-amber-300">{w.title}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                  {w.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Celebration Banner */}
        {completionCelebration && (
          <div className="absolute left-0 right-0 -bottom-8 flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>미션 완수! 챔피언급 타격으로 목표를 KO시켰습니다!</span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* REAL PHYSICAL STOPWATCH (초시계 그래픽 본체) */}
      {/* ========================================================= */}
      <div className="relative w-[340px] sm:w-[420px] md:w-[460px] aspect-[1247/1261] drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] z-10">
        {/* Stopwatch Real Photo Image */}
        <Image
          src="/images/timewatch.png"
          alt="UFC Coach Stopwatch"
          fill
          priority
          sizes="(max-width: 768px) 340px, 460px"
          className="object-contain pointer-events-none select-none drop-shadow-[0_12px_30px_rgba(0,0,0,0.85)]"
        />

        {/* ========================================================= */}
        {/* PHYSICAL BUTTON 1: LAP / RESET (좌상단 버튼) */}
        {/* ========================================================= */}
        <button
          onClick={handleLapReset}
          className="absolute top-[5%] left-[10%] w-[23%] h-[21%] rounded-full opacity-0 hover:opacity-20 active:opacity-40 bg-white cursor-pointer transition-all active:scale-90"
          title="[LAP/RESET] 클릭하여 초기화"
        >
          <span className="sr-only">LAP / RESET</span>
        </button>

        {/* ========================================================= */}
        {/* PHYSICAL BUTTON 2: MODE (중앙 상단 버튼) */}
        {/* ========================================================= */}
        <button
          onClick={handleModeSwitch}
          className="absolute top-[1%] left-[40%] w-[20%] h-[16%] rounded-full opacity-0 hover:opacity-20 active:opacity-40 bg-white cursor-pointer transition-all active:scale-90"
          title="[MODE] 클릭하여 인터벌 ↔ 카디오 모드 전환"
        >
          <span className="sr-only">MODE</span>
        </button>

        {/* ========================================================= */}
        {/* PHYSICAL BUTTON 3: START / STOP (우상단 버튼) */}
        {/* ========================================================= */}
        <button
          onClick={handleStartStop}
          className="absolute top-[5%] right-[10%] w-[23%] h-[21%] rounded-full opacity-0 hover:opacity-20 active:opacity-40 bg-white cursor-pointer transition-all active:scale-90"
          title="[START/STOP] 클릭하여 타이머 시작 / 정지"
        >
          <span className="sr-only">START / STOP</span>
        </button>

        {/* ========================================================= */}
        {/* DIGITAL LCD DISPLAY (투명 창: left: 24.46%, top: 32.75%, width: 51.08%, height: 27.2%) */}
        {/* ========================================================= */}
        <div
          style={{
            left: "24.46%",
            top: "32.75%",
            width: "51.08%",
            height: "27.20%",
          }}
          className="absolute rounded-[10px] sm:rounded-[14px] overflow-hidden bg-[#1a211e] border border-black/50 shadow-inner flex flex-col justify-between p-2 sm:p-2.5 select-none"
        >
          {/* LCD Scanline & Glare */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-black/25" />
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.6) 2px, rgba(0,0,0,0.6) 4px)",
            }}
          />

          {/* LCD Top Status Indicators */}
          <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-black tracking-wider text-[#7ea08d]">
            <div className="flex items-center gap-1">
              <span
                onClick={handleModeSwitch}
                className={`px-1 py-0.2 rounded cursor-pointer transition-colors ${
                  timerMode === "INTERVAL"
                    ? "bg-[#7ea08d] text-[#121714] font-bold"
                    : "text-[#556c5f] hover:text-[#7ea08d]"
                }`}
                title="모드 전환"
              >
                INTERVAL
              </span>
              <span
                onClick={handleModeSwitch}
                className={`px-1 py-0.2 rounded cursor-pointer transition-colors ${
                  timerMode === "CARDIO"
                    ? "bg-[#7ea08d] text-[#121714] font-bold"
                    : "text-[#556c5f] hover:text-[#7ea08d]"
                }`}
                title="모드 전환"
              >
                CARDIO
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-black ${
                  isTimerRunning ? "text-emerald-400 animate-pulse" : "text-[#556c5f]"
                }`}
              >
                {isTimerRunning ? "RUN" : "STOP"}
              </span>
              <span className="text-[9px] opacity-70">
                {timerMode === "INTERVAL" ? "RND 1" : "STAMINA"}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* LCD MAIN TIME: CLICK TO EDIT TIME (시간 클릭하여 직접 변경) */}
          {/* ========================================================= */}
          <div className="relative z-20 flex items-baseline justify-center my-auto">
            {isEditingTime ? (
              /* Inline Time Editor on LCD */
              <div className="flex flex-col items-center animate-fade-in">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEditTime();
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    ref={timeInputRef}
                    type="text"
                    value={editMinutesInput}
                    onChange={(e) => setEditMinutesInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsEditingTime(false);
                    }}
                    placeholder="25"
                    className="w-20 sm:w-28 text-center text-2xl sm:text-3xl font-mono font-black text-[#e1f5e8] bg-[#121714] border border-[#7ea08d] rounded px-1 py-0.5 focus:outline-none"
                  />
                  <span className="text-xs font-mono text-[#7ea08d]">분</span>
                  <button
                    type="submit"
                    className="p-1 rounded bg-[#7ea08d] text-[#121714] hover:bg-white transition-colors cursor-pointer"
                    title="저장"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Quick Minute Chips inside LCD */}
                <div className="flex items-center gap-1 mt-1">
                  {QUICK_MINUTES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSaveEditTime(m * 60)}
                      className="px-1 py-0.2 rounded bg-[#121714] hover:bg-[#7ea08d] hover:text-[#121714] text-[8px] sm:text-[9px] font-mono text-[#9ec4af] border border-[#7ea08d]/30 transition-colors cursor-pointer"
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Normal Digital Time Display (Hover / Clickable) */
              <div
                onClick={handleStartEditTime}
                className="group flex items-baseline cursor-pointer transition-transform active:scale-95"
                title="시간을 클릭하여 원하는 시간으로 변경"
              >
                <span
                  className="font-mono font-black tracking-tight text-[#e1f5e8] group-hover:text-emerald-300 drop-shadow-[0_0_8px_rgba(126,160,141,0.6)] transition-colors text-xl sm:text-2xl md:text-[2.2rem]"
                >
                  {currentTimeDisplay}
                </span>

                {/* Milliseconds (Centiseconds) */}
                <span className="ml-1 font-mono font-bold text-[10px] sm:text-xs md:text-sm text-[#9ec4af] tracking-wider group-hover:text-emerald-300">
                  .{String(centiseconds).padStart(2, "0")}
                </span>

                {/* Edit hint icon on hover */}
                <span className="ml-1 opacity-0 group-hover:opacity-100 text-[#7ea08d] transition-opacity">
                  <Edit3 className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>

          {/* LCD Bottom Status Line: Mission Name & Progress */}
          <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-[#7ea08d] pt-0.5 border-t border-[#7ea08d]/20">
            <span className="truncate max-w-[130px] sm:max-w-[150px] text-[#b8dcce] font-semibold">
              {activeTask?.title || (timerMode === "INTERVAL" ? "SET TIME LIMIT" : "OPEN CARDIO")}
            </span>
            <span className="text-right font-bold text-[#e1f5e8]">
              {timerMode === "INTERVAL"
                ? `${Math.round(intervalProgress)}%`
                : `${Math.floor(cardioSeconds / 60)}m`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
