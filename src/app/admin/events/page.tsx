import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Event } from "@/types/database";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
}

async function createEvent(formData: FormData) {
  "use server";
  await requireAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("events").insert({
    title: String(formData.get("title") || "").trim(),
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    start_date: String(formData.get("start_date") || "") || null,
    end_date: String(formData.get("end_date") || "") || null,
    link: String(formData.get("link") || "").trim() || null,
    display_order: Number(formData.get("display_order") || 0),
    is_published: formData.get("is_published") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

async function deleteEvent(id: string) {
  "use server";
  await requireAdmin();
  const sb = createAdminClient();
  await sb.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export default async function AdminEventsPage() {
  const sb = createAdminClient();
  const { data } = await sb.from("events").select("*").order("display_order");
  const events = (data ?? []) as Event[];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">이벤트</h1>
      <p className="text-mute text-sm mb-8">사이트에 노출되는 이벤트/혜택 관리</p>

      <div className="bg-white rounded mb-10 divide-y divide-line">
        {events.length === 0 ? (
          <p className="p-8 text-center text-mute text-sm">등록된 이벤트 없음</p>
        ) : events.map((e) => (
          <div key={e.id} className="p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{e.title}</p>
              <p className="text-xs text-mute">{e.start_date} {e.end_date && `— ${e.end_date}`}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${e.is_published ? "bg-primary/10 text-primary" : "bg-line text-mute"}`}>
              {e.is_published ? "노출" : "비노출"}
            </span>
            <form action={async () => { "use server"; await deleteEvent(e.id); }}>
              <button className="text-sm text-red-600 hover:underline">삭제</button>
            </form>
          </div>
        ))}
      </div>

      <div className="bg-white rounded p-8">
        <h2 className="font-medium mb-6">새 이벤트</h2>
        <form action={createEvent} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Input label="제목" name="title" required wide />
          <Input label="부제" name="subtitle" wide />
          <TA label="설명" name="description" />
          <Input label="이미지 URL" name="cover_image" wide />
          <Input label="시작일" name="start_date" type="date" />
          <Input label="종료일" name="end_date" type="date" />
          <Input label="링크" name="link" wide />
          <Input label="순서" name="display_order" type="number" defaultValue={0} />
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="is_published" defaultChecked /> 노출
          </label>
          <div className="col-span-2"><button className="btn-primary">추가</button></div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", required, wide, defaultValue }: { label: string; name: string; type?: string; required?: boolean; wide?: boolean; defaultValue?: string | number }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}

function TA({ label, name }: { label: string; name: string }) {
  return (
    <div className="col-span-2">
      <label className="block text-xs uppercase tracking-[.12em] mb-1.5">{label}</label>
      <textarea name={name} rows={3} className="w-full border border-line px-3 py-2 text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}
