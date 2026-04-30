"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────
type Stat = { value: string; label: string; sub?: string };
type Metric = { value: string; label: string };
type Detail = {
  productName: string[];
  smallCopy: string;
  bigCopy: string;
  tagline: string;
  hero: { image: string; secondaryImage?: string; gallery?: string[] };
  hashtags?: string[];
  stats: Stat[];
  productHero: { heading: string; description?: string; image: string };
  painPoints: { title: string; items: string[]; cta: string };
  test: { title: string; description?: string; metrics: Metric[]; note?: string };
  point1: { pct: string; title: string; description: string; sub: { title: string; description: string } };
  point2: { description: string };
  point3: {
    description: string;
    coreIngredients: string[];
    jejuIngredients: string[];
    herbalIngredients: string[];
    extraIngredients?: { label: string; items: string[] };
  };
  point4: { description: string; badges: string[]; extraNote?: string };
  closing: { heading: string; description: string; image?: string };
};

const EMPTY: Detail = {
  productName: ["", ""],
  smallCopy: "",
  bigCopy: "",
  tagline: "",
  hero: { image: "", secondaryImage: "", gallery: [] },
  hashtags: [],
  stats: [{ value: "", label: "", sub: "" }],
  productHero: { heading: "", image: "" },
  painPoints: { title: "", items: [""], cta: "" },
  test: { title: "", metrics: [{ value: "", label: "" }], note: "" },
  point1: { pct: "", title: "", description: "", sub: { title: "", description: "" } },
  point2: { description: "" },
  point3: {
    description: "",
    coreIngredients: [""],
    jejuIngredients: [""],
    herbalIngredients: [""],
  },
  point4: { description: "", badges: [""] },
  closing: { heading: "", description: "", image: "" },
};

export default function DetailDataForm({ initial }: { initial?: unknown }) {
  // 초기값: 주어진 detail_data를 EMPTY와 머지 (누락 필드 안전 보강)
  const [data, setData] = useState<Detail>(() => merge(EMPTY, initial as Partial<Detail>));
  const [showRaw, setShowRaw] = useState(false);

  // 매 변경마다 직렬화. 빈 폼이면 빈 문자열(서버에선 미저장 처리됨).
  const isEmpty = !data.productName.some((s) => s) && !data.bigCopy && !data.smallCopy;
  const serialized = isEmpty ? "" : JSON.stringify(data);

  return (
    <div className="col-span-2 mt-3">
      <details className="border border-line">
        <summary className="cursor-pointer px-4 py-3 bg-sage-50 text-sm font-medium flex items-center justify-between">
          <span>상세 페이지 콘텐츠</span>
          <span className="text-xs text-mute">Hero / Stats / 4 POINT / 원료 / 안전성 / 마무리</span>
        </summary>

        <input type="hidden" name="detail_data" value={serialized} />

        <div className="p-5 space-y-5">
          {/* HERO */}
          <Section title="HERO — 큰 카피 + 제품명">
            <div className="grid grid-cols-2 gap-4">
              <Field label="작은 라벨 (smallCopy)" value={data.smallCopy}
                onChange={(v) => setData({ ...data, smallCopy: v })} placeholder="두피 생태계를 설계하는 프리미엄 샴푸 케어" wide />
              <Field label="큰 카피 (bigCopy)" value={data.bigCopy}
                onChange={(v) => setData({ ...data, bigCopy: v })} placeholder="뿌리부터 살아나는 두피 자생력" wide />
              <Field label="제품명 1줄" value={data.productName[0] ?? ""}
                onChange={(v) => setData({ ...data, productName: [v, data.productName[1] ?? ""] })} />
              <Field label="제품명 2줄" value={data.productName[1] ?? ""}
                onChange={(v) => setData({ ...data, productName: [data.productName[0] ?? "", v] })} />
              <Field label="제품 강조 슬로건 (tagline)" value={data.tagline}
                onChange={(v) => setData({ ...data, tagline: v })} placeholder="두피 본연의 균형을 되찾는 첫걸음" wide />
            </div>
          </Section>

          {/* HERO IMAGES */}
          <Section title="히어로 이미지">
            <ImageField label="메인 이미지" value={data.hero.image}
              onChange={(v) => setData({ ...data, hero: { ...data.hero, image: v } })} />
            <ImageField label="서브 이미지 (POINT 01 흡수 섹션)" value={data.hero.secondaryImage ?? ""}
              onChange={(v) => setData({ ...data, hero: { ...data.hero, secondaryImage: v } })} />
            <ListField label="갤러리 (썸네일들)" items={data.hero.gallery ?? []}
              onChange={(items) => setData({ ...data, hero: { ...data.hero, gallery: items } })}
              isImage placeholder="/photos/..." />
          </Section>

          {/* HASHTAGS */}
          <Section title="해시태그">
            <ListField label="해시태그 (예: #두피자생력)" items={data.hashtags ?? []}
              onChange={(items) => setData({ ...data, hashtags: items })} placeholder="#두피자생력" />
          </Section>

          {/* STATS */}
          <Section title="STATS — 4가지 핵심 수치">
            <ObjectListField
              items={data.stats}
              onChange={(items) => setData({ ...data, stats: items as Stat[] })}
              fields={[
                { key: "value", label: "값", placeholder: "95.7%" },
                { key: "label", label: "라벨", placeholder: "조밀한 거품" },
                { key: "sub", label: "보조 (선택)", placeholder: "세정력 만족도" },
              ]}
              addLabel="＋ 스탯 추가"
              defaultItem={{ value: "", label: "", sub: "" }}
            />
          </Section>

          {/* PRODUCT HERO */}
          <Section title="제품 강조 섹션">
            <Field label="강조 헤딩" value={data.productHero.heading}
              onChange={(v) => setData({ ...data, productHero: { ...data.productHero, heading: v } })} wide />
            <ImageField label="배경 이미지 (다크 풀블리드)" value={data.productHero.image}
              onChange={(v) => setData({ ...data, productHero: { ...data.productHero, image: v } })} />
          </Section>

          {/* PAIN POINTS */}
          <Section title="페인 포인트 (CHECK)">
            <Field label="제목" value={data.painPoints.title}
              onChange={(v) => setData({ ...data, painPoints: { ...data.painPoints, title: v } })}
              placeholder="무너진 두피 생태계, 혹시 내 이야기라면" wide />
            <ListField label="체크리스트 (보통 5개)" items={data.painPoints.items}
              onChange={(items) => setData({ ...data, painPoints: { ...data.painPoints, items } })}
              placeholder="아침에 감아도 오후면 떡지고 냄새가 올라와요." />
            <Field label="CTA 한 줄" value={data.painPoints.cta}
              onChange={(v) => setData({ ...data, painPoints: { ...data.painPoints, cta: v } })}
              placeholder="단순한 '세정'을 멈추고 '두피 케어'를 시작할 때" wide />
          </Section>

          {/* TEST */}
          <Section title="TEST — 사용 결과 수치">
            <Field label="제목" value={data.test.title}
              onChange={(v) => setData({ ...data, test: { ...data.test, title: v } })}
              placeholder="1주 사용 후 편안해진 두피" wide />
            <ObjectListField
              items={data.test.metrics}
              onChange={(items) => setData({ ...data, test: { ...data.test, metrics: items as Metric[] } })}
              fields={[
                { key: "value", label: "수치", placeholder: "94.5%" },
                { key: "label", label: "라벨", placeholder: "피부 수분량 증가" },
              ]}
              addLabel="＋ 메트릭 추가"
              defaultItem={{ value: "", label: "" }}
            />
            <Field label="주석 (선택)" value={data.test.note ?? ""}
              onChange={(v) => setData({ ...data, test: { ...data.test, note: v } })}
              placeholder="* 자체 테스트 결과. 사용자에 따라 개인차가 있습니다." wide />
          </Section>

          {/* POINT 01 */}
          <Section title="POINT 01 — 함량 & 발효 기술">
            <Field label="큰 % 표시 (예: 30%, 90%, 94%)" value={data.point1.pct}
              onChange={(v) => setData({ ...data, point1: { ...data.point1, pct: v } })} placeholder="30%" />
            <Field label="POINT 1 제목" value={data.point1.title}
              onChange={(v) => setData({ ...data, point1: { ...data.point1, title: v } })}
              placeholder="제형 유지의 한계치, PhytoGenica™ 30% 함유" wide />
            <TextArea label="POINT 1 설명" value={data.point1.description}
              onChange={(v) => setData({ ...data, point1: { ...data.point1, description: v } })} />
            <Field label="흡수 섹션 제목" value={data.point1.sub.title}
              onChange={(v) => setData({ ...data, point1: { ...data.point1, sub: { ...data.point1.sub, title: v } } })}
              placeholder="모공보다 작은 미세 입자, 깊은 흡수와 두피 케어" wide />
            <TextArea label="흡수 섹션 설명" value={data.point1.sub.description}
              onChange={(v) => setData({ ...data, point1: { ...data.point1, sub: { ...data.point1.sub, description: v } } })} />
          </Section>

          {/* POINT 02 */}
          <Section title="POINT 02 — 제주 용암해수">
            <TextArea label="설명" value={data.point2.description}
              onChange={(v) => setData({ ...data, point2: { description: v } })}
              placeholder="제주의 자연이 오랜 시간 머금어 미네랄이 풍부한 제주 용암해수가 균형 잡힌 두피 환경을 만들어줍니다." />
          </Section>

          {/* POINT 03 */}
          <Section title="POINT 03 — 한방 & 자연 원료">
            <TextArea label="섹션 설명" value={data.point3.description}
              onChange={(v) => setData({ ...data, point3: { ...data.point3, description: v } })} />
            <ListField label="핵심 원료" items={data.point3.coreIngredients}
              onChange={(items) => setData({ ...data, point3: { ...data.point3, coreIngredients: items } })}
              placeholder="어성초 — 두피 보습 효과" />
            <ListField label="제주산 자연 원료" items={data.point3.jejuIngredients}
              onChange={(items) => setData({ ...data, point3: { ...data.point3, jejuIngredients: items } })}
              placeholder="귤피" />
            <ListField label="한방 원료" items={data.point3.herbalIngredients}
              onChange={(items) => setData({ ...data, point3: { ...data.point3, herbalIngredients: items } })}
              placeholder="감초" />

            <ExtraIngredientsField
              value={data.point3.extraIngredients}
              onChange={(v) => setData({ ...data, point3: { ...data.point3, extraIngredients: v } })}
            />
          </Section>

          {/* POINT 04 */}
          <Section title="POINT 04 — 안전성">
            <TextArea label="섹션 설명" value={data.point4.description}
              onChange={(v) => setData({ ...data, point4: { ...data.point4, description: v } })} />
            <ListField label="안전성 배지" items={data.point4.badges}
              onChange={(items) => setData({ ...data, point4: { ...data.point4, badges: items } })}
              placeholder="전성분 EWG All Green 등급 (2018년 기준)" />
            <Field label="추가 주석 (선택)" value={data.point4.extraNote ?? ""}
              onChange={(v) => setData({ ...data, point4: { ...data.point4, extraNote: v } })}
              placeholder="한국피부과학연구원 피부 첩포 테스트 자극도 0.00 판정" wide />
          </Section>

          {/* CLOSING */}
          <Section title="마무리 (FINISH) — 사용감/제형">
            <Field label="제목" value={data.closing.heading}
              onChange={(v) => setData({ ...data, closing: { ...data.closing, heading: v } })}
              placeholder="쫀쫀한 미세 거품과 청량한 쿨링감" wide />
            <TextArea label="설명" value={data.closing.description}
              onChange={(v) => setData({ ...data, closing: { ...data.closing, description: v } })} />
            <ImageField label="마무리 이미지" value={data.closing.image ?? ""}
              onChange={(v) => setData({ ...data, closing: { ...data.closing, image: v } })} />
          </Section>

          {/* RAW JSON 토글 (개발자용) */}
          <details className="border border-line">
            <summary className="cursor-pointer px-4 py-3 bg-sage-50 text-xs uppercase tracking-[.15em] text-mute font-medium" onClick={() => setShowRaw(!showRaw)}>
              ＞ Raw JSON 보기 (개발자용)
            </summary>
            <pre className="p-4 text-[11px] bg-ink/5 overflow-auto max-h-96">{serialized || "(비어있음)"}</pre>
          </details>
        </div>
      </details>
    </div>
  );
}

// ─── Helper Components ────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="bg-white border border-line rounded" open>
      <summary className="cursor-pointer px-5 py-4 font-medium text-sm flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs text-mute">▾ 펼치기/접기</span>
      </summary>
      <div className="p-5 border-t border-line space-y-3">{children}</div>
    </details>
  );
}

function Field({
  label, value, onChange, placeholder, wide,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-xs uppercase tracking-[.1em] mb-1.5 text-mute">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[.1em] mb-1.5 text-mute">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
      />
    </div>
  );
}

function ImageField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j.url) onChange(j.url);
      else alert("업로드 실패: " + (j.error || "unknown"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-[.1em] mb-1.5 text-mute">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... 또는 /photos/..."
            className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="text-xs px-3 py-1.5 border border-line hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {uploading ? "업로드 중..." : "이미지 업로드"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-20 h-20 object-cover bg-sage-50 border border-line" />
        )}
      </div>
    </div>
  );
}

function ListField({
  label, items, onChange, placeholder, isImage,
}: {
  label: string; items: string[]; onChange: (items: string[]) => void;
  placeholder?: string; isImage?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[.1em] mb-1.5 text-mute">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-xs text-mute w-6">#{i + 1}</span>
            {isImage ? (
              <ImageInline value={item} onChange={(v) => {
                const next = [...items]; next[i] = v; onChange(next);
              }} />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...items]; next[i] = e.target.value; onChange(next);
                }}
                placeholder={placeholder}
                className="flex-1 border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            )}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-xs px-2 py-1 text-red-600 hover:underline">삭제</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])}
          className="text-xs px-3 py-1.5 border border-dashed border-line hover:border-primary hover:text-primary">
          ＋ 추가
        </button>
      </div>
    </div>
  );
}

function ImageInline({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j.url) onChange(j.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="이미지 URL" className="flex-1 border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
        className="text-xs px-2 py-1.5 border border-line hover:border-primary hover:text-primary disabled:opacity-50">
        {uploading ? "..." : "업로드"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-12 h-12 object-cover bg-sage-50 border border-line" />
      )}
    </>
  );
}

type FieldDef = { key: string; label: string; placeholder?: string };

function ObjectListField({
  items, onChange, fields, addLabel, defaultItem,
}: {
  items: Record<string, string | undefined>[];
  onChange: (items: Record<string, string | undefined>[]) => void;
  fields: FieldDef[];
  addLabel: string;
  defaultItem: Record<string, string | undefined>;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start p-3 bg-sage-50/50 border border-line">
          <span className="text-xs text-mute w-6 mt-2">#{i + 1}</span>
          <div className="flex-1 grid grid-cols-3 gap-2">
            {fields.map((f) => (
              <input
                key={f.key}
                type="text"
                value={(item[f.key] as string) ?? ""}
                placeholder={f.placeholder ?? f.label}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], [f.key]: e.target.value };
                  onChange(next);
                }}
                className="border border-line px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
              />
            ))}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-xs px-2 py-1 text-red-600 hover:underline mt-2">삭제</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, defaultItem])}
        className="text-xs px-3 py-1.5 border border-dashed border-line hover:border-primary hover:text-primary">
        {addLabel}
      </button>
    </div>
  );
}

function ExtraIngredientsField({
  value, onChange,
}: {
  value?: { label: string; items: string[] };
  onChange: (v: { label: string; items: string[] } | undefined) => void;
}) {
  const [enabled, setEnabled] = useState(!!value);

  useEffect(() => {
    if (!enabled) onChange(undefined);
    else if (!value) onChange({ label: "", items: [""] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return (
    <div className="border-t border-line pt-3">
      <label className="flex items-center gap-2 mb-3 text-xs text-mute">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        추가 핵심 원료 (선택)
      </label>
      {enabled && value && (
        <div className="space-y-3 pl-4 border-l-2 border-primary/30">
          <Field label="라벨" value={value.label}
            onChange={(v) => onChange({ ...value, label: v })}
            placeholder="추가 핵심 원료 / 식물성 부스터" wide />
          <ListField label="항목" items={value.items}
            onChange={(items) => onChange({ ...value, items })}
            placeholder="연꽃 — 두피 정화 & 활력 부여" />
        </div>
      )}
    </div>
  );
}

// ─── 머지 헬퍼 ─────────────────────────────────────
function merge(empty: Detail, partial?: Partial<Detail>): Detail {
  if (!partial) return JSON.parse(JSON.stringify(empty));
  const out = JSON.parse(JSON.stringify(empty)) as Detail;
  for (const key of Object.keys(partial) as (keyof Detail)[]) {
    const v = partial[key];
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) || typeof v !== "object") {
      // @ts-expect-error generic merge
      out[key] = v;
    } else {
      // @ts-expect-error nested object merge
      out[key] = { ...out[key], ...v };
    }
  }
  return out;
}
