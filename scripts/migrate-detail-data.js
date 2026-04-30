// Phase 1 마이그레이션: TS 파일의 트루자임 3제품 리치 데이터를 DB의 detail_data 컬럼으로 이전
// 사전 조건: ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_data jsonb; 실행 완료
// 실행: node scripts/migrate-detail-data.js

const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const fs = require("fs");

// .env.local 직접 파싱 (dotenv 의존 회피)
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) process.env[m[1]] = m[2];
});

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// truezyme-products.ts 의 데이터를 JS 형태로 그대로 복사 (한 번 사용)
const SHAMPOO_DIR = "/photos/shampoo/";
const TONIC_DIR = "/photos/scalp-tonic/";
const MULTI_DIR = "/photos/multi-tonic/";
const img = (d, n) => `${d}${n}`;

const PRODUCTS = [
  {
    slug: "active-enzyme-shampoo",
    productName: ["트루자임 액티브 엔자임", "볼륨 앤 스칼프 샴푸"],
    smallCopy: "두피 생태계를 설계하는 프리미엄 샴푸 케어",
    bigCopy: "뿌리부터 살아나는 두피 자생력",
    tagline: "두피 본연의 균형을 되찾는 첫걸음",
    hero: {
      image: img(SHAMPOO_DIR, "Gemini_Generated_Image_5phney5phney5phn.png"),
      secondaryImage: img(SHAMPOO_DIR, "Gemini_Generated_Image_2pq9on2pq9on2pq9.png"),
      gallery: [
        img(SHAMPOO_DIR, "Gemini_Generated_Image_5phney5phney5phn.png"),
        img(SHAMPOO_DIR, "Gemini_Generated_Image_2pq9on2pq9on2pq9.png"),
        img(SHAMPOO_DIR, "Gemini_Generated_Image_uaymecuaymecuaym.png"),
        img(SHAMPOO_DIR, "Gemini_Generated_Image_glw1v3glw1v3glw1.png"),
      ],
    },
    hashtags: ["#두피자생력", "#PhytoGenica30", "#볼륨케어", "#무자극"],
    stats: [
      { value: "95.7%", label: "조밀한 거품", sub: "세정력 만족도" },
      { value: "0.00", label: "피부 자극 테스트", sub: "무자극 판정" },
      { value: "97%", label: "걱정 없는", sub: "자연 유래 성분" },
      { value: "30%", label: "PhytoGenica™", sub: "최대 함유" },
    ],
    productHero: { heading: "두피 본연의 균형을 되찾는 첫걸음", image: img(SHAMPOO_DIR, "Gemini_Generated_Image_uaymecuaymecuaym.png") },
    painPoints: {
      title: "무너진 두피 생태계, 혹시 내 이야기라면",
      items: [
        "아침에 감아도 오후면 떡지고 냄새가 올라와요.",
        "펌이랑 염색을 자주해서 두피가 붉고 예민해졌어요.",
        "모발이 점점 가늘어지고, 뿌리 볼륨 없이 축 처져요.",
        "샴푸 후에도 가려워서 무의식적으로 긁게 돼요.",
        "탈모 샴푸는 독하다던데, 자극이 걱정돼요.",
      ],
      cta: "단순한 '세정'을 멈추고 '두피 케어'를 시작할 때",
    },
    test: {
      title: "사용 전 · 후 변화",
      metrics: [
        { value: "95.7%", label: "두피 세정 만족도" },
        { value: "82.6%", label: "두피 진정 만족도" },
        { value: "91.3%", label: "두피 진정" },
      ],
      note: "* 자체 사용성 평가 결과. 사용자에 따라 개인차가 있습니다.",
    },
    point1: {
      pct: "30%",
      title: "제형 유지의 한계치, PhytoGenica™ 30% 함유",
      description: "특허받은 발효 원액 PhytoGenica™를 샴푸의 세정력과 텍스처 안정성을 지키는 최대치인 30%로 꽉 채웠습니다. 무늬만 발효인 컨셉 성분과는 다릅니다.",
      sub: { title: "모공보다 작은 미세 입자, 깊은 흡수와 두피 케어", description: "미세한 발효 영양분이 두피 깊숙이 스며들어 두피의 유분과 냄새를 말끔하게 지웁니다." },
    },
    point2: { description: "제주의 자연이 오랜 시간 머금어 미네랄이 풍부한 제주 용암해수가 균형 잡힌 두피 환경을 만들어줍니다." },
    point3: {
      description: "한의학 박사의 전문 처방을 더하여 15종의 엄선된 원료가 예민한 두피를 진정시킵니다.",
      coreIngredients: ["어성초 — 두피 보습 효과", "동충하초 — 두피 진정 효과", "다시마 — 두피 영양 공급"],
      jejuIngredients: ["귤피", "알로에베라잎", "동백꽃", "녹차", "연꽃"],
      herbalIngredients: ["감초", "대추", "하수오", "침당귀"],
    },
    point4: {
      description: "두피에 부담을 주는 성분은 비우고 꼭 필요한 성분만 남겼습니다.",
      badges: ["전성분 EWG All Green 등급 (2018년 기준)", "100% 자연 유래 계면활성제", "자연 유래 성분 95.6% 함유", "실리콘 · 파라벤 무첨가"],
    },
    closing: { heading: "쫀쫀한 미세 거품과 청량한 쿨링감", description: "미세 거품이 시원한 청량감과 살아난 뿌리 볼륨을 선사합니다.", image: img(SHAMPOO_DIR, "Gemini_Generated_Image_glw1v3glw1v3glw1.png") },
  },
  {
    slug: "active-enzyme-scalp-tonic",
    productName: ["트루자임 액티브 엔자임", "스칼프 토닉"],
    smallCopy: "진한 발효 에너지로 가득 채우는 두피 영양",
    bigCopy: "두피에 차오르는 깊은 생명력",
    tagline: "두피에 스며드는 진한 자생 에너지",
    hero: {
      image: img(TONIC_DIR, "Gemini_Generated_Image_aluugqaluugqaluu.png"),
      secondaryImage: img(TONIC_DIR, "Gemini_Generated_Image_qtvupyqtvupyqtvu.png"),
      gallery: [
        img(TONIC_DIR, "Gemini_Generated_Image_aluugqaluugqaluu.png"),
        img(TONIC_DIR, "Gemini_Generated_Image_qtvupyqtvupyqtvu.png"),
        img(TONIC_DIR, "Gemini_Generated_Image_iue4l1iue4l1iue4.png"),
        img(TONIC_DIR, "Gemini_Generated_Image_2ilp2v2ilp2v2ilp.png"),
      ],
    },
    hashtags: ["#두피자생력", "#PhytoGenica90", "#탈모방지특허", "#청량케어"],
    stats: [
      { value: "CERT", label: "탈모 방지 및", sub: "발모 촉진 특허" },
      { value: "0.00", label: "피부 자극 테스트", sub: "무자극 판정" },
      { value: "CLEAN", label: "떡짐 없이", sub: "산뜻한 청량감" },
      { value: "90%", label: "PhytoGenica™", sub: "최대 함유" },
    ],
    productHero: { heading: "두피에 스며드는 진한 자생 에너지", image: img(TONIC_DIR, "Gemini_Generated_Image_iue4l1iue4l1iue4.png") },
    painPoints: {
      title: "메마르고 지친 두피, 지금 내 이야기라면",
      items: [
        "오후만 되면 냄새가 신경 쓰여 향수를 뿌려요.",
        "두피에 열감이 훅 오르고 붉어지고 가려워요.",
        "모발이 가늘어지고 빠지는 양이 늘었어요.",
        "토닉 쓰면 머리가 떡져서 안 쓰게 되더라고요.",
        "잦은 염색과 펌으로 두피가 메말랐어요.",
      ],
      cta: "일시적인 영양이 아닌, 환경부터 바꿔주세요",
    },
    test: {
      title: "1주 사용 후 편안해진 두피",
      metrics: [
        { value: "28%", label: "두피 & 모발 수분 증가" },
        { value: "0.4℃", label: "즉각적인 두피 열 감소" },
        { value: "↑", label: "각질 개선" },
        { value: "↑", label: "두피 환경 개선" },
      ],
      note: "* 트루자임 스칼프 토닉을 1주 사용 후 자체 테스트한 결과입니다. 사용자에 따라 개인차가 있습니다.",
    },
    point1: {
      pct: "90%",
      title: "근본적인 두피 집중 케어, PhytoGenica™ 90% 함유",
      description: "트루자임만의 독자 발효 원액 PhytoGenica™를 정제수 대신 90% 채워, 약해진 두피 장벽을 탄탄하게 만듭니다.",
      sub: { title: "모공 깊숙이 침투하여 산뜻하게 스며드는 흡수력", description: "모공보다 작은 크기의 영양분이 두피 깊숙이 스며들어 열감을 다스리고 냄새를 말끔하게 케어합니다." },
    },
    point2: { description: "미네랄이 풍부한 제주의 용암해수가 메마르고 붉어진 두피에 깊은 수분 에너지를 채워줍니다." },
    point3: {
      description: "의학, 한의학 전문가의 배합 노하우로 엄선된 15종의 원료가 두피의 자생력을 깨워줍니다.",
      coreIngredients: ["어성초 — 두피 보습 효과", "동충하초 — 두피 진정 효과", "다시마 — 두피 영양 공급"],
      jejuIngredients: ["귤피", "알로에베라잎", "동백꽃", "녹차"],
      herbalIngredients: ["감초 뿌리", "대추", "하수오", "동충하초", "침당귀"],
      extraIngredients: { label: "추가 핵심 원료", items: ["연꽃 — 두피 정화 & 활력 부여", "돌콩배아 — 두피 영양 공급"] },
    },
    point4: {
      description: "불필요한 자극 요소는 덜어내고 안심할 수 있는 성분만 담았습니다.",
      badges: ["전성분 EWG All Green 등급 (2018년 기준)", "자연 유래 성분 95.6% 함유", "실리콘 · 파라벤 무첨가"],
      extraNote: "한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정",
    },
    closing: { heading: "간편하게 바르는, 가볍고 촉촉한 워터 제형", description: "가볍고 촉촉한 워터 제형으로 수시로 발라도 모발이 뭉치거나 기름지지 않습니다.", image: img(TONIC_DIR, "Gemini_Generated_Image_2ilp2v2ilp2v2ilp.png") },
  },
  {
    slug: "water-lock-multi-tonic",
    productName: ["트루자임 워터락 엔자임", "스킨카밍 멀티 토닉"],
    smallCopy: "메마른 피부를 촉촉하게, 3초 수분 잠금 토닉",
    bigCopy: "3초 만에 깨어나는 수분 자생력",
    tagline: "메마른 피부에 내려앉은, 마르지 않는 수분막",
    hero: {
      image: img(MULTI_DIR, "Gemini_Generated_Image_kwzi5rkwzi5rkwzi.png"),
      secondaryImage: img(MULTI_DIR, "Gemini_Generated_Image_2liacl2liacl2lia.png"),
      gallery: [
        img(MULTI_DIR, "Gemini_Generated_Image_kwzi5rkwzi5rkwzi.png"),
        img(MULTI_DIR, "Gemini_Generated_Image_apvv0rapvv0rapvv.png"),
        img(MULTI_DIR, "Gemini_Generated_Image_2liacl2liacl2lia.png"),
      ],
    },
    hashtags: ["#수분잠금", "#PhytoGenica94", "#3초속보습", "#민감피부"],
    stats: [
      { value: "94.5%", label: "1회 사용 후", sub: "피부 수분량 증가" },
      { value: "0.00", label: "피부 자극 테스트", sub: "무자극 판정" },
      { value: "94.5%", label: "PhytoGenica™", sub: "최대 함유" },
    ],
    productHero: { heading: "메마른 피부에 내려앉은, 마르지 않는 수분막", image: img(MULTI_DIR, "Gemini_Generated_Image_apvv0rapvv0rapvv.png") },
    painPoints: {
      title: "아무리 채워도 메마른다면, 원인은 무너진 환경",
      items: [
        "세안 직후 피부가 찢어질 듯 당기고 건조해요.",
        "조금만 피곤해도 피부에 열이 오르고 붉어져요.",
        "화장품을 아무리 덧발라도 속당김이 해결되지 않아요.",
        "냉난방기 바람에 피부가 푸석하고 거칠어졌어요.",
        "온 가족이 안심하고 쓸 수 있는 순한 제품이 필요해요.",
      ],
      cta: "단순한 보습이 아닌, 수분 잠금이 필요할 때",
    },
    test: {
      title: "뿌리자마자 증명되는 수분 잠금 효과",
      metrics: [{ value: "94.5%", label: "피부 수분량 증가" }],
      note: "* 1회 사용 후 자체 테스트 결과. 사용자에 따라 개인차가 있습니다.",
    },
    point1: {
      pct: "94%",
      title: "정제수 대신 채운 영양, PhytoGenica™ 94% 함유",
      description: "정제수 대신 특허받은 발효 원액으로 94%를 꽉 채워, 약해진 피부 장벽을 탄탄하게 만들어 줍니다.",
      sub: { title: "메이크업 위 뭉침 제로, 미세 입자가 채우는 속보습", description: "모공보다 작은 크기의 입자로 메이크업 위에도 뭉침 없이 피부 깊숙이 수분을 채워줍니다." },
    },
    point2: { description: "제주 자연이 오랜 시간 담아낸 미네랄을 품은 용암해수가 자극받아 붉게 달아오른 피부 온도를 낮추고 생기를 부여합니다." },
    point3: {
      description: "의학, 한의학 전문가의 자문을 거쳐 엄선된 15가지 원료가 자극받은 피부 장벽을 진정시킵니다.",
      coreIngredients: ["귤피", "동백꽃", "녹차", "다시마"],
      jejuIngredients: ["귤피", "동백꽃", "녹차", "다시마"],
      herbalIngredients: ["감초 뿌리", "천궁 뿌리", "모란 뿌리", "쑥잎", "침당귀 뿌리"],
      extraIngredients: { label: "식물성 부스터", items: ["라벤더오일", "브로콜리싹", "편백오일", "돌콩배아"] },
    },
    point4: {
      description: "피부에 부담되는 자극 요소를 비워, 민감해도 안심하고 사용할 수 있습니다.",
      badges: ["전성분 EWG All Green 등급 (2018년 기준)", "자연 유래 성분 95.6% 함유", "실리콘 · 파라벤 무첨가"],
      extraNote: "한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정",
    },
    closing: { heading: "수분을 빈틈없이 가두는, 산뜻한 갈색빛 보습막", description: "맑은 갈색빛을 띠는 가벼운 워터 제형이 끈적임 없이 스며들어 쫀쫀한 수분 잠금막을 형성합니다.", image: img(MULTI_DIR, "Gemini_Generated_Image_2liacl2liacl2lia.png") },
  },
];

(async () => {
  for (const p of PRODUCTS) {
    const { data, error } = await sb
      .from("products")
      .update({ detail_data: p })
      .eq("slug", p.slug)
      .select("slug");

    if (error) {
      if (error.message.includes("detail_data")) {
        console.error("\n❌ detail_data 컬럼이 없습니다. Supabase SQL Editor에서 먼저 실행:");
        console.error("    ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_data jsonb;\n");
        process.exit(1);
      }
      console.error(`❌ ${p.slug}: ${error.message}`);
    } else if (data?.length) {
      console.log(`✅ ${p.slug}`);
    } else {
      console.warn(`⚠️  ${p.slug}: 매칭되는 row 없음`);
    }
  }
  console.log("\nDone.");
})();
