// products 테이블에 external_url 컬럼 추가 (스마트스토어 링크용)
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

(async () => {
  // Supabase REST는 raw SQL을 직접 못 돌려서, exec_sql 함수 만들거나 RPC 필요.
  // 가장 빠른 방법: dashboard SQL editor에서 직접 실행하시거나,
  // 아래 스크립트는 시도만 하고, 안 되면 안내 출력.
  const { error } = await sb.rpc("execute_sql", {
    sql: "alter table products add column if not exists external_url text;",
  });

  if (error) {
    console.log("⚠️  RPC 실행 실패 — Supabase Dashboard SQL Editor에서 직접 실행하세요:");
    console.log("");
    console.log("  alter table products add column if not exists external_url text;");
    console.log("");
    console.log("실패 사유:", error.message);
  } else {
    console.log("✅ external_url 컬럼 추가됨");
  }
})();
