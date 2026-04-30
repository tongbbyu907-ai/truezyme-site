import { redirect } from "next/navigation";

// 단일 브랜드 운영 중 — /admin/products 로 통합
export default function AdminBrandsRedirect() {
  redirect("/admin/products");
}
