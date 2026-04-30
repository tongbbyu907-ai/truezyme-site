-- ============================================================
-- 트루자임 3개 제품 시드
-- 실행: Supabase SQL Editor에 붙여넣고 RUN
-- (이미 schema.sql 실행해서 brands + product_types가 있어야 함)
-- ============================================================

-- 트루자임 브랜드 + Hair&Scalp / SKIN 타입 ID 가져오기
do $$
declare
  v_brand_id     uuid;
  v_type_hair    uuid;
  v_type_skin    uuid;
begin
  select id into v_brand_id from brands where slug = 'truezyme';
  select id into v_type_hair from product_types where brand_id = v_brand_id and slug = 'hair-scalp';
  select id into v_type_skin from product_types where brand_id = v_brand_id and slug = 'skin';

  -- 1. 액티브 엔자임 볼륨 앤 스칼프 샴푸
  insert into products (
    brand_id, product_type_id, slug, name_ko, name_en,
    short_description, description, usage, ingredients,
    price, volume, tag, main_image, is_published, display_order
  ) values (
    v_brand_id, v_type_hair, 'active-enzyme-shampoo',
    '액티브 엔자임 볼륨 앤 스칼프 샴푸',
    'Active Enzyme Volume & Scalp Shampoo',
    '뿌리부터 살아나는 두피 자생력. PhytoGenica™ 30% 함유 프리미엄 두피 케어 샴푸.',
    E'두피 생태계를 설계하는 프리미엄 샴푸 케어.\n\n특허받은 발효 원액 PhytoGenica™를 샴푸의 세정력과 텍스처 안정성을 지키는 최대치인 30%로 꽉 채웠습니다. 미세한 발효 영양분이 두피 깊숙이 스며들어 두피의 유분과 냄새를 말끔하게 지웁니다.\n\n· 95.7% 두피 세정 만족도\n· 0.00 자극도 (무자극 판정)\n· 97% 자연 유래 성분\n· 30% PhytoGenica™ 최대 함유',
    E'1. 충분히 적신 모발에 적량을 덜어 손바닥에서 가볍게 거품을 냅니다.\n2. 두피와 모발에 부드럽게 마사지하듯 도포해주세요.\n3. 미온수로 깨끗이 헹궈주세요.',
    E'전성분 EWG All Green 등급 (2018년 기준)\n100% 자연 유래 계면활성제\n자연 유래 성분 95.6% 함유\n실리콘 · 파라벤 무첨가\n\n핵심 한방 원료: 어성초, 동충하초, 다시마\n제주 자연 원료: 귤피, 알로에베라잎, 동백꽃, 녹차, 연꽃\n한방 원료: 감초, 대추, 하수오, 침당귀',
    45000, '250ml', 'BESTSELLER',
    '/photos/shampoo/Gemini_Generated_Image_5phney5phney5phn.png',
    true, 1
  )
  on conflict (brand_id, slug) do update set
    main_image    = excluded.main_image,
    short_description = excluded.short_description,
    description   = excluded.description,
    usage         = excluded.usage,
    ingredients   = excluded.ingredients,
    price         = excluded.price,
    volume        = excluded.volume,
    tag           = excluded.tag,
    product_type_id = excluded.product_type_id;

  -- 2. 액티브 엔자임 스칼프 토닉
  insert into products (
    brand_id, product_type_id, slug, name_ko, name_en,
    short_description, description, usage, ingredients,
    price, volume, tag, main_image, is_published, display_order
  ) values (
    v_brand_id, v_type_hair, 'active-enzyme-scalp-tonic',
    '액티브 엔자임 스칼프 토닉',
    'Active Enzyme Scalp Tonic',
    '두피에 차오르는 깊은 생명력. PhytoGenica™ 90% 함유, 한·미 탈모 방지·발모 촉진 특허.',
    E'진한 발효 에너지로 가득 채우는 두피 영양.\n\n트루자임만의 독자 발효 원액 PhytoGenica™를 정제수 대신 90% 채워, 약해진 두피 장벽을 탄탄하게 만듭니다. 모공보다 작은 크기의 영양분이 두피 깊숙이 스며들어 열감을 다스리고 냄새를 말끔하게 케어합니다.\n\n· 한·미 탈모 방지 · 발모 촉진 특허\n· 0.00 자극도 (무자극 판정)\n· 떡짐 없이 산뜻한 청량감\n· 90% PhytoGenica™ 최대 함유\n\n[1주 사용 후]\n두피 & 모발 수분 28% 증가 · 두피 열 0.4°C 감소 · 각질 개선 · 두피 환경 개선',
    E'1. 샴푸 후 타월 드라이한 두피에 직접 분사합니다.\n2. 두피 전체에 골고루 마사지하듯 흡수시킵니다.\n3. 헹구지 않고 자연 건조하면 됩니다. 매일 1-2회 사용 권장.',
    E'전성분 EWG All Green 등급 (2018년 기준)\n자연 유래 성분 95.6% 함유\n실리콘 · 파라벤 무첨가\n한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정\n\n핵심 한방 원료: 어성초, 동충하초, 다시마\n추가 핵심: 연꽃 (두피 정화), 돌콩배아 (두피 영양)\n제주 자연 원료: 귤피, 알로에베라잎, 동백꽃, 녹차\n한방 원료: 감초 뿌리, 대추, 하수오, 동충하초, 침당귀',
    58000, '100ml', 'PATENT',
    '/photos/scalp-tonic/Gemini_Generated_Image_aluugqaluugqaluu.png',
    true, 2
  )
  on conflict (brand_id, slug) do update set
    main_image    = excluded.main_image,
    short_description = excluded.short_description,
    description   = excluded.description,
    usage         = excluded.usage,
    ingredients   = excluded.ingredients,
    price         = excluded.price,
    volume        = excluded.volume,
    tag           = excluded.tag,
    product_type_id = excluded.product_type_id;

  -- 3. 워터락 엔자임 스킨카밍 멀티 토닉
  insert into products (
    brand_id, product_type_id, slug, name_ko, name_en,
    short_description, description, usage, ingredients,
    price, volume, tag, main_image, is_published, display_order
  ) values (
    v_brand_id, v_type_skin, 'water-lock-multi-tonic',
    '워터락 엔자임 스킨카밍 멀티 토닉',
    'Water Lock Enzyme Skin Calming Multi Tonic',
    '3초 만에 깨어나는 수분 자생력. 정제수 대신 PhytoGenica™ 94%로 채운 멀티 토닉.',
    E'메마른 피부를 촉촉하게, 3초 수분 잠금 토닉.\n\n정제수 대신 특허받은 발효 원액으로 94%를 꽉 채워, 약해진 피부 장벽을 탄탄하게 만들어 줍니다. 모공보다 작은 크기의 입자로 메이크업 위에도 뭉침 없이 피부 깊숙이 수분을 채워줍니다.\n\n· 94.5% 1회 사용 후 피부 수분량 증가\n· 0.00 자극도 (무자극 판정)\n· 94.5% PhytoGenica™ 최대 함유\n\n맑은 갈색빛을 띠는 가벼운 워터 제형이 끈적임 없이 스며들어 쫀쫀한 수분 잠금막을 형성합니다.',
    E'1. 세안 후 피부에 적당량을 분사하거나 손에 덜어 도포합니다.\n2. 메이크업 위에도 뭉침 없이 사용 가능합니다.\n3. 수시로 덧발라 수분을 보충해주세요.',
    E'전성분 EWG All Green 등급 (2018년 기준)\n자연 유래 성분 95.6% 함유\n실리콘 · 파라벤 무첨가\n한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정\n\n제주 자연 원료: 귤피, 동백꽃, 녹차, 다시마\n한방 원료: 감초 뿌리, 천궁 뿌리, 모란 뿌리, 쑥잎, 침당귀 뿌리\n식물성 부스터: 라벤더오일, 브로콜리싹, 편백오일, 돌콩배아',
    52000, '100ml', 'NEW',
    '/photos/multi-tonic/Gemini_Generated_Image_kwzi5rkwzi5rkwzi.png',
    true, 3
  )
  on conflict (brand_id, slug) do update set
    main_image    = excluded.main_image,
    short_description = excluded.short_description,
    description   = excluded.description,
    usage         = excluded.usage,
    ingredients   = excluded.ingredients,
    price         = excluded.price,
    volume        = excluded.volume,
    tag           = excluded.tag,
    product_type_id = excluded.product_type_id;

end $$;
