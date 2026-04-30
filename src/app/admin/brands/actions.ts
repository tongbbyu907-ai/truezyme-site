"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
}

// 빈 문자열이면 detail_data 안 건드림. JSON 파싱 실패 시 에러.
function parseDetailData(raw: FormDataEntryValue | null): { detail_data?: unknown } {
  const s = String(raw || "").trim();
  if (!s) return {};
  try {
    return { detail_data: JSON.parse(s) };
  } catch (e) {
    throw new Error("상세 데이터 JSON 형식이 올바르지 않습니다: " + (e instanceof Error ? e.message : String(e)));
  }
}

export async function createBrand(formData: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const payload = {
    slug: String(formData.get("slug") || "").trim(),
    name_ko: String(formData.get("name_ko") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    concept: String(formData.get("concept") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    color_primary: String(formData.get("color_primary") || "#2A5F58"),
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    display_order: Number(formData.get("display_order") || 0),
    is_published: formData.get("is_published") === "on",
  };
  const { error } = await sb.from("brands").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/brands");
  revalidatePath("/");
}

export async function updateBrand(id: string, formData: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const payload = {
    slug: String(formData.get("slug") || "").trim(),
    name_ko: String(formData.get("name_ko") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    concept: String(formData.get("concept") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    color_primary: String(formData.get("color_primary") || "#2A5F58"),
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    display_order: Number(formData.get("display_order") || 0),
    is_published: formData.get("is_published") === "on",
  };
  const { error } = await sb.from("brands").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/brands");
  revalidatePath(`/admin/brands/${id}`);
  revalidatePath("/");
}

export async function deleteBrand(id: string) {
  await requireAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("brands").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/brands");
  revalidatePath("/");
}

// ─── product_types ───────────────────────
export async function createProductType(brandId: string, formData: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const payload = {
    brand_id: brandId,
    slug: String(formData.get("slug") || "").trim(),
    name_ko: String(formData.get("name_ko") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    display_order: Number(formData.get("display_order") || 0),
  };
  const { error } = await sb.from("product_types").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/brands/${brandId}`);
}

export async function deleteProductType(id: string, brandId: string) {
  await requireAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("product_types").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/brands/${brandId}`);
}

// ─── products ────────────────────────────
export async function createProduct(brandId: string, formData: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const priceStr = String(formData.get("price") || "").replace(/[^\d]/g, "");
  const payload = {
    brand_id: brandId,
    product_type_id: String(formData.get("product_type_id") || "") || null,
    slug: String(formData.get("slug") || "").trim(),
    name_ko: String(formData.get("name_ko") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    short_description: String(formData.get("short_description") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    usage: String(formData.get("usage") || "").trim() || null,
    ingredients: String(formData.get("ingredients") || "").trim() || null,
    price: priceStr ? Number(priceStr) : null,
    volume: String(formData.get("volume") || "").trim() || null,
    tag: String(formData.get("tag") || "").trim() || null,
    main_image: String(formData.get("main_image") || "").trim() || null,
    external_url: String(formData.get("external_url") || "").trim() || null,
    is_published: formData.get("is_published") === "on",
    display_order: Number(formData.get("display_order") || 0),
  };
  const { error } = await sb.from("products").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/brands/${brandId}`);
}

export async function updateProduct(id: string, brandId: string, formData: FormData) {
  await requireAdmin();
  const sb = createAdminClient();
  const priceStr = String(formData.get("price") || "").replace(/[^\d]/g, "");
  const payload = {
    product_type_id: String(formData.get("product_type_id") || "") || null,
    slug: String(formData.get("slug") || "").trim(),
    name_ko: String(formData.get("name_ko") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    short_description: String(formData.get("short_description") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    usage: String(formData.get("usage") || "").trim() || null,
    ingredients: String(formData.get("ingredients") || "").trim() || null,
    price: priceStr ? Number(priceStr) : null,
    volume: String(formData.get("volume") || "").trim() || null,
    tag: String(formData.get("tag") || "").trim() || null,
    main_image: String(formData.get("main_image") || "").trim() || null,
    external_url: String(formData.get("external_url") || "").trim() || null,
    is_published: formData.get("is_published") === "on",
    display_order: Number(formData.get("display_order") || 0),
    ...parseDetailData(formData.get("detail_data")),
  };
  const { error } = await sb.from("products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/brands/${brandId}`);
}

export async function deleteProduct(id: string, brandId: string) {
  await requireAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/brands/${brandId}`);
}
