-- ============================================================
-- Truezyme — Database Schema
-- 실행: Supabase Dashboard > SQL Editor에 붙여넣고 RUN
-- ============================================================

-- 1. BRANDS (브랜드 카테고리: 트루자임, 바당쉬, 피토제닉, 루미노셀, 클로아 …)
create table if not exists brands (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name_ko         text not null,
  name_en         text,
  concept         text,                     -- 한 줄 컨셉 (e.g. "Pure & Premium Marine Skincare from Nature")
  description     text,                     -- 본문 설명
  cover_image     text,                     -- Supabase Storage URL
  color_primary   text default '#2A5F58',   -- 브랜드별 액센트
  display_order   int default 0,
  is_published    boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 2. PRODUCT TYPES (브랜드 안의 특성/카테고리: Hair&Scalp, SKIN, Body, 토너, 세럼 …)
create table if not exists product_types (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid not null references brands(id) on delete cascade,
  slug            text not null,
  name_ko         text not null,
  name_en         text,
  display_order   int default 0,
  created_at      timestamptz default now(),
  unique(brand_id, slug)
);

-- 3. PRODUCTS (개별 제품)
create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  brand_id          uuid not null references brands(id) on delete cascade,
  product_type_id   uuid references product_types(id) on delete set null,
  slug              text not null,
  name_ko           text not null,
  name_en           text,
  short_description text,
  description       text,                   -- 상세 페이지 본문
  usage             text,                   -- 사용법
  ingredients       text,                   -- 전성분
  price             int,                    -- KRW
  volume            text,                   -- "300ml" 등
  tag               text,                   -- BEST / NEW / PREMIUM …
  main_image        text,
  gallery_images    text[] default '{}',
  is_published      boolean default true,
  display_order     int default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique(brand_id, slug)
);

-- 4. EVENTS (이벤트/혜택)
create table if not exists events (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  subtitle        text,
  description     text,
  cover_image     text,
  start_date      date,
  end_date        date,
  link            text,
  display_order   int default 0,
  is_published    boolean default true,
  created_at      timestamptz default now()
);

-- 5. FAQS (커뮤니티 Q&A)
create table if not exists faqs (
  id              uuid primary key default gen_random_uuid(),
  question        text not null,
  answer          text,
  category        text,                     -- 제품 / 배송 / 멤버십 등
  display_order   int default 0,
  is_published    boolean default true,
  created_at      timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table brands         enable row level security;
alter table product_types  enable row level security;
alter table products       enable row level security;
alter table events         enable row level security;
alter table faqs           enable row level security;

-- 공개 조회 (관리자 작성은 service_role 키로 RLS 우회)
drop policy if exists "public read brands"        on brands;
drop policy if exists "public read product_types" on product_types;
drop policy if exists "public read products"      on products;
drop policy if exists "public read events"        on events;
drop policy if exists "public read faqs"          on faqs;

create policy "public read brands"        on brands        for select using (is_published = true);
create policy "public read product_types" on product_types for select using (true);
create policy "public read products"      on products      for select using (is_published = true);
create policy "public read events"        on events        for select using (is_published = true);
create policy "public read faqs"          on faqs          for select using (is_published = true);

-- ============================================================
-- updated_at 자동 갱신 트리거
-- ============================================================
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_brands_updated   on brands;
drop trigger if exists trg_products_updated on products;

create trigger trg_brands_updated   before update on brands   for each row execute function set_updated_at();
create trigger trg_products_updated before update on products for each row execute function set_updated_at();

-- ============================================================
-- 시드 데이터 (트루자임 + 바당쉬)
-- ============================================================
insert into brands (slug, name_ko, name_en, concept, color_primary, display_order) values
  ('truezyme', '트루자임', 'Truezyme',  'Personal Care · 럭셔리 스킨케어 · 피토제니카 90%+', '#2A5F58', 1),
  ('badangshi','바당쉬',   'Badangshi', 'Pure & Premium Marine Skincare from Nature',          '#3E6D75', 2)
on conflict (slug) do nothing;

-- 트루자임 product_types
with b as (select id from brands where slug = 'truezyme')
insert into product_types (brand_id, slug, name_ko, name_en, display_order)
select b.id, t.slug, t.ko, t.en, t.ord
from b, (values
  ('hair-scalp','헤어 & 스칼프','Hair & Scalp Care', 1),
  ('skin',      '스킨',         'SKIN',              2),
  ('body',      '바디',         'Body',              3),
  ('feminine',  '페미닌',       'Feminine',          4),
  ('baby',      '베이비',       'Baby',              5),
  ('sports',    '스포츠',       'Golf · Sports',     6),
  ('whitening', '화이트닝',     'Whitening Care',    7),
  ('sunscreen', '선스크린',     'Sun Screen',        8)
) as t(slug, ko, en, ord)
on conflict do nothing;

-- 바당쉬 product_types
with b as (select id from brands where slug = 'badangshi')
insert into product_types (brand_id, slug, name_ko, name_en, display_order)
select b.id, t.slug, t.ko, t.en, t.ord
from b, (values
  ('toner',   '토너',     'Toner',          1),
  ('serum',   '세럼',     'Serum',          2),
  ('essence', '에센스',   'Essence',        3),
  ('cream',   '크림',     'Moisturizer',    4),
  ('vitc',    '비타민C',  'Vitamin C Cream',5),
  ('sun',     '선크림',   'Sun Care',       6),
  ('peeling', '각질제거', 'Peeling',        7)
) as t(slug, ko, en, ord)
on conflict do nothing;
