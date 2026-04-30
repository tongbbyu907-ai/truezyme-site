import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { createProduct, updateProduct, deleteProduct } from "../actions";
import DetailDataForm from "@/components/admin/DetailDataForm";
import type { Brand, Product, ProductType } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function BrandEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data: brand } = await sb.from("brands").select("*").eq("id", id).single();
  if (!brand) notFound();
  const b = brand as Brand;

  const { data: types } = await sb.from("product_types").select("*").eq("brand_id", id).order("display_order");
  const { data: products } = await sb.from("products").select("*").eq("brand_id", id).order("display_order");

  return (
    <div>
      <Link href="/admin" className="text-sm text-mute hover:text-primary">← 대시보드</Link>
      <h1 className="font-serif text-3xl mt-2 mb-2">{b.name_ko} 제품 관리</h1>
      <p className="text-mute text-sm mb-10">등록된 제품 수정 / 새 제품 추가</p>

      {/* 제품 목록 — 최상단으로 이동 */}
      <section className="bg-white rounded p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medium text-lg">제품 ({products?.length ?? 0}개)</h2>
          <span className="text-xs text-mute">아래 ＋ 새 제품 추가에서 등록</span>
        </div>

        {products && products.length > 0 && (
          <ul className="divide-y divide-line mb-6">
            {(products as Product[]).map((p) => {
              const type = (types as ProductType[] | null)?.find((t) => t.id === p.product_type_id);
              return (
                <li key={p.id} className="py-4 flex items-center gap-4">
                  {p.main_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.main_image} alt="" className="w-12 h-12 object-cover bg-cream" />
                  ) : (
                    <div className="w-12 h-12 bg-cream" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.name_ko}</p>
                    <p className="text-xs text-mute">{type?.name_ko ?? "(타입 없음)"} · {p.price ? `₩${p.price.toLocaleString()}` : "—"}</p>
                  </div>
                  {p.tag && <span className="text-[10px] tracking-[.15em] uppercase text-primary">{p.tag}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded ${p.is_published ? "bg-primary/10 text-primary" : "bg-line text-mute"}`}>
                    {p.is_published ? "노출" : "비노출"}
                  </span>
                  <details>
                    <summary className="text-sm text-primary cursor-pointer">수정</summary>
                    <ProductForm
                      brandId={id}
                      types={(types ?? []) as ProductType[]}
                      product={p}
                    />
                  </details>
                  <form action={async () => { "use server"; await deleteProduct(p.id, id); }}>
                    <button className="text-xs text-red-600 hover:underline">삭제</button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <details className="border border-line p-4 rounded">
          <summary className="cursor-pointer text-sm font-medium">＋ 새 제품 추가</summary>
          <ProductForm brandId={id} types={(types ?? []) as ProductType[]} />
        </details>
      </section>
    </div>
  );
}

// ─── ProductForm ─────────────────────────
function ProductForm({
  brandId, types, product,
}: { brandId: string; types: ProductType[]; product?: Product }) {
  const action = product
    ? async (fd: FormData) => { "use server"; await updateProduct(product.id, brandId, fd); }
    : async (fd: FormData) => { "use server"; await createProduct(brandId, fd); };

  return (
    <form action={action} className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5">
      <FSelect label="제품 타입" name="product_type_id" defaultValue={product?.product_type_id ?? ""}>
        <option value="">— 선택 —</option>
        {types.map((t) => <option key={t.id} value={t.id}>{t.name_ko}</option>)}
      </FSelect>
      <F label="태그" name="tag" placeholder="BEST / NEW / PREMIUM" defaultValue={product?.tag ?? ""} />
      <F label="슬러그" name="slug" defaultValue={product?.slug ?? ""} required />
      <F label="순서" name="display_order" type="number" defaultValue={product?.display_order ?? 0} />
      <F label="국문명" name="name_ko" defaultValue={product?.name_ko ?? ""} required />
      <F label="영문명" name="name_en" defaultValue={product?.name_en ?? ""} />
      <F label="한 줄 설명" name="short_description" defaultValue={product?.short_description ?? ""} wide />
      <F label="가격 (원)" name="price" type="number" defaultValue={product?.price ?? ""} />
      <F label="용량" name="volume" placeholder="300ml" defaultValue={product?.volume ?? ""} />
      <F label="대표 이미지 URL" name="main_image" defaultValue={product?.main_image ?? ""} wide />
      <F label="구매 링크 (스마트스토어)" name="external_url" defaultValue={product?.external_url ?? ""} placeholder="https://smartstore.naver.com/..." wide />
      <DetailDataForm initial={product?.detail_data} />
      <TA label="상세 설명" name="description" defaultValue={product?.description ?? ""} />
      <TA label="사용법" name="usage" defaultValue={product?.usage ?? ""} />
      <TA label="전성분" name="ingredients" defaultValue={product?.ingredients ?? ""} />
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_published" defaultChecked={product?.is_published ?? true} /> 노출
      </label>
      <div className="col-span-2"><button className="btn-primary">{product ? "저장" : "추가"}</button></div>
    </form>
  );
}

function F({
  label, name, type = "text", placeholder, defaultValue, required, wide,
}: { label: string; name: string; type?: string; placeholder?: string; defaultValue?: string | number | null; required?: boolean; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
      />
    </div>
  );
}

function FSelect({
  label, name, defaultValue, children,
}: { label: string; name: string; defaultValue?: string | null; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <select name={name} defaultValue={defaultValue ?? ""} className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary">
        {children}
      </select>
    </div>
  );
}

function TA({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return (
    <div className="col-span-2">
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue ?? ""}
        className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
      />
    </div>
  );
}

