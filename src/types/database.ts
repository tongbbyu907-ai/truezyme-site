export type Brand = {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string | null;
  concept: string | null;
  description: string | null;
  cover_image: string | null;
  color_primary: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductType = {
  id: string;
  brand_id: string;
  slug: string;
  name_ko: string;
  name_en: string | null;
  display_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  brand_id: string;
  product_type_id: string | null;
  slug: string;
  name_ko: string;
  name_en: string | null;
  short_description: string | null;
  description: string | null;
  usage: string | null;
  ingredients: string | null;
  price: number | null;
  volume: string | null;
  tag: string | null;
  main_image: string | null;
  gallery_images: string[];
  is_published: boolean;
  display_order: number;
  external_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | null;
  start_date: string | null;
  end_date: string | null;
  link: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string | null;
  category: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export type BrandWithTypes = Brand & {
  product_types: ProductType[];
};

export type BrandWithCounts = Brand & {
  product_count: number;
  type_count: number;
};
