// 트렌디 라인 아트 픽토그램 — 32×32 viewBox, stroke-1.5, currentColor
// stroke 기반이라 부모 color 속성으로 색상 조절 가능

type IconProps = { className?: string; size?: number };

const baseProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

// ─── 6단 내러티브 ─────────────────────────────────

// 01. 문제 제기 — 끝없이 도는 화살표 (반복되는 고민)
export const IconLoop = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M22 8a8 8 0 1 1-7-3" />
    <path d="M22 4v4h-4" />
    <circle cx="16" cy="16" r="2.5" />
  </svg>
);

// 02. 피부 재정의 — 연결된 노드 (에코시스템)
export const IconEcosystem = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="8" r="2" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="24" cy="20" r="2" />
    <circle cx="16" cy="24" r="2" />
    <path d="M16 10v0m0 0L9.5 18.5M16 10l6.5 8.5M9.5 22 16 23m6.5-1L16 23" />
  </svg>
);

// 03. 한계 — 균열된 장벽
export const IconCrack = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 6h22v20H5z" />
    <path d="M5 12h22M5 18h22" />
    <path d="M14 6l-1 6 3 4-2 4 1 6" />
  </svg>
);

// 04. 새로운 관점 — 새싹 / 자생력
export const IconSprout = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 26h22" />
    <path d="M16 26V14" />
    <path d="M16 14c-4 0-7-3-7-6 4 0 7 3 7 6Z" />
    <path d="M16 18c4 0 7-3 7-6-4 0-7 3-7 6Z" />
  </svg>
);

// 05. 트루자임 역할 — 균형 / 회복 시스템
export const IconBalance = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="16" r="11" />
    <path d="M16 5v22" />
    <path d="M11 11l10 10M21 11l-10 10" />
  </svg>
);

// 06. 브랜드 약속 — 핸드 + 케어
export const IconCare = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 27c-2-2-9-7-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-7 11-9 13Z" />
  </svg>
);

// ─── 4 강점 ───────────────────────────────────────

// 특허
export const IconPatent = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="13" r="6" />
    <path d="M12 18v9l4-2 4 2v-9" />
    <path d="M14 13l1.5 1.5L18 12" />
  </svg>
);

// 함량 — 비커 + 한계까지 채움
export const IconConcentration = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M11 4h10" />
    <path d="M12 4v6l-5 14a3 3 0 0 0 3 4h12a3 3 0 0 0 3-4l-5-14V4" />
    <path d="M9 18h14" />
  </svg>
);

// 안전성 — 잎
export const IconLeaf = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M27 5C13 5 5 13 5 25c8 0 14-2 18-6 4-4 6-9 4-14Z" />
    <path d="M14 18l8-8" />
  </svg>
);

// 메디컬 자문 — 십자
export const IconMedical = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="16" r="11" />
    <path d="M16 10v12M10 16h12" />
  </svg>
);

// ─── 4 적용 영역 ─────────────────────────────────

// 피부
export const IconFace = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 5c-5 0-9 5-9 12 0 6 4 10 9 10s9-4 9-10c0-7-4-12-9-12Z" />
    <path d="M12 14h.01M20 14h.01M13 20c1 1 2 1.5 3 1.5s2-.5 3-1.5" />
  </svg>
);

// 아토피 — 장벽 회복
export const IconBarrier = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 9h22v14H5z" />
    <path d="M5 14h7l3 3 3-3h9" />
    <path d="M5 18h22" />
  </svg>
);

// 두피 — 모근
export const IconScalp = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 18h22" />
    <path d="M9 18v-6c0-3 3-7 7-7s7 4 7 7v6" />
    <path d="M11 11v-2M16 9V6M21 11v-2" />
    <circle cx="16" cy="22" r="1" />
    <circle cx="11" cy="22" r="1" />
    <circle cx="21" cy="22" r="1" />
  </svg>
);

// 베이비 — 작은 새싹
export const IconBaby = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 27v-9" />
    <path d="M16 18c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
    <path d="M16 22c3 0 5-2 5-5-3 0-5 2-5 5Z" />
    <circle cx="16" cy="11" r="4" />
  </svg>
);

// ─── 제품 상세 — 약속 / 메커니즘 / 기술 ────────────

// 장벽 강화 — 방패
export const IconShield = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 4 6 8v8c0 6 4 10 10 12 6-2 10-6 10-12V8L16 4Z" />
  </svg>
);

// 보습 / 수분 — 물방울
export const IconDrop = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 4c-4 6-9 11-9 16a9 9 0 0 0 18 0c0-5-5-10-9-16Z" />
    <path d="M11 19a4 4 0 0 0 4 4" />
  </svg>
);

// 흡수 — 안쪽으로 향하는 화살표
export const IconAbsorb = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="16" r="6" />
    <path d="M5 5l5 5M27 5l-5 5M5 27l5-5M27 27l-5-5" />
    <path d="M10 10l-3-1 1 3M22 10l3-1-1 3M10 22l-3 1 1-3M22 22l3 1-1-3" />
  </svg>
);

// 환경 / 원자 — 궤도
export const IconAtom = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="16" r="2" />
    <ellipse cx="16" cy="16" rx="11" ry="4" />
    <ellipse cx="16" cy="16" rx="11" ry="4" transform="rotate(60 16 16)" />
    <ellipse cx="16" cy="16" rx="11" ry="4" transform="rotate(120 16 16)" />
  </svg>
);

// 발효 — 플라스크
export const IconFlask = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M11 4h10" />
    <path d="M13 4v9l-6 11a3 3 0 0 0 3 4h12a3 3 0 0 0 3-4l-6-11V4" />
    <path d="M9 19h14" />
    <circle cx="14" cy="22" r="0.5" />
    <circle cx="18" cy="24" r="0.5" />
  </svg>
);

// 나노 입자 — 점 무리
export const IconParticles = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="10" cy="10" r="2" />
    <circle cx="22" cy="10" r="1.5" />
    <circle cx="16" cy="16" r="1" />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="22" cy="22" r="2" />
    <circle cx="20" cy="6" r="1" />
    <circle cx="6" cy="16" r="1" />
    <circle cx="26" cy="16" r="1" />
    <circle cx="14" cy="24" r="1" />
  </svg>
);

// 진정 — 잔잔한 물결
export const IconCalm = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 12c3 0 3 2 6 2s3-2 6-2 3 2 6 2 3-2 4-2" />
    <path d="M5 18c3 0 3 2 6 2s3-2 6-2 3 2 6 2 3-2 4-2" />
    <path d="M5 24c3 0 3 1 6 1s3-1 6-1 3 1 6 1" />
  </svg>
);

// 미생물 — 박테리아 셰이프
export const IconMicrobe = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <ellipse cx="16" cy="16" rx="8" ry="6" />
    <path d="M8 16h-3M27 16h-3M16 8V5M16 27v-3" />
    <circle cx="13" cy="14" r="0.5" />
    <circle cx="19" cy="14" r="0.5" />
    <circle cx="14" cy="18" r="0.5" />
    <circle cx="19" cy="18" r="0.5" />
  </svg>
);

// 아미노산 / 분자
export const IconMolecule = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="9" cy="11" r="2.5" />
    <circle cx="23" cy="11" r="2.5" />
    <circle cx="9" cy="22" r="2.5" />
    <circle cx="23" cy="22" r="2.5" />
    <circle cx="16" cy="16" r="2.5" />
    <path d="M11 12l3 3M21 12l-3 3M11 21l3-3M21 21l-3-3" />
  </svg>
);

// 핵심 / 별
export const IconStar = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 4l3.5 8 8.5.8-6.5 5.7 2 8.5L16 22l-7.5 5 2-8.5L4 12.8l8.5-.8L16 4Z" />
  </svg>
);

// 한방 — 약초/잎 두 장
export const IconHerbs = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M16 28V12" />
    <path d="M16 18c-4 0-8-3-9-7 5-1 9 2 9 7Z" />
    <path d="M16 14c4-1 8-4 9-8-5-1-9 3-9 8Z" />
    <path d="M16 22c-3 0-6-2-7-5 4-1 7 1 7 5Z" />
  </svg>
);

// 자연 유래 — 손에 잎
export const IconNature = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 22c5-2 9-2 13 0M5 22v-2M5 22l-1 4" />
    <path d="M22 16c4-2 6-7 5-12-5-1-10 2-12 6" />
    <path d="M16 16l8-8" />
  </svg>
);

// 무첨가 — X / 금지
export const IconNoChem = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="16" cy="16" r="11" />
    <path d="M9 9l14 14" />
  </svg>
);

// 거품 / 계면활성제
export const IconBubble = ({ size = 32, className }: IconProps) => (
  <svg {...baseProps(size, className)}>
    <circle cx="11" cy="20" r="6" />
    <circle cx="21" cy="14" r="4" />
    <circle cx="22" cy="22" r="3" />
    <circle cx="9" cy="11" r="2" />
  </svg>
);
