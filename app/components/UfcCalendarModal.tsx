"use client";

import React, { useState, useMemo } from "react";
import { sounds } from "@/lib/sounds";
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Swords,
  Trophy,
  Flame,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Tv,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export interface FightScheduleEvent {
  id: string;
  dateStr: string; // "YYYY-MM-DD"
  type: "PPV" | "FIGHT_NIGHT" | "CAMP" | "WEIGH_IN" | "CUSTOM";
  title: string;
  badge: string;
  venue: string;
  city: string;
  broadcast: string; // "ESPN+ PPV", "ESPN+", "UFC FIGHT PASS", "UFC PI"
  mainCard?: string;
  notes?: string;
  completed?: boolean;
}

interface UfcCalendarModalProps {
  onClose: () => void;
  onSelectEvent?: (event: FightScheduleEvent) => void;
}

const MONTH_NAMES_EN = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const MONTH_NAMES_KO = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

const WEEKDAYS = [
  { en: "SUN", ko: "일", isSun: true, isSat: false },
  { en: "MON", ko: "월", isSun: false, isSat: false },
  { en: "TUE", ko: "화", isSun: false, isSat: false },
  { en: "WED", ko: "수", isSun: false, isSat: false },
  { en: "THU", ko: "목", isSun: false, isSat: false },
  { en: "FRI", ko: "금", isSun: false, isSat: false },
  { en: "SAT", ko: "토", isSun: false, isSat: true },
];

// Curated realistic UFC schedule events across months (2025, 2026, 2027)
const DEFAULT_EVENTS: FightScheduleEvent[] = [
  // 2026 JANUARY
  {
    id: "ufc-2026-01-17",
    dateStr: "2026-01-17",
    type: "PPV",
    title: "UFC 323",
    badge: "MAIN EVENT",
    venue: "T-MOBILE ARENA",
    city: "LAS VEGAS, NV",
    broadcast: "ESPN+ PPV",
    mainCard: "JONES vs ASPINALL // HEAVYWEIGHT TITLE",
    notes: "새해 첫 넘버링 타이틀 매치",
  },
  {
    id: "ufc-2026-01-24",
    dateStr: "2026-01-24",
    type: "FIGHT_NIGHT",
    title: "UFC FIGHT NIGHT",
    badge: "SEOUL",
    venue: "KSPO DOME",
    city: "SEOUL, KOREA",
    broadcast: "ESPN+",
    mainCard: "KOREAN FIGHTERS SHOWCASE",
    notes: "한국 서울 파이트 나이트 대회",
  },

  // 2026 FEBRUARY
  {
    id: "ufc-2026-02-14",
    dateStr: "2026-02-14",
    type: "PPV",
    title: "UFC 324",
    badge: "TITLE BOUT",
    venue: "TOYOTA CENTER",
    city: "HOUSTON, TX",
    broadcast: "ESPN+ PPV",
    mainCard: "ADESANYA vs DU PLESSIS II",
    notes: "미들급 리매치 타이틀전",
  },
  {
    id: "ufc-2026-02-28",
    dateStr: "2026-02-28",
    type: "FIGHT_NIGHT",
    title: "UFC FIGHT NIGHT",
    badge: "ESPN+",
    venue: "SPARK ARENA",
    city: "AUCKLAND, NZ",
    broadcast: "ESPN+",
    mainCard: "OCEANIA CONTENDER SERIES",
  },

  // 2026 MARCH
  {
    id: "ufc-2026-03-07",
    dateStr: "2026-03-07",
    type: "PPV",
    title: "UFC 325",
    badge: "TITLE BOUT",
    venue: "KASEYA CENTER",
    city: "MIAMI, FL",
    broadcast: "ESPN+ PPV",
    mainCard: "O'MALLEY vs SANDHAGEN",
  },
  {
    id: "ufc-2026-03-21",
    dateStr: "2026-03-21",
    type: "FIGHT_NIGHT",
    title: "UFC FIGHT NIGHT",
    badge: "LONDON",
    venue: "THE O2",
    city: "LONDON, ENGLAND",
    broadcast: "ESPN+",
    mainCard: "EDWARDS vs BRADY",
  },

  // 2026 SEPTEMBER (Current Month)
  {
    id: "ufc-2026-09-05",
    dateStr: "2026-09-05",
    type: "CAMP",
    title: "CAMP KICKOFF & 실전 스파링",
    badge: "SPARRING",
    venue: "UFC PERFORMANCE INSTITUTE",
    city: "LAS VEGAS, NV",
    broadcast: "UFC PI",
    mainCard: "알고리즘 코테 집중 스파링 3R",
    notes: "시합 3주 전 고강도 타격 및 전술 훈련",
  },
  {
    id: "ufc-2026-09-12",
    dateStr: "2026-09-12",
    type: "FIGHT_NIGHT",
    title: "UFC FIGHT NIGHT",
    badge: "PARIS",
    venue: "ACCOR ARENA",
    city: "PARIS, FRANCE",
    broadcast: "ESPN+",
    mainCard: "GANE vs VOLKOV // HEAVYWEIGHT",
    notes: "유럽 파리 메인 이벤트",
  },
  {
    id: "ufc-2026-09-15",
    dateStr: "2026-09-15",
    type: "CAMP",
    title: "CAMP FOCUS: 전술 최적화 데이",
    badge: "TODAY",
    venue: "UFC PERFORMANCE INSTITUTE",
    city: "LAS VEGAS, NV",
    broadcast: "UFC PI",
    mainCard: "SQLD 데이터 모델링 서브미션 공략",
    notes: "오늘의 핵심 집중 훈련 (D-6 카운트다운)",
  },
  {
    id: "ufc-2026-09-18",
    dateStr: "2026-09-18",
    type: "WEIGH_IN",
    title: "공식 계체량 (OFFICIAL WEIGH-IN)",
    badge: "WEIGH-IN",
    venue: "T-MOBILE ARENA",
    city: "LAS VEGAS, NV",
    broadcast: "UFC FIGHT PASS",
    mainCard: "155 LBS 라이트급 챔피언십 체중 통과",
    notes: "수분 감량 완료 & 계체 통과",
  },
  {
    id: "ufc-2026-09-21",
    dateStr: "2026-09-21",
    type: "PPV",
    title: "UFC 300: MAIN EVENT",
    badge: "TITLE BOUT",
    venue: "T-MOBILE ARENA",
    city: "LAS VEGAS, NV",
    broadcast: "ESPN+ PPV",
    mainCard: "WORLD CHAMPIONSHIP TITLE DEFENSE",
    notes: "세계 챔피언십 타이틀 결전의 날 (시합)",
  },
  {
    id: "ufc-2026-09-26",
    dateStr: "2026-09-26",
    type: "CAMP",
    title: "리커버리 & 미디어 데이",
    badge: "POST-FIGHT",
    venue: "UFC APEX",
    city: "LAS VEGAS, NV",
    broadcast: "ESPN / UFC PRESS",
    mainCard: "승리 인터뷰 & 피지컬 회복 루틴",
    notes: "시합 후 휴식 및 차기 타이틀 방어전 분석",
  },

  // 2026 OCTOBER
  {
    id: "ufc-2026-10-10",
    dateStr: "2026-10-10",
    type: "PPV",
    title: "UFC 326",
    badge: "TITLE BOUT",
    venue: "ETIHAD ARENA",
    city: "ABU DHABI, UAE",
    broadcast: "ESPN+ PPV",
    mainCard: "FIGHT ISLAND CHAMPIONSHIP",
    notes: "아부다비 파이트 아일랜드 빅매치",
  },
  {
    id: "ufc-2026-10-24",
    dateStr: "2026-10-24",
    type: "FIGHT_NIGHT",
    title: "UFC FIGHT NIGHT",
    badge: "TOKYO",
    venue: "SAITAMA SUPER ARENA",
    city: "TOKYO, JAPAN",
    broadcast: "ESPN+",
    mainCard: "ASIAN CONTENDER SHOWDOWN",
  },

  // 2026 NOVEMBER
  {
    id: "ufc-2026-11-14",
    dateStr: "2026-11-14",
    type: "PPV",
    title: "UFC 327",
    badge: "MSG PPV",
    venue: "MADISON SQUARE GARDEN",
    city: "NEW YORK, NY",
    broadcast: "ESPN+ PPV",
    mainCard: "NEW YORK WORLD TITLE BOUT",
    notes: "매디슨 스퀘어 가든 연례 빅 이벤트",
  },

  // 2026 DECEMBER
  {
    id: "ufc-2026-12-12",
    dateStr: "2026-12-12",
    type: "PPV",
    title: "UFC 328: YEAR-END FINALE",
    badge: "FINALE",
    venue: "T-MOBILE ARENA",
    city: "LAS VEGAS, NV",
    broadcast: "ESPN+ PPV",
    mainCard: "DOUBLE CHAMPIONSHIP SHOWDOWN",
    notes: "연말 결선 메이저 이벤트",
  },
];

export default function UfcCalendarModal({
  onClose,
  onSelectEvent,
}: UfcCalendarModalProps) {
  // Current view date: year & month
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(8); // 8 = September (0-indexed)

  // Selected date on calendar (default to main bout or today)
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-21");

  // User-added and persistent events
  const [events, setEvents] = useState<FightScheduleEvent[]>(DEFAULT_EVENTS);

  // New Event Form State
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [newEventType, setNewEventType] = useState<FightScheduleEvent["type"]>("CAMP");

  // Today string for comparison
  const todayStr = "2026-09-15";

  // Navigation handlers
  const handlePrevYear = () => {
    sounds.playSelect();
    setYear((y) => y - 1);
  };

  const handleNextYear = () => {
    sounds.playSelect();
    setYear((y) => y + 1);
  };

  const handlePrevMonth = () => {
    sounds.playSelect();
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    sounds.playSelect();
    setMonth((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleGoToday = () => {
    sounds.playSelect();
    setYear(2026);
    setMonth(8); // September
    setSelectedDate("2026-09-15");
  };

  // Build calendar matrix (1 to 28/30/31 with padding)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: FightScheduleEvent[];
    }> = [];

    // Previous month leading days
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.dateStr === dateStr);

      cells.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: dayEvents,
      });
    }

    // Current month days (1 to 28/30/31)
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.dateStr === dateStr);

      cells.push({
        dateStr,
        dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        events: dayEvents,
      });
    }

    // Next month trailing days to complete full grid (multiple of 7, 35 or 42 cells)
    const totalFilled = cells.length;
    const remaining = totalFilled % 7 === 0 ? 0 : 7 - (totalFilled % 7);
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.dateStr === dateStr);

      cells.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: dayEvents,
      });
    }

    return cells;
  }, [year, month, events]);

  // Selected date details
  const selectedDayEvents = useMemo(() => {
    return events.filter((e) => e.dateStr === selectedDate);
  }, [events, selectedDate]);

  // Check if selected date has a major FIGHT event (PPV or FIGHT_NIGHT)
  const primaryFightEvent = useMemo(() => {
    return selectedDayEvents.find((e) => e.type === "PPV" || e.type === "FIGHT_NIGHT");
  }, [selectedDayEvents]);

  // Toggle to-do item completed status
  const toggleEventComplete = (id: string) => {
    sounds.playSelect();
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  // Formatted date string for selected date
  const selectedDateFormatted = useMemo(() => {
    const target = selectedDate || "2026-09-21";
    const [y, m, d] = target.split("-").map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    const dayNameKo = ["일", "월", "화", "수", "목", "금", "토"][dayOfWeek] || "토";
    const dayNameEn = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][dayOfWeek] || "SAT";
    return {
      year: y,
      month: m,
      day: d,
      dayNameKo,
      dayNameEn,
      fullText: `${y}년 ${m}월 ${d}일 (${dayNameKo} / ${dayNameEn})`,
    };
  }, [selectedDate]);

  // Add custom event
  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    sounds.playPunch();

    const created: FightScheduleEvent = {
      id: `custom-${Date.now()}`,
      dateStr: selectedDate,
      type: newEventType,
      title: newEventTitle.trim(),
      badge:
        newEventType === "PPV"
          ? "MAIN EVENT"
          : newEventType === "FIGHT_NIGHT"
          ? "FIGHT NIGHT"
          : newEventType === "WEIGH_IN"
          ? "WEIGH-IN"
          : "TRAINING CAMP",
      venue: newEventVenue.trim() || "UFC PERFORMANCE INSTITUTE",
      city: "LAS VEGAS, NV",
      broadcast: newEventType === "PPV" ? "ESPN+ PPV" : "UFC FIGHT PASS",
      mainCard: newEventTitle.trim(),
      notes: "사용자 등록 훈련/경기 일정",
    };

    setEvents((prev) => [...prev, created]);
    setNewEventTitle("");
    setNewEventVenue("");
    setIsAddingEvent(false);
  };

  // Delete an event
  const handleDeleteEvent = (id: string) => {
    sounds.playHover();
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none font-pretendard animate-fade-in overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-7xl max-h-[96vh] bg-[#0d0f14] border border-white/20 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-red-600 via-amber-500 before:to-red-600">
        
        {/* Background Angular UFC Broadcast Slanted Slices (Inspired by Reference Image) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-neutral-700/25 to-transparent -translate-x-20 -translate-y-20 rotate-45 pointer-events-none z-0" />
        <div className="absolute top-0 left-0 w-36 h-36 border-b-2 border-r-2 border-neutral-700/40 pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-neutral-800/30 to-transparent translate-x-24 translate-y-24 rotate-45 pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-44 h-44 border-t-2 border-l-2 border-neutral-700/40 pointer-events-none z-0" />

        {/* 1. Top Header: UFC Red Box Badge + Year Schedule Title */}
        <header className="relative z-10 px-5 sm:px-8 pt-5 pb-4 border-b border-white/10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playHover();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
            title="닫기 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Red UFC Badge (Matches Reference Image) */}
          <div className="inline-flex items-center justify-center bg-red-600 px-6 py-0.5 text-white font-black italic tracking-widest text-2xl sm:text-3xl font-teko shadow-[0_0_20px_rgba(220,38,38,0.7)]">
            UFC
          </div>

          {/* Title (Matches Reference Image: 2020 SCHEDULE -> {YEAR} SCHEDULE) */}
          <h1 className="font-teko font-black italic text-3xl sm:text-5xl md:text-6xl text-white tracking-widest uppercase mt-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none text-center">
            {year} SCHEDULE & CALENDAR
          </h1>
          <p className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase mt-1">
            OCTAGON FIGHT DATES • TRAINING CAMP TIMELINE • LAS VEGAS NV
          </p>
        </header>

        {/* 2. Navigation Toolbar: Prev/Next Year & Center Month Banner */}
        <div className="relative z-10 px-4 sm:px-8 py-3 bg-[#13161f]/90 border-b border-white/10 flex items-center justify-between gap-3">
          {/* Left Controls: Only Prev Year */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handlePrevYear}
              onMouseEnter={() => sounds.playHover()}
              className="px-3 sm:px-4 py-1.5 rounded-sm bg-neutral-900 hover:bg-neutral-800 border border-white/15 hover:border-white/40 text-neutral-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title={`${year - 1}년으로 이동`}
            >
              <ChevronsLeft className="w-3.5 h-3.5 text-red-500" />
              <span className="font-teko text-sm sm:text-base tracking-wide uppercase">작년 ({year - 1})</span>
            </button>
          </div>

          {/* Center Banner: Big Red UFC Month Box with embedded Month Nav */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                onMouseEnter={() => sounds.playHover()}
                className="p-1.5 rounded-sm bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-red-500 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="이전 달로 이동"
              >
                <ChevronLeft className="w-4 h-4 text-red-500" />
              </button>

              <div className="px-6 sm:px-8 py-1 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-black font-teko text-2xl sm:text-3xl tracking-wider uppercase rounded-xs shadow-[0_0_15px_rgba(220,38,38,0.5)] border-t border-red-400 flex items-center gap-3 select-none">
                <span>{MONTH_NAMES_EN[month]}</span>
                <span className="text-white/80 font-sans text-sm sm:text-base font-bold tracking-normal">
                  {MONTH_NAMES_KO[month]}
                </span>
                <span className="font-mono text-base font-bold text-amber-300">
                  {year}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                onMouseEnter={() => sounds.playHover()}
                className="p-1.5 rounded-sm bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-red-500 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="다음 달로 이동"
              >
                <ChevronRight className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {/* Right Controls: Only Next Year */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleNextYear}
              onMouseEnter={() => sounds.playHover()}
              className="px-3 sm:px-4 py-1.5 rounded-sm bg-neutral-900 hover:bg-neutral-800 border border-white/15 hover:border-white/40 text-neutral-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title={`${year + 1}년으로 이동`}
            >
              <span className="font-teko text-sm sm:text-base tracking-wide uppercase">내년 ({year + 1})</span>
              <ChevronsRight className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        </div>

        {/* 4. Main Body: Calendar Grid (Left 8 Cols) + Selected Date Details (Right 4 Cols) */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* LEFT: 1일부터 30일/31일까지 있는 정통 월간 달력 그리드 (8 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
            {/* Weekday Header (SUN ~ SAT) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center font-teko text-lg sm:text-xl font-bold tracking-wider">
              {WEEKDAYS.map((wd) => (
                <div
                  key={wd.en}
                  className={`py-1.5 rounded-xs border-b ${
                    wd.isSun
                      ? "text-red-500 border-red-500/40 bg-red-950/20"
                      : wd.isSat
                      ? "text-amber-400 border-amber-500/40 bg-amber-950/20"
                      : "text-neutral-400 border-white/10 bg-neutral-900/40"
                  }`}
                >
                  <span>{wd.en}</span>
                  <span className="text-xs font-pretendard ml-1 text-neutral-500">
                    ({wd.ko})
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix (1 to 28/30/31) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 auto-rows-fr">
              {calendarCells.map((cell, idx) => {
                const isSelected = selectedDate === cell.dateStr;
                const hasEvent = cell.events.length > 0;
                const isSun = idx % 7 === 0;
                const isSat = idx % 7 === 6;

                return (
                  <div
                    key={cell.dateStr + idx}
                    onClick={() => {
                      sounds.playSelect();
                      setSelectedDate(cell.dateStr);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`relative min-h-[72px] sm:min-h-[88px] p-1.5 rounded-xs border transition-all cursor-pointer flex flex-col justify-between group ${
                      !cell.isCurrentMonth
                        ? "opacity-35 bg-black/30 border-white/5 hover:opacity-60"
                        : isSelected
                        ? "bg-[#252834] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/80"
                        : cell.isToday
                        ? "bg-red-950/25 border-red-500/80 shadow-[0_0_12px_rgba(220,38,38,0.3)]"
                        : "bg-[#14161f]/80 hover:bg-[#1c202d] border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`font-mono font-bold text-xs sm:text-sm ${
                          cell.isToday
                            ? "px-1.5 py-0.5 rounded bg-red-600 text-white shadow-sm"
                            : isSelected
                            ? "text-amber-400 font-black"
                            : isSun
                            ? "text-red-400"
                            : isSat
                            ? "text-amber-400"
                            : cell.isCurrentMonth
                            ? "text-neutral-200"
                            : "text-neutral-500"
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {/* Today indicator badge */}
                      {cell.isToday && (
                        <span className="text-[9px] font-teko tracking-wider uppercase px-1 py-0.5 rounded bg-red-600 text-white font-bold leading-none animate-pulse">
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Events inside Day Cell */}
                    <div className="space-y-1 my-auto overflow-hidden">
                      {cell.events.map((ev) => (
                        <div
                          key={ev.id}
                          className={`px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold truncate leading-tight border transition-all ${
                            ev.type === "PPV"
                              ? "bg-red-600/90 hover:bg-red-600 text-white border-red-400 shadow-sm"
                              : ev.type === "FIGHT_NIGHT"
                              ? "bg-amber-500/85 hover:bg-amber-500 text-black border-amber-300 font-black"
                              : ev.type === "WEIGH_IN"
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/60"
                              : "bg-blue-950/80 text-blue-300 border-blue-500/60"
                          }`}
                          title={`${ev.title} - ${ev.venue}`}
                        >
                          <span className="font-teko tracking-wide text-xs">
                            {ev.type === "PPV" ? "🥊 " : ev.type === "FIGHT_NIGHT" ? "⚡ " : "📍 "}
                            {ev.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Small dot if has events */}
                    {hasEvent && (
                      <div className="flex items-center gap-1 mt-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[9px] font-mono text-neutral-400 hidden sm:inline">
                          {cell.events.length}개 일정
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Legend */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-600 border border-red-400" />
                <span className="font-bold text-neutral-300">PPV 넘버링 경기 (UFC 300)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-300" />
                <span className="font-bold text-neutral-300">UFC 파이트 나이트 (ESPN+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-400" />
                <span className="font-bold text-neutral-300">계체량 / 미디어 데이</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 border border-blue-400" />
                <span className="font-bold text-neutral-300">캠프 훈련 & 목표</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Selected Date Details & Card View (Aesthetic matches Reference Image wmux-paste-1789437332345.png) */}
          <div className="lg:col-span-4 p-4 sm:p-6 bg-[#11131a] flex flex-col justify-start overflow-y-auto space-y-4">
            
            {/* Top Detail Card Header: Vivid Red Banner (Exact Reference Image Style) */}
            <div className="rounded-xs border border-white/15 overflow-hidden shadow-xl bg-[#1b1e28]">
              {/* Dynamic Red Header Banner (FIGHT events showcase) */}
              {primaryFightEvent ? (
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-4 py-3 text-white flex items-center justify-between border-b border-red-400/40 shadow-lg">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase flex items-center gap-1.5 mb-0.5">
                      <Swords className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                      <span>OCTAGON FIGHT EVENT // 결전의 날</span>
                      <span className="px-1.5 py-0.2 bg-black/40 border border-amber-400/50 text-amber-300 text-[9px] font-black rounded-xs">
                        {primaryFightEvent.badge}
                      </span>
                    </div>
                    <div className="font-teko font-black text-2xl sm:text-3xl tracking-wider uppercase text-white truncate leading-none">
                      {primaryFightEvent.title} <span className="text-white/80 font-sans text-sm sm:text-base font-bold tracking-normal ml-1">({selectedDateFormatted.year}년 {selectedDateFormatted.month}월 {selectedDateFormatted.day}일)</span>
                    </div>
                  </div>
                  {primaryFightEvent.broadcast && (
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-black/60 border border-amber-400/50 text-amber-300 uppercase shrink-0">
                      {primaryFightEvent.broadcast}
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-white flex items-center justify-between">
                  <span className="font-teko font-black text-2xl sm:text-3xl tracking-wider uppercase">
                    {selectedDateFormatted.year}년 {selectedDateFormatted.month}월 {selectedDateFormatted.day}일
                  </span>
                  <span className="text-xs font-mono font-bold bg-black/30 px-2 py-0.5 rounded text-neutral-200 uppercase">
                    {selectedDateFormatted.dayNameEn} // DAILY CAMP
                  </span>
                </div>
              )}

              {/* Card Body: Unified To-Do Style Continuous List (투두리스트 형태) */}
              <div className="p-4 space-y-3">
                {selectedDayEvents.length > 0 ? (
                  <div className="divide-y divide-white/10 bg-black/40 rounded-sm border border-white/10 overflow-hidden">
                    {selectedDayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="py-3 px-3 hover:bg-white/[0.04] transition-colors flex items-start gap-3 group"
                      >
                        {/* Checkbox / Status Icon */}
                        <div className="mt-0.5 shrink-0">
                          {ev.type === "PPV" ? (
                            <span className="w-5 h-5 rounded bg-red-600/30 border border-red-500 text-red-400 flex items-center justify-center text-xs shadow-[0_0_8px_rgba(220,38,38,0.5)] font-bold">
                              🥊
                            </span>
                          ) : ev.type === "FIGHT_NIGHT" ? (
                            <span className="w-5 h-5 rounded bg-amber-500/30 border border-amber-400 text-amber-300 flex items-center justify-center text-xs font-bold">
                              ⚡
                            </span>
                          ) : ev.type === "WEIGH_IN" ? (
                            <span className="w-5 h-5 rounded bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center text-xs font-bold">
                              ⚖️
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleEventComplete(ev.id)}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                ev.completed
                                  ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                  : "border-neutral-600 hover:border-amber-400 bg-neutral-900 text-transparent hover:text-neutral-400"
                              }`}
                              title={ev.completed ? "완료됨 (클릭하여 취소)" : "미완료 (클릭하여 완료)"}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* To-Do Event Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shrink-0 ${
                                  ev.type === "PPV"
                                    ? "bg-red-600 text-white"
                                    : ev.type === "FIGHT_NIGHT"
                                    ? "bg-amber-400 text-black font-black"
                                    : ev.type === "WEIGH_IN"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                    : "bg-blue-950 text-blue-300 border border-blue-500/40"
                                }`}
                              >
                                {ev.badge}
                              </span>
                              <h4
                                className={`font-teko text-xl sm:text-2xl font-bold tracking-wide uppercase transition-colors truncate ${
                                  ev.completed
                                    ? "line-through text-neutral-500"
                                    : ev.type === "PPV"
                                    ? "text-amber-400 font-black"
                                    : "text-white"
                                }`}
                              >
                                {ev.title}
                              </h4>
                            </div>

                            {ev.broadcast && (
                              <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                                {ev.broadcast}
                              </span>
                            )}
                          </div>

                          {/* Sub-info list (Venue, Main Card, Notes) */}
                          <div className="mt-1 space-y-1 text-xs text-neutral-400">
                            {ev.venue && (
                              <div className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                <span>{ev.city} | {ev.venue}</span>
                              </div>
                            )}
                            {ev.mainCard && (
                              <div className="text-[11px] text-neutral-200 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                <Swords className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>{ev.mainCard}</span>
                              </div>
                            )}
                            {ev.notes && (
                              <div className="text-[11px] text-neutral-400 font-pretendard pl-0.5">
                                📌 {ev.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete Button for custom tasks */}
                        {ev.type === "CUSTOM" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="opacity-40 hover:opacity-100 p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer shrink-0 mt-0.5"
                            title="일정 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-neutral-400 space-y-2 bg-black/30 rounded-sm border border-white/5 p-4">
                    <CalendarIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="text-xs font-medium">
                      선택한 날짜에 등록된 일정이나 시합이 없습니다.
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      아래 버튼으로 새로운 투두 항목/훈련 목표를 추가해보세요.
                    </p>
                  </div>
                )}

                {/* Add Event Toggle Button */}
                {!isAddingEvent ? (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setIsAddingEvent(true);
                    }}
                    className="w-full py-2.5 rounded-sm bg-neutral-800 hover:bg-neutral-700 border border-white/10 hover:border-red-500 text-neutral-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-500" />
                    <span>이 날짜에 훈련/일정 추가하기</span>
                  </button>
                ) : (
                  /* Add Event Inline Form */
                  <form
                    onSubmit={handleAddCustomEvent}
                    className="p-3 bg-neutral-900 border border-red-500/40 rounded-sm space-y-3 animate-fade-in"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-white/10">
                      <span className="font-teko text-lg text-white font-bold tracking-wider">
                        새 훈련 / 경기 일정 등록
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingEvent(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        일정 명칭 (제목)
                      </label>
                      <input
                        type="text"
                        placeholder="예: 알고리즘 코테 모의고사 or 가슴/어깨 웨이트"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full bg-black border border-white/15 px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 rounded-sm focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                          카테고리
                        </label>
                        <select
                          value={newEventType}
                          onChange={(e) => setNewEventType(e.target.value as any)}
                          className="w-full bg-black border border-white/15 px-2 py-1.5 text-xs text-white rounded-sm focus:outline-none focus:border-red-500"
                        >
                          <option value="CAMP">훈련 캠프 (CAMP)</option>
                          <option value="PPV">결전 / 시합 (PPV)</option>
                          <option value="FIGHT_NIGHT">스프린트 (FIGHT NIGHT)</option>
                          <option value="WEIGH_IN">점검 / 계체량</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                          장소 / 경기장
                        </label>
                        <input
                          type="text"
                          placeholder="예: 독서실 / 헬스장"
                          value={newEventVenue}
                          onChange={(e) => setNewEventVenue(e.target.value)}
                          className="w-full bg-black border border-white/15 px-2 py-1.5 text-xs text-white placeholder-neutral-500 rounded-sm focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingEvent(false)}
                        className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-sm"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-sm shadow-md"
                      >
                        등록 완료
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
