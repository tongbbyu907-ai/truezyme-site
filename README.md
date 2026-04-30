# Truezyme Site

트루자임 브랜드 홈페이지 + 관리자 페이지 (Next.js 15 · TypeScript · Tailwind · Supabase).

## 사이트 구조

- **공개**: 홈 / 브랜드 스토리 / 브랜드 라인업(트루자임/바당쉬 등) / 제품 상세 / 이벤트 / 커뮤니티
- **관리자(`/admin`)**: 브랜드(카테고리) · 제품 타입(특성) · 제품 · 이벤트 · FAQ CRUD + 이미지 업로드

## 1. 설치

```bash
npm install
```

## 2. Supabase 프로젝트 만들기

1. https://supabase.com 가입 → **New Project**
2. 비밀번호 설정 후 프로젝트 생성 (몇 분 소요)
3. 좌측 **SQL Editor** → New Query → `supabase/schema.sql` 내용 전체 붙여넣고 **RUN**
4. **Storage** → New bucket → 이름 `product-images`, **Public** 체크 → 생성

## 3. 환경변수 설정

`.env.example`을 `.env.local`로 복사:

```bash
cp .env.example .env.local
```

값 채우기:

| 변수 | 어디서 가져오나 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 같은 페이지의 anon `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | 같은 페이지의 service_role `secret` key (⚠️ 외부 공개 금지) |
| `ADMIN_EMAIL` | 관리자 로그인 ID (이메일 형식) |
| `ADMIN_PASSWORD_HASH` | 아래 명령으로 생성 |
| `SESSION_SECRET` | 아래 명령으로 생성 |

비밀번호 해시 생성:
```bash
node -e "console.log(require('bcryptjs').hashSync('내가정할비번', 10))"
```

세션 시크릿 생성:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 4. 실행

```bash
npm run dev
```

- 공개 사이트: http://localhost:3000
- 관리자 로그인: http://localhost:3000/admin/login

## 폴더

```
src/
├─ app/                  # Next.js App Router
│  ├─ page.tsx           # 홈
│  ├─ brands/[slug]/     # 브랜드 라인업 페이지
│  ├─ products/[id]/     # 제품 상세
│  └─ admin/             # 관리자
├─ components/           # UI 컴포넌트
├─ lib/
│  ├─ supabase/          # client / server 헬퍼
│  └─ auth.ts            # 단일 관리자 세션
└─ types/database.ts     # DB 타입
```

## 배포

Vercel 권장. GitHub 연동 → 환경변수 동일하게 설정 → 자동 배포.
