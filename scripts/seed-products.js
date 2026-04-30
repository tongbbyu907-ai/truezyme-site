// 트루자임 3개 제품 시드
// 실행: node scripts/seed-products.js
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("환경변수 없음"); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });

(async () => {
  // 트루자임 brand
  const { data: brand } = await sb.from("brands").select("id").eq("slug", "truezyme").single();
  if (!brand) { console.error("트루자임 브랜드 없음. schema.sql 먼저 실행하세요."); process.exit(1); }

  // type IDs
  const { data: types } = await sb.from("product_types").select("id, slug").eq("brand_id", brand.id);
  const typeBy = Object.fromEntries((types || []).map(t => [t.slug, t.id]));

  const products = [
    {
      brand_id: brand.id,
      product_type_id: typeBy["hair-scalp"],
      slug: "active-enzyme-shampoo",
      name_ko: "액티브 엔자임 볼륨 앤 스칼프 샴푸",
      name_en: "Active Enzyme Volume & Scalp Shampoo",
      short_description: "뿌리부터 살아나는 두피 자생력. PhytoGenica™ 30% 함유 프리미엄 두피 케어 샴푸.",
      description: `두피 생태계를 설계하는 프리미엄 샴푸 케어.

특허받은 발효 원액 PhytoGenica™를 샴푸의 세정력과 텍스처 안정성을 지키는 최대치인 30%로 꽉 채웠습니다. 미세한 발효 영양분이 두피 깊숙이 스며들어 두피의 유분과 냄새를 말끔하게 지웁니다.

· 95.7% 두피 세정 만족도
· 0.00 자극도 (무자극 판정)
· 97% 자연 유래 성분
· 30% PhytoGenica™ 최대 함유`,
      usage: `1. 충분히 적신 모발에 적량을 덜어 손바닥에서 가볍게 거품을 냅니다.
2. 두피와 모발에 부드럽게 마사지하듯 도포해주세요.
3. 미온수로 깨끗이 헹궈주세요.`,
      ingredients: `전성분 EWG All Green 등급 (2018년 기준)
100% 자연 유래 계면활성제
자연 유래 성분 95.6% 함유
실리콘 · 파라벤 무첨가

핵심 한방 원료: 어성초, 동충하초, 다시마
제주 자연 원료: 귤피, 알로에베라잎, 동백꽃, 녹차, 연꽃
한방 원료: 감초, 대추, 하수오, 침당귀`,
      price: 45000,
      volume: "250ml",
      tag: "BESTSELLER",
      main_image: "/photos/shampoo/Gemini_Generated_Image_5phney5phney5phn.png",
      is_published: true,
      display_order: 1,
    },
    {
      brand_id: brand.id,
      product_type_id: typeBy["hair-scalp"],
      slug: "active-enzyme-scalp-tonic",
      name_ko: "액티브 엔자임 스칼프 토닉",
      name_en: "Active Enzyme Scalp Tonic",
      short_description: "두피에 차오르는 깊은 생명력. PhytoGenica™ 90% 함유, 한·미 탈모 방지·발모 촉진 특허.",
      description: `진한 발효 에너지로 가득 채우는 두피 영양.

트루자임만의 독자 발효 원액 PhytoGenica™를 정제수 대신 90% 채워, 약해진 두피 장벽을 탄탄하게 만듭니다. 모공보다 작은 크기의 영양분이 두피 깊숙이 스며들어 열감을 다스리고 냄새를 말끔하게 케어합니다.

· 한·미 탈모 방지 · 발모 촉진 특허
· 0.00 자극도 (무자극 판정)
· 떡짐 없이 산뜻한 청량감
· 90% PhytoGenica™ 최대 함유

[1주 사용 후]
두피 & 모발 수분 28% 증가 · 두피 열 0.4°C 감소 · 각질 개선 · 두피 환경 개선`,
      usage: `1. 샴푸 후 타월 드라이한 두피에 직접 분사합니다.
2. 두피 전체에 골고루 마사지하듯 흡수시킵니다.
3. 헹구지 않고 자연 건조하면 됩니다. 매일 1-2회 사용 권장.`,
      ingredients: `전성분 EWG All Green 등급 (2018년 기준)
자연 유래 성분 95.6% 함유
실리콘 · 파라벤 무첨가
한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정

핵심 한방 원료: 어성초, 동충하초, 다시마
추가 핵심: 연꽃 (두피 정화), 돌콩배아 (두피 영양)
제주 자연 원료: 귤피, 알로에베라잎, 동백꽃, 녹차
한방 원료: 감초 뿌리, 대추, 하수오, 동충하초, 침당귀`,
      price: 58000,
      volume: "100ml",
      tag: "PATENT",
      main_image: "/photos/scalp-tonic/Gemini_Generated_Image_aluugqaluugqaluu.png",
      is_published: true,
      display_order: 2,
    },
    {
      brand_id: brand.id,
      product_type_id: typeBy["skin"],
      slug: "water-lock-multi-tonic",
      name_ko: "워터락 엔자임 스킨카밍 멀티 토닉",
      name_en: "Water Lock Enzyme Skin Calming Multi Tonic",
      short_description: "3초 만에 깨어나는 수분 자생력. 정제수 대신 PhytoGenica™ 94%로 채운 멀티 토닉.",
      description: `메마른 피부를 촉촉하게, 3초 수분 잠금 토닉.

정제수 대신 특허받은 발효 원액으로 94%를 꽉 채워, 약해진 피부 장벽을 탄탄하게 만들어 줍니다. 모공보다 작은 크기의 입자로 메이크업 위에도 뭉침 없이 피부 깊숙이 수분을 채워줍니다.

· 94.5% 1회 사용 후 피부 수분량 증가
· 0.00 자극도 (무자극 판정)
· 94.5% PhytoGenica™ 최대 함유

맑은 갈색빛을 띠는 가벼운 워터 제형이 끈적임 없이 스며들어 쫀쫀한 수분 잠금막을 형성합니다.`,
      usage: `1. 세안 후 피부에 적당량을 분사하거나 손에 덜어 도포합니다.
2. 메이크업 위에도 뭉침 없이 사용 가능합니다.
3. 수시로 덧발라 수분을 보충해주세요.`,
      ingredients: `전성분 EWG All Green 등급 (2018년 기준)
자연 유래 성분 95.6% 함유
실리콘 · 파라벤 무첨가
한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정

제주 자연 원료: 귤피, 동백꽃, 녹차, 다시마
한방 원료: 감초 뿌리, 천궁 뿌리, 모란 뿌리, 쑥잎, 침당귀 뿌리
식물성 부스터: 라벤더오일, 브로콜리싹, 편백오일, 돌콩배아`,
      price: 52000,
      volume: "100ml",
      tag: "NEW",
      main_image: "/photos/multi-tonic/Gemini_Generated_Image_kwzi5rkwzi5rkwzi.png",
      is_published: true,
      display_order: 3,
    },
  ];

  for (const p of products) {
    // upsert by (brand_id, slug)
    const { error } = await sb.from("products").upsert(p, { onConflict: "brand_id,slug" });
    if (error) {
      console.error("❌", p.slug, error.message);
    } else {
      console.log("✅", p.slug);
    }
  }
  console.log("Done.");
})();
