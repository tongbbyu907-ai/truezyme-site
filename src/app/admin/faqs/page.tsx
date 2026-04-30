import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Faq } from "@/types/database";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
}

async function createFaq(formData: FormData) {
  "use server";
  await requireAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("faqs").insert({
    question: String(formData.get("question") || "").trim(),
    answer: String(formData.get("answer") || "").trim() || null,
    category: String(formData.get("category") || "").trim() || null,
    display_order: Number(formData.get("display_order") || 0),
    is_published: formData.get("is_published") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/community");
}

async function deleteFaq(id: string) {
  "use server";
  await requireAdmin();
  const sb = createAdminClient();
  await sb.from("faqs").delete().eq("id", id);
  revalidatePath("/admin/faqs");
  revalidatePath("/community");
}

export default async function AdminFaqsPage() {
  const sb = createAdminClient();
  const { data } = await sb.from("faqs").select("*").order("display_order");
  const faqs = (data ?? []) as Faq[];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">자주 묻는 질문</h1>
      <p className="text-mute text-sm mb-8">커뮤니티 페이지에 노출되는 Q&amp;A</p>

      <div className="bg-white rounded mb-10 divide-y divide-line">
        {faqs.length === 0 ? (
          <p className="p-8 text-center text-mute text-sm">등록된 항목 없음</p>
        ) : faqs.map((f) => (
          <div key={f.id} className="p-5 flex gap-4">
            <span className="text-xs text-mute w-6 pt-0.5">{f.display_order}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{f.question}</p>
              {f.answer && <p className="text-xs text-mute mt-1 line-clamp-2 whitespace-pre-line">{f.answer}</p>}
            </div>
            <form action={async () => { "use server"; await deleteFaq(f.id); }}>
              <button className="text-sm text-red-600 hover:underline">삭제</button>
            </form>
          </div>
        ))}
      </div>

      <div className="bg-white rounded p-8">
        <h2 className="font-medium mb-6">새 Q&amp;A</h2>
        <form action={createFaq} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-2">
            <label className="block text-xs uppercase tracking-[.12em] mb-1.5">질문</label>
            <input name="question" required className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs uppercase tracking-[.12em] mb-1.5">답변</label>
            <textarea name="answer" rows={4} className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[.12em] mb-1.5">카테고리</label>
            <input name="category" placeholder="제품 / 배송 / 멤버십" className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[.12em] mb-1.5">순서</label>
            <input name="display_order" type="number" defaultValue={0} className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <label className="flex items-center gap-2 col-span-2">
            <input type="checkbox" name="is_published" defaultChecked /> 노출
          </label>
          <div className="col-span-2"><button className="btn-primary">추가</button></div>
        </form>
      </div>
    </div>
  );
}
