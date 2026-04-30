import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

// 단일 브랜드(트루자임)로 운영 중이라 제품 관리는 트루자임 브랜드 편집 화면으로 바로 보냄
export const dynamic = "force-dynamic";

export default async function AdminProductsLanding() {
  const sb = createAdminClient();
  const { data } = await sb.from("brands").select("id").eq("slug", "truezyme").single();
  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-mute">트루자임 브랜드가 데이터베이스에 없습니다.</p>
      </div>
    );
  }
  redirect(`/admin/brands/${data.id}`);
}
