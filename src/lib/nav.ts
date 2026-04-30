import { createClient } from "@/lib/supabase/server";

export type NavBrand = {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string | null;
  products: { id: string; name_ko: string }[];
};

export async function getNavBrands(): Promise<NavBrand[]> {
  try {
    const sb = await createClient();
    const { data } = await sb
      .from("brands")
      .select("id, slug, name_ko, name_en, products(id, name_ko, is_published, display_order)")
      .eq("is_published", true)
      .order("display_order")
      .limit(20);

    return (data ?? []).map((b) => ({
      id: b.id,
      slug: b.slug,
      name_ko: b.name_ko,
      name_en: b.name_en,
      products: ((b as unknown as { products: { id: string; name_ko: string; is_published: boolean; display_order: number }[] }).products ?? [])
        .filter((p) => p.is_published)
        .sort((a, z) => a.display_order - z.display_order)
        .slice(0, 8)
        .map((p) => ({ id: p.id, name_ko: p.name_ko })),
    }));
  } catch {
    return [];
  }
}
