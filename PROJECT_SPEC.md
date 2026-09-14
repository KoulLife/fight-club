# PROJECT_SPEC: FightWeek (파이트위크) - UFC 테마 생산성 & 파이트 캠프 플래너

## 1. 프로젝트 개요 (Overview)
* **프로젝트명**: FightWeek (가칭 / Cornerman)
* **콘셉트**: UFC 파이트 캠프 및 전적(Tale of the Tape) 시스템을 일상 생산성에 이식한 게이미피케이션 To-Do & 프로젝트 관리 웹 서비스.
* **핵심 슬로건**: "목표는 시합이고, 일상은 캠프다. 오늘의 훈련을 완수하고 승리를 쟁취하라."
* **차별점**: 딱딱한 일반 생산성 툴 대신 묵직한 UFC 격투 게임 감성의 캐릭터 모션, 타격감(Screen Shake/SFX), AI 헤드코치의 분석 및 브리핑 제공.

---

## 2. 도메인 개념 매핑 (Core Metaphors)

| 일반 생산성 개념 | FightWeek 서비스 개념 | 설명 |
| :--- | :--- | :--- |
| 사용자 (User) | **파이터 (Fighter)** | 프로필, 소속 체급, 파이팅 스타일, 통산 전적을 보유 |
| 프로젝트 / 대목표 | **경기 (Fight / Bout)** | 마감일(시합일)이 정해진 큰 목표. 가상의 적(게으름, 시험 등) 설정 |
| 목표 준비 기간 | **파이트 캠프 (Camp)** | 시합을 준비하는 4~8주간의 집중 훈련 기간 (D-Day 트래커) |
| 일일 할 일 (To-Do) | **오늘의 훈련 (Workout)** | 매일 소화해야 하는 세부 훈련 과제 (스트라이킹, 그래플링 등 태깅) |
| 목표 달성 / 실패 | **경기 결과 (Tale of the Tape)** | 승리(KO/판정승), 패배(판정패/TKO), 취소(No Contest) 기록 |
| AI 어시스턴트 | **헤드코치 (Head Coach)** | 목표 분석, 준비 기간 산출, 우선순위 배정, 훈련 브리핑 제공 |

---

## 3. 핵심 기능 명세 (Key Features)

### 3.1. 파이터 프로필 & 전적실 (`/profile`)
* **UFC 스타일 프로필 레이아웃**: 닉네임, 체급, 스탠스, 프로필 사진.
* **통산 전적 요약**: `N전 N승 N패 (N KO)`.
* **연도별/시즌별 전적 아카이빙**: 특정 연도에 치른 경기 내역, 승률 지표, 카테고리별 성취율 시각화.

### 3.2. 파이트 카드 대시보드 (`/events` or `/`)
* **메인 이벤트 / 언더카드 분기**: 진행 중인 경기들의 우선순위화.
* **신규 경기 등록**: 목표, D-Day, 가상의 상대 입력 및 AI 코치 분석 요청.

### 3.3. 트레이닝 캠프 (`/camps/:id`)
* **D-Day 카운트다운**: 시합일까지의 남은 일수 (`FIGHT WEEK D-7`).
* **일일 훈련(To-Do) 관리**: 일별 태스크 추가/완료 처리.
* **훈련 강도 및 컨디션 추적**: 일일 To-Do 소화율에 따른 파이터 컨디션 지표 산출.

### 3.4. AI 헤드코치 시스템
* **캠프 기간 자동 산출**: 사용자의 목표와 세부 내용을 바탕으로 적정 준비 기간(주 단위) 추천.
* **우선순위 가이드**: 여러 경기가 겹칠 때 사용자의 핵심 가치와 마감 임박도를 평가하여 메인 이벤트(우선순위 1)와 언더카드(서브) 자동 분류.
* **일일 브리핑 & 사후 총평**: 캠프 성실도와 경기 결과를 결합한 피드백 제공.

---

## 4. 데이터베이스 ERD 설계 (Database Schema)

```sql
-- 1. 사용자 (파이터)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  weight_class VARCHAR(50), -- 페더급, 라이트급 등 유저 레벨/체급
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 경기 (대목표/프로젝트)
CREATE TABLE fights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL, -- 경기명 (예: 정보처리기사 실기 합격)
  opponent VARCHAR(100),       -- 가상의 상대 (예: 나태함, 수면욕)
  fight_date DATE NOT NULL,    -- 경기 예정일 (D-Day)
  status VARCHAR(20) DEFAULT 'SCHEDULED', -- SCHEDULED, IN_CAMP, COMPLETED, CANCELLED
  result VARCHAR(20),          -- WIN, LOSS, NO_CONTEST
  win_type VARCHAR(50),        -- KO (조기달성), DECISION (기한내 달성), SUBMISSION 등
  review TEXT,                 -- 경기 후 회고
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 파이트 캠프 (준비 기간)
CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fight_id UUID UNIQUE REFERENCES fights(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_intensity VARCHAR(50), -- 캠프 강도
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 훈련 항목 (To-Do List)
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  target_date DATE NOT NULL,
  category VARCHAR(50),         -- STRIKING(집중작업), GRAPPLING(자료정리), CONDITIONING(체력관리) 등
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI 코치 분석 로그
CREATE TABLE coach_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fight_id UUID REFERENCES fights(id) ON DELETE CASCADE,
  priority_score INT,          -- 1~10 우선순위
  estimated_days INT,          -- 추천 캠프 일수
  coach_feedback TEXT,         -- 코치의 조언/한마디
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 5. 기술 스택 (Tech Stack)
* **Framework**: Next.js (App Router, JavaScript/TypeScript)
* **Database & ORM**: PostgreSQL (Supabase / Neon) + Prisma
* **Styling**: Tailwind CSS (Black, Dark Gray, Crimson Red, Octagon Gold)
* **Animations**: Framer Motion (타격감, 화면 흔들림, 모달 팝업)
* **AI Engine**: OpenAI API / Google Gemini API (헤드코치 진단 및 피드백 스트리밍)

---

## 6. 캐릭터 에셋 및 인터랙션 구현 가이드
* **6.1. 코치 캐릭터**: 3D 렌더 풍 2.5D 이미지 전환 기법 (경량화).
* **6.2. 모션 상태**:
  - `Idle`: 팔짱 끼고 호흡(CSS keyframes).
  - `Talking`: 텍스트 타이핑 시 말하는 루프.
  - `Directive`: 삿대질/지시 포즈.
* **6.3. 타격감 (Game Juice)**: To-Do 체크 시 펀치 SFX + 튕기는 카드 + Screen Shake.

---

## 7. 개발 로드맵 (Milestones)
* **Phase 1**: Next.js + Tailwind UFC 다크 테마, Prisma 스키마 & DB 마이그레이션, Fight/Workout CRUD.
* **Phase 2**: 코치 캐릭터 Idle 호흡 모션, 타격 사운드/화면 흔들림 연출, 프로필 전적실(Win/Loss) 뷰.
* **Phase 3**: AI 코치 캠프 기간 자동 산출, 다중 경기 우선순위 분류 및 실시간 브리핑 스트리밍.
