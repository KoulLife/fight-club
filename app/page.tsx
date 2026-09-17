"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sounds } from "@/lib/sounds";
import PromotionModal from "./components/PromotionModal";
import HeadCoachModal from "./components/HeadCoachModal";
import SocialMediaPhoneModal from "./components/SocialMediaPhoneModal";
import UfcCalendarModal from "./components/UfcCalendarModal";
import FocusTimerModal, { TimerTask } from "./components/FocusTimerModal";
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
  ShieldCheck,
  Target,
  Diamond,
  Timer,
  Users,
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
  category: "STAND-UP" | "GRAPPLING" | "HEALTH";
  title: string;
  completed: boolean;
}

interface CoachChoice {
  id: string;
  label: string;
  badge: string;
  badgeColor: "red" | "blue" | "amber" | "emerald";
  coachReaction: string;
  statEffect: string;
  nextNodeId?: string;
}

interface CoachDialogNode {
  id: string;
  category: string;
  coachSpeech: string;
  choices: CoachChoice[];
}

const COACH_DIALOGS: Record<string, CoachDialogNode> = {
  start: {
    id: "start",
    category: "CAMP CHECK-IN // 상태 진단",
    coachSpeech:
      "이봐, 들어왔군! 이번 경기까지 남은 시간이 얼마 없어. 오늘의 훈련 캠프는 어떻게 진행할 생각이지? 자네 눈빛을 보니 준비된 것 같기도 하고, 살짝 긴장한 것 같기도 하군.",
    choices: [
      {
        id: "c1",
        label: "오늘 목표 전부 완벽하게 박살내겠습니다. 강도 더 올려주십시오!",
        badge: "투지(SPIRIT)",
        badgeColor: "red",
        statEffect: "🔥 파이팅 스피릿 +20% | 사기 진작",
        coachReaction:
          "하하! 그 패기, 아주 맘에 들어! 그래야 챔피언 벨트를 감을 자격이 있지. 하지만 흥분해서 페이스 잃으면 카운터 맞는다. 리스트의 목표를 하나씩 냉정하게 KO시켜라!",
        nextNodeId: "intense_plan",
      },
      {
        id: "c2",
        label: "무리하지 않고 핵심 목표(알고리즘/배포) 위주로 냉정하게 타격하겠습니다.",
        badge: "전술(TACTIC)",
        badgeColor: "blue",
        statEffect: "🧠 전술 집중도 +15% | 우선순위 최적화",
        coachReaction:
          "영리한 판단이야. 주먹을 100번 헛휘두르는 것보다, 정확한 타이밍의 잽과 카운터 스트레이트가 상대를 쓰러뜨리는 법이지. 오늘 우선순위 높은 과제부터 확실하게 끝내라.",
        nextNodeId: "tactical_plan",
      },
      {
        id: "c3",
        label: "솔직히 어제 훈련 피로가 남아있습니다. 컨디션 조율과 리커버리가 필요합니다.",
        badge: "체력(CONDITION)",
        badgeColor: "amber",
        statEffect: "🛡️ 회복력 +25% | 오버트레이닝 방지",
        coachReaction:
          "솔직하게 털어놓는 것도 프로의 기술이야. 오버트레이닝은 패배의 지름길이다. 오늘은 무리해서 목록을 늘리지 말고, 딱 2~3개 필수 목표만 타격하고 스트레칭 후 일찍 쉬어라.",
        nextNodeId: "recovery_plan",
      },
      {
        id: "c4",
        label: "시합(마감일) 승리를 위한 코치님의 최종 게임 플랜을 브리핑해 주십시오.",
        badge: "전략(STRATEGY)",
        badgeColor: "emerald",
        statEffect: "⚡ 결전 전략 숙지 완료 | 멘탈 무장",
        coachReaction:
          "좋아, 집중해라! 첫째, 자잘한 잡음에 한눈팔지 마라. 둘째, 막히는 문제가 생겨도 당황하지 말고 스텝 밟아 다음 과제로 넘어가. 셋째, 완주가 곧 챔피언십 판정승이다!",
        nextNodeId: "game_plan",
      },
    ],
  },
  intense_plan: {
    id: "intense_plan",
    category: "TACTICAL FOCUS // 공세 집중",
    coachSpeech:
      "좋아, 피가 끓는 게 느껴지는군. 그럼 지금 당장 어떤 목표부터 전력으로 때려눕힐 텐가?",
    choices: [
      {
        id: "c1_1",
        label: "가장 어렵고 무거운 메인 이벤트 과제부터 정면 승부하겠습니다!",
        badge: "정면돌파",
        badgeColor: "red",
        statEffect: "💥 넉아웃 파워 +15%",
        coachReaction:
          "그렇지! 턱 당기고 전진 스텝 밟아! 내가 코너에서 자네 등을 지키고 있을 테니 거침없이 때려박아라!",
      },
      {
        id: "c1_2",
        label: "스피드가 생명이니 가벼운 과제들부터 빠른 연타로 해치우겠습니다.",
        badge: "스피드 콤보",
        badgeColor: "amber",
        statEffect: "⚡ 연타 적중률 +15%",
        coachReaction:
          "스피드 킬이지! 잽으로 가드를 흔들고 빈틈에 피니시를 꽂는 전술이다. 훌륭해, 지금 바로 시작해라!",
      },
      {
        id: "c1_3",
        label: "코치님, 다른 조언도 듣고 싶습니다.",
        badge: "다른 대화",
        badgeColor: "blue",
        statEffect: "🔄 상태 재점검",
        coachReaction: "그래, 언제든 물어봐라. 자네의 페이스를 찾는 게 최우선이다.",
        nextNodeId: "start",
      },
    ],
  },
  tactical_plan: {
    id: "tactical_plan",
    category: "TACTICAL PLAN // 냉철한 경기 운영",
    coachSpeech:
      "전술을 세웠다면 링 위에서 절대 흔들리지 마라. 훈련 도중 예상치 못한 버그나 방해요소가 터지면 어떻게 대처할 텐가?",
    choices: [
      {
        id: "c2_1",
        label: "심호흡하고 계획된 우선순위 투두리스트만 냉정하게 밀고 가겠습니다.",
        badge: "포커스 멘탈",
        badgeColor: "blue",
        statEffect: "🎯 집중 유지력 +20%",
        coachReaction:
          "바로 그거야. 챔피언은 관중의 야유나 상대의 클린치에 말려들지 않는 법이지. 계획대로만 쳐라.",
      },
      {
        id: "c2_2",
        label: "상황에 맞춰 유연하게 스텝을 바꾸며 침착하게 우회로를 찾겠습니다.",
        badge: "유연한 대처",
        badgeColor: "emerald",
        statEffect: "🥋 카운터 능력 +15%",
        coachReaction:
          "물의 흐름처럼 움직여라! 막히면 다른 각도로 파고들면 그만이다. 아주 노련한 파이터의 태도야.",
      },
      {
        id: "c2_3",
        label: "코치님, 다른 조언도 듣고 싶습니다.",
        badge: "다른 대화",
        badgeColor: "amber",
        statEffect: "🔄 상태 재점검",
        coachReaction: "좋아, 다시 이야기해보자. 자네에게 필요한 건 전부 코치해주마.",
        nextNodeId: "start",
      },
    ],
  },
  recovery_plan: {
    id: "recovery_plan",
    category: "RECOVERY ROUTINE // 체력 및 리셋",
    coachSpeech:
      "지혜로운 파이터는 쉴 때도 전략적으로 쉰다. 오늘 훈련 마친 후 수면과 식단 관리는 준비되어 있나?",
    choices: [
      {
        id: "c3_1",
        label: "단백질 식단 챙겨먹고 오늘 밤은 스마트폰 끄고 7시간 이상 푹 자겠습니다.",
        badge: "딥 슬립 리커버리",
        badgeColor: "emerald",
        statEffect: "💤 피로 회복도 +30%",
        coachReaction:
          "완벽해! 잠자는 동안 근육과 뇌신경이 더 단단하게 재구축된다. 오늘 훈련 깔끔하게 끝내고 푹 쉬어라.",
      },
      {
        id: "c3_2",
        label: "가벼운 폼롤러 스트레칭과 시각화 명상으로 멘탈을 가다듬겠습니다.",
        badge: "멘탈 디톡스",
        badgeColor: "blue",
        statEffect: "🧘 긴장 완화 +20%",
        coachReaction:
          "멘탈 리셋이야말로 5라운드 챔피언십 접전을 버티게 해주는 원동력이다. 몸의 긴장을 풀고 편안히 임해라.",
      },
      {
        id: "c3_3",
        label: "코치님, 다른 조언도 듣고 싶습니다.",
        badge: "다른 대화",
        badgeColor: "amber",
        statEffect: "🔄 상태 재점검",
        coachReaction: "그래, 언제든 편하게 말해라. 코칭 스테프는 항상 자네 편이다.",
        nextNodeId: "start",
      },
    ],
  },
  game_plan: {
    id: "game_plan",
    category: "FINAL GAME PLAN // 결전의 각오",
    coachSpeech:
      "좋아. 머릿속으로 이미 상대의 주먹을 흘리고 승리의 벨트를 들어 올리는 자네의 모습을 시각화해봐라. 준비됐나?",
    choices: [
      {
        id: "c4_1",
        label: "네! 코치님 믿고 옥타곤으로 돌아가 오늘의 목표를 완수하겠습니다!",
        badge: "전투 준비 완료",
        badgeColor: "red",
        statEffect: "🏆 승리 확신도 100%",
        coachReaction:
          "가서 증명해라! 옥타곤의 붉은 캔버스는 자네가 지배하는 무대다! 쇼타임이다!",
      },
      {
        id: "c4_2",
        label: "코치님, 다른 조언도 듣고 싶습니다.",
        badge: "다른 대화",
        badgeColor: "amber",
        statEffect: "🔄 상태 재점검",
        coachReaction: "그래, 부족한 부분이 있다면 얼마든지 채워주마.",
        nextNodeId: "start",
      },
    ],
  },
};

export default function CareerHubPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"HOME" | "CAMP" | "FIGHTS" | "CAREER">("HOME");
  const [isShaking, setIsShaking] = useState(false);
  const [punchFlash, setPunchFlash] = useState(false);
  const [fighterOutfit, setFighterOutfit] = useState<"MCGREGOR" | "TATTED" | "RASHGUARD">("MCGREGOR");

  // Active Modal State: null | "FIGHT" | "COACH" | "HISTORY" | "CALENDAR" | "EVOLUTION" | "SOCIAL" | "SETTINGS"
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Focus Stopwatch & Interval Timer (시:분:초 집중 시간 타이머)
  const [timerMode, setTimerMode] = useState<"INTERVAL" | "CARDIO">("INTERVAL");
  const [focusSeconds, setFocusSeconds] = useState(0); // Cardio mode: elapsed seconds
  const [intervalTotalSeconds, setIntervalTotalSeconds] = useState(25 * 60); // Interval mode: default 25 min
  const [intervalSecondsLeft, setIntervalSecondsLeft] = useState(25 * 60); // Interval mode: remaining seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimerTask, setActiveTimerTask] = useState<TimerTask | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerMode === "INTERVAL") {
          setIntervalSecondsLeft((prev) => {
            if (prev <= 1) {
              setIsTimerRunning(false);
              sounds.playBell();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setFocusSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerMode]);

  const formatFocusTime = (totalSecs: number, forceHours: boolean = false) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0 || forceHours) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Projects State (대단위 프로젝트)
  const [projects, setProjects] = useState<FightProject[]>([
    {
      id: "proj-1",
      badge: "MAIN EVENT",
      title: "알고리즘 코딩테스트 집중 대비",
      shortName: "알고리즘 코테",
      dDay: "D-7",
      color: "red",
    },
    {
      id: "proj-2",
      badge: "CO-MAIN",
      title: "SQLD 데이터 자격증 취득",
      shortName: "SQLD 자격증",
      dDay: "D-14",
      color: "amber",
    },
    {
      id: "proj-3",
      badge: "BOUT",
      title: "백엔드 클라우드 무중단 배포",
      shortName: "클라우드 배포",
      dDay: "D-3",
      color: "blue",
    },
    {
      id: "proj-4",
      badge: "BOUT",
      title: "피지컬 & 멘탈 컨디셔닝",
      shortName: "피지컬 루틴",
      dDay: "D-DAY",
      color: "purple",
    },
  ]);

  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("ALL");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("w-7");
  const [campSubTab, setCampSubTab] = useState<"ATTRIBUTES" | "MOVES" | "PERKS">("ATTRIBUTES");
  const [newWorkoutTitle, setNewWorkoutTitle] = useState("");
  const [newWorkoutProjectId, setNewWorkoutProjectId] = useState<string>("proj-1");
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [currentDialogNode, setCurrentDialogNode] = useState<string>("start");
  const [coachReaction, setCoachReaction] = useState<string | null>(null);
  const [activeStatEffect, setActiveStatEffect] = useState<string | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectBadge, setNewProjectBadge] = useState<"MAIN EVENT" | "CO-MAIN" | "TITLE BOUT" | "BOUT">("BOUT");
  const [newProjectDDay, setNewProjectDDay] = useState("D-10");

  // Workouts State (Fighter Evolution 3-Column Attributes)
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([
    // 1. STAND-UP (실전 코딩 / 스프린트 / 개발)
    {
      id: "w-1",
      projectId: "proj-1",
      category: "STAND-UP",
      title: "알고리즘 고난도 실전 문제 2개 타격 (집중 스프린트)",
      completed: false,
    },
    {
      id: "w-2",
      projectId: "proj-3",
      category: "STAND-UP",
      title: "Docker Compose 환경 및 PostgreSQL 마이그레이션 검증",
      completed: false,
    },
    {
      id: "w-3",
      projectId: "proj-1",
      category: "STAND-UP",
      title: "UFC 커리어 모드 스타일 UI 인터랙션 리팩토링",
      completed: true,
    },
    {
      id: "w-4",
      projectId: "proj-3",
      category: "STAND-UP",
      title: "Next.js 서버 액션 성능 프로파일링 및 렌더 최적화",
      completed: true,
    },
    // 2. GRAPPLING (데이터 / 분석 / 지식 정리 / 자격증)
    {
      id: "w-5",
      projectId: "proj-1",
      category: "GRAPPLING",
      title: "동적 계획법(DP) & 그래프 탐색 핵심 오답 노트 정리",
      completed: true,
    },
    {
      id: "w-6",
      projectId: "proj-2",
      category: "GRAPPLING",
      title: "SQLD 2과목 SQL 기본 및 활용 모의고사 1회 풀이",
      completed: true,
    },
    {
      id: "w-7",
      projectId: "proj-2",
      category: "GRAPPLING",
      title: "윈도우 함수 및 계층형 질의 핵심 문법 서브미션 공략",
      completed: false,
    },
    {
      id: "w-8",
      projectId: "proj-2",
      category: "GRAPPLING",
      title: "데이터 모델링 3단계 및 엔티티 관계도 핵심 총정리",
      completed: false,
    },
    // 3. HEALTH (체력 / 컨디셔닝 / 멘탈 관리)
    {
      id: "w-9",
      projectId: "proj-4",
      category: "HEALTH",
      title: "아침 공복 유산소 러닝 5km & 코어 강화 루틴",
      completed: true,
    },
    {
      id: "w-10",
      projectId: "proj-4",
      category: "HEALTH",
      title: "수면 7시간 수면 리듬 회복 & 수분 2L 섭취",
      completed: false,
    },
    {
      id: "w-11",
      projectId: "proj-4",
      category: "HEALTH",
      title: "파이트 마인드셋 유지 & 시합 리허설 시각화 15분",
      completed: true,
    },
    {
      id: "w-12",
      projectId: "proj-4",
      category: "HEALTH",
      title: "고단백 식단 관리 & 훈련 후 스트레칭 리커버리",
      completed: false,
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

  // ESC key listener to quickly close any active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModal) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

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
        : modalName === "TIMER"
        ? "OCTAGON FOCUS TIMER // 집중 훈련 세션"
        : "OCTAGON BROADCAST FEED";

    executeArenaTransition(label, () => {
      setActiveModal(modalName);
      if (modalName === "FIGHT") {
        sounds.playBell();
      }
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
    sounds.playSelect();
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
    sounds.playSelect();
  };

  const handleAddWorkout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newWorkoutTitle.trim()) return;

    sounds.playSelect();

    const targetProject = newWorkoutProjectId || projects[0]?.id || "proj-1";

    const newItem: WorkoutItem = {
      id: `w-${Date.now()}`,
      projectId: targetProject,
      category: "STAND-UP",
      title: newWorkoutTitle.trim(),
      completed: false,
    };

    setWorkouts((prev) => [newItem, ...prev]);
    setNewWorkoutTitle("");
    setIsAddingWorkout(false);
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
  const campProgressPercent = Math.round((completedWorkouts / (workouts.length || 1)) * 100);

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
              ? "bg-gradient-to-r from-black/50 via-black/25 to-transparent w-full md:w-[65%]"
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
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
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
                className={`relative px-4 py-1 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "text-white bg-red-600/30 border-b-2 border-red-600"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Status Metrics (Top Right HUD) */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          {/* Focus Stopwatch / Interval Timer (시:분:초 집중 시간) */}
          <div
            onClick={() => {
              sounds.playSelect();
              setActiveModal("TIMER");
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-900/80 border cursor-pointer select-none transition-all group hover:border-amber-400 ${
              isTimerRunning
                ? timerMode === "INTERVAL"
                  ? "border-red-500/80 bg-red-950/25 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  : "border-amber-500/80 bg-amber-950/25 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "border-white/10 text-neutral-300 hover:border-neutral-400"
            }`}
            title="파이트 집중 타이머 열기 (인터벌 / 카디오)"
          >
            {timerMode === "INTERVAL" ? (
              <Flame className={`w-3.5 h-3.5 ${isTimerRunning ? "text-red-400 animate-pulse" : "text-neutral-400 group-hover:text-red-400"}`} />
            ) : (
              <Timer className={`w-3.5 h-3.5 ${isTimerRunning ? "text-amber-400 animate-pulse" : "text-neutral-400 group-hover:text-amber-400"}`} />
            )}
            <span className="font-mono font-bold text-xs tracking-wider text-white">
              {timerMode === "INTERVAL"
                ? formatFocusTime(intervalSecondsLeft, true)
                : formatFocusTime(focusSeconds, true)}
            </span>
            {isTimerRunning && (
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ml-0.5 ${
                  timerMode === "INTERVAL" ? "bg-red-400" : "bg-amber-400"
                }`}
              />
            )}
            {activeTimerTask && (
              <span className="hidden xl:inline-block max-w-[110px] truncate text-[10px] text-neutral-400 font-normal pl-1 border-l border-white/10">
                {activeTimerTask.title}
              </span>
            )}
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

          {/* Fan Count (글로벌 팬 수) */}
          <div
            onClick={() => {
              sounds.playSelect();
              openModal("SOCIAL");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-900/80 border border-white/10 text-yellow-400 cursor-pointer hover:border-yellow-500 hover:bg-yellow-950/10 transition-colors"
            title="글로벌 팬 수 (소셜 미디어 열기)"
          >
            <Users className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-bold font-teko text-sm tracking-wide">75.4M 팬</span>
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
        /* TRAINING CAMP GYM STAGE (Unified Single-Card To-Do List + Heavy Bag & Fighter) */
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 max-w-[1800px] w-full mx-auto items-center">
          {/* LEFT SECTION (6 Cols): Unified UFC Fighter Evolution To-Do List Dashboard */}
          <div className="lg:col-span-6 flex flex-col w-full">
            <div className="bg-black/40 border border-white/10 rounded-sm p-4 md:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col gap-3.5 min-h-[720px] h-[720px]">
              {/* 1. HEAD COACHING BANNER BUTTON (Same size as TRAINING, with coach2.png background) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playSelect();
                  setShowCoachModal(true);
                }}
                onMouseEnter={() => sounds.playHover()}
                className="relative rounded-sm overflow-hidden border border-amber-500/40 hover:border-amber-400 shadow-xl -mx-1 -mt-1 min-h-[72px] h-[72px] flex items-center justify-between text-left transition-all duration-200 group cursor-pointer shrink-0 bg-neutral-950"
              >
                {/* Background Image & Atmospheric Lighting */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <Image
                    src="/images/card_coach.jpg"
                    alt="Coach Background"
                    fill
                    priority
                    className="object-cover object-center filter brightness-40 contrast-125 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-amber-950/40" />
                </div>

                {/* Right-Side Head Coach Bust Figure (coach2.png) */}
                <div className="absolute right-0 top-0 bottom-0 w-44 md:w-56 pointer-events-none overflow-hidden z-10">
                  <div className="relative w-full h-full transform translate-y-1 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/coach2.png"
                      alt="Head Coach Tyrone"
                      fill
                      priority
                      className="object-contain object-right-bottom drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                </div>

                {/* Bottom Amber Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500/40 group-hover:bg-amber-400 z-10 transition-colors" />

                {/* Content on Left: STRIKING COACH */}
                <div className="relative z-20 px-5 py-4 flex flex-col justify-center">
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl md:text-4xl font-black font-teko text-white group-hover:text-amber-300 tracking-widest uppercase leading-none transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      STRIKING COACH
                    </h2>
                    <span className="text-xs font-semibold text-neutral-300 hidden sm:inline-block font-pretendard">
                      타격 전술 & 멘탈 브리핑
                    </span>
                  </div>
                </div>
              </button>

              {/* 2. TRAINING Header Banner with Dynamic Left-to-Right Progress Background */}
              <div className="relative rounded-sm overflow-hidden border border-white/15 shadow-xl -mx-1 min-h-[72px] h-[72px] flex items-center shrink-0">
                {/* Base Background Image (Uncompleted / Darkened Grayscale) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <Image
                    src="/images/card_camp.jpg"
                    alt="UFC Training Camp Header Banner"
                    fill
                    priority
                    className="object-cover object-[center_35%] filter brightness-45 contrast-125 grayscale"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* Active Progress Fill from Left to Right (Colors the background) */}
                <div
                  className="absolute inset-y-0 left-0 z-1 pointer-events-none overflow-hidden transition-all duration-700 ease-out"
                  style={{ width: `${campProgressPercent}%` }}
                >
                  {/* Full Color Image inside the progress width */}
                  <div className="absolute inset-0 w-[900px] max-w-none h-full">
                    <Image
                      src="/images/card_camp.jpg"
                      alt="UFC Training Camp Active Progress"
                      fill
                      priority
                      className="object-cover object-[center_35%] filter brightness-90 contrast-125"
                    />
                    {/* Dynamic UFC Red Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700/60 via-red-600/50 to-red-500/60" />
                  </div>

                  {/* Leading Edge Glow Line */}
                  <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-amber-300 to-red-400 shadow-[0_0_15px_rgba(248,113,113,1)]" />
                </div>

                {/* Bottom Progress Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/80 z-10">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${campProgressPercent}%` }}
                  />
                </div>

                {/* Content inside Banner: Simply "TRAINING" and "OCTAGON HUB" */}
                <div className="relative z-20 w-full px-5 py-4 flex items-center justify-between gap-4">
                  <h2 className="text-3xl md:text-4xl font-black font-teko text-white tracking-widest uppercase leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    TRAINING
                  </h2>

                  <button
                    onClick={() => triggerTabTransition("HOME")}
                    onMouseEnter={() => sounds.playHover()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-black/80 hover:bg-neutral-900 border border-white/20 hover:border-red-500 text-neutral-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md font-pretendard"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>OCTAGON HUB</span>
                  </button>
                </div>
              </div>

              {/* 2. Single Unified Goal List (Translucent Pure Achromatic Grays, No Red Selection, No D-Day, Hidden Scrollbar) */}
              <div className="flex-1 min-h-0 space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0">
                {workouts.map((workout, index) => {
                  const proj = projects.find((p) => p.id === workout.projectId) || projects[0];
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={workout.id}
                      onClick={() => handleToggleWorkout(workout.id)}
                      onMouseEnter={() => sounds.playHover()}
                      className={`group relative p-3 rounded-sm transition-all duration-150 cursor-pointer select-none backdrop-blur-sm ${
                        isEven
                          ? "bg-[#28282b]/60 hover:bg-[#343438]/75 border border-white/10 hover:border-white/30"
                          : "bg-[#141416]/60 hover:bg-[#1e1e21]/75 border border-white/5 hover:border-white/20"
                      } ${workout.completed ? "opacity-55" : "opacity-100"}`}
                    >
                      {/* Line 1: 프로젝트 (Project) */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              proj.color === "red"
                                ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                                : proj.color === "amber"
                                ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                                : proj.color === "blue"
                                ? "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]"
                                : "bg-neutral-300 shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                            }`}
                          />
                          <span className="text-xs font-bold tracking-wider uppercase text-neutral-400 group-hover:text-neutral-200 truncate transition-colors">
                            {proj.shortName}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteWorkout(workout.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-red-400 transition-all cursor-pointer shrink-0"
                          title="목표 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line 2: 목표 (Goal Task Description) */}
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                          workout.completed
                            ? "line-through text-neutral-400"
                            : "text-neutral-100 group-hover:text-white"
                        }`}
                      >
                        {workout.title}
                      </p>
                    </div>
                  );
                })}

                {workouts.length === 0 && (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center py-12 text-center text-neutral-500 text-xs border border-dashed border-white/10 rounded">
                    현재 등록된 훈련 목표가 없습니다.
                  </div>
                )}
              </div>

              {/* 4. List Footer: Only [+] Button & Inline Quick Input */}
              <div className="pt-3 border-t border-white/10 flex items-center font-pretendard mt-auto shrink-0">
                {!isAddingWorkout ? (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setIsAddingWorkout(true);
                    }}
                    className="p-2 rounded bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/35 text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-sm"
                    title="목표 추가"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newWorkoutTitle.trim()) return;
                      sounds.playSelect();
                      const newItem: WorkoutItem = {
                        id: `w-${Date.now()}`,
                        projectId: newWorkoutProjectId || projects[0]?.id || "proj-1",
                        category: "STAND-UP",
                        title: newWorkoutTitle.trim(),
                        completed: false,
                      };
                      setWorkouts((prev) => [newItem, ...prev]);
                      setNewWorkoutTitle("");
                      setIsAddingWorkout(false);
                    }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="새로운 훈련 목표를 입력하세요... (Enter로 추가, Esc로 취소)"
                      value={newWorkoutTitle}
                      onChange={(e) => setNewWorkoutTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setIsAddingWorkout(false);
                          setNewWorkoutTitle("");
                        }
                      }}
                      className="flex-1 bg-black/60 border border-white/20 focus:border-white/50 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 px-3 py-1.5 rounded focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!newWorkoutTitle.trim()}
                      className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 border border-white/30 disabled:opacity-40 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
                    >
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playHover();
                        setIsAddingWorkout(false);
                        setNewWorkoutTitle("");
                      }}
                      className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="취소"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                )}
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

            {/* Heavy Bag & Striking Fighter Stage */}
            <div
              onClick={handleFighterPunch}
              className="relative w-full h-[580px] lg:h-[720px] flex items-end justify-end cursor-pointer z-15 group pr-2 lg:pr-6"
              title="클릭하여 훈련 파이터 인터랙션"
            >
              {/* 1. Heavy Punching Bag (Positioned directly in front of Conor's punching glove) */}
              <div
                className="absolute bottom-16 sm:bottom-18 lg:bottom-20 right-[270px] sm:right-[330px] md:right-[390px] lg:right-[450px] w-[125px] sm:w-[145px] md:w-[160px] lg:w-[175px] h-[480px] sm:h-[560px] md:h-[620px] lg:h-[680px] z-14 transition-all duration-200 origin-top"
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

              {/* 2. Conor McGregor Grounded on Gym Mat Floor (Shifted to the right) */}
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

                {/* Fighter Image with idle breathe (No punch flash shake) */}
                <div
                  className="relative w-full h-full animate-idle-breathe z-10 flex items-end justify-center"
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

            {/* Bottom Fighter Status Strip (NO STARS) */}
            <div className="relative z-20 w-full max-w-sm flex flex-col gap-1.5 mt-2 pointer-events-auto pr-2 lg:pr-6">
              <div className="bg-black/80 backdrop-blur-sm border-l-2 border-red-600 px-3 py-1.5 flex items-center justify-between gap-4 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-lg">
                <span className="text-neutral-200">TRAINING FOCUS: FIGHT-BASED PREPARATION</span>
                <span className="text-emerald-400 font-mono font-bold">READY</span>
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

      {/* MODAL 1: Fight Modal - UFC Tale of the Tape (EA Sports Broadcast Style) */}
      {activeModal === "FIGHT" && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none animate-fade-in flex flex-col justify-between">
          {/* Background Arena with Dark Cinematic Vignette */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/ufc_arena_transition.jpg"
              alt="UFC Arena Octagon"
              fill
              priority
              className="object-cover object-center opacity-45 scale-105"
            />
            {/* Spotlight & Vignette Masks */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,0.25)_0%,_rgba(6,8,12,0.85)_70%,_rgba(0,0,0,0.98)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-48 sm:h-72 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 to-transparent" />
          </div>

          {/* Top Bar: Clean X Button */}
          <header className="relative z-30 flex items-center justify-end px-6 sm:px-12 pt-6 pb-2 w-full">
            {/* Clean X close button as requested */}
            <button
              onClick={closeModal}
              onMouseEnter={() => sounds.playHover()}
              className="p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/20 hover:border-white/50 transition-all cursor-pointer shadow-xl active:scale-90"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Main Stage: Left Fighter (McGregor) + Center Board + Right Fighter (Tsang) */}
          <main className="relative z-20 flex-1 w-full max-w-[1700px] mx-auto flex items-end justify-center px-4 sm:px-8 pb-2">
            {/* LEFT FIGHTER: Conor McGregor */}
            <div className="absolute left-0 sm:left-4 md:left-8 lg:left-14 bottom-0 w-[42%] sm:w-[38%] md:w-[36%] max-w-[540px] h-[78vh] sm:h-[84vh] pointer-events-none flex flex-col justify-end z-10">
              <div className="relative w-full h-full animate-idle-breathe">
                <Image
                  src="/images/fighter_mcgregor_side.png"
                  alt="Conor McGregor"
                  fill
                  priority
                  className="object-contain object-bottom select-none filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                />
              </div>

              {/* McGregor Nameplate (Lower body banner matching reference) */}
              <div className="absolute left-4 sm:left-8 md:left-12 bottom-10 sm:bottom-14 z-20 pointer-events-auto max-w-[280px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#f4c300] text-black font-black font-teko text-base rounded-[1px] leading-none shadow">
                    C
                  </span>
                  <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4c300] font-teko">
                    UNDISPUTED CHAMPION
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-teko uppercase text-white tracking-wider leading-[0.88] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                  CONOR<br />MCGREGOR
                </div>
                <div className="h-[2px] bg-white/70 w-full my-2 shadow" />
                <div className="flex items-center gap-3">
                  {/* Ireland Flag */}
                  <svg className="w-7 h-4.5 rounded-[1px] shadow border border-white/30 shrink-0" viewBox="0 0 30 20">
                    <rect width="10" height="20" fill="#169b62" />
                    <rect x="10" width="10" height="20" fill="#ffffff" />
                    <rect x="20" width="10" height="20" fill="#ff883e" />
                  </svg>
                  <span className="text-xl sm:text-2xl font-black font-teko text-white tracking-widest leading-none drop-shadow">
                    22-6-0
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT FIGHTER: Chaoxiang Tsang */}
            <div className="absolute right-0 sm:right-4 md:right-8 lg:right-14 bottom-0 w-[42%] sm:w-[38%] md:w-[36%] max-w-[540px] h-[78vh] sm:h-[84vh] pointer-events-none flex flex-col justify-end items-end z-10">
              <div className="relative w-full h-full animate-idle-breathe">
                <Image
                  src="/images/enemy1.png"
                  alt="Chaoxiang Tsang"
                  fill
                  priority
                  className="object-contain object-bottom select-none filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                />
              </div>

              {/* Opponent Nameplate (Lower body banner matching reference) */}
              <div className="absolute right-4 sm:right-8 md:right-12 bottom-10 sm:bottom-14 z-20 pointer-events-auto max-w-[280px] text-right flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-neutral-300 font-teko">
                    #1 RANKED CONTENDER
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-neutral-200 text-black font-black font-teko text-base rounded-[1px] leading-none shadow">
                    1
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-teko uppercase text-white tracking-wider leading-[0.88] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                  CHAOXIANG<br />TSANG
                </div>
                <div className="h-[2px] bg-white/70 w-full my-2 shadow" />
                <div className="flex items-center justify-end gap-3">
                  <span className="text-xl sm:text-2xl font-black font-teko text-white tracking-widest leading-none drop-shadow">
                    19-2-0
                  </span>
                  {/* Flag */}
                  <svg className="w-7 h-4.5 rounded-[1px] shadow border border-white/30 shrink-0" viewBox="0 0 30 20">
                    <rect width="30" height="20" fill="#de2910" />
                    <polygon points="5,2 6.5,6.5 2.5,3.7 7.5,3.7 3.5,6.5" fill="#ffde00" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CENTER TALE OF THE TAPE BOARD */}
            <div className="relative z-20 my-auto mb-8 sm:mb-12 w-full max-w-[360px] sm:max-w-[420px] md:max-w-[440px] flex items-stretch shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
              {/* Left Yellow Vertical Stripe */}
              <div className="w-6 sm:w-7 bg-[#f4c300] flex flex-col items-center justify-center py-6 relative shrink-0">
                {/* Pointer Notch pointing left */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#f4c300]" />
                <span
                  style={{ writingMode: "vertical-lr" }}
                  className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-black uppercase rotate-180 select-none whitespace-nowrap"
                >
                  . IRELAND - DUBLIN, IRELAND - .
                </span>
              </div>

              {/* Center Dark Panel */}
              <div className="flex-1 bg-[#1e2024]/95 backdrop-blur-md border-y border-white/10 flex flex-col">
                {/* UFC Yellow Top Tab */}
                <div className="flex justify-center -mt-0">
                  <div className="bg-[#f4c300] px-8 py-1.5 shadow-md flex items-center justify-center min-w-[130px] sm:min-w-[150px]">
                    <span className="text-white font-black italic text-3xl sm:text-4xl font-teko tracking-tighter leading-none transform -skew-x-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      UFC
                    </span>
                  </div>
                </div>

                {/* Division Title & Bout Objective */}
                <div className="pt-3 pb-2.5 px-6 text-center">
                  <h2 className="text-white font-black font-teko text-3xl sm:text-4xl tracking-wider uppercase leading-none">
                    LIGHTWEIGHT
                  </h2>
                  <p className="text-neutral-400 font-teko text-sm sm:text-base tracking-[0.3em] uppercase italic font-bold mt-0.5">
                    CHAMPIONSHIP
                  </p>
                  <p className="text-neutral-400 font-pretendard text-xs sm:text-sm font-light tracking-wider mt-1">
                    정보처리기사 취득
                  </p>
                </div>

                {/* Stat Rows */}
                <div className="flex flex-col">
                  {/* Row 1: AGE */}
                  <div className="grid grid-cols-3 items-center py-3.5 px-6 border-t border-white/10">
                    <span className="text-right font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      36
                    </span>
                    <span className="text-center font-teko font-bold text-base sm:text-lg text-neutral-400 tracking-widest uppercase leading-none">
                      AGE
                    </span>
                    <span className="text-left font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      32
                    </span>
                  </div>

                  {/* Row 2: HEIGHT */}
                  <div className="grid grid-cols-3 items-center py-3.5 px-6 border-t border-white/10">
                    <span className="text-right font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      5' 9"
                    </span>
                    <span className="text-center font-teko font-bold text-base sm:text-lg text-neutral-400 tracking-widest uppercase leading-none">
                      HEIGHT
                    </span>
                    <span className="text-left font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      6' 1"
                    </span>
                  </div>

                  {/* Row 3: WEIGHT */}
                  <div className="grid grid-cols-3 items-center py-3.5 px-6 border-t border-white/10">
                    <span className="text-right font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      155 lbs
                    </span>
                    <span className="text-center font-teko font-bold text-base sm:text-lg text-neutral-400 tracking-widest uppercase leading-none">
                      WEIGHT
                    </span>
                    <span className="text-left font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      155 lbs
                    </span>
                  </div>

                  {/* Row 4: REACH */}
                  <div className="grid grid-cols-3 items-center py-3.5 px-6 border-t border-white/10">
                    <span className="text-right font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      74"
                    </span>
                    <span className="text-center font-teko font-bold text-base sm:text-lg text-neutral-400 tracking-widest uppercase leading-none">
                      REACH
                    </span>
                    <span className="text-left font-teko font-black text-3xl sm:text-4xl text-white tracking-wide leading-none">
                      75"
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Yellow Vertical Stripe */}
              <div className="w-6 sm:w-7 bg-[#f4c300] flex flex-col items-center justify-center py-6 relative shrink-0">
                {/* Pointer Notch pointing right */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-[#f4c300]" />
                <span
                  style={{ writingMode: "vertical-lr" }}
                  className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-black uppercase select-none whitespace-nowrap"
                >
                  - BEIJING, CHINA - . ASIA .
                </span>
              </div>
            </div>
          </main>

          {/* Bottom Controls Bar: Skip & Start Bout Action */}
          <footer className="relative z-30 flex items-center justify-between px-6 sm:px-12 py-4 w-full bg-gradient-to-t from-black via-black/90 to-transparent">
            {/* Left: EA Sports style Skip button */}
            <button
              onClick={closeModal}
              onMouseEnter={() => sounds.playHover()}
              className="text-neutral-400 hover:text-white font-teko text-lg tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-white/20 text-xs font-mono text-neutral-300">
                ESC
              </span>
              <span>SKIP</span>
            </button>

            {/* Right: Enter Octagon Action Button */}
            <button
              onClick={() => {
                sounds.playPunch();
                sounds.playBell();
                closeModal();
              }}
              onMouseEnter={() => sounds.playHover()}
              className="group relative px-8 py-3 bg-[#f4c300] hover:bg-yellow-400 text-black font-black font-teko text-2xl uppercase tracking-wider rounded-sm transition-all duration-200 shadow-[0_0_25px_rgba(244,195,0,0.5)] flex items-center gap-3 active:scale-95 cursor-pointer"
            >
              <Swords className="w-5 h-5 text-black" />
              <span>START BOUT // 시합 시작</span>
              <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </footer>
        </div>
      )}

      {/* MODAL 2: EA Sports UFC Style Head Coach Modal */}
      {activeModal === "COACH" && (
        <HeadCoachModal
          onClose={closeModal}
          onSelectFight={(boutId) => {
            sounds.playPunch();
            sounds.playBell();
          }}
        />
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

      {/* MODAL 5: UFC Broadcast Styled Interactive Calendar Modal */}
      {activeModal === "CALENDAR" && (
        <UfcCalendarModal onClose={closeModal} />
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

      {/* MODAL 7: Smartphone X (Twitter) Social Media Feed */}
      {activeModal === "SOCIAL" && (
        <SocialMediaPhoneModal onClose={closeModal} />
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

      {/* MODAL 9: EA Sports UFC Style Promotions Invitation Modal */}
      {activeModal === "PROMOTION" && (
        <PromotionModal
          onClose={closeModal}
          onAcceptContract={(org) => {
            sounds.playPunch();
            sounds.playBell();
          }}
        />
      )}

      {/* MODAL 10: UFC Focus Timer & Interval / Cardio Training Modal */}
      {activeModal === "TIMER" && (
        <FocusTimerModal
          isOpen={true}
          onClose={closeModal}
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
          intervalTotalSeconds={intervalTotalSeconds}
          setIntervalTotalSeconds={setIntervalTotalSeconds}
          intervalSecondsLeft={intervalSecondsLeft}
          setIntervalSecondsLeft={setIntervalSecondsLeft}
          cardioSeconds={focusSeconds}
          setCardioSeconds={setFocusSeconds}
          activeTask={activeTimerTask}
          setActiveTask={setActiveTimerTask}
          workouts={workouts}
          onToggleWorkout={handleToggleWorkout}
          onAddWorkout={(title) => {
            const newItem: WorkoutItem = {
              id: `w-${Date.now()}`,
              projectId: projects[0]?.id || "proj-1",
              category: "STAND-UP",
              title,
              completed: false,
            };
            setWorkouts((prev) => [newItem, ...prev]);
          }}
        />
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

      {/* 6. GAME-STYLE HEAD COACHING DIALOGUE MODAL (EA Sports UFC Career Mode Style) */}
      {showCoachModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none font-pretendard">
          <div className="relative w-full max-w-5xl h-[660px] max-h-[92vh] bg-[#0c0e14] border border-white/15 rounded-sm shadow-2xl overflow-hidden flex flex-col justify-between before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-red-600 via-amber-500 before:to-red-600">
            {/* Background Gym Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
              <Image
                src="/images/ufc_training_gym_v2.jpg"
                alt="Gym Background"
                fill
                className="object-cover object-center filter grayscale brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
            </div>

            {/* Top Bar: Title & Close Button */}
            <div className="relative z-20 px-5 md:px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
              <h3 className="text-xl md:text-2xl font-black font-teko uppercase text-white tracking-wide">
                STRIKING COACH DIALOGUE • 타격 전술 & 멘탈 코칭
              </h3>
              <button
                type="button"
                onClick={() => {
                  sounds.playHover();
                  setShowCoachModal(false);
                }}
                className="p-1.5 rounded hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="닫기 (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Body: Coach Character on Right + Dialogue & Choice Panel on Left */}
            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 md:p-6 overflow-hidden items-end">
              {/* Left Column (7 cols): Dialogue Console & Choice Options */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 py-1">
                {/* 1. Coach Speech Box */}
                <div className="bg-black/65 border border-amber-500/30 rounded-sm p-4 md:p-5 backdrop-blur-md shadow-xl relative">
                  {/* Speaker Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
                      <span className="font-teko font-black text-xl tracking-wider text-amber-400 uppercase">
                        COACH TYRONE (스트라이킹 코치)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                      {COACH_DIALOGS[currentDialogNode]?.category || "TACTICAL ADVICE"}
                    </span>
                  </div>

                  {/* Coach's Current Speech */}
                  <p className="text-sm md:text-base font-medium text-neutral-100 leading-relaxed font-pretendard">
                    "{coachReaction || COACH_DIALOGS[currentDialogNode]?.coachSpeech}"
                  </p>

                  {/* Active Stat / Morale Notification if any */}
                  {activeStatEffect && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide shadow-sm animate-fade-in">
                      <span>{activeStatEffect}</span>
                    </div>
                  )}
                </div>

                {/* 2. Player Response Choices (선택지) */}
                <div className="space-y-2 mt-auto">
                  <div className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 uppercase flex items-center justify-between gap-2 mb-1">
                    <span>SELECT YOUR RESPONSE (답변 선택)</span>
                    {coachReaction && (
                      <span className="text-amber-400 text-[10px] font-sans font-bold">
                        코치 피드백 접수됨
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {COACH_DIALOGS[currentDialogNode]?.choices.map((choice, idx) => {
                      const isSelected = selectedChoiceId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            sounds.playSelect();
                            setSelectedChoiceId(choice.id);
                            setCoachReaction(choice.coachReaction);
                            setActiveStatEffect(choice.statEffect);
                            if (choice.nextNodeId) {
                              setTimeout(() => {
                                setCurrentDialogNode(choice.nextNodeId!);
                                setCoachReaction(null);
                                setSelectedChoiceId(null);
                              }, 1800);
                            }
                          }}
                          onMouseEnter={() => sounds.playHover()}
                          className={`w-full p-3 rounded-sm text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 border backdrop-blur-md group ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                              : "bg-[#181a20]/80 hover:bg-[#252832]/90 border-white/10 hover:border-white/30 text-neutral-200 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded bg-black/60 border border-white/20 text-neutral-400 group-hover:text-amber-400 group-hover:border-amber-400/60 text-xs font-bold font-mono flex items-center justify-center shrink-0 transition-colors">
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold truncate transition-colors">
                              {choice.label}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 transition-colors ${
                              choice.badgeColor === "red"
                                ? "bg-red-950/40 text-red-400 border-red-500/40"
                                : choice.badgeColor === "blue"
                                ? "bg-blue-950/40 text-blue-400 border-blue-500/40"
                                : choice.badgeColor === "amber"
                                ? "bg-amber-950/40 text-amber-400 border-amber-500/40"
                                : "bg-emerald-950/40 text-emerald-400 border-emerald-500/40"
                            }`}
                          >
                            {choice.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Bar: Reset Conversation or Return to Training */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        setCurrentDialogNode("start");
                        setCoachReaction(null);
                        setActiveStatEffect(null);
                        setSelectedChoiceId(null);
                      }}
                      className="text-xs font-bold text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      ↩ 처음부터 다시 대화하기
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        setShowCoachModal(false);
                      }}
                      className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg font-pretendard"
                    >
                      훈련으로 복귀 🥊
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Coach 3D Cutout Figure Standing on Mat */}
              <div className="lg:col-span-5 relative h-full flex flex-col items-center justify-end pointer-events-none select-none">
                {/* Floor shadow */}
                <div className="absolute bottom-2 flex items-center justify-center w-full z-0">
                  <div
                    className="w-[380px] h-20 rounded-[50%] blur-md"
                    style={{
                      background:
                        "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 45%, transparent 80%)",
                    }}
                  />
                </div>

                {/* Coach Figure Asset */}
                <div className="relative w-full h-[460px] md:h-[530px] animate-idle-breathe z-10">
                  <Image
                    src="/images/coach1.png"
                    alt="UFC Head Coach Tyrone"
                    fill
                    priority
                    className="object-contain object-bottom"
                  />
                </div>

                {/* Coach Name Overlay */}
                <div className="absolute bottom-4 right-2 z-20 text-right">
                  <div className="font-teko font-black text-3xl md:text-4xl text-white tracking-wider uppercase leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    TYRONE "THE ANVIL"
                  </div>
                  <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase drop-shadow-md">
                    UFC PI STRIKING COACH
                  </div>
                </div>
              </div>
            </div>
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
