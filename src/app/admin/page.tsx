import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let stats = { products: 0, events: 0, faqs: 0 };
  try {
    const sb = createAdminClient();
    const [p, e, f] = await Promise.all([
      sb.from("products").select("*", { count: "exact", head: true }),
      sb.from("events").select("*", { count: "exact", head: true }),
      sb.from("faqs").select("*", { count: "exact", head: true }),
    ]);
    stats = {
      products: p.count ?? 0,
      events: e.count ?? 0,
      faqs: f.count ?? 0,
    };
  } catch {}

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">대시보드</h1>
      <p className="text-mute mb-10">트루자임 사이트 콘텐츠 관리</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Card title="제품" count={stats.products} href="/admin/products" />
        <Card title="이벤트" count={stats.events} href="/admin/events" />
        <Card title="Q&A" count={stats.faqs} href="/admin/faqs" />
      </div>

      <div className="bg-white p-6 rounded">
        <h2 className="font-medium mb-4">빠른 작업</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/products" className="btn-dark">제품 관리하기 →</Link>
          <Link href="/admin/events" className="btn-light border border-line">이벤트 추가</Link>
          <Link href="/admin/faqs" className="btn-light border border-line">Q&A 추가</Link>
          <Link href="/" className="btn-light border border-line">사이트 보기 ↗</Link>
        </div>
      </div>
    </div>
  );
}

function Card({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <Link href={href} className="bg-white p-6 rounded hover:shadow-sm transition">
      <p className="text-xs uppercase tracking-[.15em] text-mute mb-3">{title}</p>
      <p className="font-serif text-3xl">{count}</p>
    </Link>
  );
}
