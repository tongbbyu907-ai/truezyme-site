import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { createBrand, deleteBrand } from "./actions";
import type { Brand } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  let brands: Brand[] = [];
  try {
    const sb = createAdminClient();
    const { data } = await sb.from("brands").select("*").order("display_order");
    brands = data ?? [];
  } catch {}

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">브랜드</h1>
          <p className="text-mute text-sm mt-1">트루자임 산하 브랜드(카테고리) 관리</p>
        </div>
      </div>

      {/* 목록 */}
      <div className="bg-white rounded mb-10 divide-y divide-line">
        {brands.length === 0 ? (
          <p className="p-8 text-center text-mute text-sm">아직 등록된 브랜드가 없습니다.</p>
        ) : (
          brands.map((b) => (
            <div key={b.id} className="p-5 flex items-center gap-4">
              <span
                className="w-2 h-10 rounded-full"
                style={{ background: b.color_primary }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{b.name_ko}{b.name_en && <span className="text-mute font-normal ml-2 text-sm">{b.name_en}</span>}</p>
                <p className="text-xs text-mute truncate">{b.concept || "—"}</p>
              </div>
              <span className="text-xs text-mute">order: {b.display_order}</span>
              <span className={`text-xs px-2 py-1 rounded ${b.is_published ? "bg-primary/10 text-primary" : "bg-line text-mute"}`}>
                {b.is_published ? "노출" : "비노출"}
              </span>
              <Link href={`/admin/brands/${b.id}`} className="text-sm text-primary underline underline-offset-2">관리</Link>
              <form action={async () => { "use server"; await deleteBrand(b.id); }}>
                <button className="text-sm text-red-600 hover:underline" type="submit">삭제</button>
              </form>
            </div>
          ))
        )}
      </div>

      {/* 새 브랜드 추가 */}
      <div className="bg-white rounded p-8">
        <h2 className="font-medium mb-6">새 브랜드 추가</h2>
        <form action={createBrand} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Field label="슬러그 (URL)" name="slug" placeholder="truezyme" required />
          <Field label="표시 순서" name="display_order" type="number" defaultValue={0} />
          <Field label="국문명" name="name_ko" placeholder="트루자임" required />
          <Field label="영문명" name="name_en" placeholder="Truezyme" />
          <Field label="한 줄 컨셉" name="concept" placeholder="Pure & Premium Marine Skincare from Nature" wide />
          <TextArea label="설명" name="description" />
          <Field label="대표 이미지 URL" name="cover_image" placeholder="https://..." wide />
          <Field label="브랜드 컬러" name="color_primary" defaultValue="#2A5F58" type="color" />
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="is_published" defaultChecked /> 사이트에 노출
          </label>
          <div className="col-span-2 mt-4">
            <button className="btn-primary">추가</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", placeholder, defaultValue, required, wide,
}: { label: string; name: string; type?: string; placeholder?: string; defaultValue?: string | number; required?: boolean; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
      />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div className="col-span-2">
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <textarea
        name={name}
        rows={3}
        className="w-full border border-line px-3 py-2 focus:outline-none focus:border-primary text-sm"
      />
    </div>
  );
}
