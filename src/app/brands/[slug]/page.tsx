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

  const isTruezyme = slug === "truezyme";
  const headerColor = b.color_primary || "#2A5F58";

  return (
    <>
      <Header brands={navBrands} overlay />

      {/* HERO */}
      <section
        className="relative h-[78vh] min-h-[520px] flex items-end text-white overflow-hidden"
        style={{
          backgroundImage: b.cover_image
            ? `linear-gradient(rgba(19,48,44,.45),rgba(19,48,44,.7)),url(${b.cover_image})`
            : `linear-gradient(135deg, ${headerColor}, ${headerColor}cc)`,
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="container-x pb-20 relative z-10">
          <p className="eyebrow opacity-90 mb-5">{b.name_en}</p>
          <h1 className="display text-[clamp(56px,9vw,140px)]">{b.name_ko}</h1>
          {b.concept && <p className="mt-7 text-lg md:text-xl opacity-90 max-w-2xl">{b.concept}</p>}
        </div>
      </section>

      {b.description && (
        <section className="py-24 bg-sage-100">
          <div className="container-x max-w-3xl text-center">
            <p className="text-[#1F3A35] leading-[2] text-[16px] whitespace-pre-line">{b.description}</p>
          </div>
        </section>
      )}

      {/* 제품 — 타입별 그룹 */}
      <section className="section bg-white">
        <div className="container-x">
          {(!products || products.length === 0) ? (
            <div className="text-center py-20">
              <p className="text-mute">아직 등록된 제품이 없습니다.</p>
              <p className="text-xs text-mute mt-2">관리자 페이지에서 제품을 추가하면 이곳에 노출됩니다.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {(types as ProductType[] | null)?.map((t) => {
                const list = grouped.get(t.id);
                if (!list || list.length === 0) return null;
                return (
                  <div key={t.id}>
                    <div className="flex items-end justify-between mb-10 pb-5 border-b-2 border-primary/20">
                      <div>
                        <p className="eyebrow text-primary mb-2">{t.name_en}</p>
                        <h2 className="font-serif text-3xl md:text-4xl">{t.name_ko}</h2>
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
                  <h2 className="font-serif text-3xl mb-8">기타</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                    {grouped.get(null)!.map((p) => <ProductCard key={p.id} p={p} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 다른 브랜드로 */}
      {navBrands.length > 1 && (
        <section className="bg-sage-50 py-20">
          <div className="container-x text-center">
            <p className="eyebrow text-primary mb-4">EXPLORE</p>
            <h3 className="font-serif text-2xl mb-8">다른 라인 보기</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {navBrands.filter((nb) => nb.slug !== slug).map((nb) => (
                <Link key={nb.slug} href={`/brands/${nb.slug}`} className="btn-outline">
                  {nb.name_ko} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
      <h3 className="font-serif text-xl mb-1.5 leading-tight">{p.name_ko}</h3>
      {p.short_description && <p className="text-sm text-mute mb-3 line-clamp-2 leading-relaxed">{p.short_description}</p>}
      {p.price && <p className="text-sm font-medium">₩{p.price.toLocaleString()}</p>}
    </Link>
  );
}
