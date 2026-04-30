import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getNavBrands } from "@/lib/nav";
import type { Brand, Product, ProductType } from "@/types/database";

export const revalidate = 60;

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createClient();

  const [{ data: brand }, navBrands] = await Promise.all([
    sb.from("brands").select("*").eq("slug", slug).eq("is_published", true).single(),
    getNavBrands(),
  ]);
  if (!brand) notFound();
  const b = brand as Brand;

  const [{ data: types }, { data: products }] = await Promise.all([
    sb.from("product_types").select("*").eq("brand_id", b.id).order("display_order"),
    sb.from("products").select("*").eq("brand_id", b.id).eq("is_published", true).order("display_order"),
  ]);

  const grouped = new Map<string | null, Product[]>();
  ((products ?? []) as Product[]).forEach((p) => {
    const key = p.product_type_id;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  });

  const headerColor = b.color_primary || "#2A5F58";
  const heroImage = b.cover_image || "/photos/shampoo/Gemini_Generated_Image_glw1v3glw1v3glw1.png";

  return (
    <>
      <Header brands={navBrands} overlay />

      {/* HERO */}
      <section
        className="relative h-[90vh] min-h-[640px] flex items-end text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(19,48,44,.45),rgba(19,48,44,.75)),url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-x pb-24 relative z-10 max-w-5xl">
          <p className="eyebrow opacity-90 mb-7">{b.name_en}</p>
          <h1 className="display text-[clamp(56px,9vw,140px)]">{b.name_ko}</h1>
          {b.concept && <p className="mt-9 text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">{b.concept}</p>}
        </div>
      </section>

      {/* MISSION — 2-col 텍스트 + 모델 사진 */}
      <section className="py-32 md:py-40 bg-sage-100">
        <div className="container-x grid md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <p className="eyebrow text-primary mb-7">OUR MISSION</p>
            <h2 className="display text-[clamp(34px,4.8vw,60px)] leading-[1.2] text-primary-dark mb-10">
              피부의 결과는<br />표면이 아니라<br />환경에서 시작됩니다.
            </h2>
            <p className="text-[15px] leading-[2] text-[#1F3A35]/85">
              한·미 특허 발효 공법으로 추출한 PhytoGenica™가
              피부 미세 환경에 반응하며, 자생 환경을 설계합니다.
              자극하지 않고, 덮지 않고, 억지로 바꾸지 않습니다.
            </p>
          </div>
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="aspect-[4/5] bg-[url('/photos/shampoo/Gemini_Generated_Image_uaymecuaymecuaym.png')] bg-cover bg-center" />
          </div>
        </div>
      </section>

      {b.description && (
        <section className="py-24 bg-white">
          <div className="container-x max-w-3xl text-center">
            <p className="text-[#1F3A35] leading-[2] text-[15.5px] whitespace-pre-line">{b.description}</p>
          </div>
        </section>
      )}

      {/* PHILOSOPHY QUOTE — 풀블리드 다크 */}
      <section className="relative py-32 md:py-44 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/photos/multi-tonic/Gemini_Generated_Image_2liacl2liacl2lia.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-primary-900/85" />
        <div className="container-x relative max-w-3xl text-center">
          <p className="eyebrow opacity-70 mb-10">PHILOSOPHY</p>
          <p className="display text-[clamp(28px,4.2vw,52px)] leading-[1.35]">
            우리는 피부를 관리하지 않습니다.<br />
            <span className="text-sage-200">스스로 살아날 환경을 만듭니다.</span>
          </p>
        </div>
      </section>

      {/* PRODUCT GROUPS */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="text-center mb-20">
            <p className="eyebrow text-primary mb-5">PRODUCT LINEUP</p>
            <h2 className="display text-[clamp(36px,4.5vw,56px)]">{b.name_ko} 라인업</h2>
          </div>

          {(!products || products.length === 0) ? (
            <div className="text-center py-20">
              <p className="text-mute">아직 등록된 제품이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-28">
              {(types as ProductType[] | null)?.map((t) => {
                const list = grouped.get(t.id);
                if (!list || list.length === 0) return null;
                return (
                  <div key={t.id}>
                    <div className="flex items-end justify-between mb-12 pb-5 border-b border-line">
                      <div>
                        <p className="eyebrow text-primary mb-2">{t.name_en}</p>
                        <h3 className="display text-3xl md:text-4xl">{t.name_ko}</h3>
                      </div>
                      <p className="text-xs text-mute">{list.length}개 제품</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                      {list.map((p) => <ProductCard key={p.id} p={p} />)}
                    </div>
                  </div>
                );
              })}

              {grouped.get(null) && grouped.get(null)!.length > 0 && (
                <div>
                  <h3 className="display text-3xl mb-8">기타</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                    {grouped.get(null)!.map((p) => <ProductCard key={p.id} p={p} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FROM JEJU — 풀블리드 비주얼 */}
      <section className="relative aspect-[21/9] min-h-[420px] overflow-hidden bg-[url('https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=2000&q=80')] bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-x pb-16 md:pb-20">
          <p className="eyebrow opacity-90 mb-6">NATURAL TRUST FROM JEJU</p>
          <h3 className="display text-[clamp(32px,4.5vw,56px)] mb-3">제주의 시간이 만든 미네랄</h3>
          <p className="opacity-90 max-w-md leading-relaxed">40만 년 제주 용암해수와 15가지 한방 원료가 피부의 자생 환경을 설계합니다.</p>
        </div>
      </section>

      {/* CTA — 브랜드 스토리 더 보기 */}
      <section className="py-24 bg-sage-50 text-center">
        <div className="container-x">
          <p className="eyebrow text-primary mb-5">EXPLORE</p>
          <h3 className="display text-[clamp(28px,3.6vw,42px)] mb-10">트루자임의 이야기를 더 깊이 알아보세요</h3>
          <Link href="/about" className="btn-outline">브랜드 스토리 →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/products/${p.id}`} className="group block">
      <div className="aspect-square bg-sage-50 overflow-hidden mb-5">
        {p.main_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.main_image} alt={p.name_ko} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sage-300 text-xs uppercase tracking-[.25em]">No image</div>
        )}
      </div>
      {p.tag && <p className="text-[10px] tracking-[.3em] text-primary mb-2 uppercase">{p.tag}</p>}
      <h3 className="display text-xl mb-1.5 leading-tight">{p.name_ko}</h3>
      {p.short_description && <p className="text-sm text-mute mb-3 line-clamp-2 leading-relaxed">{p.short_description}</p>}
      {p.price && <p className="text-sm font-medium">₩{p.price.toLocaleString()}</p>}
    </Link>
  );
}
