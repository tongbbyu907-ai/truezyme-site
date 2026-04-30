import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import StickyBuyBar from "@/components/StickyBuyBar";
import { createClient } from "@/lib/supabase/server";
import { getNavBrands } from "@/lib/nav";
import type { Brand, Product } from "@/types/database";
import { TRUEZYME_PRODUCTS, SHARED_NARRATIVE, ALL_TRUEZYME_PRODUCTS, type ProductRich } from "@/data/truezyme-products";
import {
  IconShield, IconDrop, IconEcosystem, IconAbsorb, IconAtom, IconBalance,
  IconFlask, IconParticles, IconCalm, IconScalp, IconMicrobe, IconMolecule,
  IconStar, IconLeaf, IconHerbs, IconPatent, IconNature, IconNoChem, IconBubble,
} from "@/components/icons";

type IconCmp = (p: { size?: number; className?: string }) => React.JSX.Element;

// 3 약속
const PROMISE_ICONS: IconCmp[] = [IconShield, IconDrop, IconEcosystem];

// PhytoGenica 3 메커니즘
const PHYTO_ICONS: IconCmp[] = [IconAbsorb, IconAtom, IconBalance];

// 발효 기술 3축
const FERM_ICONS: IconCmp[] = [IconFlask, IconParticles, IconCalm];

// 6 핵심
const CORE_ICONS: IconCmp[] = [IconScalp, IconShield, IconMicrobe, IconCalm, IconMolecule, IconAbsorb];

// 안전성 배지 키워드 매칭
function safetyIconFor(badge: string): IconCmp {
  if (badge.includes("EWG")) return IconLeaf;
  if (badge.includes("계면활성제")) return IconBubble;
  if (badge.includes("자연 유래")) return IconNature;
  if (badge.includes("무첨가")) return IconNoChem;
  return IconShield;
}

export const revalidate = 60;

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createClient();
  const [{ data: product }, navBrands] = await Promise.all([
    sb.from("products").select("*").eq("id", id).eq("is_published", true).single(),
    getNavBrands(),
  ]);
  if (!product) notFound();
  const p = product as Product;
  const { data: brand } = await sb.from("brands").select("*").eq("id", p.brand_id).single();
  const b = brand as Brand;
  const rich = TRUEZYME_PRODUCTS[p.slug];

  const otherTruezyme = ALL_TRUEZYME_PRODUCTS.filter(x => x.slug !== p.slug);
  const { data: otherProducts } = await sb
    .from("products")
    .select("id, slug, name_ko, main_image, tag, price")
    .in("slug", otherTruezyme.map(x => x.slug))
    .eq("is_published", true);

  return (
    <>
      <Header brands={navBrands} />
      {rich
        ? <SK2Style p={p} b={b} rich={rich} otherProducts={(otherProducts ?? []) as RelatedProduct[]} />
        : <SimpleProductPage p={p} b={b} />}
      <StickyBuyBar name={p.name_ko} price={p.price} externalUrl={p.external_url} />
      <Footer />
    </>
  );
}

type RelatedProduct = { id: string; slug: string; name_ko: string; main_image: string | null; tag: string | null; price: number | null };

// ============================================================
// SK-II KOREA INSPIRED PRODUCT TEMPLATE
// — 풀블리드 이미지 위주 / 박스 최소 / 큰 여백 / 자연스러운 스토리 흐름
// ============================================================
function SK2Style({
  p, b, rich, otherProducts,
}: {
  p: Product; b: Brand; rich: ProductRich; otherProducts: RelatedProduct[];
}) {
  const gallery = rich.hero.gallery ?? [rich.hero.image].filter(Boolean) as string[];
  const buyUrl = p.external_url || "#";

  return (
    <main className="bg-white pb-24">
      {/* ──────── HERO ──────── */}
      <section className="container-x pt-28 pb-16 md:pb-28">
        <nav className="text-[11px] tracking-[.15em] uppercase text-mute mb-10">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-3">/</span>
          <Link href={`/brands/${b.slug}`} className="hover:text-primary">{b.name_en}</Link>
          <span className="mx-3">/</span>
          <span className="text-ink/70">{rich.productName.join(" ")}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          {/* 좌: 갤러리 */}
          <div className="md:col-span-7">
            <ProductGallery images={gallery} alt={p.name_ko} />
          </div>

          {/* 우: 정보 */}
          <div className="md:col-span-5 md:py-2">
            {p.tag && <p className="eyebrow text-primary mb-5">{p.tag}</p>}
            <p className="text-[13px] text-mute mb-3">{rich.smallCopy}</p>
            <h1 className="display text-[clamp(28px,3.4vw,40px)] mb-2 text-ink">
              {rich.productName.join(" ")}
            </h1>
            {p.name_en && <p className="text-mute text-sm mb-6">{p.name_en}</p>}

            {rich.hashtags && (
              <div className="mb-7 flex flex-wrap gap-x-3 gap-y-2">
                {rich.hashtags.map((h) => <span key={h} className="hashtag">{h}</span>)}
              </div>
            )}

            <dl className="text-sm py-7 border-y border-line space-y-3">
              {p.volume && (
                <div className="flex"><dt className="w-24 text-mute">용량</dt><dd>{p.volume}</dd></div>
              )}
              <div className="flex"><dt className="w-24 text-mute">피부타입</dt><dd>모든 피부 · 민감 피부 가능</dd></div>
              <div className="flex"><dt className="w-24 text-mute">혜택</dt>
                <dd className="flex-1">{rich.stats.slice(0, 2).map(s => s.label).join(" · ")}</dd>
              </div>
            </dl>

            {p.price && (
              <p className="num-bold text-3xl text-ink mt-7 mb-7">
                ₩ {p.price.toLocaleString()}
              </p>
            )}

            <div className="flex flex-col gap-3">
              {buyUrl !== "#" ? (
                <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                  지금 구매하기 ↗
                </a>
              ) : (
                <button className="btn-primary justify-center opacity-90" disabled title="구매 링크 등록 예정">
                  지금 구매하기
                </button>
              )}
              <button className="btn-outline justify-center">매장 찾기</button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── HERO 풀블리드 라이프스타일 컷 ──────── */}
      {rich.productHero.image && (
        <section className="relative aspect-[16/9] md:aspect-[21/9] bg-cover bg-center overflow-hidden"
                 style={{ backgroundImage: `url(${rich.productHero.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-x">
              <p className="eyebrow text-white/90 mb-7">{rich.smallCopy}</p>
              <h2 className="display text-[clamp(36px,5.8vw,84px)] text-white max-w-2xl leading-[1.15]">
                {rich.bigCopy}
              </h2>
            </div>
          </div>
        </section>
      )}

      {/* ──────── BRAND STORY (가벼운 텍스트 한 단락) ──────── */}
      <section className="py-32 md:py-44">
        <div className="container-x max-w-3xl text-center">
          <p className="eyebrow text-primary mb-10">BRAND STORY</p>
          <p className="display text-[clamp(22px,3vw,32px)] text-ink/85 leading-[1.5] mb-14">
            매일 케어를 해도 같은 고민이 반복된다면,<br />
            문제는 <span className="text-primary">피부의 환경</span>입니다.<br />
            트루자임은 <span className="text-primary">관리</span>가 아니라<br />
            <span className="text-primary">스스로 살아날 환경</span>을 만듭니다.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-10 border-t border-line">
            {SHARED_NARRATIVE.threePromises.map((t, i) => {
              const Icon = PROMISE_ICONS[i];
              return (
                <div key={i}>
                  <span className="inline-flex text-primary-dark mb-4"><Icon size={36} /></span>
                  <p className="text-xs tracking-[.2em] uppercase text-mute mb-2">0{i + 1}</p>
                  <p className="text-sm font-medium leading-snug">{t}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────── PHYTOGENICA — 풀블리드 다크 ──────── */}
      <section className="relative bg-primary-900 text-white py-32 md:py-44 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
        <div className="container-x relative">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-6">
              <p className="eyebrow opacity-70 mb-6">CORE INGREDIENT</p>
              <h2 className="display text-[clamp(40px,5.5vw,80px)] leading-[1.1] mb-8">PhytoGenica™</h2>
              <p className="text-base leading-[2] opacity-85 max-w-md">
                한·미 특허 보유 독자 발효 공법으로 추출한 트루자임의 핵심 자산.
                단순 추출이 아닌, 피부 환경 자체를 설계하는 발효.
              </p>
            </div>
            <div className="md:col-span-6 grid grid-cols-1 gap-px bg-white/10">
              {SHARED_NARRATIVE.phytoGenicaThree.map((m, i) => {
                const Icon = PHYTO_ICONS[i];
                return (
                  <div key={m.n} className="bg-primary-900 py-8 px-2 flex items-center gap-6">
                    <span className="text-white/80 shrink-0"><Icon size={40} /></span>
                    <div className="flex-1">
                      <p className="num-xl text-2xl text-white/60 mb-1">{m.n}</p>
                      <p className="font-medium mb-1">{m.title}</p>
                      <p className="text-sm opacity-70 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── KEY % — 함량 (POINT 01) ──────── */}
      <section className="py-32 md:py-44">
        <div className="container-x grid md:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="md:col-span-6 text-center md:text-left">
            <p className="eyebrow text-primary mb-6">PHYTOGENICA™ MAX</p>
            <p className="num-xl text-primary text-[160px] md:text-[280px] leading-[0.85] mb-3">
              {rich.point1.pct}
            </p>
            <p className="text-xs uppercase tracking-[.3em] text-mute">Maximum Concentration</p>
          </div>
          <div className="md:col-span-6">
            <h2 className="display text-[clamp(26px,3.4vw,40px)] leading-[1.25] mb-7">
              {rich.point1.title}
            </h2>
            <p className="text-[15px] leading-[2] text-ink/80 mb-8">{rich.point1.description}</p>
            <p className="text-xs uppercase tracking-[.2em] text-mute border-t border-line pt-5">
              ※ 무늬만 발효인 컨셉 성분, 피부의 변화는 미비합니다
            </p>
          </div>
        </div>
      </section>

      {/* ──────── 발효 기술 — 가로 3축 ──────── */}
      <section className="bg-sage-50 py-28 md:py-36">
        <div className="container-x">
          <div className="text-center mb-16">
            <p className="eyebrow text-primary mb-5">FERMENTATION TECHNOLOGY</p>
            <h2 className="display text-[clamp(28px,3.6vw,44px)] leading-[1.25]">
              기존 발효의 한계를 넘은 트루자임의 발효 기술
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-20">
            {SHARED_NARRATIVE.fermentationAxes.map((a, i) => {
              const Icon = FERM_ICONS[i];
              return (
                <div key={i} className="text-center">
                  <span className="inline-flex text-primary-dark mb-5"><Icon size={52} /></span>
                  <p className="num-xl text-primary text-2xl mb-3">0{i + 1}</p>
                  <p className="display text-xl mb-2">{a.ko}</p>
                  <p className="text-[10px] tracking-[.2em] uppercase text-mute">{a.en}</p>
                </div>
              );
            })}
          </div>

          {/* 6 핵심 — 가로 한 줄 */}
          <div className="border-t border-sage-300/40 pt-16 max-w-5xl mx-auto">
            <p className="eyebrow text-primary text-center mb-10">PHYTOGENICA™ 6 CORES</p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-y-10 gap-x-6">
              {SHARED_NARRATIVE.sixCores.map((c, i) => {
                const Icon = CORE_ICONS[i];
                return (
                  <div key={i} className="text-center">
                    <span className="inline-flex text-primary-dark mb-3"><Icon size={32} /></span>
                    <p className="text-xs tracking-[.2em] text-primary mb-2">0{i + 1}</p>
                    <p className="text-[13px] font-medium leading-snug">{c}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── 비교표 — 깔끔 가로 ──────── */}
      <section className="py-28 md:py-36">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-14">
            <p className="eyebrow text-primary mb-5">VS</p>
            <h2 className="display text-[clamp(28px,3.6vw,44px)] leading-[1.25]">
              단순 추출물과 다른 리얼 발효
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-5 px-3 text-left text-xs uppercase tracking-[.15em] w-1/4">구분</th>
                  <th className="py-5 px-3 text-left text-xs uppercase tracking-[.15em] text-mute">
                    {SHARED_NARRATIVE.comparison.columns[0]}
                  </th>
                  <th className="py-5 px-3 text-left text-xs uppercase tracking-[.15em] text-primary">
                    {SHARED_NARRATIVE.comparison.columns[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SHARED_NARRATIVE.comparison.rows.map((r, i) => (
                  <tr key={i} className="border-b border-line">
                    <td className="py-5 px-3 font-medium text-sm">{r.label}</td>
                    <td className="py-5 px-3 text-sm text-mute">{r.a}</td>
                    <td className="py-5 px-3 text-sm">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ──────── 흡수 + 특허 ──────── */}
      <section className="py-28 md:py-36">
        <div className="container-x grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {rich.hero.secondaryImage && (
            <div className="aspect-[4/5] bg-sage-50 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rich.hero.secondaryImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="eyebrow text-primary mb-6">DEEP ABSORPTION & PATENT</p>
            <h3 className="display text-[clamp(24px,3.2vw,36px)] mb-7 leading-[1.25]">
              {rich.point1.sub.title}
            </h3>
            <p className="text-[15px] leading-[1.95] mb-9">{rich.point1.sub.description}</p>
            <div className="border-t border-line pt-7">
              <p className="text-sm leading-[1.9] mb-5">
                한·미에서 획득한 <strong className="font-medium">탈모 방지 · 발모 촉진 · 아토피 개선</strong> 특허
              </p>
              <div className="flex gap-2">
                <span className="pill border-primary text-primary">K · PATENT</span>
                <span className="pill border-primary text-primary">US · PATENT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── TEST RESULTS — 풀블리드 사게 ──────── */}
      <section className="bg-sage-100 py-32 md:py-44">
        <div className="container-x">
          <div className="text-center mb-20">
            <p className="eyebrow text-primary mb-6">TEST RESULTS</p>
            <h2 className="display text-[clamp(28px,3.8vw,46px)] leading-[1.25]">{rich.test.title}</h2>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(rich.test.metrics.length, 4)} gap-y-16 md:gap-x-8 max-w-5xl mx-auto`}>
            {rich.test.metrics.map((m, i) => (
              <div key={i} className="text-center px-4">
                <p className="num-xl text-primary text-7xl md:text-8xl mb-5 leading-none">{m.value}</p>
                <span className="block w-8 h-px bg-primary/40 mx-auto mb-5" />
                <p className="text-sm font-medium">{m.label}</p>
              </div>
            ))}
          </div>
          {rich.test.note && <p className="text-xs text-mute text-center mt-12">{rich.test.note}</p>}
        </div>
      </section>

      {/* ──────── 제주 + 한방 ──────── */}
      <section className="bg-cream py-32 md:py-44">
        <div className="container-x">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-20 items-center">
            <div className="aspect-[4/5] bg-[url('https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1400&q=80')] bg-cover bg-center" />
            <div>
              <p className="eyebrow text-earth mb-5">JEJU LAVA SEAWATER</p>
              <h2 className="display text-[clamp(26px,3.4vw,40px)] text-earth mb-3 leading-[1.2]">자연이 만든 미네랄</h2>
              <h3 className="display text-[clamp(22px,3vw,32px)] text-earth/85 mb-8 leading-[1.25]">40만 년 제주 용암해수</h3>
              <p className="text-[15px] leading-[2] text-earth/85">{rich.point2.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-16 border-t border-earth/15">
            <IngredientGroup tag="핵심 원료" Icon={IconStar} items={rich.point3.coreIngredients} />
            <IngredientGroup tag="제주산 자연 원료" Icon={IconLeaf} items={rich.point3.jejuIngredients} sub="청정 제주의 식물성 에너지" />
            <IngredientGroup tag="한방 원료" Icon={IconHerbs} items={rich.point3.herbalIngredients} sub="피부 본연의 힘을 키우는 약재" />
          </div>

          {rich.point3.extraIngredients && (
            <div className="mt-10 max-w-3xl mx-auto text-center pt-10 border-t border-earth/15">
              <p className="eyebrow text-earth mb-4">{rich.point3.extraIngredients.label}</p>
              <p className="text-base text-earth font-medium tracking-wide">
                {rich.point3.extraIngredients.items.join("   ·   ")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ──────── SAFETY — 가로 4분할 ──────── */}
      <section className="py-28 md:py-36">
        <div className="container-x">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="eyebrow text-primary mb-5">SAFETY</p>
            <h2 className="display text-[clamp(26px,3.4vw,40px)] leading-[1.25]">민감해도 안심 케어</h2>
            <p className="text-[15px] leading-[2] mt-6">{rich.point4.description}</p>
          </div>
          <div className={`grid md:grid-cols-${Math.min(rich.point4.badges.length, 4)} gap-x-6 gap-y-12 max-w-5xl mx-auto border-y border-line py-14`}>
            {rich.point4.badges.map((badge, i) => {
              const Icon = safetyIconFor(badge);
              return (
                <div key={i} className="text-center">
                  <span className="inline-flex text-primary-dark mb-4"><Icon size={44} /></span>
                  <p className="num-xl text-primary text-xl mb-2">0{i + 1}</p>
                  <p className="text-sm font-medium leading-snug">{badge}</p>
                </div>
              );
            })}
          </div>
          {rich.point4.extraNote && (
            <p className="text-center text-sm text-primary mt-8">★ {rich.point4.extraNote}</p>
          )}
        </div>
      </section>

      {/* ──────── FINISH — 풀블리드 ──────── */}
      <section className="bg-sage-50 py-32 md:py-44">
        <div className="container-x grid md:grid-cols-2 gap-14 items-center">
          {rich.closing.image && (
            <div className="aspect-[4/5] bg-sage-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rich.closing.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="eyebrow text-primary mb-6">FINISH · TEXTURE</p>
            <h2 className="display text-[clamp(26px,4vw,46px)] mb-9 leading-[1.2]">{rich.closing.heading}</h2>
            <span className="block w-12 h-px bg-primary mb-7" />
            <p className="text-[15px] leading-[2]">{rich.closing.description}</p>

            <div className="mt-12 pt-8 border-t border-sage-300/40">
              <p className="eyebrow text-primary mb-5">SHOP NOW</p>
              {p.external_url ? (
                <a href={p.external_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  스마트스토어에서 구매하기 ↗
                </a>
              ) : (
                <button className="btn-primary opacity-90" disabled>
                  지금 구매하기
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── SYNERGY ──────── */}
      {otherProducts.length > 0 && (
        <section className="py-28 md:py-36">
          <div className="container-x">
            <div className="flex items-end justify-between mb-12 pb-5 border-b border-line">
              <div>
                <p className="eyebrow text-primary mb-4">SYNERGY CARE</p>
                <h2 className="display text-[clamp(24px,3vw,36px)]">함께 만나는 트루자임 라인</h2>
              </div>
              <Link href={`/brands/${b.slug}`} className="text-xs uppercase tracking-[.2em] text-primary hover:text-primary-dark">
                전체 보기 →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
              {otherProducts.map((op) => (
                <Link key={op.id} href={`/products/${op.id}`} className="group block">
                  <div className="aspect-square bg-sage-50 overflow-hidden mb-5">
                    {op.main_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={op.main_image} alt={op.name_ko} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  {op.tag && <p className="text-[10px] tracking-[.3em] text-primary mb-2 uppercase">{op.tag}</p>}
                  <h3 className="display text-base mb-1 leading-tight">{op.name_ko}</h3>
                  {op.price && <p className="text-sm text-mute">₩{op.price.toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────── DETAILS (아코디언) ──────── */}
      <section className="bg-sage-50 py-20">
        <div className="container-x max-w-4xl">
          {p.description && <Detail title="제품 설명">{p.description}</Detail>}
          {p.usage && <Detail title="사용법">{p.usage}</Detail>}
          {p.ingredients && <Detail title="전성분 / 주의사항">{p.ingredients}</Detail>}
        </div>
      </section>
    </main>
  );
}

function IngredientGroup({
  tag, items, sub, Icon,
}: {
  tag: string; items: string[]; sub?: string;
  Icon?: IconCmp;
}) {
  return (
    <div>
      {Icon && <span className="inline-flex text-earth mb-5"><Icon size={36} /></span>}
      <p className="eyebrow text-earth mb-3">{tag}</p>
      {sub && <p className="text-xs text-earth/70 mb-5 leading-relaxed">{sub}</p>}
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-earth border-b border-earth/15 pb-2.5 last:border-0">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Detail({ title, children }: { title: string; children: string }) {
  return (
    <details className="border-b border-line group">
      <summary className="cursor-pointer py-5 flex items-center justify-between font-medium list-none">
        {title}
        <span className="text-mute font-light text-2xl group-open:rotate-45 transition">+</span>
      </summary>
      <p className="leading-[1.95] whitespace-pre-line text-sm pb-6 text-ink/80">{children}</p>
    </details>
  );
}

// ============================================================
// SIMPLE TEMPLATE
// ============================================================
function SimpleProductPage({ p, b }: { p: Product; b: Brand }) {
  return (
    <main className="pt-[76px] bg-white">
      <div className="container-x py-8">
        <nav className="text-[11px] tracking-[.15em] uppercase text-mute">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-3">/</span>
          <Link href={`/brands/${b.slug}`} className="hover:text-primary">{b.name_en}</Link>
          <span className="mx-3">/</span>
          <span>{p.name_ko}</span>
        </nav>
      </div>
      <div className="container-x grid md:grid-cols-2 gap-x-16 gap-y-10 pb-24">
        <div className="aspect-square bg-sage-50 md:sticky md:top-28 self-start overflow-hidden">
          {p.main_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.main_image} alt={p.name_ko} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="md:py-6">
          {p.tag && <p className="eyebrow text-primary mb-4">{p.tag}</p>}
          <h1 className="display text-3xl md:text-5xl mb-3">{p.name_ko}</h1>
          {p.name_en && <p className="text-mute mb-7 text-lg">{p.name_en}</p>}
          {p.short_description && <p className="text-lg leading-relaxed mb-9">{p.short_description}</p>}
          <div className="flex items-baseline gap-4 mb-10 pb-9 border-b border-line">
            {p.price && <p className="num-bold text-3xl text-primary">₩{p.price.toLocaleString()}</p>}
            {p.volume && <p className="text-sm text-mute">{p.volume}</p>}
          </div>
          {p.external_url && (
            <a href={p.external_url} target="_blank" rel="noopener noreferrer" className="btn-primary mb-10">
              지금 구매하기 ↗
            </a>
          )}
          {p.description && <Detail title="제품 설명">{p.description}</Detail>}
          {p.usage && <Detail title="사용법">{p.usage}</Detail>}
          {p.ingredients && <Detail title="전성분">{p.ingredients}</Detail>}
        </div>
      </div>
    </main>
  );
}
